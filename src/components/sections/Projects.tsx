"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const projects = [
  {
    id: 1,
    number: "01",
    title: "The Chair Shop",
    description: "A chair e-commerce storefront built with Next.js 14 (App Router). Browse a catalog of chairs, add them to a persistent cart, create an account, and check out. Features include product catalog with search & pagination (/bestsellers), persistent cart with quantity management, email/password authentication against a companion REST API, and smooth scroll animations via Lenis.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Lenis"],
    primaryTag: "Next.js",
    imageUrl: "/projects/the-chair-shop.png",
    liveUrl: "https://the-chair-hub.vercel.app/",
  },
  {
    id: 2,
    number: "02",
    title: "Netflix Clone",
    description: "A fullstack streaming app where users can register, browse trending/top-rated movies, watch trailers, and manage a personal favourites list. Built with Next.js, Prisma ORM, and NextAuth.",
    tags: ["Next.js", "Prisma", "NextAuth", "MongoDB"],
    primaryTag: "Next.js",
    imageUrl: "/projects/netflix-clone.png",
    liveUrl: "https://ntflx-seven.vercel.app/",
  },
  {
    id: 3,
    number: "03",
    title: "Airtime Wallet App",
    description: "A digital wallet platform that lets users top up their balance and purchase airtime for all major Nigerian mobile networks. Built with React on the frontend and Node.js/Express on the backend.",
    tags: ["React", "Node.js", "Express"],
    primaryTag: "React",
    imageUrl: "/projects/airtime-wallet.png",
    liveUrl: "https://airtime-app-frontend.vercel.app/",
  },
  {
    id: 4,
    number: "04",
    title: "Paygate",
    description: "A responsive frontend application designed to simplify payment workflows and integrate a seamless blog interface for content management. Built with Next.js, TypeScript, and Tailwind CSS.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    primaryTag: "Next.js",
    imageUrl: "/projects/paygate.png",
    liveUrl: "https://dev.mypaygate.co/",
  },
];

function CardBody({ project }: { project: typeof projects[number] }) {
  return (
    <>
      <div className="p-[14px]">
        <p className="font-mono text-[10px] tracking-[0.14em] text-text-faint mb-1">{project.number}</p>
        <p className="font-sans text-xs font-medium text-text-title mb-1">{project.title}</p>
        <p className="text-[11px] text-text-muted leading-[1.5] mb-[10px]">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-[0.1em] uppercase py-[2px] px-[6px]"
              style={{
                color: tag === project.primaryTag ? "var(--c-accent)" : "var(--c-fg-muted)",
                border: `0.5px solid ${tag === project.primaryTag ? "var(--c-accent-border)" : "var(--c-line-tag)"}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionLabelRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const cardImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  // High-water mark of the pinned timeline, so it only ever moves forward.
  // Declared outside the effect so it survives a matchMedia rebuild.
  const maxProgressRef = useRef(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (!sectionRef.current || !cardsContainerRef.current) return;

      // The single source of truth for the hidden state. The tweens below are
      // plain `to`s over it, never `fromTo`s — see the note on the card JSX.
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      gsap.set(cards, { x: "100vw", opacity: 0, clipPath: "inset(0 100% 0 0)" });

      // Built paused and driven by hand from the trigger's onUpdate rather than
      // handed to ScrollTrigger via `scrollTrigger:` with a `scrub`. A scrub
      // runs the timeline backwards on the way up, which is exactly what we do
      // not want: once a card has landed it stays landed until a reload.
      const tl = gsap.timeline({ paused: true });

      // Drifts across the whole pin, so it spans the normalised timeline.
      if (headingRef.current) tl.to(headingRef.current, { x: -40, duration: 1, ease: "none" }, 0);

      // Cards share the pinned scroll: each starts one slice after the last and
      // takes slightly longer than a slice to arrive, so consecutive cards
      // overlap instead of landing one fully-settled card at a time. The
      // timeline is normalised to 1 unit total, and the final card has to
      // finish inside it — hence the explicit duration rather than GSAP's 0.5s
      // default, which would overrun the pin window as the list grows.
      const slice = 1 / projects.length;
      const duration = slice * 1.25;
      cards.forEach((card, i) => {
        const start = Math.min(i * slice, 1 - duration);
        tl.to(
          card,
          { x: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration, ease: "power3.out" },
          start,
        );
      });
      // Hold the pin briefly after the last card settles.
      tl.to({}, { duration: slice * 0.25 });

      // Restore whatever the timeline had already reached before this rebuild,
      // so a matchMedia re-run cannot un-land cards that had landed.
      if (maxProgressRef.current > 0) tl.progress(maxProgressRef.current);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "center center",
        end: () => `+=${projects.length * 600}`,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress <= maxProgressRef.current) return;
          maxProgressRef.current = self.progress;
          // The short tween stands in for what `scrub: 1` used to do, so the
          // motion still reads as scroll-linked rather than snapping.
          gsap.to(tl, { progress: self.progress, duration: 0.4, ease: "power2.out", overwrite: true });
        },
      });

      cardImageRefs.current.forEach((img) => {
        if (!img) return;
        gsap.fromTo(img, { y: 0 }, { y: -20, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } });
      });

      return () => {};
    });

    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      // Reset any pin state
      cardRefs.current.forEach((card) => { if (card) gsap.set(card, { x: 0, opacity: 1, clipPath: "inset(0 100% 0 0)", transform: "none" }); });
      if (headingRef.current) gsap.fromTo(headingRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: headingRef.current, start: "top 88%", toggleActions: "play none none none" } });
      if (cardsContainerRef.current) {
        gsap.fromTo(
          Array.from(cardsContainerRef.current.children),
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: cardsContainerRef.current, start: "top 85%", toggleActions: "play none none none" } },
        );
      }
      return () => {};
    });

    mm.add("(min-width: 500px) and (max-width: 767px)", () => {
      cardRefs.current.forEach((card) => { if (card) gsap.set(card, { x: 0, opacity: 1, clipPath: "inset(0 100% 0 0)", transform: "none" }); });
      if (cardsContainerRef.current) {
        gsap.fromTo(
          Array.from(cardsContainerRef.current.children),
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, stagger: 0.12, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: cardsContainerRef.current, start: "top 85%", toggleActions: "play none none none" } },
        );
      }
      return () => {};
    });

    mm.add("(max-width: 499px)", () => {
      cardRefs.current.forEach((card) => { if (card) gsap.set(card, { x: 0, opacity: 0, clipPath: "none", transform: "none" }); });
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.to(card, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1, scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none none" } });
      });
      return () => {};
    });

    // mm.revert() kills the triggers and restores the inline styles created
    // inside each matchMedia branch. Never call ScrollTrigger.getAll().kill()
    // here — it would take down every other section's triggers too.
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-9 px-5 sm:px-7 relative" style={{ borderBottom: "0.5px solid var(--c-line)" }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
            <div className="w-[14px] h-px bg-text-muted" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">What I&apos;ve built</span>
          </div>
          <h2 ref={headingRef} className="font-display text-[28px] sm:text-[32px] md:text-[36px] tracking-[0.04em] leading-none">
            <span className="text-text-primary">Selected </span>
            <span className="text-accent">work.</span>
          </h2>
        </div>
      </div>

      {/* Cards */}
      {/* overflow-x-clip contains the desktop pin's parked cards, which sit at
          x: 100vw before they fly in and otherwise widen the whole document.
          `clip` rather than `hidden` so the vertical axis stays `visible` — and
          it goes here rather than on the <section>, which is the pinned element. */}
      <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-x-clip">
        {projects.map((project, idx) => {
          // A project without a live URL yet renders as a plain card so it
          // doesn't open an empty tab. "" is treated the same as "#" — an
          // <a href=""> would reload the current page.
          const isLinked = project.liveUrl !== "#" && project.liveUrl !== "";
          const Card = isLinked ? "a" : "div";
          const linkProps = isLinked
            ? { href: project.liveUrl, target: "_blank", rel: "noopener noreferrer" }
            : {};

          return (
            <Card
              key={project.id}
              ref={(el: HTMLElement | null) => { cardRefs.current[idx] = el; }}
              {...linkProps}
              className="bg-surface overflow-hidden block group"
              // Only opacity is pre-set, so there is no flash before the effect
              // runs. transform/clipPath belong to GSAP alone — duplicating them
              // here is what previously fought the scrub and the mobile branches.
              style={{ border: "0.5px solid var(--c-line)", opacity: 0 }}
            >
              <div
                className="w-full h-[160px] sm:h-[140px] md:h-[220px] bg-media relative overflow-hidden"
                style={{ borderBottom: "0.5px solid var(--c-line)" }}
              >
                <div ref={(el) => { cardImageRefs.current[idx] = el; }} className="w-full h-full relative">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    // Cards are full-width on mobile and half-width from `sm:` up.
                    // Without this, next/image assumes 100vw and serves a needlessly
                    // large variant.
                    sizes="(max-width: 500px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <CardBody project={project} />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
