"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiGreensock, SiTypescript,
  SiNodedotjs, SiExpress, SiNestjs, SiSpring,
  SiCss, SiSass, SiTailwindcss, SiChakraui, SiMui,
  SiRedux, SiReactquery, SiPostgresql, SiMongodb, SiPrisma,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbBrandNuxt } from "react-icons/tb";

const skillGroups = [
  {
    category: "Frontend",
    skills: [
      { name: "React",         Icon: SiReact,       color: "#61DAFB" },
      { name: "Next.js",       Icon: SiNextdotjs,   color: "#e8e4dc" },
      { name: "Vue",           Icon: SiVuedotjs,    color: "#4FC08D" },
      { name: "Nuxt.js",       Icon: TbBrandNuxt,   color: "#00DC82" },
      { name: "Angular",       Icon: SiAngular,     color: "#DD0031" },
      { name: "GSAP",          Icon: SiGreensock,   color: "#88CE02" },
      { name: "TypeScript",    Icon: SiTypescript,  color: "#3178C6" },
      { name: "Redux Toolkit", Icon: SiRedux,       color: "#764ABC" },
      { name: "React Query",   Icon: SiReactquery,  color: "#FF4154" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js",     Icon: SiNodedotjs,  color: "#339933" },
      { name: "Express",     Icon: SiExpress,    color: "#e8e4dc" },
      { name: "NestJS",      Icon: SiNestjs,     color: "#E0234E" },
      { name: "Java",        Icon: FaJava,       color: "#007396" },
      { name: "Spring Boot", Icon: SiSpring,     color: "#6DB33F" },
      { name: "PostgreSQL",  Icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB",     Icon: SiMongodb,    color: "#47A248" },
      { name: "Prisma ORM",  Icon: SiPrisma,     color: "#e8e4dc" },
    ],
  },
  {
    category: "Styling",
    skills: [
      { name: "CSS",         Icon: SiCss,         color: "#1572B6" },
      { name: "SASS",        Icon: SiSass,        color: "#CC6699" },
      { name: "TailwindCSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Chakra UI",   Icon: SiChakraui,    color: "#319795" },
      { name: "Material UI", Icon: SiMui,         color: "#007FFF" },
    ],
  },
];

export default function Skills() {
  const sectionRef    = useRef<HTMLElement>(null);
  const sectionLabelRef = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const categoryRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const dropZoneRef   = useRef<HTMLDivElement>(null);
  const droppedIconRefs = useRef<(HTMLDivElement | null)[][]>(skillGroups.map(() => []));

  useEffect(() => {
    const mm = gsap.matchMedia();

    const pillReveal = () => {
      categoryRefs.current.forEach((container) => {
        if (!container) return;
        gsap.fromTo(
          container.querySelectorAll(".skill-pill"),
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", stagger: 0.05, duration: 0.4, ease: "power3.out", scrollTrigger: { trigger: container, start: "top 88%", toggleActions: "play none none none" } },
        );
      });
    };

    const iconDropAnimation = (staggerMode: boolean) => {
      droppedIconRefs.current.forEach((group) => {
        group.forEach((el) => { if (el) gsap.set(el, { opacity: 0, y: -60 }); });
      });

      if (staggerMode) {
        // Tablet / small tablet: drop per group on scroll, no pin
        skillGroups.forEach((group, gi) => {
          const iconEls = group.skills.map((_, si) => droppedIconRefs.current[gi][si]).filter(Boolean);
          const categoryEl = categoryRefs.current[gi]?.querySelector(".drop-category-label");
          if (iconEls.length) {
            gsap.to(iconEls, {
              opacity: 1, y: 0, stagger: 0.06, ease: "bounce.out", duration: 0.5,
              scrollTrigger: { trigger: categoryRefs.current[gi], start: "top 85%", toggleActions: "play none none none",
                onEnter: () => { if (categoryEl) gsap.to(categoryEl, { color: "#c8a96e", duration: 0.2 }); },
              },
            });
          }
        });
      }
    };

    mm.add("(min-width: 1024px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" } });
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -50, ease: "none", scrollTrigger: { trigger: headingRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      pillReveal();

      if (!sectionRef.current || !dropZoneRef.current) return () => {};

      droppedIconRefs.current.forEach((group) => { group.forEach((el) => { if (el) gsap.set(el, { opacity: 0, y: -60 }); }); });

      const totalIconSkills = skillGroups.reduce((sum, g) => sum + g.skills.length, 0);
      const scrollDistance = totalIconSkills * 100;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "center center", end: `+=${scrollDistance}`, pin: true, scrub: 0.8, anticipatePin: 1 },
      });

      let cursor = 0;
      skillGroups.forEach((group, gi) => {
        const categoryEl = categoryRefs.current[gi]?.querySelector(".category-label");
        if (categoryEl) {
          tl.to(categoryEl, { color: "#c8a96e", duration: 0.01 }, cursor / totalIconSkills);
          tl.to(categoryEl, { color: "#4a4a44", duration: 0.01 }, (cursor + group.skills.length) / totalIconSkills);
        }
        group.skills.forEach((_, si) => {
          const el = droppedIconRefs.current[gi][si];
          if (!el) return;
          tl.to(el, { opacity: 1, y: 0, duration: 0.3, ease: "bounce.out" }, cursor / totalIconSkills);
          cursor++;
        });
      });

      return () => {};
    });

    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" } });
      pillReveal();
      iconDropAnimation(true);
      return () => {};
    });

    mm.add("(min-width: 500px) and (max-width: 767px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" } });
      pillReveal();
      iconDropAnimation(true);
      return () => {};
    });

    mm.add("(max-width: 499px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" } });
      // Simple fade for pills on mobile
      categoryRefs.current.forEach((container) => {
        if (!container) return;
        gsap.fromTo(container.querySelectorAll(".skill-pill"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.03, duration: 0.3, scrollTrigger: { trigger: container, start: "top 88%", toggleActions: "play none none none" } });
      });
      iconDropAnimation(true);
      return () => {};
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" style={{ borderBottom: "0.5px solid #1e1e1a" }}>
      {/* Heading — mobile only (static, no animation refs) */}
      <div className="md:hidden pt-9 px-5 sm:px-7 pb-4">
        <div className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">What I work with</span>
        </div>
        <h2 className="font-display text-[28px] tracking-[0.04em] leading-none">
          <span className="text-[#e8e4dc]">My </span>
          <span className="text-[#c8a96e]">stack.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left — skill pills (desktop/tablet only) */}
        <div className="hidden md:block py-9 px-5 sm:px-7" style={{ borderRight: "0.5px solid #1e1e1a" }}>
          <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
            <div className="w-[14px] h-px bg-[#5a5a52]" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">What I work with</span>
          </div>

          <h2 ref={headingRef} className="font-display text-[28px] sm:text-[32px] md:text-[36px] tracking-[0.04em] leading-none mb-5">
            <span className="text-[#e8e4dc]">My </span>
            <span className="text-[#c8a96e]">stack.</span>
          </h2>

          {skillGroups.map((group, i) => (
            <div key={group.category} ref={(el) => { categoryRefs.current[i] = el; }} className="mb-5">
              <p className="category-label font-mono text-[10px] tracking-[0.16em] uppercase text-[#4a4a44] mb-2 pb-[6px] transition-colors duration-200" style={{ borderBottom: "0.5px solid #1a1a18" }}>
                {group.category}
              </p>
              <div className="flex flex-wrap gap-[5px]">
                {group.skills.map((skill) => (
                  <span key={skill.name} className="skill-pill font-mono text-[10px] tracking-widest uppercase py-1 px-2 border border-[#242420] text-[#5a5a52] bg-transparent" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right — icon drop zone */}
        <div ref={dropZoneRef} className="py-9 px-5 sm:px-7 flex flex-col justify-start gap-8">
          {skillGroups.map((group, gi) => (
            <div key={group.category}>
              <p className="drop-category-label font-mono text-[10px] tracking-[0.16em] uppercase text-[#2a2a26] mb-3 pb-[6px] transition-colors duration-200" style={{ borderBottom: "0.5px solid #1a1a18" }}>
                {group.category}
              </p>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, si) => {
                  const Icon = skill.Icon;
                  return (
                    <div
                      key={skill.name}
                      ref={(el) => { droppedIconRefs.current[gi][si] = el; }}
                      className="p-2"
                      style={{ border: "0.5px solid #1e1e1a", background: "#0f0f0d", color: skill.color }}
                      title={skill.name}
                    >
                      <Icon size={24} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
