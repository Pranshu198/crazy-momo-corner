import { useEffect, useState } from 'react'

const SECTIONS = [
  ['home', 'Home'], ['delivery', 'Free Delivery'], ['specials', '360° Specials'], ['builder', 'Build Your Plate'], ['menu', 'Menu Wall'],
  ['why', 'Why Us'], ['gallery', 'Gallery'], ['reviews', 'Reviews'], ['visit', 'Visit Us'],
] as const

/** Right-side section dots (desktop only) with active tracking + labels. */
export default function SideIndicator() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-38% 0px -55% 0px' })
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <nav aria-label="Sections" className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-[65] flex-col gap-3">
      {SECTIONS.map(([id, label]) => (
        <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} aria-label={`${label} section par jao`} aria-current={active === id}
          className="group flex items-center gap-2.5 flex-row-reverse">
          <span className={`side-dot rounded-full border ${active === id ? 'w-3 h-3 grad-bg border-transparent shadow-lg' : 'w-2 h-2 bg-transparent opacity-50 group-hover:opacity-100'}`} style={{ borderColor: 'var(--line)' }} />
          <span className={`text-[10px] font-heading font-bold tracking-[0.18em] uppercase whitespace-nowrap transition-all ${active === id ? 'opacity-100 grad-text' : 'opacity-0 group-hover:opacity-70'}`}>{label}</span>
        </button>
      ))}
    </nav>
  )
}
