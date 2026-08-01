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

    const originHeader =
      request.headers.get("origin") ||
      request.headers.get("referer") ||
      "https://chrislee.site";

    let siteOrigin = "https://chrislee.site";
    try {
      siteOrigin = new URL(originHeader).origin;
    } catch {
      /* keep default */
    }

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
      }),
    });

    const raw = await res.text();
    let data: { success?: string | boolean; message?: string } = {};
    try {
      data = JSON.parse(raw) as typeof data;
    } catch {
      data = { message: raw };
    }

    const msg = String(data.message || "").toLowerCase();

    if (msg.includes("activation") || msg.includes("activate form")) {
      return NextResponse.json({
        ok: true,
        needsActivation: true,
        message:
          "Check Gmail for a FormSubmit email and click Activate Form. After that, messages will arrive automatically.",
      });
    }

    const success =
      data.success === true ||
      data.success === "true" ||
      msg.includes("successfully");

    if (success) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          data.message ||
          "Could not send yet. If this is the first time, check Gmail for a FormSubmit activation link.",
      },
      { status: 502 }
    );
  } catch (err) {
    console.error("contact api error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Temporary send error. Please try again.",
      },
      { status: 500 }
    );
  }
}
