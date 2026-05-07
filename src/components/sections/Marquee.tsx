const items = [
  'Next.js', 'React', 'Vue', 'Nuxt.js', 'Angular', 'Node.js', 'NestJS',
  'Spring Boot', 'Java', 'TypeScript', 'GSAP', 'Contentful', 'SASS', 'TailwindCSS',
] as const

const doubled = [...items, ...items]

export default function Marquee() {
  return (
    <div className="overflow-hidden py-[10px] bg-[#080808] border-t-[0.5px] border-b-[0.5px] border-[#1e1e1a]">
      <div className="animate-marquee flex w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center font-mono text-[9px] tracking-[0.22em] uppercase text-[#2e2e28] px-6 border-r-[0.5px] border-[#1e1e1a] whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
