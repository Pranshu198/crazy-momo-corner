import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu as MenuIcon, Phone, ShoppingBag, X } from 'lucide-react'
import { SITE } from '../data/site'
import { useApp } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'

const LINKS = [['Home', '#home'], ['360° Specials', '#specials'], ['Build Your Plate', '#builder'], ['Menu', '#menu'], ['Why Us', '#why'], ['Gallery', '#gallery'], ['Reviews', '#reviews'], ['Visit Us', '#visit']] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { count, setDrawerOpen } = useApp()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    LINKS.forEach(([, h]) => { const el = document.querySelector(h); if (el) io.observe(el) })
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect() }
  }, [])
  const go = (h: string) => { setOpen(false); document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' }) }
  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-[70] glass border-b line transition-all ${scrolled ? 'py-2 shadow-lg' : 'py-3.5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3">
          <button onClick={() => go('#home')} className="flex items-center gap-2.5 text-left" aria-label="Crazy Momo Corner — home">
            <span className="w-10 h-10 rounded-2xl grad-bg grid place-items-center font-display text-white text-sm shadow-lg shrink-0">CMC</span>
            <span className="leading-none">
              <span className="block font-display uppercase tracking-wide text-lg sm:text-xl">Crazy <span className="grad-text">Momo</span> Corner</span>
              <span className="block text-[10px] tracking-[0.28em] mut font-heading mt-0.5">PURE VEG • UTTAM NAGAR</span>
            </span>
          </button>
          <nav className="hidden lg:flex items-center gap-6 ml-auto font-heading text-sm" aria-label="Main">
            {LINKS.map(([label, h]) => (
              <button key={h} onClick={() => go(h)} className={`relative py-1 hover:text-[#FF8A00] transition-colors ${active === h.slice(1) ? 'text-[#FF8A00]' : ''}`}>
                {label}
                {active === h.slice(1) && <motion.span layoutId="nav-underline" className="absolute -bottom-0.5 left-0 right-0 h-0.5 grad-bg rounded-full" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto lg:ml-4">
            <ThemeToggle />
            <button onClick={() => setDrawerOpen(true)} aria-label="Order list kholo" className="relative w-10 h-10 grid place-items-center rounded-full border line surface hover:scale-110 active:scale-95 transition-transform">
              <ShoppingBag size={18} />
              {count > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full grad-bg text-white text-[11px] font-bold grid place-items-center">{count}</span>}
            </button>
            <a href={SITE.phoneTel} data-magnetic className="hidden sm:flex items-center gap-2 grad-bg text-white font-bold rounded-full px-5 py-2.5 text-sm shadow-lg active:scale-95 transition-transform"><Phone size={16} /> Order Now</a>
            <button onClick={() => setOpen(true)} aria-label="Menu kholo" className="lg:hidden w-10 h-10 grid place-items-center rounded-full border line surface"><MenuIcon size={19} /></button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] bg-black text-white flex flex-col p-6" role="dialog" aria-modal="true" aria-label="Site menu">
            <div className="flex justify-between items-center">
              <span className="font-display text-xl uppercase">Crazy <span className="grad-text">Momo</span> Corner</span>
              <button onClick={() => setOpen(false)} aria-label="Menu band karo" className="w-11 h-11 grid place-items-center rounded-full bg-white/10"><X /></button>
            </div>
            <nav className="flex-1 flex flex-col justify-center gap-2" aria-label="Mobile">
              {LINKS.map(([label, h], i) => (
                <motion.button key={h} initial={{ x: -32, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.06 * i }} onClick={() => go(h)} className="text-left font-display uppercase text-4xl py-2 hover:text-[#FF8A00] transition-colors">{label}</motion.button>
              ))}
            </nav>
            <a href={SITE.phoneTel} className="grad-bg text-white text-center font-bold rounded-full py-4 text-lg">Call — {SITE.phoneDisplay}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
