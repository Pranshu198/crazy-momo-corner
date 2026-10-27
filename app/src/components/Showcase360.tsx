import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Rotate3d } from 'lucide-react'
import { priceLabel } from '../data/menu'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)
const DishScene = lazy(() => import('./DishViewer360').then(m => ({ default: m.DishScene })))

export default function Showcase360() {
  const [idx, setIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const pinRef = useRef<HTMLDivElement>(null)
  const { setViewerDish, add, signatures: SIGNATURES } = useApp()
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsMobile(mq.matches); update(); mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (isMobile || !pinRef.current) return
    const st = ScrollTrigger.create({
      trigger: pinRef.current, start: 'top top', end: `+=${SIGNATURES.length * 90}%`, pin: true, scrub: 0.4,
      onUpdate: self => setIdx(Math.min(SIGNATURES.length - 1, Math.floor(self.progress * SIGNATURES.length))),
    })
    return () => { st.kill() }
  }, [isMobile])
  const dish = SIGNATURES[idx]
  const viewer = (
    <Suspense fallback={<div className="h-full min-h-[300px] rounded-[28px] shimmer" aria-label="3D view load ho raha hai" />}>
      <DishScene key={dish.id} dish={dish} height="100%" />
    </Suspense>
  )
  const info = (
    <div key={dish.id}>
      <div className="font-display outline-text text-[clamp(4rem,12vw,8rem)] leading-none select-none" aria-hidden>0{idx + 1}</div>
      <AnimatePresence mode="wait">
        <motion.div key={dish.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.35 }}>
          <h3 className="font-display uppercase text-[clamp(1.8rem,5vw,3.4rem)] leading-[0.95] mt-2">{dish.name}{dish.soldOut && <span className="ml-3 align-middle bg-[#FF3B30] text-white text-xs font-heading font-bold tracking-widest px-2.5 py-1 rounded-full">SOLD OUT</span>}</h3>
          <div className="flex items-center gap-3 mt-3">
            <span className="grad-text font-display text-2xl">{priceLabel(dish)}</span>
            <span className="flex gap-0.5" aria-label={`Spice ${dish.spice}/3`}>{[0, 1, 2].map(i => <Flame key={i} size={16} className={i < dish.spice ? 'text-[#FF3B30]' : 'opacity-25'} fill={i < dish.spice ? '#FF3B30' : 'transparent'} />)}</span>
          </div>
          <p className="mut mt-3 max-w-md">{dish.desc}</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => setViewerDish(dish)} className="flex items-center gap-2 grad-bg text-white font-bold rounded-full px-6 py-3 active:scale-95 transition-transform"><Rotate3d size={17} /> Full 360° View</button>
            <button onClick={() => add(dish)} disabled={dish.soldOut} className="rounded-full border line surface font-bold px-6 py-3 active:scale-95 transition-transform disabled:opacity-40 disabled:pointer-events-none">{dish.soldOut ? "Sold Out hai" : "+ Add to Order"}</button>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-2 mt-7" role="tablist" aria-label="Signature dishes">
        {SIGNATURES.map((s, i) => (
          <button key={s.id} role="tab" aria-selected={i === idx} aria-label={s.name} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all ${i === idx ? 'w-10 grad-bg' : 'w-4 bg-current opacity-25'}`} />
        ))}
      </div>
    </div>
  )
  if (isMobile) {
    return (
      <section id="specials" className="py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display uppercase text-[clamp(2.2rem,8vw,4.5rem)] leading-none">Hamare <span className="grad-text">Crazy</span> 360° Specials</h2>
          <p className="mut mt-2">Side me swipe karo — har dish 3D me ghumti hui.</p>
        </div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 pt-8 pb-4" style={{ scrollbarWidth: 'none' }}>
          {SIGNATURES.map((s, i) => (
            <article key={s.id} className="snap-center shrink-0 w-[85vw] max-w-sm surface border line rounded-[26px] overflow-hidden">
              <div className="h-60 img-frame"><Suspense fallback={<div className="h-full shimmer" />}><DishScene dish={s} /></Suspense></div>
              <div className="p-5">
                <div className="font-display text-lg opacity-40">0{i + 1}</div>
                <h3 className="font-display uppercase text-2xl leading-tight">{s.name}</h3>
                <div className="grad-text font-display text-xl mt-1">{priceLabel(s)}</div>
                <p className="mut text-sm mt-2 line-clamp-2">{s.desc}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setViewerDish(s)} className="flex-1 flex items-center justify-center gap-2 grad-bg text-white font-bold rounded-full py-2.5 text-sm active:scale-95 transition-transform"><Rotate3d size={15} /> 360° View</button>
                  <button onClick={() => add(s)} className="flex-1 rounded-full border line font-bold py-2.5 text-sm active:scale-95 transition-transform">+ Add</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
  }
  return (
    <section id="specials" className="relative">
      <div ref={pinRef} className="min-h-[100svh] flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 items-center w-full">
          <div>
            <div className="font-heading text-xs tracking-[0.3em] mut">06 — SIGNATURE SHOWCASE</div>
            <h2 className="font-display uppercase text-[clamp(2.2rem,6vw,4.2rem)] leading-none mt-2 mb-8">Hamare <span className="grad-text">Crazy</span> Specials</h2>
            {info}
          </div>
          <div className="h-[62svh] min-h-[380px] relative">
            <div className="absolute inset-10 rounded-full bg-[#FF8A00]/15 blur-3xl" aria-hidden />
            {viewer}
          </div>
        </div>
      </div>
    </section>
  )
}
