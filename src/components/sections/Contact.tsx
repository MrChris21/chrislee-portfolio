"use client";

import { FormEvent, useState } from "react";
import { products, site } from "@/data/content";
import { IconMail, IconMapPin, IconPhone } from "../Icons";
import Image from "next/image";

type Status = "idle" | "sending" | "sent" | "error" | "activation";

const TO_EMAIL = "christopherlee812@gmail.com";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function sendViaFormSubmit(payload: {
    name: string;
    email: string;
    message: string;
  }) {
    // Client-side FormSubmit works best (browser Origin)
    const res = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        _subject: `Portfolio contact from ${payload.name}`,
        _replyto: payload.email,
        _template: "table",
        _captcha: "false",
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };
    return data;
  }

  async function sendViaApi(payload: {
    name: string;
    email: string;
    message: string;
    website: string;
  }) {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as {
      ok?: boolean;
      error?: string;
      needsActivation?: boolean;
      message?: string;
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || "").trim(),
    };

    if (payload.website) {
      setStatus("sent");
      form.reset();
      return;
    }

    setStatus("sending");
    setError("");
    setInfo("");

    try {
      // 1) Prefer direct FormSubmit from the browser
      const fs = await sendViaFormSubmit(payload);
      const fsMsg = String(fs.message || "").toLowerCase();

      if (
        fsMsg.includes("activation") ||
        fsMsg.includes("activate form")
      ) {
        setStatus("activation");
        setInfo(
          "Setup email sent. Open Gmail (christopherlee812@gmail.com), find the FormSubmit message, and click “Activate Form”. Then try sending again — messages will arrive after that."
        );
        return;
      }

      if (
        fs.success === true ||
        fs.success === "true" ||
        fsMsg.includes("successfully")
      ) {
        setStatus("sent");
        form.reset();
        return;
      }

      // 2) Fallback to our API route
      const api = await sendViaApi(payload);
      if (api.needsActivation) {
        setStatus("activation");
        setInfo(
          api.message ||
            "Check your Gmail for a FormSubmit activation link, then try again."
        );
        return;
      }
      if (api.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      setStatus("error");
      setError(
        api.error ||
          fs.message ||
          "Could not send yet. Check Gmail for a FormSubmit activation email, click Activate Form, then try again."
      );
    } catch {
      // 3) Last fallback: API only
      try {
        const api = await sendViaApi(payload);
        if (api.needsActivation) {
          setStatus("activation");
          setInfo(
            api.message ||
              "Check your Gmail for a FormSubmit activation link, then try again."
          );
          return;
        }
        if (api.ok) {
          setStatus("sent");
          form.reset();
          return;
        }
        setStatus("error");
        setError(api.error || "Failed to send. Please try again.");
      } catch {
        setStatus("error");
        setError("Network error. Please try again in a moment.");
      }
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

            {/* Honeypot */}
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden>
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
                Message sent successfully! I&apos;ll get back to you soon.
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
