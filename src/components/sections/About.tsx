"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

const bio = {
  firstParagraph:
    "I'm a Full Stack Engineer with about 3 years of experience building scalable web applications across the entire stack. I care deeply about clean architecture, performance, and shipping products that actually solve problems.",
  secondParagraph:
    "When I'm not writing code I'm exploring new technologies, contributing to open source, or thinking about how to make complex systems simpler. I bring the same attention to detail to every project I touch.",
};

export default function About() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionLabelRef = useRef<HTMLDivElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);
  const annotationRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const splitReveal = () => {
      let split1: SplitType | null = null;
      let split2: SplitType | null = null;
      if (para1Ref.current) {
        split1 = new SplitType(para1Ref.current, { types: "lines" });
        if (split1.lines)
          gsap.fromTo(
            split1.lines,
            { y: "100%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              stagger: 0.08,
              duration: 0.65,
              ease: "power3.out",
              scrollTrigger: {
                trigger: para1Ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
      }
      if (para2Ref.current) {
        split2 = new SplitType(para2Ref.current, { types: "lines" });
        if (split2.lines)
          gsap.fromTo(
            split2.lines,
            { y: "100%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              stagger: 0.08,
              duration: 0.65,
              ease: "power3.out",
              scrollTrigger: {
                trigger: para2Ref.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
      }
      if (annotationRef.current)
        gsap.fromTo(
          annotationRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.3,
            scrollTrigger: {
              trigger: annotationRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      return () => {
        split1?.revert();
        split2?.revert();
      };
    };

    // The column is centred, so the label now rises into place rather than
    // sliding in from the left edge as it did in the old split layout.
    const labelReveal = (distance: number) => {
      if (!sectionLabelRef.current) return;
      gsap.fromTo(
        sectionLabelRef.current,
        { y: distance, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionLabelRef.current,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    };

    mm.add("(min-width: 1024px)", () => {
      if (headingRef.current)
        gsap.fromTo(
          headingRef.current,
          { y: 0 },
          {
            y: -70,
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      labelReveal(16);
      return splitReveal();
    });

    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      if (headingRef.current)
        gsap.fromTo(
          headingRef.current,
          { y: 0 },
          {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      labelReveal(12);
      return splitReveal();
    });

    mm.add("(min-width: 500px) and (max-width: 767px)", () => {
      if (sectionLabelRef.current)
        gsap.fromTo(
          sectionLabelRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: sectionLabelRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      return splitReveal();
    });

    mm.add("(max-width: 499px)", () => {
      if (sectionLabelRef.current)
        gsap.fromTo(
          sectionLabelRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            scrollTrigger: {
              trigger: sectionLabelRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      return splitReveal();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      className="border-b"
      style={{ borderBottomWidth: "0.5px", borderColor: "var(--c-line)" }}
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center py-14 md:py-20 px-5 md:px-8">
        <div
          ref={sectionLabelRef}
          className="flex items-center justify-center gap-2 mb-[6px]"
        >
          <div className="w-[14px] h-px bg-text-muted" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-muted">
            Who I am
          </span>
          <div className="w-[14px] h-px bg-text-muted" />
        </div>

        <h2
          ref={headingRef}
          className="font-display text-[28px] sm:text-[32px] md:text-[36px] tracking-[0.04em] leading-none mb-5"
        >
          <span className="text-text-primary">About </span>
          <span className="text-accent">me.</span>
        </h2>

        {/* SplitType measures line boxes, so the paragraphs keep an explicit
            max-width — centred text with no bound would re-wrap unpredictably. */}
        <p
          ref={para1Ref}
          className="text-xs text-text-body-soft leading-[1.8] mb-3 overflow-hidden max-w-[60ch]"
        >
          {bio.firstParagraph}
        </p>
        <p
          ref={para2Ref}
          className="text-xs text-text-body-soft leading-[1.8] overflow-hidden max-w-[60ch]"
        >
          {bio.secondParagraph}
        </p>

        {/* <span
          ref={annotationRef}
          className="block font-mono text-[10px] tracking-[0.1em] uppercase text-text-ghost pt-2 mt-[14px]"
          style={{ borderTop: "0.5px solid var(--c-line)" }}
        >
          bio text managed in Contentful CMS
        </span> */}
      </div>
    </section>
  );
}
