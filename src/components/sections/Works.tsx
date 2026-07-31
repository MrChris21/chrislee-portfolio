"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { works, type WorkCategory } from "@/data/content";
import { IconExternal } from "../Icons";

const filters: WorkCategory[] = ["All", "Link", "Image", "Gallery", "Video", "Content"];

export default function Works() {
  const [filter, setFilter] = useState<WorkCategory>("All");

  const filtered = useMemo(
    () => (filter === "All" ? works : works.filter((w) => w.category === filter)),
    [filter]
  );

  return (
    <div className="fade-in space-y-8">
      <section>
        <h2 className="section-title">Works</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "bg-[var(--accent)] text-[#111]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((work) => (
            <a
              key={work.title}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group card overflow-hidden p-0 transition hover:border-[var(--accent)]/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--card-soft)]">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#111]">
                    View Project <IconExternal />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white group-hover:text-[var(--accent)]">
                    {work.title}
                  </h3>
                </div>
                <span className="text-xs text-[var(--muted)]">{work.category}</span>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-[var(--muted)]">No projects in this category.</p>
        )}
      </section>
    </div>
  );
}
