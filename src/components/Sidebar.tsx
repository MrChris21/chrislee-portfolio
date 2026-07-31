"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/data/content";
import {
  IconDownload,
  IconGithub,
  IconInstagram,
  IconMessenger,
  IconTwitter,
  IconWhatsapp,
} from "./Icons";

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <IconInstagram />,
  twitter: <IconTwitter />,
  github: <IconGithub />,
  messenger: <IconMessenger />,
  whatsapp: <IconWhatsapp />,
};

export default function Sidebar({
  onContact,
  compact = false,
}: {
  onContact: () => void;
  compact?: boolean;
}) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = site.roles[roleIndex];
    const speed = deleting ? 40 : 80;

    if (!deleting && display === full) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && display === "") {
      setDeleting(false);
      setRoleIndex((i) => (i + 1) % site.roles.length);
      return;
    }

    const t = setTimeout(() => {
      setDisplay(
        deleting ? full.slice(0, display.length - 1) : full.slice(0, display.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [display, deleting, roleIndex]);

  return (
    <aside
      className={`flex flex-col items-center text-center ${
        compact
          ? "w-full p-6"
          : "sticky top-8 w-full max-w-[300px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-7 shadow-2xl"
      }`}
    >
      <div className="relative mb-5">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--accent)]/40 to-transparent blur-sm" />
        <Image
          src={site.avatar}
          alt={site.name}
          width={140}
          height={140}
          className="relative h-[120px] w-[120px] rounded-full border-4 border-[var(--card-soft)] object-cover md:h-[140px] md:w-[140px]"
          priority
        />
        <span className="absolute bottom-1 right-2 h-4 w-4 rounded-full border-2 border-[var(--card)] bg-emerald-400" title="Available" />
      </div>

      <h1 className="mb-1 text-xl font-bold text-white md:text-2xl">{site.name}</h1>
      <p className="mb-5 min-h-[1.5rem] text-sm text-[var(--accent)]">
        {display}
        <span className="typing-cursor ml-0.5 text-[var(--accent)]">|</span>
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {site.social.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#111]"
          >
            {socialIcons[s.icon]}
          </a>
        ))}
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <a
          href="mailto:Christopherlee812@gmail.com?subject=CV%20Request"
          className="btn-outline w-full"
        >
          <IconDownload />
          Download CV
        </a>
        <button type="button" onClick={onContact} className="btn-primary w-full">
          Contact Me
        </button>
      </div>
    </aside>
  );
}
