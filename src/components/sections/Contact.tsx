"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";
import { SiGithub, SiX } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

const socials = [
  { label: "GitHub",   Icon: SiGithub,     color: "#e8e4dc", href: "https://github.com/Yinye013" },
  { label: "LinkedIn", Icon: FaLinkedinIn, color: "#0A66C2", href: "https://www.linkedin.com/in/onyinyechukwu-adesanya-517489204/" },
  { label: "X",        Icon: SiX,          color: "#e8e4dc", href: "https://x.com/yinye_xx" },
];

export default function Contact() {
  const headingRef        = useRef<HTMLHeadingElement>(null);
  const headingLineRefs   = useRef<(HTMLSpanElement | null)[]>([null, null, null]);
  const sectionLabelRef   = useRef<HTMLDivElement>(null);
  const subRef            = useRef<HTMLParagraphElement>(null);
  const socialsRef        = useRef<HTMLDivElement>(null);
  const formGroupsRef     = useRef<HTMLDivElement>(null);
  const submitBtnRef      = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const commonAnimations = () => {
      let splitSub: SplitType | null = null;

      const headingLines = headingLineRefs.current.filter((el): el is HTMLSpanElement => el !== null);
      if (headingLines.length) {
        gsap.fromTo(headingLines, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", stagger: 0.15, duration: 0.8, ease: "power4.out", scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none none" } });
      }
      if (subRef.current) {
        splitSub = new SplitType(subRef.current, { types: "lines" });
        if (splitSub.lines) gsap.fromTo(splitSub.lines, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, stagger: 0.08, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: subRef.current, start: "top 85%", toggleActions: "play none none none" } });
      }
      if (socialsRef.current) gsap.fromTo(socialsRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: socialsRef.current, start: "top 85%", toggleActions: "play none none none" } });
      if (formGroupsRef.current) gsap.fromTo(formGroupsRef.current.children, { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", stagger: 0.1, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: formGroupsRef.current, start: "top 85%", toggleActions: "play none none none" } });
      if (submitBtnRef.current) gsap.fromTo(submitBtnRef.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.5, delay: 0.45, ease: "power3.out", scrollTrigger: { trigger: formGroupsRef.current, start: "top 85%", toggleActions: "play none none none" } });

      return () => { splitSub?.revert(); };
    };

    const addMagnetic = () => {
      const cleanups: (() => void)[] = [];
      const chips = socialsRef.current ? (Array.from(socialsRef.current.children) as HTMLElement[]) : [];
      chips.forEach((chip) => {
        const onMove = (e: MouseEvent) => { const r = chip.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2); const dy = e.clientY - (r.top + r.height / 2); if (Math.hypot(dx, dy) < 60) gsap.to(chip, { x: dx * 0.2, y: dy * 0.2, duration: 0.2, ease: "power2.out" }); };
        const onLeave = () => gsap.to(chip, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        chip.addEventListener("mousemove", onMove); chip.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { chip.removeEventListener("mousemove", onMove); chip.removeEventListener("mouseleave", onLeave); });
      });
      const btn = submitBtnRef.current;
      if (btn) {
        const onMove = (e: MouseEvent) => { const r = btn.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2); const dy = e.clientY - (r.top + r.height / 2); if (Math.hypot(dx, dy) < 80) gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.2, ease: "power2.out" }); };
        const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        btn.addEventListener("mousemove", onMove); btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); });
      }
      return () => cleanups.forEach((fn) => fn());
    };

    mm.add("(min-width: 1024px)", () => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -70, ease: "none", scrollTrigger: { trigger: headingRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      const c1 = commonAnimations();
      const c2 = addMagnetic();
      return () => { c1?.(); c2?.(); };
    });

    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -40, ease: "none", scrollTrigger: { trigger: headingRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      const c1 = commonAnimations();
      return () => { c1?.(); };
    });

    mm.add("(min-width: 500px) and (max-width: 767px)", () => {
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, scrollTrigger: { trigger: sectionLabelRef.current, start: "top 88%", toggleActions: "play none none none" } });
      const c1 = commonAnimations();
      return () => { c1?.(); };
    });

    mm.add("(max-width: 499px)", () => {
      const c1 = commonAnimations();
      return () => { c1?.(); };
    });

    return () => mm.revert();
  }, []);

  const inputClass = "w-full bg-[#0f0f0d] text-[#8a8a80] font-sans text-[11px] py-2 px-3 outline-none focus:border-[#3a3a34] transition-colors";

  return (
    <section id="contact" style={{ borderBottom: "0.5px solid #1e1e1a" }}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left column */}
        <div className="flex flex-col justify-center py-10 px-5 sm:px-7" style={{ borderRight: "0.5px solid #1e1e1a" }}>
          <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
            <div className="w-[14px] h-px bg-[#5a5a52]" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">Get in touch</span>
          </div>

          <h2 ref={headingRef} className="font-display text-[36px] sm:text-[38px] md:text-[42px] tracking-[0.03em] leading-[0.9] mb-[14px]">
            <span ref={(el) => { headingLineRefs.current[0] = el; }} className="block text-[#e8e4dc]" style={{ clipPath: "inset(0 100% 0 0)" }}>Let&apos;s</span>
            <span ref={(el) => { headingLineRefs.current[1] = el; }} className="block text-[#2e2e28]" style={{ clipPath: "inset(0 100% 0 0)" }}>build</span>
            <span ref={(el) => { headingLineRefs.current[2] = el; }} className="block text-[#e8e4dc]" style={{ clipPath: "inset(0 100% 0 0)" }}>something.</span>
          </h2>

          <p ref={subRef} className="text-[13px] text-[#5a5a52] leading-[1.7] mb-5 overflow-hidden">
            Open to full-time roles, freelance contracts, and interesting collaborations. Don&apos;t hesitate to reach out.
          </p>

          <div ref={socialsRef} className="flex gap-2">
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                className="transition-opacity hover:opacity-70 cursor-pointer p-[8px]"
                style={{ border: "0.5px solid #1e1e1a", color: social.color }}
              >
                <social.Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-center py-10 px-5 sm:px-7 bg-[#0f0f0d]">
          <div className="flex flex-col gap-3">
            <div ref={formGroupsRef} className="flex flex-col gap-3">
              <div className="flex flex-col gap-[5px]" style={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}>
                <label htmlFor="contact-name" className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#4a4a44]">Name</label>
                <input id="contact-name" type="text" placeholder="Your name" className={inputClass} style={{ border: "0.5px solid #1e1e1a" }} />
              </div>
              <div className="flex flex-col gap-[5px]" style={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}>
                <label htmlFor="contact-email" className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#4a4a44]">Email</label>
                <input id="contact-email" type="email" placeholder="your@email.com" className={inputClass} style={{ border: "0.5px solid #1e1e1a" }} />
              </div>
              <div className="flex flex-col gap-[5px]" style={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}>
                <label htmlFor="contact-message" className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#4a4a44]">Message</label>
                <textarea id="contact-message" placeholder="What are you working on?" rows={4} className={`${inputClass} resize-none`} style={{ border: "0.5px solid #1e1e1a" }} />
              </div>
            </div>
            <button ref={submitBtnRef} type="button" className="mt-1 w-full md:w-auto inline-block font-mono text-[10px] tracking-[0.14em] uppercase font-medium text-[#0a0a0a] bg-[#c8a96e] py-[10px] px-5 cursor-pointer text-center" style={{ clipPath: "inset(0 100% 0 0)" }}>
              Send message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
