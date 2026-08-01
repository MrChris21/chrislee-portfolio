import { NextResponse } from "next/server";

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

    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Contact form is not configured yet. Missing Web3Forms access key.",
        },
        { status: 503 }
      );
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio contact from ${name}`,
        from_name: "Chris Lee Portfolio",
        name,
        email,
        message,
        replyto: email,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!res.ok || !data.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            data.message ||
            "Failed to send message via Web3Forms. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact api error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Temporary send error. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
