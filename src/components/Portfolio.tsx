"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import About from "./sections/About";
import Resume from "./sections/Resume";
import Works from "./sections/Works";
import Blog from "./sections/Blog";
import Contact from "./sections/Contact";
import { IconClose, IconMenu } from "./Icons";
import BinaryRain from "./BinaryRain";
import { site } from "@/data/content";
import Image from "next/image";

const tabs = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "works", label: "Works" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Portfolio() {
  const [active, setActive] = useState<TabId>("about");
  const [mobileOpen, setMobileOpen] = useState(false);

  function goTo(tab: TabId) {
    setActive(tab);
    setMobileOpen(false);
    // Scroll only the main content panel (desktop) or window (mobile)
    const panel = document.getElementById("main-scroll");
    if (panel) {
      panel.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden">
      {/* Binary matrix rain + soft gold glows */}
      <BinaryRain />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-[var(--accent)]/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[35vw] w-[35vw] rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <Image
            src={site.avatar}
            alt={site.name}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="font-semibold text-white">{site.name}</span>
        </div>
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-[var(--border)] p-2 text-white"
        >
          {mobileOpen ? <IconClose /> : <IconMenu />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[min(320px,85vw)] overflow-y-auto border-l border-[var(--border)] bg-[var(--card)] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onContact={() => goTo("contact")} compact />
            <nav className="mt-4 flex flex-col gap-1 border-t border-[var(--border)] pt-4">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTo(t.id)}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                    active === t.id
                      ? "bg-[var(--accent)] text-[#111]"
                      : "text-[var(--muted)] hover:bg-[var(--card-soft)] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/*
        Desktop: fixed-height row — profile stays put, main content scrolls.
        Mobile: normal document flow.
      */}
      <div className="mx-auto flex h-full max-w-6xl flex-col gap-6 px-4 py-6 md:py-10 lg:flex-row lg:items-stretch lg:gap-8 lg:overflow-hidden lg:px-6 lg:py-8">
        {/* Desktop profile — fixed in place (does not scroll with content) */}
        <aside className="hidden shrink-0 lg:flex lg:w-[300px] lg:flex-col lg:self-start">
          <div className="w-full max-w-[300px]">
            <Sidebar onContact={() => goTo("contact")} />
          </div>
        </aside>

        {/* Main panel — independent scroll on desktop */}
        <main
          id="main-scroll"
          className="min-w-0 flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
        >
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            {/* Tabs stay at top of the scrolling panel */}
            <nav className="sticky top-0 z-10 hidden border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md lg:block">
              <ul className="flex flex-wrap">
                {tabs.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => goTo(t.id)}
                      className={`relative px-6 py-4 text-sm font-semibold transition ${
                        active === t.id
                          ? "text-[var(--accent)]"
                          : "text-[var(--muted)] hover:text-white"
                      }`}
                    >
                      {t.label}
                      {active === t.id && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-[var(--accent)]" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Content */}
            <div className="p-5 md:p-8 lg:p-10">
              {active === "about" && <About />}
              {active === "resume" && <Resume />}
              {active === "works" && <Works />}
              {active === "blog" && <Blog />}
              {active === "contact" && <Contact />}
            </div>
          </div>

          <footer className="mt-6 pb-4 text-center text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} {site.name}. Built with Next.js · Deployed
            on Vercel.
          </footer>
        </main>
      </div>
    </div>
  );
}
