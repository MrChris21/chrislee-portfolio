import Image from "next/image";
import { blogPosts } from "@/data/content";

export default function Blog() {
  return (
    <div className="fade-in space-y-8">
      <section>
        <h2 className="section-title">Blog</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="card group overflow-hidden p-0 transition hover:border-[var(--accent)]/40"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--card-soft)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-5">
                <time className="text-xs font-medium text-[var(--accent)]">{post.date}</time>
                <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-[var(--accent)]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
