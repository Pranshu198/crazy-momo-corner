export default function Marquee({ items, className = '', speed = 26, outline = false }: { items: string; className?: string; speed?: number; outline?: boolean }) {
  const row = (key: number) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === 1}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className={`whitespace-nowrap px-2 ${outline ? 'outline-text font-display' : 'font-heading font-bold tracking-[0.2em]'}`}>{items}</span>
      ))}
    </div>
  )
  return (
    <div className={`overflow-hidden ${className}`} role="marquee" aria-label={items}>
      <div className="marquee-track" style={{ ['--mq' as string]: `${speed}s` }}>{[row(0), row(1)]}</div>
    </div>
  )
}
