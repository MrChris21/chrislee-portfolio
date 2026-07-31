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

    // Bots fill hidden honeypot — pretend success
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

    // Prefer Web3Forms when an access key is configured (most reliable on Vercel).
    // Free key: https://web3forms.com — set WEB3FORMS_ACCESS_KEY in Vercel env.
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
          email,
          message,
          to: TO_EMAIL,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) {
        return NextResponse.json(
          {
            ok: false,
            error: data.message || "Failed to send message. Please try again.",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    // Default: FormSubmit.co → delivers to your Gmail (no API key required).
    // First submission may require clicking an activation email from FormSubmit.
    const res = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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

    const data = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };

    const success =
      res.ok &&
      (data.success === true ||
        data.success === "true" ||
        String(data.message || "")
          .toLowerCase()
          .includes("success"));

    if (!success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            data.message ||
            "Could not send right now. Please email christopherlee812@gmail.com directly.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong. Please email christopherlee812@gmail.com directly.",
      },
      { status: 500 }
    );
  }
}
