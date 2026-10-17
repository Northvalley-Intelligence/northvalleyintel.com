"use client";

import { useEffect, useState } from "react";

const FEED_URL = "https://feroshjacob.github.io/feed.xml";
const BLOG_ORIGIN = "https://feroshjacob.github.io/";
const MAX_TITLE = 44;

type LatestPost = { title: string; href: string };

const pillClass =
  "rounded-full border border-north-line px-3 py-1 text-xs font-bold text-north-muted hover:text-north-ink";

function truncate(title: string) {
  return title.length > MAX_TITLE ? `${title.slice(0, MAX_TITLE)}…` : title;
}

/**
 * Header pill pointing at the founder's latest post. Server-side, and on any
 * error, it is a plain "Founder's blog" link; the feed is read in the browser
 * and only its text is rendered, never its markup.
 */
export function LatestPostPill() {
  const [post, setPost] = useState<LatestPost | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(FEED_URL, { signal: controller.signal });
        if (!response.ok) return;
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "application/xml");
        const entry = doc.querySelector("entry");
        const title = entry?.querySelector("title")?.textContent?.trim();
        const href = entry?.querySelector("link")?.getAttribute("href");
        if (title && href && href.startsWith(BLOG_ORIGIN)) {
          setPost({ title, href });
        }
      } catch {
        // Keep the fallback link.
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  if (!post) {
    return (
      <a
        href="https://feroshjacob.github.io/posts/"
        target="_blank"
        rel="noopener noreferrer"
        className={pillClass}
      >
        Founder&apos;s blog
      </a>
    );
  }

  return (
    <a
      href={post.href}
      target="_blank"
      rel="noopener noreferrer"
      title={post.title}
      className={`${pillClass} inline-flex items-center gap-2`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-north-green opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-north-green" />
      </span>
      {`New: ${truncate(post.title)}`}
    </a>
  );
}
