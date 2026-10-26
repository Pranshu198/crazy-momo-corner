import { Suspense, lazy, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, Clock, MapPin, Star } from 'lucide-react'
import { MENU, SIGNATURES } from '../data/menu'
import { SITE, waLink } from '../data/site'
import TypingText from './TypingText'

const DishScene = lazy(() => import('./DishViewer360').then(m => ({ default: m.DishScene })))

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 16 }); const sy = useSpring(my, { stiffness: 60, damping: 16 })
  const px = useTransform(sx, [-0.5, 0.5], [-16, 16]); const py = useTransform(sy, [-0.5, 0.5], [-10, 10])
  const gx = useTransform(sx, [-0.5, 0.5], [50, -50])
  const onMove = (e: React.MouseEvent) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5) }
  return (
    <section id="home" ref={ref} onMouseMove={onMove} className="relative min-h-[100svh] flex items-center overflow-hidden grain pt-24 pb-16">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full opacity-25 blur-3xl" style={{ background: 'radial-gradient(closest-side,#FF3B30,transparent)' }} />
        <motion.div style={{ x: gx }} className="absolute bottom-0 right-0 w-[50vw] h-[40vh] rounded-full opacity-15 blur-3xl bg-[#FF8A00]" />
        <div className="absolute top-[22%] left-[6%] w-24 h-24 rounded-full bg-[#FF3B30]/15 blur-2xl floaty" />
        <div className="absolute top-[16%] right-[10%] w-16 h-16 rounded-full bg-[#FF8A00]/20 blur-xl floaty" style={{ animationDelay: '1.2s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center relative z-10 w-full">
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs font-heading font-bold tracking-wider rounded-full border line surface px-3 py-1.5"><Star size={13} className="text-[#FF8A00]" fill="#FF8A00" /> {SITE.rating.toFixed(1)} Rated ({SITE.ratingCount} Justdial)</span>
            <span className="flex items-center gap-1.5 text-xs font-heading font-bold tracking-wider rounded-full border line surface px-3 py-1.5"><MapPin size={13} className="text-[#FF3B30]" /> Uttam Nagar</span>
            <span className="flex items-center gap-1.5 text-xs font-heading font-bold tracking-wider rounded-full border line surface px-3 py-1.5"><Clock size={13} className="text-[#FF8A00]" /> Till 11 PM</span>
          </motion.div>
          <h1 className="font-display uppercase leading-[0.92] mt-5 text-[clamp(3.2rem,11vw,7.5rem)]">
            {'CRAZY MOMO'.split('').map((c, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 40, rotateX: 70 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.25 + i * 0.035, duration: 0.5 }} className="inline-block">{c === ' ' ? '\u00A0' : c}</motion.span>
            ))}
            <span className="block grad-text">CORNER</span>
          </h1>
          <div className="font-display uppercase text-[clamp(1.3rem,4.5vw,2.2rem)] mt-4 h-[1.3em]"><TypingText /></div>
          <p className="font-accent text-2xl sm:text-3xl text-[#FF8A00] mt-2">{SITE.tagline}</p>
          <p className="mut mt-3 max-w-md">{SITE.freeDelivery}. Steam se kurkure tak — har plate fresh, garam aur loaded.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button data-magnetic onClick={() => document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })} className="grad-bg text-white font-bold rounded-full px-7 py-3.5 shadow-xl active:scale-95 transition-transform">Explore Menu</button>
            <a data-magnetic href={waLink('Hi Crazy Momo Corner! Mujhe order karna hai.')} target="_blank" rel="noreferrer" className="bg-[#25D366] text-[#04240f] font-bold rounded-full px-7 py-3.5 shadow-xl active:scale-95 transition-transform">Order on WhatsApp</a>
          </div>
          <div className="mt-8 flex items-center gap-2 mut text-xs font-heading tracking-widest"><span className="w-8 h-px grad-bg" /> {MENU.length}+ DISHES • PURE VEG • {SITE.timingShort}</div>
        </div>
        <motion.div style={{ x: px, y: py }} className="relative h-[46svh] lg:h-[62svh] min-h-[320px]" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <div className="absolute inset-8 rounded-full bg-[#FF3B30]/20 blur-3xl" aria-hidden />
          <Suspense fallback={<div className="h-full rounded-[28px] shimmer" aria-label="3D dish load ho raha hai" />}>
            <DishScene dish={SIGNATURES[4]} />
          </Suspense>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
            <div className="font-display uppercase text-lg">{SIGNATURES[4].name}</div>
            <div className="mut text-xs font-heading tracking-widest">DRAG KARKE 360° GHUMAO</div>
          </div>
        </motion.div>
      </div>
      <button onClick={() => document.querySelector('#specials')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Neeche scroll karo" className="absolute bottom-5 left-1/2 -translate-x-1/2 mut hover:text-[#FF8A00] transition-colors">
        <ChevronDown className="animate-bounce" />
      </button>
    </section>
  )
}
