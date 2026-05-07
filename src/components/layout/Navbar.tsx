const navLinks = ['About', 'Projects', 'Skills', 'Experience', 'Contact'] as const

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-[18px] px-7 border-b-[0.5px] border-[#1e1e1a] bg-[#0a0a0a]">
      <div className="font-display text-[17px] tracking-[0.08em] leading-none">
        <span className="text-[#e8e4dc]">OA</span>
        <span className="text-[#c8a96e]">.</span>
      </div>

      <div className="flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6a6a60] hover:text-[#e8e4dc] transition-colors duration-150"
          >
            {link}
          </a>
        ))}
      </div>

      <a
        href="mailto:yinadesanya@gmail.com"
        className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#c8a96e] border border-[#c8a96e44] py-[6px] px-[14px] bg-transparent"
      >
        Hire me
      </a>
    </nav>
  )
}
