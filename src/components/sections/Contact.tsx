"use client";

import { FormEvent, useState } from "react";
import { products, site } from "@/data/content";
import { IconMail, IconMapPin, IconPhone } from "../Icons";
import Image from "next/image";

type Status = "idle" | "sending" | "sent" | "error" | "activation";

const TO_EMAIL = "christopherlee812@gmail.com";

function isActivationMessage(msg: string) {
  const m = msg.toLowerCase();
  return m.includes("activation") || m.includes("activate form");
}

function isSuccessMessage(success: unknown, msg: string) {
  const m = msg.toLowerCase();
  return (
    success === true ||
    success === "true" ||
    m.includes("successfully") ||
    m.includes("form was submitted")
  );
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const website = String(data.get("website") || "").trim();

    // Honeypot
    if (website) {
      setStatus("sent");
      form.reset();
      return;
    }

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }

    setStatus("sending");
    setError("");
    setInfo("");

    try {
      // Browser → FormSubmit only (server-side is blocked by Cloudflare)
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

      const text = await res.text();
      let parsed: { success?: string | boolean; message?: string } = {};
      try {
        parsed = JSON.parse(text) as typeof parsed;
      } catch {
        // Cloudflare challenge or non-JSON
        if (text.includes("Just a moment") || text.includes("cloudflare")) {
          // Fallback: open mailto so the user can still reach you
          const subject = encodeURIComponent(`Portfolio contact from ${name}`);
          const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
          );
          window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
          setStatus("sent");
          setInfo(
            "Opened your email app as a backup. You can also email me directly."
          );
          form.reset();
          return;
        }
        parsed = { message: text.slice(0, 200) };
      }

      const msg = String(parsed.message || "");

      if (isActivationMessage(msg)) {
        setStatus("activation");
        setInfo(
          "Check Gmail (and Spam) for FormSubmit, then click Activate Form. After that, messages send automatically."
        );
        return;
      }

      if (isSuccessMessage(parsed.success, msg) || res.ok) {
        // FormSubmit sometimes returns success:false with ok body after activation pending
        if (parsed.success === false || parsed.success === "false") {
          if (isActivationMessage(msg)) {
            setStatus("activation");
            setInfo(
              "Check Gmail for FormSubmit and click Activate Form, then try again."
            );
            return;
          }
          setStatus("error");
          setError(
            msg ||
              "Could not send yet. If this is the first time, activate FormSubmit from your Gmail."
          );
          return;
        }
        setStatus("sent");
        form.reset();
        return;
      }

      setStatus("error");
      setError(
        msg ||
          "Could not send. Please try again, or email christopherlee812@gmail.com."
      );
    } catch {
      // Network failure → mailto fallback
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
      setStatus("sent");
      setInfo("Opened your email app as a backup so the message is not lost.");
      form.reset();
    }
  }

  return (
    <div className="fade-in space-y-12">
      <section id="contact">
        <h2 className="section-title">Get in Touch</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[
              { icon: <IconMapPin />, label: "Address", value: site.residence },
              {
                icon: <IconMail />,
                label: "Email",
                value: site.email,
                href: `mailto:${site.email}`,
              },
              { icon: <IconPhone />, label: "Phone", value: site.phone },
              {
                icon: <span className="text-lg">✨</span>,
                label: "Freelance",
                value: site.freelance,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] p-4"
              >
                <span className="mt-0.5 text-[var(--accent)]">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-white transition hover:text-[var(--accent)]"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="card relative space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Form</h3>

            <div
              className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
              aria-hidden
            >
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs text-[var(--muted)]">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                disabled={status === "sending"}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs text-[var(--muted)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={status === "sending"}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs text-[var(--muted)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                disabled={status === "sending"}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)] disabled:opacity-60"
                placeholder="How can I help?"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "sending" ? "Sending…" : "Send Message"}
            </button>

            {status === "sent" && (
              <p className="text-center text-sm text-emerald-400">
                {info ||
                  "Message sent successfully! I'll get back to you soon."}
              </p>
            )}
            {status === "activation" && (
              <p className="text-center text-sm text-amber-300" role="status">
                {info}
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </section>

      <section>
        <h2 className="section-title">Products (Soon)</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {products.map((p) => (
            <div key={p.title} className="card group overflow-hidden p-0">
              <div className="relative aspect-square bg-[var(--card-soft)]">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  Sale!
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2">
                  <span className="mr-2 text-sm text-[var(--muted)] line-through">
                    ${p.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-[var(--accent)]">
                    ${p.price.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
