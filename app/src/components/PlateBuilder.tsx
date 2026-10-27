import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, Droplets, Minus, Plus, RotateCcw, ShoppingBag } from 'lucide-react'
import {
  BUILDER_CATEGORIES, CHINESE_IDS, FRIES_IDS, MOMO_STYLES, MOMO_VARIANTS, ROLL_OPTIONS, SOUP_IDS,
  TWISTER_OPTIONS, dishById, dishSizes, momoDish, type BOption, type BSize, type Dish,
} from '../data/menu'
import { useApp } from '../context/AppContext'
import Tilt from './Tilt'

const BASE = import.meta.env.BASE_URL
interface Sel { cat: string | null; variant: string | null; style: string | null; size: number; cheese: boolean; qty: number }
const INIT: Sel = { cat: null, variant: null, style: null, size: 0, cheese: false, qty: 1 }

function OptionCard({ opt, selected, onClick }: { opt: BOption; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={selected}
      className={`card-shine relative text-left rounded-[22px] overflow-hidden border transition-all duration-300 active:scale-[0.98] ${selected ? 'border-transparent ring-2 ring-[#FF8A00] shadow-[0_18px_50px_-12px_rgba(255,90,0,.45)]' : 'line surface hover:-translate-y-1'}`}>
      <div className="h-24 sm:h-28 img-frame overflow-hidden">
        <img src={`${BASE}${opt.img}`} alt={opt.label} loading="lazy" className="w-full h-full object-cover" />
        {selected && <span className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full grad-bg text-white grid place-items-center shadow-lg"><Check size={14} strokeWidth={3.5} /></span>}
      </div>
      <div className="p-3.5">
        <div className="font-heading font-bold leading-tight">{opt.label}</div>
        {opt.desc && <div className="mut text-xs mt-1 leading-snug">{opt.desc}</div>}
      </div>
    </button>
  )
}

function StepShell({ n, title, accent, children, done }: { n: number; title: string; accent: string; children: React.ReactNode; done?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.4, ease: [0.22, 0.8, 0.3, 1] }} className="mt-10">
      <div className="flex items-center gap-3">
        <span className={`w-9 h-9 rounded-full grid place-items-center font-display text-sm shrink-0 ${done ? 'grad-bg text-white' : 'surface2 border line'}`}>{done ? <Check size={16} strokeWidth={3} /> : `0${n}`}</span>
        <h3 className="font-display uppercase text-xl sm:text-2xl">{title} <span className="font-accent normal-case grad-text text-[1.1em]">{accent}</span></h3>
        <span className="flex-1 h-px line border-t" aria-hidden />
      </div>
      <div className="mt-5">{children}</div>
    </motion.div>
  )
}

export default function PlateBuilder() {
  const { add, setDrawerOpen } = useApp()
  const [sel, setSel] = useState<Sel>(INIT)
  const topRef = useRef<HTMLDivElement>(null)
  const set = (p: Partial<Sel>) => setSel(s => ({ ...s, ...p }))

  const isMomos = sel.cat === 'momos'
  const isPieces = sel.cat === 'twister' || sel.cat === 'rolls'
  const dishIds = sel.cat === 'chinese' ? CHINESE_IDS : sel.cat === 'fries' ? FRIES_IDS : sel.cat === 'soups' ? SOUP_IDS : []
  const dishOptions: BOption[] = dishIds.map(id => { const d = dishById(id)!; return { id: d.id, label: d.name, desc: d.desc, img: d.img } })
  const pieceOptions = sel.cat === 'twister' ? TWISTER_OPTIONS : ROLL_OPTIONS

  const sizes: BSize[] = useMemo(() => {
    if (isMomos && sel.variant && sel.style) { const d = momoDish(sel.style, sel.variant); return d ? [{ label: 'Half Plate', sub: '5 Pcs', price: d.price }, { label: 'Full Plate', sub: '10 Pcs', price: d.fullPrice ?? d.price }] : [] }
    if (isPieces && sel.variant) { const o = pieceOptions.find(p => p.id === sel.variant); return o ? o.sizes : [] }
    if (dishIds.length && sel.variant) { const d = dishById(sel.variant); return d ? dishSizes(d) : [] }
    return []
  }, [isMomos, isPieces, sel.variant, sel.style, pieceOptions, dishIds.length])

  const needsStyle = isMomos
  const needsSize = !(sel.cat === 'soups')
  const ready = !!sel.cat && !!sel.variant && (!needsStyle || !!sel.style) && (!needsSize || sizes.length > 0)

  const built: { dish: Dish; unit: number | 'ADD_PRICE'; name: string; img: string } | null = useMemo(() => {
    if (!ready) return null
    const size = sizes[Math.min(sel.size, sizes.length - 1)]
    if (isMomos) {
      const base = momoDish(sel.style!, sel.variant!)!
      const name = `${base.name} — ${size.label}${size.sub ? ` (${size.sub})` : ''}`
      return { dish: { ...base, id: `b-${base.id}-${sel.size}`, name, price: size.price }, unit: size.price, name, img: base.img }
    }
    if (isPieces) {
      const o = pieceOptions.find(p => p.id === sel.variant)!
      const cheeseTxt = sel.cat === 'twister' && sel.cheese ? ' + Liquid Cheese' : ''
      const name = `${o.label} — ${size.label}${cheeseTxt}`
      const base = dishById(o.id)
      return { dish: { id: `b-${o.id}-${sel.size}${sel.cheese ? '-cheese' : ''}`, name, category: 'Build Your Plate', veg: true, price: size.price, spice: base?.spice ?? 2, desc: o.desc ?? '', img: o.img }, unit: size.price, name, img: o.img }
    }
    const base = dishById(sel.variant!)!
    const name = dishIds.length && sizes.length > 1 ? `${base.name} — ${size.label}` : base.name
    return { dish: { ...base, id: `b-${base.id}-${sel.size}`, name, price: size.price }, unit: size.price, name, img: base.img }
  }, [ready, sizes, sel, isMomos, isPieces, pieceOptions, dishIds.length])

  const stepCount = !sel.cat ? 1 : isMomos ? 4 : isPieces ? 3 : sel.cat === 'soups' ? 2 : 3
  const currentStep = !sel.cat ? 1 : !sel.variant ? 2 : isMomos && !sel.style ? 3 : stepCount
  const reset = () => { setSel(INIT); topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <section id="builder" className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute -top-24 right-0 w-[46vw] h-[46vw] max-w-[560px] max-h-[560px] rounded-full opacity-[0.13] blur-3xl grad-bg glow-drift pointer-events-none" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" ref={topRef}>
        <div className="text-center" data-reveal>
          <div className="font-heading text-xs tracking-[0.3em] mut">07 — BUILD YOUR PLATE</div>
          <h2 className="font-display uppercase text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.92] mt-2" data-clip>Apni Plate <span className="grad-text">Khud Banao</span></h2>
          <p className="font-accent text-2xl sm:text-3xl text-[#FF8A00] mt-2">step by step — category, variant, style, size… price live!</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 max-w-xl mx-auto mt-10" aria-label={`Step ${currentStep} of ${stepCount}`}>
          {Array.from({ length: stepCount }).map((_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i < currentStep ? 'grad-bg shadow' : 'surface2'}`} />
          ))}
          <span className="text-xs font-heading font-bold mut ml-2 whitespace-nowrap">STEP {currentStep}/{stepCount}</span>
        </div>

        {/* STEP 1 — Category */}
        <StepShell n={1} title="Category Chuno" accent="kya khana hai?" done={!!sel.cat}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {BUILDER_CATEGORIES.map(c => (
              <Tilt key={c.id} max={5}>
                <button onClick={() => set({ ...INIT, cat: c.id, qty: sel.qty })} aria-pressed={sel.cat === c.id}
                  className={`card-shine relative w-full text-left rounded-[24px] overflow-hidden border transition-all duration-300 active:scale-[0.98] ${sel.cat === c.id ? 'border-transparent ring-2 ring-[#FF8A00] shadow-[0_22px_60px_-14px_rgba(255,90,0,.5)]' : 'line surface'}`}>
                  <div className="h-28 sm:h-36 img-frame overflow-hidden">
                    <img src={`${BASE}${c.img}`} alt={c.label} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
                    <span className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="block font-display uppercase text-lg sm:text-2xl leading-none">{c.label}</span>
                      <span className="block font-accent text-[#FFB25E] text-lg leading-tight">{c.accent}</span>
                    </span>
                    {sel.cat === c.id && <span className="absolute top-3 right-3 w-7 h-7 rounded-full grad-bg text-white grid place-items-center shadow-lg"><Check size={15} strokeWidth={3.5} /></span>}
                  </div>
                  <p className="mut text-xs sm:text-sm p-3.5 leading-snug">{c.blurb}</p>
                </button>
              </Tilt>
            ))}
          </div>
        </StepShell>

        <AnimatePresence mode="wait">
          {/* STEP 2 — Variant / Type / Dish */}
          {sel.cat && (
            <StepShell key={`v-${sel.cat}`} n={2} title={isMomos ? 'Variant Chuno' : isPieces ? 'Type Chuno' : 'Dish Chuno'} accent={isMomos ? 'veg, soya, paneer…' : 'apni pasand'} done={!!sel.variant}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {(isMomos ? MOMO_VARIANTS : isPieces ? pieceOptions : dishOptions).map(o => (
                  <OptionCard key={o.id} opt={o} selected={sel.variant === o.id} onClick={() => set({ variant: o.id, size: 0 })} />
                ))}
              </div>
              {sel.cat === 'twister' && (
                <button onClick={() => set({ cheese: !sel.cheese })} aria-pressed={sel.cheese}
                  className={`mt-5 w-full sm:w-auto flex items-center gap-3 rounded-full border px-5 py-3 font-heading font-bold text-sm transition-all active:scale-[0.98] ${sel.cheese ? 'grad-bg text-white border-transparent shadow-lg' : 'line surface'}`}>
                  <Droplets size={17} /> Liquid Cheese Add-on {sel.cheese ? '— ON hai' : '— dono twisters par dalta hai'}
                  <span className={`w-11 h-6 rounded-full p-0.5 flex transition-colors ${sel.cheese ? 'bg-white/30 justify-end' : 'surface2 justify-start'}`}><span className={`w-5 h-5 rounded-full ${sel.cheese ? 'bg-white' : 'bg-current opacity-40'}`} /></span>
                </button>
              )}
            </StepShell>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* STEP 3 — Style (momos only) */}
          {isMomos && sel.variant && (
            <StepShell key="style" n={3} title="Style Chuno" accent="kaise bane?" done={!!sel.style}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {MOMO_STYLES.map(o => (
                  <OptionCard key={o.id} opt={o} selected={sel.style === o.id} onClick={() => set({ style: o.id, size: 0 })} />
                ))}
              </div>
            </StepShell>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {/* FINAL — Size + live price */}
          {ready && built && (
            <motion.div key={`final-${built.dish.id}`} initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: [0.22, 0.8, 0.3, 1] }}
              className="mt-12 surface border line rounded-[28px] overflow-hidden shadow-2xl">
              <div className="grid md:grid-cols-[220px_1fr]">
                <div className="h-44 md:h-full img-frame relative overflow-hidden">
                  <img src={`${BASE}${built.img}`} alt={built.name} className="absolute inset-0 w-full h-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent to-black/25" aria-hidden />
                </div>
                <div className="p-5 sm:p-7">
                  <div className="font-heading text-[11px] tracking-[0.28em] mut">STEP {stepCount} — QUANTITY & PRICE</div>
                  <h3 className="font-display uppercase text-2xl sm:text-3xl leading-tight mt-1.5">{built.name}</h3>
                  {needsSize && (
                    <div className="flex flex-wrap gap-2.5 mt-4" role="radiogroup" aria-label="Plate size">
                      {sizes.map((s, i) => (
                        <button key={s.label} role="radio" aria-checked={sel.size === i} onClick={() => set({ size: i })}
                          className={`rounded-2xl border px-4 py-2.5 text-left transition-all active:scale-95 ${sel.size === i ? 'grad-bg text-white border-transparent shadow-lg' : 'line surface2'}`}>
                          <span className="block font-heading font-bold text-sm leading-none">{s.label}{s.sub ? ` · ${s.sub}` : ''}</span>
                          <span className={`block text-xs mt-1 ${sel.size === i ? 'text-white/85' : 'mut'}`}>{s.price === 'ADD_PRICE' ? 'Price shop par confirm' : `₹${s.price}`}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {sel.cat === 'twister' && sel.cheese && <p className="mut text-xs mt-3 flex items-center gap-1.5"><Droplets size={13} className="text-[#FF8A00]" /> Liquid cheese ka price shop par confirm karein — base price neeche hai.</p>}
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <div className="flex items-center gap-3 rounded-full border line px-2 py-1.5">
                      <button onClick={() => set({ qty: Math.max(1, sel.qty - 1) })} aria-label="Quantity kam karo" className="w-9 h-9 grid place-items-center rounded-full surface2 active:scale-90"><Minus size={16} /></button>
                      <span className="font-display text-xl w-6 text-center" aria-live="polite">{sel.qty}</span>
                      <button onClick={() => set({ qty: Math.min(20, sel.qty + 1) })} aria-label="Quantity badhao" className="w-9 h-9 grid place-items-center rounded-full surface2 active:scale-90"><Plus size={16} /></button>
                    </div>
                    <div className="leading-none">
                      <div className="text-[11px] font-heading font-bold tracking-[0.2em] mut">TOTAL</div>
                      <AnimatePresence mode="wait">
                        <motion.div key={`${built.unit}-${sel.qty}`} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.18 }} className="font-display text-3xl sm:text-4xl grad-text mt-1">
                          {built.unit === 'ADD_PRICE' ? 'Confirm @ Shop' : `₹${(built.unit as number) * sel.qty}`}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="flex gap-2.5 ml-auto">
                      <button onClick={reset} className="flex items-center gap-2 rounded-full border line px-4 py-3 font-bold text-sm active:scale-95 transition-transform"><RotateCcw size={15} /> Change</button>
                      <button onClick={() => { add(built.dish, sel.qty); setDrawerOpen(true) }} className="flex items-center gap-2 grad-bg text-white font-bold rounded-full px-6 py-3 shadow-xl active:scale-95 transition-transform"><ShoppingBag size={17} /> Add to Order</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!ready && sel.cat && (
          <button onClick={reset} className="mt-8 flex items-center gap-1.5 mut text-sm font-heading font-bold hover:text-[#FF8A00] transition-colors"><ChevronLeft size={15} /> Dobara shuru karo</button>
        )}
      </div>
    </section>
  )
}
