import {
  codingSkills,
  education,
  experience,
  knowledge,
  languages,
  technicalSkills,
} from "@/data/content";
import { IconCheck } from "../Icons";

function Timeline({
  items,
}: {
  items: { years: string; title: string; subtitle: string; text: string }[];
}) {
  return (
    <div className="relative space-y-0 border-l-2 border-[var(--border)] pl-6">
      {items.map((item, i) => (
        <div key={i} className="relative pb-8 last:pb-0">
          <span className="absolute -left-[1.9rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--accent)] bg-[var(--card)]" />
          <span className="mb-1 inline-block rounded-full bg-[var(--accent)]/15 px-3 py-0.5 text-xs font-semibold text-[var(--accent)]">
            {item.years}
          </span>
          <h4 className="mt-2 text-base font-semibold text-white">{item.title}</h4>
          {item.subtitle && (
            <p className="text-sm text-[var(--muted)]">{item.subtitle}</p>
          )}
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">
            {item.text}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function Resume() {
  return (
    <div className="fade-in space-y-12">
      <section>
        <h2 className="section-title">Resume/CV</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="text-[var(--accent)]">💼</span> Experience
            </h3>
            <Timeline items={experience} />
          </div>
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="text-[var(--accent)]">🎓</span> Education
            </h3>
            <Timeline items={education} />
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section>
        <h2 className="section-title">Technical Skills</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {technicalSkills.map((group) => (
            <div key={group.category} className="card">
              <h3 className="mb-4 text-base font-semibold text-[var(--accent)]">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)]/50 hover:text-white sm:text-sm"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Coding Skills */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="text-[var(--accent)]">💻</span> Coding
            </h3>
            <div className="space-y-5">
              {codingSkills.map((s) => (
                <div key={s.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-white">{s.label}</span>
                    <span className="text-[var(--muted)]">{s.progress}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="text-[var(--accent)]">📋</span> Knowledge
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {knowledge.map((k) => (
                <li
                  key={k}
                  className="flex items-center gap-2 text-sm text-[var(--muted)]"
                >
                  <IconCheck className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
          <span className="text-[var(--accent)]">🌐</span> Languages
        </h3>
        <div className="grid max-w-md gap-5">
          {languages.map((l) => (
            <div key={l.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-white">{l.label}</span>
                <span className="text-[var(--muted)]">{l.progress}%</span>
              </div>
              <div className="skill-bar">
                <div className="skill-bar-fill" style={{ width: `${l.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
