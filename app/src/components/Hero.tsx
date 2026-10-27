import { Suspense, lazy, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronDown, Clock, MapPin, Star } from 'lucide-react'
import { MENU, SIGNATURES } from '../data/menu'
import { SITE, waLink } from '../data/site'
import TypingText from './TypingText'

const DishScene = lazy(() => import('./DishViewer360').then(m => ({ default: m.DishScene })))

const ROTS = [-7, 5, -4, 6, -5, 4, -6, 5, -3, 6]
/** Funky word — har letter alag rotation/baseline, springy stagger entry */
function FunkyWord({ word, className = '', delay = 0 }: { word: string; className?: string; delay?: number }) {
  return (
    <span className={`inline-block ${className}`} aria-hidden>
      {word.split('').map((c, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 60, rotate: ROTS[i % ROTS.length] * 3, scale: 0.6 }}
          animate={{ opacity: 1, y: i % 2 ? 5 : -3, rotate: ROTS[i % ROTS.length], scale: 1 }}
          transition={{ delay: delay + i * 0.055, type: 'spring', stiffness: 320, damping: 13 }}
          className="inline-block will-change-transform">{c === ' ' ? '\u00A0' : c}</motion.span>
      ))}
    </span>
  )
}

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
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-wrap gap-3">
            <span className="sticker -rotate-2 flex items-center gap-1.5 text-xs tracking-wider px-3.5 py-1.5"><Star size={13} className="text-[#FF8A00]" fill="#FF8A00" /> {SITE.rating.toFixed(1)} Rated ({SITE.ratingCount} Justdial)</span>
            <span className="sticker sticker-gold rotate-1 flex items-center gap-1.5 text-xs tracking-wider px-3.5 py-1.5"><MapPin size={13} className="text-[#FF3B30]" /> Uttam Nagar</span>
            <span className="sticker -rotate-1 flex items-center gap-1.5 text-xs tracking-wider px-3.5 py-1.5"><Clock size={13} className="text-[#FF8A00]" /> Till 11 PM</span>
          </motion.div>
          <h1 aria-label="Crazy Momo Corner" className="font-display uppercase leading-[0.95] mt-6 text-[clamp(3rem,11.5vw,7.2rem)]">
            <span className="block">
              <FunkyWord word="CRAZY" delay={0.2} />{' '}
              <span className="font-accent normal-case grad-text inline-block -rotate-3 text-[0.92em] translate-y-1">wale</span>
            </span>
            <span className="block outline-word -rotate-1 origin-left scale-[1.02]"><FunkyWord word="MOMO" delay={0.5} /></span>
            <motion.span initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 1.5 }} transition={{ delay: 0.85, type: 'spring', stiffness: 260, damping: 12 }}
              className="inline-block grad-bg text-white rounded-[22px] px-4 sm:px-6 pb-2 mt-2 shadow-hard-ink" aria-hidden>CORNER</motion.span>
          </h1>
          <div className="font-display uppercase text-[clamp(1.3rem,4.5vw,2.2rem)] mt-5 h-[1.3em]"><TypingText /></div>
          <motion.p initial={{ opacity: 0, scale: 0.6, rotate: 4 }} animate={{ opacity: 1, scale: 1, rotate: -2.5 }} transition={{ delay: 1.15, type: 'spring', stiffness: 300, damping: 13 }}
            className="sticker sticker-gold inline-block text-sm sm:text-base px-4 py-2 mt-3">Momos itne crazy, diet bhi confuse!</motion.p>
          <p className="font-accent text-2xl sm:text-3xl text-[#FF8A00] mt-4">{SITE.tagline}</p>
          <p className="mut mt-3 max-w-md">{SITE.freeDelivery}. Steam se kurkure tak — har plate fresh, garam aur loaded.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <button data-magnetic onClick={() => document.querySelector('#builder')?.scrollIntoView({ behavior: 'smooth' })} className="grad-bg text-white font-bold rounded-full px-7 py-3.5 shadow-hard active:scale-95 transition-transform">Build Your Plate</button>
            <a data-magnetic href={waLink('Hi Crazy Momo Corner! Mujhe order karna hai.')} target="_blank" rel="noreferrer" className="bg-[#25D366] text-[#04240f] font-bold rounded-full px-7 py-3.5 shadow-hard-gold active:scale-95 transition-transform">Order on WhatsApp</a>
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
