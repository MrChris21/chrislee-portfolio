"use client";

import { FormEvent, useState } from "react";
import { products, site } from "@/data/content";
import { IconMail, IconMapPin, IconPhone } from "../Icons";
import Image from "next/image";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
    form.reset();
  }

  return (
    <div className="fade-in space-y-12">
      <section id="contact">
        <h2 className="section-title">Get in Touch</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[
              { icon: <IconMapPin />, label: "Address", value: site.residence },
              { icon: <IconMail />, label: "Email", value: site.email, href: `mailto:${site.email}` },
              { icon: <IconPhone />, label: "Phone", value: site.phone },
              { icon: <span className="text-lg">✨</span>, label: "Freelance", value: site.freelance },
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

          <form onSubmit={handleSubmit} className="card space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Form</h3>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs text-[var(--muted)]">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
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
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-xs text-[var(--muted)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                placeholder="How can I help?"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
            {status === "sent" && (
              <p className="text-center text-sm text-emerald-400">
                Opening your email client… thank you!
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
