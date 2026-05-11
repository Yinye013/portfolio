"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";

const bio = {
  firstParagraph:
    "I'm a Full Stack Engineer with about 3 years of experience building scalable web applications across the entire stack. I care deeply about clean architecture, performance, and shipping products that actually solve problems.",
  secondParagraph:
    "When I'm not writing code I'm exploring new technologies, contributing to open source, or thinking about how to make complex systems simpler. I bring the same attention to detail to every project I touch.",
  photoUrl: "https://placehold.co/400x500/0f0f0d/2e2e28?text=Photo",
};

export default function About() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionLabelRef = useRef<HTMLDivElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);
  const annotationRef = useRef<HTMLSpanElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const photoImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const splitReveal = () => {
      let split1: SplitType | null = null;
      let split2: SplitType | null = null;
      if (para1Ref.current) {
        split1 = new SplitType(para1Ref.current, { types: "lines" });
        if (split1.lines) gsap.fromTo(split1.lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, stagger: 0.08, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: para1Ref.current, start: "top 85%", toggleActions: "play none none none" } });
      }
      if (para2Ref.current) {
        split2 = new SplitType(para2Ref.current, { types: "lines" });
        if (split2.lines) gsap.fromTo(split2.lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, stagger: 0.08, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: para2Ref.current, start: "top 85%", toggleActions: "play none none none" } });
      }
      if (annotationRef.current) gsap.fromTo(annotationRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.3, scrollTrigger: { trigger: annotationRef.current, start: "top 85%", toggleActions: "play none none none" } });
      return () => { split1?.revert(); split2?.revert(); };
    };

    mm.add("(min-width: 1024px)", () => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -70, ease: "none", scrollTrigger: { trigger: headingRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      if (photoContainerRef.current) gsap.fromTo(photoContainerRef.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.0, ease: "power4.out", scrollTrigger: { trigger: photoContainerRef.current, start: "top 80%", toggleActions: "play none none none" } });
      if (photoImageRef.current) gsap.fromTo(photoImageRef.current, { y: 0 }, { y: -40, ease: "none", scrollTrigger: { trigger: photoImageRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      return splitReveal();
    });

    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -40, ease: "none", scrollTrigger: { trigger: headingRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      if (photoContainerRef.current) gsap.fromTo(photoContainerRef.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.0, ease: "power4.out", scrollTrigger: { trigger: photoContainerRef.current, start: "top 80%", toggleActions: "play none none none" } });
      return splitReveal();
    });

    mm.add("(min-width: 500px) and (max-width: 767px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      if (photoContainerRef.current) gsap.fromTo(photoContainerRef.current, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.0, ease: "power4.out", scrollTrigger: { trigger: photoContainerRef.current, start: "top 80%", toggleActions: "play none none none" } });
      return splitReveal();
    });

    mm.add("(max-width: 499px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      if (photoContainerRef.current) gsap.fromTo(photoContainerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, scrollTrigger: { trigger: photoContainerRef.current, start: "top 85%", toggleActions: "play none none none" } });
      return splitReveal();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="about" className="border-b" style={{ borderBottomWidth: "0.5px", borderColor: "#1e1e1a" }}>
      <div className="flex flex-col-reverse md:grid md:grid-cols-2">
        {/* Photo column */}
        <div
          className="flex flex-col items-center justify-center py-8 md:py-10 px-5 md:px-7 bg-[#0f0f0d]"
          style={{ borderRight: "0.5px solid #1e1e1a", minHeight: "200px" }}
        >
          <div
            ref={photoContainerRef}
            className="w-full max-w-[280px] aspect-[3/4] overflow-hidden relative"
            style={{ border: "0.5px solid #1e1e1a", clipPath: "inset(100% 0 0 0)" }}
          >
            <div ref={photoImageRef} className="w-full h-full relative">
              <Image src={bio.photoUrl} alt="Onyinyechukwu Adesanya" fill className="object-cover" />
            </div>
          </div>
          <span
            className="mt-3 font-mono text-[10px] tracking-[0.12em] uppercase text-[#4a4a44] inline-block py-[3px] px-2"
            style={{ border: "0.5px dashed #2e2e28" }}
          >
            Photo via Contentful
          </span>
        </div>

        {/* Content column */}
        <div className="flex flex-col justify-center py-8 md:py-10 px-5 md:px-8" style={{ borderLeft: "0.5px solid #1e1e1a" }}>
          <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
            <div className="w-[14px] h-px bg-[#5a5a52]" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">Who I am</span>
          </div>

          <h2 ref={headingRef} className="font-display text-[28px] sm:text-[32px] md:text-[36px] tracking-[0.04em] leading-none mb-5">
            <span className="text-[#e8e4dc]">About </span>
            <span className="text-[#c8a96e]">me.</span>
          </h2>

          <p ref={para1Ref} className="text-xs text-[#7a7a70] leading-[1.8] mb-3 overflow-hidden">{bio.firstParagraph}</p>
          <p ref={para2Ref} className="text-xs text-[#7a7a70] leading-[1.8] overflow-hidden">{bio.secondParagraph}</p>

          <span
            ref={annotationRef}
            className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#2e2e28] pl-2 mt-[10px]"
            style={{ borderLeft: "0.5px solid #1e1e1a" }}
          >
            ← bio text &amp; photo managed in Contentful CMS
          </span>
        </div>
      </div>
    </section>
  );
}
