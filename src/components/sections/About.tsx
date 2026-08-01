import Image from "next/image";
import {
  funFacts,
  pricing,
  services,
  site,
  testimonials,
  tools,
} from "@/data/content";
import {
  IconMonitor,
  IconNextjs,
  IconServer,
  IconShield,
  IconWordPress,
} from "../Icons";

const serviceIcons: Record<string, React.ReactNode> = {
  monitor: <IconMonitor className="h-9 w-9 text-[var(--accent)]" />,
  server: <IconServer className="h-9 w-9 text-[var(--accent)]" />,
  nextjs: <IconNextjs className="h-9 w-9 text-[var(--accent)]" />,
  wordpress: <IconWordPress className="h-9 w-9 text-[var(--accent)]" />,
  shield: <IconShield className="h-9 w-9 text-[var(--accent)]" />,
};

export default function About() {
  return (
    <div className="fade-in space-y-12">
      {/* About Me */}
      <section>
        <h2 className="section-title">About Me</h2>
        <div className="mt-6 space-y-4 text-[var(--muted)] leading-relaxed">
          <p className="text-lg text-white">
            👋 Hi, I&apos;m <strong className="text-[var(--accent)]">{site.fullName}</strong>
          </p>
          <p className="text-base font-medium text-[var(--accent)]">{site.title}</p>
          <p className="whitespace-pre-line">{site.about}</p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            ["Age", site.age],
            ["Residence", site.residence],
            ["Freelance", site.freelance],
            ["Address", site.address],
          ].map(([label, value]) => (
            <li
              key={label}
              className="flex items-start gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-soft)] px-4 py-3 text-sm"
            >
              <span className="font-semibold text-[var(--accent)]">{label}:</span>
              <span className="text-[var(--muted)]">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Services */}
      <section>
        <h2 className="section-title">My Services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="card group transition hover:border-[var(--accent)]/40">
              <div className="mb-3">{serviceIcons[s.icon]}</div>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="section-title">Can do also</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`card relative ${
                p.highlight ? "border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/20" : ""
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 right-4 rounded-full bg-[var(--accent)] px-3 py-0.5 text-xs font-bold text-[#111]">
                  NEW
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-2 mb-4">
                <span className="text-3xl font-bold text-[var(--accent)]">${p.price}</span>
                <span className="text-sm text-[var(--muted)]"> / hour</span>
              </p>
              <ul className="mb-6 space-y-2 text-sm text-[var(--muted)]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[var(--accent)]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#contact" className="btn-primary w-full text-center">
                Contact me now
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section>
        <h2 className="section-title">Tools and System</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {tools.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex flex-col items-center gap-3 p-4 text-center transition hover:border-[var(--accent)]/50"
            >
              <div className="relative h-14 w-14">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-contain"
                  sizes="56px"
                  unoptimized={t.image.endsWith(".svg")}
                />
              </div>
              <span className="text-xs font-medium text-[var(--muted)]">{t.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="section-title">Passages</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <p className="mb-4 text-sm italic leading-relaxed text-[var(--muted)]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[var(--accent)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Facts */}
      <section>
        <h2 className="section-title">Fun Facts</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {funFacts.map((f) => (
            <div key={f.label} className="card text-center">
              <p className="text-2xl font-bold text-[var(--accent)] md:text-3xl">{f.value}</p>
              <p className="mt-1 text-xs text-[var(--muted)] md:text-sm">{f.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
