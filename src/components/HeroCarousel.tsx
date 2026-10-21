"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { sanityLoader } from "@/sanity/imageLoader";

export type HeroSlide = {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const count = slides.length;
  // The track is a native scroller, so a swipe drags the slides under the
  // finger. The buttons scroll it too, and the scroll position sets the index.
  const go = (next: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: ((next + count) % count) * el.clientWidth });
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured stories"
      className="panel relative overflow-hidden"
    >
      {/* Slides stretch to the tallest one, so the hero takes the height of
          its longest title and doesn't jump between slides. The aspect ratio
          is a minimum: a title that needs more room makes it taller. */}
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className="relative flex aspect-[16/10] w-full shrink-0 snap-start snap-always flex-col justify-center sm:aspect-[16/8]"
          >
            {/* Load the current slide and its neighbors, so a swipe never
                drags in a blank slide. */}
            {Math.abs(i - index) > 1 ? null : slide.imageSrc ? (
              <Image
                loader={sanityLoader}
                src={slide.imageSrc}
                alt={slide.imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: slide.imagePosition }}
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgb(34_179_78/0.35),transparent_55%),linear-gradient(135deg,#0b1f17,#030c09)]"
              />
            )}
            {/* The scrim is at least 70% ink under all the text, which keeps
                the light text at 4.5:1 even over a white patch of image.
                Phone text spans the slide, so the scrim does too; wider
                screens fade it out past the 36rem text column. */}
            <div className="absolute inset-0 bg-ink/70 sm:bg-transparent sm:bg-[linear-gradient(to_right,rgb(3_12_9/0.9),rgb(3_12_9/0.7)_36rem,transparent)]" />
            <div
              className={`relative flex max-w-xl flex-col gap-4 p-6 sm:p-10 ${
                count > 1 ? "pb-16 sm:pb-16" : ""
              }`}
            >
              {/* Light, not green: green small text needs a darker scrim
                  than the image can take. The dot keeps the accent. */}
              <p className="eyebrow flex items-center gap-2 !text-text">
                <span aria-hidden className="size-2 rounded-full bg-glow shadow-[0_0_8px_var(--color-glow)]" />
                Featured{slide.category ? ` / ${slide.category}` : ""}
              </p>
              <h2 className="font-display text-2xl font-black leading-tight sm:text-4xl">
                {slide.title}
              </h2>
              {slide.excerpt ? (
                <p className="hidden text-base text-text/80 sm:line-clamp-3">
                  {slide.excerpt}
                </p>
              ) : null}
              <Link
                href={`/news/${slide.slug}`}
                className="w-fit rounded-full border border-glow bg-ink/90 px-5 py-2 font-display text-xs font-bold uppercase tracking-wider text-glow transition-colors hover:bg-glow hover:text-ink"
              >
                Read more &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-5">
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((slide, i) => (
              <button
                key={slide.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-7 bg-glow" : "w-1.5 bg-text/40 hover:bg-text/70"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="grid size-8 place-items-center rounded-md border border-line bg-ink/90 text-text hover:border-glow hover:text-glow"
            >
              &larr;
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="grid size-8 place-items-center rounded-md border border-line bg-ink/90 text-text hover:border-glow hover:text-glow"
            >
              &rarr;
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
