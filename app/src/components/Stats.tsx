import { useEffect, useRef, useState } from 'react'
import { SITE, } from '../data/site'
import { MENU } from '../data/menu'

function Counter({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null); const [val, setVal] = useState(0)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect()
      const start = performance.now(); const dur = 1400
      const step = (t: number) => { const p = Math.min(1, (t - start) / dur); setVal(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step) }
      requestAnimationFrame(step)
    }, { threshold: 0.4 })
    io.observe(el); return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>
}

export default function Stats() {
  const stats = [
    { v: <Counter to={SITE.rating} decimals={1} />, label: 'Justdial Rating' },
    { v: <Counter to={SITE.ratingCount} suffix="+" />, label: 'Happy Ratings' },
    { v: <Counter to={MENU.length} suffix="+" />, label: 'Dishes & Combos' },
    { v: <Counter to={7} />, label: 'Days Open / Week' },
  ]
  return (
    <section aria-label="Crazy Momo Corner ke numbers" className="border-y line surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map(s => (
          <div key={s.label} className="text-center">
            <div className="font-display text-4xl sm:text-5xl grad-text">{s.v}</div>
            <div className="mut text-xs font-heading tracking-[0.22em] mt-1.5 uppercase">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
