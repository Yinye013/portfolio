"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const projects = [
  {
    id: 1,
    number: "01",
    title: "Netflix Clone",
    description: "A fullstack streaming app where users can register, browse trending/top-rated movies, watch trailers, and manage a personal favourites list. Built with Next.js, Prisma ORM, and NextAuth.",
    tags: ["Next.js", "Prisma", "NextAuth", "MongoDB"],
    primaryTag: "Next.js",
    imageUrl: "/projects/netflix-clone.png",
    liveUrl: "https://ntflx-seven.vercel.app/",
  },
  {
    id: 2,
    number: "02",
    title: "Airtime Wallet App",
    description: "A digital wallet platform that lets users top up their balance and purchase airtime for all major Nigerian mobile networks. Built with React on the frontend and Node.js/Express on the backend.",
    tags: ["React", "Node.js", "Express"],
    primaryTag: "React",
    imageUrl: "/projects/airtime-wallet.png",
    liveUrl: "https://airtime-app-frontend.vercel.app/",
  },
  {
    id: 3,
    number: "03",
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
        <p className="font-mono text-[10px] tracking-[0.14em] text-[#3a3a34] mb-1">{project.number}</p>
        <p className="font-sans text-xs font-medium text-[#d8d4cc] mb-1">{project.title}</p>
        <p className="text-[11px] text-[#5a5a52] leading-[1.5] mb-[10px]">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] tracking-[0.1em] uppercase py-[2px] px-[6px]"
              style={{ color: tag === project.primaryTag ? "#c8a96e" : "#5a5a52", border: `0.5px solid ${tag === project.primaryTag ? "#c8a96e44" : "#2a2a26"}` }}
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

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (!sectionRef.current || !cardsContainerRef.current) return;

      // Reset cards to initial state for pin animation
      cardRefs.current.forEach((card) => {
        if (card) gsap.set(card, { x: "100vw", opacity: 0, clipPath: "inset(0 100% 0 0)" });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: () => `+=${projects.length * 600}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      if (headingRef.current) tl.fromTo(headingRef.current, { x: 0 }, { x: -40, ease: "none" }, 0);

      const ranges: [number, number][] = [[0, 0.33], [0.25, 0.58], [0.5, 0.83]];
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const [start, end] = ranges[i];
        tl.fromTo(card, { x: "100vw", opacity: 0, clipPath: "inset(0 100% 0 0)" }, { x: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", ease: "power3.out" }, start);
        tl.to(card, {}, end);
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

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-9 px-5 sm:px-7 relative" style={{ borderBottom: "0.5px solid #1e1e1a" }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
            <div className="w-[14px] h-px bg-[#5a5a52]" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">What I&apos;ve built</span>
          </div>
          <h2 ref={headingRef} className="font-display text-[28px] sm:text-[32px] md:text-[36px] tracking-[0.04em] leading-none">
            <span className="text-[#e8e4dc]">Selected </span>
            <span className="text-[#c8a96e]">work.</span>
          </h2>
        </div>
      </div>

      {/* Cards */}
      <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {projects.map((project, idx) => (
          <a
            key={project.id}
            ref={(el) => { cardRefs.current[idx] = el; }}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0f0f0d] overflow-hidden block group"
            style={{ border: "0.5px solid #1e1e1a", clipPath: "inset(0 100% 0 0)", opacity: 0, transform: "translateX(100vw)" }}
          >
            <div
              className="w-full h-[160px] sm:h-[140px] md:h-[220px] bg-[#151513] relative overflow-hidden"
              style={{ borderBottom: "0.5px solid #1e1e1a" }}
            >
              <div ref={(el) => { cardImageRefs.current[idx] = el; }} className="w-full h-full relative">
                <Image src={project.imageUrl} alt={project.title} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            <CardBody project={project} />
          </a>
        ))}
      </div>
    </section>
  );
}
