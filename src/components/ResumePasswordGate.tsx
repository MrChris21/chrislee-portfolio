"use client";

import { FormEvent, useEffect, useState } from "react";

const STORAGE_KEY = "resume_cv_unlocked";
// Soft client-side gate (not server security). Password: 1921@
const RESUME_PASSWORD = "1921@";

export default function ResumePasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === RESUME_PASSWORD) {
      setUnlocked(true);
      setError("");
      setPassword("");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      return;
    }
    setError("Incorrect password. Please try again.");
  }

  if (!ready) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-[var(--muted)]">
        Loading…
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fade-in flex min-h-[320px] flex-col items-center justify-center px-2 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] text-2xl">
        🔒
      </div>
      <h2 className="section-title mb-2">Resume/CV</h2>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)]">
        This section is password-protected. Enter the password to view my
        Resume/CV.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-sm space-y-4 text-left"
      >
        <div>
          <label
            htmlFor="resume-password"
            className="mb-1.5 block text-xs font-medium text-[var(--muted)]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="resume-password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              autoComplete="current-password"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 pr-16 text-sm text-white outline-none transition focus:border-[var(--accent)]"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--muted)] hover:text-[var(--accent)]"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full">
          Unlock Resume/CV
        </button>
      </form>
    </div>
  );
}
