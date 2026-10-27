import { motion } from 'framer-motion'
import { Flame, Leaf, Plus, Printer, Rotate3d } from 'lucide-react'
import { ADD_PRICE_LABEL, CATEGORIES, type Dish } from '../data/menu'
import { useApp } from '../context/AppContext'
import Marquee from './Marquee'
import Tilt from './Tilt'

const BASE = import.meta.env.BASE_URL
const ACCENTS: Record<string, string> = {
  'Steam Momos': 'garam bhaap, naram dil',
  'Fried Momos': 'golden crunch',
  'Kurkure Momos': 'crunch ka king',
  'Gravy Momos': 'masala me dooba',
  'Sides & Chinese': 'street style chinese',
  'Soups & Beverages': 'garam ghunt, thandi drink',
}

function VegDot() {
  return <span className="w-3.5 h-3.5 mt-1 rounded-[4px] border-2 border-[#22C55E] grid place-items-center shrink-0" title="Pure Veg" aria-label="Pure Veg"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /></span>
}
function SpiceMini({ level }: { level: number }) {
  if (!level) return null
  return <span className="flex gap-px shrink-0 mt-1" aria-label={`Spice ${level}/3`}>{[0, 1, 2].map(i => <Flame key={i} size={11} className={i < level ? 'text-[#FF3B30]' : 'opacity-20'} fill={i < level ? '#FF3B30' : 'transparent'} />)}</span>
}

function SoldOutBadge() { return <span className="bg-[#FF3B30] text-white text-[10px] font-heading font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">Sold Out</span> }
function PriceBlock({ dish, big = false }: { dish: Dish; big?: boolean }) {
  if (dish.price === 'ADD_PRICE') return <span className="block text-xs font-heading font-bold mut leading-snug max-w-[8rem] sm:max-w-none sm:whitespace-nowrap">{ADD_PRICE_LABEL}</span>
  if (dish.fullPrice) return (
    <span className={`flex gap-3 font-display leading-none ${big ? 'text-2xl' : 'text-base sm:text-lg'}`}>
      <span><span className="block text-[10px] font-heading font-bold tracking-widest mut mb-0.5">{dish.halfLabel ?? 'HALF'}</span>₹{dish.price}</span>
      <span className="grad-text"><span className="block text-[10px] font-heading font-bold tracking-widest mut mb-0.5">{dish.fullLabel ?? 'FULL'}</span>₹{dish.fullPrice}</span>
    </span>
  )
  return <span className={`font-display leading-none ${big ? 'text-2xl' : 'text-base sm:text-lg'}`}>₹{dish.price}<span className="block text-[10px] font-heading font-bold tracking-widest mut mt-0.5">{dish.category === 'Soups & Beverages' ? '1 GLASS' : 'PER PC / SERVE'}</span></span>
}

function DishRow({ dish, i, feature = false }: { dish: Dish; i: number; feature?: boolean }) {
  const { add, setViewerDish } = useApp()
  if (feature) {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.55 }}
        className="jump-hover relative surface2 border line rounded-[24px] p-4 sm:p-5 my-4 flex gap-4 items-center overflow-hidden">
        <img decoding="async" src={`${BASE}${dish.img}`} alt={`${dish.name} — Crazy Momo Corner`} width={1920} height={1280} loading="lazy" className={`w-24 h-24 sm:w-36 sm:h-28 rounded-2xl object-cover img-frame shrink-0 ${dish.soldOut ? 'grayscale opacity-60' : ''}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <VegDot />
            <h4 className="font-display uppercase text-lg sm:text-[1.55rem] leading-[0.95]">{dish.name}</h4>
            {dish.tags?.[0] && <span className="bg-[#14100C] text-white dark:bg-white dark:text-black text-[10px] font-heading font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">{dish.tags[0]}</span>}{dish.soldOut && <SoldOutBadge />}
          </div>
          <p className="mut text-[13px] sm:text-sm leading-snug mt-1.5 max-w-lg">{dish.desc}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <PriceBlock dish={dish} big />
            <button onClick={() => add(dish)} disabled={dish.soldOut} className="flex items-center gap-1.5 grad-bg text-white font-bold rounded-full px-4 py-2 text-sm shadow active:scale-95 hover:scale-105 transition-transform disabled:opacity-40 disabled:pointer-events-none"><Plus size={15} /> {dish.soldOut ? 'Sold Out' : 'Add'}</button>
            {dish.signature && <button onClick={() => setViewerDish(dish)} className="flex items-center gap-1.5 rounded-full border line px-4 py-2 text-sm font-bold active:scale-95 hover:scale-105 transition-transform"><Rotate3d size={15} /> 360°</button>}
          </div>
        </div>
      </motion.div>
    )
  }
  return (
    <motion.div initial={{ opacity: 0, x: 26 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
      className="group py-3.5 first:pt-0">
      <div className="flex items-start gap-2.5">
        <VegDot />
        <div className="min-w-0">
          <span className="font-heading font-bold leading-snug">{dish.name}</span>{dish.soldOut && <span className="ml-2 align-middle"><SoldOutBadge /></span>}
          {dish.tags?.[0] && <span className="ml-2 align-middle grad-bg text-white text-[10px] font-heading font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">{dish.tags[0]}</span>}
          <p className="mut text-[13px] leading-snug mt-0.5 max-w-md">{dish.desc}</p>
        </div>
        <SpiceMini level={dish.spice} />
        <span className="dot-leader mt-3 hidden sm:block" aria-hidden />
        <div className="text-right shrink-0 ml-auto sm:ml-0"><PriceBlock dish={dish} /></div>
        <div className="flex flex-col gap-1.5 shrink-0">
          <button onClick={() => add(dish)} disabled={dish.soldOut} aria-label={`${dish.name} order list me add karo`} className="w-10 h-10 grid place-items-center rounded-full grad-bg text-white shadow active:scale-90 hover:scale-110 transition-transform disabled:opacity-40 disabled:pointer-events-none"><Plus size={15} /></button>
          {dish.signature && <button onClick={() => setViewerDish(dish)} aria-label={`${dish.name} 360 view kholo`} className="w-10 h-10 grid place-items-center rounded-full border line active:scale-90 hover:scale-110 transition-transform"><Rotate3d size={14} /></button>}
        </div>
      </div>
    </motion.div>
  )
}

export default function MenuWall() {
  const { menu: MENU } = useApp()
  return (
    <section id="menu" className="relative py-20 sm:py-28 overflow-hidden">
      <Marquee items="MOMOS • MOMOS • MOMOS • " outline speed={46} className="absolute top-8 inset-x-0 text-[clamp(3.2rem,10vw,7.5rem)] opacity-50 pointer-events-none select-none" />
      <Marquee items="CRAZY • CRAZY • CRAZY • " outline speed={60} className="absolute bottom-10 inset-x-0 text-[clamp(3.2rem,10vw,7.5rem)] opacity-40 pointer-events-none select-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center" data-reveal>
          <div className="font-heading text-xs tracking-[0.3em] mut">08 — FULL MENU WALL</div>
          <h2 className="font-display uppercase text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.92] mt-2" data-clip>The <span className="grad-text">Menu</span> Wall</h2>
          <p className="font-heading italic font-semibold text-xl sm:text-2xl text-[#FF8A00] mt-3">Sab kuch chap gaya hai — bas order karna baki hai</p>
          <button onClick={() => window.print()} className="no-print mt-5 inline-flex items-center gap-2 rounded-full border line px-5 py-2.5 font-bold text-sm active:scale-95 transition-transform"><Printer size={16} /> Print Menu</button>
          <p className="mut mt-3 flex items-center justify-center gap-2 text-sm"><Leaf size={15} className="text-[#22C55E]" /> 100% Pure Veg • Momos: Half = 5 Pcs, Full = 10 Pcs • Noodles & Chinese sirf delivery par</p>
        </div>

        {CATEGORIES.map((cat, ci) => {
          const dishes = MENU.filter(m => m.category === cat)
          if (!dishes.length) return null
          const thumb = (dishes.find(d => d.signature) ?? dishes[0]).img
          return (
            <div key={cat} className="grid lg:grid-cols-[320px_1fr] gap-6 lg:gap-12 mt-16 sm:mt-20" data-reveal>
              <div className="lg:sticky lg:top-24 self-start">
                <div className="flex items-end gap-4">
                  <span className="font-display outline-text text-[clamp(3.6rem,8vw,5.5rem)] leading-[0.8] select-none" aria-hidden>{String(ci + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-display uppercase text-2xl sm:text-[1.7rem] leading-[0.95]">{cat}</h3>
                    <div className="font-heading italic font-semibold text-base text-[#FF8A00] leading-tight mt-1.5">{ACCENTS[cat] ?? 'full swad'}</div>
                  </div>
                </div>
                <Tilt max={6} className="mt-5 hidden sm:block">
                  <div className="rounded-[24px] overflow-hidden img-frame border line shadow-xl">
                    <img decoding="async" src={`${BASE}${thumb}`} alt={`${cat} — Crazy Momo Corner`} width={1920} height={1280} loading="lazy" className="w-full h-44 object-cover" />
                  </div>
                </Tilt>
                <p className="mut text-xs font-heading font-bold tracking-[0.2em] mt-4">{dishes.length} ITEMS • CHAPTER {String(ci + 1).padStart(2, '0')}</p>
              </div>
              <div className="divide-y divide-[var(--line)]">
                {dishes.map((d, i) => <DishRow key={d.id} dish={d} i={i} feature={d === (dishes.find(x => x.signature) ?? dishes[0])} />)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
