import { NextResponse } from "next/server";

const TO_EMAIL = "christopherlee812@gmail.com";

type Body = {
  name?: string;
  email?: string;
  message?: string;
  website?: string; // honeypot
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const honeypot = String(body.website || "").trim();

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in all fields." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message is too long." },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      "https://chrislee.site";

    const siteOrigin = (() => {
      try {
        return new URL(origin).origin;
      } catch {
        return "https://chrislee.site";
      }
    })();

    // Optional: Web3Forms (client/server friendly with free access key)
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: web3Key,
          subject: `Portfolio contact from ${name}`,
          from_name: name,
          name,
          email,
          message,
          replyto: email,
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (data.success) {
        return NextResponse.json({ ok: true });
      }
      // fall through to FormSubmit if Web3Forms fails
    }

    // FormSubmit — needs browser-like Origin; first use requires inbox activation
    const res = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: siteOrigin,
        Referer: `${siteOrigin}/`,
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Portfolio contact from ${name}`,
        _replyto: email,
        _template: "table",
        _captcha: "false",
        _honey: "",
      }),
    });

    const rawText = await res.text();
    let data: { success?: string | boolean; message?: string } = {};
    try {
      data = JSON.parse(rawText) as typeof data;
    } catch {
      data = { message: rawText };
    }

    const msg = String(data.message || "").toLowerCase();
    const successFlag =
      data.success === true ||
      data.success === "true" ||
      msg.includes("the form was submitted successfully") ||
      msg.includes("successfully");

    // First-time activation flow
    if (msg.includes("activation") || msg.includes("activate form")) {
      return NextResponse.json({
        ok: true,
        needsActivation: true,
        message:
          "Almost ready! Check christopherlee812@gmail.com for a FormSubmit activation email and click Activate Form. After that, messages will arrive automatically.",
      });
    }

    if (successFlag) {
      return NextResponse.json({ ok: true });
    }

    // Last-resort: return clear error (not the old generic dead-end)
    return NextResponse.json(
      {
        ok: false,
        error:
          data.message ||
          "Email service is finishing setup. Please try again in a minute, or check Gmail for a FormSubmit activation link.",
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("contact api error", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Temporary send error. Please try again, or check Gmail for a FormSubmit activation link.",
      },
      { status: 500 }
    );
  }
}
