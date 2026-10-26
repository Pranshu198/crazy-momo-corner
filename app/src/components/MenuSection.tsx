import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Flame, Leaf, Plus, Rotate3d, Search } from 'lucide-react'
import { ADD_PRICE_LABEL, CATEGORIES, MENU, type Dish } from '../data/menu'
import { useApp } from '../context/AppContext'
import Marquee from './Marquee'

function VegDot() {
  return <span className="w-4 h-4 rounded-[4px] border-2 border-[#22C55E] grid place-items-center bg-black/30 shrink-0" title="Pure Veg" aria-label="Pure Veg"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /></span>
}
export function Spice({ level }: { level: number }) {
  return <span className="flex gap-0.5" aria-label={`Spice level ${level}/3`}>{[0, 1, 2].map(i => <Flame key={i} size={13} className={i < level ? 'text-[#FF3B30]' : 'opacity-20'} fill={i < level ? '#FF3B30' : 'transparent'} />)}</span>
}

function DishCard({ dish }: { dish: Dish }) {
  const { add, setViewerDish } = useApp()
  const [tilt, setTilt] = useState('')
  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.3 }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; setTilt(`perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`) }}
      onMouseLeave={() => setTilt('')} style={{ transform: tilt }}
      className="card-shine surface border line rounded-[24px] overflow-hidden flex flex-col transition-shadow hover:shadow-2xl">
      <div className="relative h-44 img-frame overflow-hidden group">
        <img src={`${import.meta.env.BASE_URL}${dish.img}`} alt={`${dish.name} — Crazy Momo Corner`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {dish.signature && <span className="absolute top-3 left-3 grad-bg text-white text-[10px] font-heading font-bold tracking-widest px-2.5 py-1 rounded-full">360° SIGNATURE</span>}
        {dish.tags?.[0] && <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-heading font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">{dish.tags[0]}</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-2"><VegDot /><h3 className="font-heading font-bold leading-snug flex-1">{dish.name}</h3><Spice level={dish.spice} /></div>
        <p className="mut text-sm mt-2 flex-1">{dish.desc}</p>
        <div className="flex items-end justify-between mt-4 gap-2">
          <div>
            <div className="font-display text-xl grad-text leading-none">{dish.price === 'ADD_PRICE' ? '—' : `₹${dish.price}`}</div>
            <div className="text-[11px] mut mt-1">{dish.price === 'ADD_PRICE' ? ADD_PRICE_LABEL : dish.fullPrice ? `Half • Full ₹${dish.fullPrice}` : 'Per pc / plate'}</div>
          </div>
          <div className="flex gap-2">
            {dish.signature && <button onClick={() => setViewerDish(dish)} aria-label={`${dish.name} 360 view`} className="w-10 h-10 grid place-items-center rounded-full border line hover:scale-110 active:scale-90 transition-transform"><Rotate3d size={17} /></button>}
            <button onClick={() => add(dish)} aria-label={`${dish.name} order list me add karo`} className="flex items-center gap-1 grad-bg text-white font-bold rounded-full px-4 py-2.5 text-sm active:scale-95 transition-transform"><Plus size={15} /> Add</button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function MenuSection() {
  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')
  const [spice, setSpice] = useState<number | null>(null)
  const filtered = useMemo(() => MENU.filter(m =>
    (cat === 'All' || m.category === cat) &&
    m.name.toLowerCase().includes(q.toLowerCase()) &&
    (spice === null || m.spice >= spice)), [cat, q, spice])
  return (
    <section id="menu" className="relative py-20">
      <Marquee items="MOMOS • MOMOS • MOMOS • " outline speed={40} className="absolute top-6 inset-x-0 text-[clamp(3rem,9vw,7rem)] opacity-60 pointer-events-none select-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center">
          <div className="font-accent text-3xl grad-text">full menu</div>
          <h2 className="font-display uppercase text-[clamp(2.4rem,7vw,4.8rem)] leading-none mt-1">Sab Kuch <span className="grad-text">Crazy</span></h2>
          <p className="mut mt-3 flex items-center justify-center gap-2 text-sm"><Leaf size={15} className="text-[#22C55E]" /> 100% Pure Veg • Half plate = 5 pcs, Full plate = 10 pcs (momos)</p>
        </div>
        <div className="sticky top-[68px] z-40 glass border line rounded-[22px] p-3 mt-10 shadow-lg">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }} role="tablist" aria-label="Menu categories">
            {['All', ...CATEGORIES].map(c => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-heading font-bold transition-all ${cat === c ? 'grad-bg text-white shadow' : 'surface2 hover:scale-[1.03]'}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2.5">
            <label className="flex items-center gap-2 surface2 rounded-full px-4 py-2 flex-1 min-w-[180px]">
              <Search size={16} className="mut shrink-0" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Dish search karo… (kurkure, twister…)" className="bg-transparent outline-none w-full text-sm" aria-label="Dish search karo" />
            </label>
            <div className="flex items-center gap-1.5 surface2 rounded-full px-3 py-2" aria-label="Spice filter">
              <span className="text-xs font-heading font-bold mut mr-1">SPICE:</span>
              {[1, 2, 3].map(s => (
                <button key={s} onClick={() => setSpice(spice === s ? null : s)} aria-pressed={spice === s} className={`w-8 h-8 grid place-items-center rounded-full transition-all ${spice === s ? 'grad-bg text-white' : 'hover:scale-110'}`}><Flame size={15} /></button>
              ))}
              {spice !== null && <span className="text-xs mut">& {spice}+</span>}
            </div>
            <span className="flex items-center gap-2 surface2 rounded-full px-4 py-2 text-sm font-heading font-bold"><Leaf size={15} className="text-[#22C55E]" /> Veg Only — hamesha ON</span>
          </div>
        </div>
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            <AnimatePresence mode="popLayout">{filtered.map(dish => <DishCard key={dish.id} dish={dish} />)}</AnimatePresence>
          </motion.div>
        </LayoutGroup>
        {filtered.length === 0 && <p className="text-center mut py-16 font-heading">Koi dish nahi mili — search ya filter badal kar dekho.</p>}
      </div>
    </section>
  )
}
