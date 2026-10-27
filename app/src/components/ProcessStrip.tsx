import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { ChefHat, CircleDot, Flame, Hand, Soup, Wind } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)
const STEPS = [
  { icon: CircleDot, label: 'Dough', text: 'Taaza aata ghuthna' },
  { icon: Hand, label: 'Filling', text: 'Loaded masala bharai' },
  { icon: ChefHat, label: 'Pleating', text: 'Haath ki kala, har fold' },
  { icon: Wind, label: 'Steaming / Tandoor', text: 'Bhaap ya aanch' },
  { icon: Flame, label: 'Chutney', text: 'Signature lal chutney' },
  { icon: Soup, label: 'Serve', text: 'Garam, turant' },
]

/** Desktop: GSAP pinned horizontal scroll. Mobile/tablet: native swipe strip. */
export default function ProcessStrip() {
  const secRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current; const sec = secRef.current
      if (!track || !sec) return
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 64)
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
      })
      return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(track, { x: 0 }) }
    })
    return () => mm.revert()
  }, [])
  return (
    <section ref={secRef} aria-label="From Steam to Sizzle — process" className="py-16 lg:py-0 lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center overflow-hidden relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 font-display outline-text text-[clamp(6rem,18vw,15rem)] leading-none opacity-40 pointer-events-none select-none whitespace-nowrap" data-parallax="6" aria-hidden>SIZZLE</div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative">
        <div className="font-heading text-xs tracking-[0.3em] mut" data-reveal>PROCESS</div>
        <h3 className="font-display uppercase text-[clamp(2rem,6vw,4rem)] leading-none mt-2" data-clip>From Steam <span className="grad-text">to Sizzle</span></h3>
        <p className="mut mt-3 max-w-md hidden lg:block">Scroll karte jao — plate tak ka safar, side me khisakta hua.</p>
      </div>
      <div className="overflow-x-auto lg:overflow-visible mt-8 lg:mt-12" style={{ scrollbarWidth: 'none' }}>
        <div ref={trackRef} className="flex gap-4 sm:gap-5 px-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4 w-max max-w-none">
          {STEPS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className={`snap-start shrink-0 w-56 sm:w-64 surface border line rounded-[26px] p-6 card-shine ${i % 2 ? 'lg:translate-y-8 rotate-[0.6deg]' : '-rotate-[0.6deg]'}`}>
              <div className="flex items-center justify-between"><span className="w-12 h-12 grid place-items-center rounded-2xl grad-bg text-white shadow-lg"><s.icon size={24} /></span><span className="font-display text-4xl opacity-20">0{i + 1}</span></div>
              <div className="font-heading font-bold text-lg mt-5">{s.label}</div>
              <div className="mut text-sm mt-1">{s.text}</div>
              {i < STEPS.length - 1 && <div className="mt-5 h-1 w-full grad-bg rounded-full opacity-50" aria-hidden />}
            </motion.div>
          ))}
          <div className="shrink-0 w-56 sm:w-64 grid place-items-center">
            <div className="font-heading italic font-bold text-3xl grad-text text-center leading-tight">…aur plate<br />tumhare saamne!</div>
          </div>
        </div>
      </div>
    </section>
  )
}
