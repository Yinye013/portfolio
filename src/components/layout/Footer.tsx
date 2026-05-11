const stack = ["Next.js", "Contentful", "GSAP"] as const;

export default function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center sm:justify-between gap-1 sm:gap-0 py-[18px] px-5 sm:px-7 border-t-[0.5px] border-[#111111] text-center sm:text-left">
      <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-[#3a3a34]">
        © 2025 Onyinyechukwu Adesanya
      </span>

      <div className="flex items-center">
        {stack.map((item, i) => (
          <span
            key={item}
            className={`font-mono text-[12px] tracking-[0.1em] uppercase text-[#2e2e28]${
              i > 0 ? " border-l-[0.5px] border-[#1e1e1a] pl-3 ml-3" : ""
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </footer>
  );
}
