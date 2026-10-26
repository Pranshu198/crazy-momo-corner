import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader() {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduce ? 200 : 1600
    const start = performance.now()
    let raf = 0
    const step = (t: number) => { const p = Math.min(100, Math.round(((t - start) / dur) * 100)); setPct(p); if (p < 100) raf = requestAnimationFrame(step); else setTimeout(() => setDone(true), 150) }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ y: '-100%' }} transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }} onClick={() => setDone(true)}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center cursor-pointer" role="button" aria-label="Skip intro">
          <svg width="110" height="110" viewBox="0 0 100 100" fill="none" aria-hidden>
            <path d="M50 18 C30 18 18 34 18 52 C18 72 32 84 50 84 C68 84 82 72 82 52 C82 34 70 18 50 18 Z" stroke="#f5efe2" strokeWidth="3.5" strokeDasharray="260" strokeDashoffset="260" style={{ animation: 'drawpath 1.4s ease forwards' }} />
            <path d="M38 22 C42 12 58 12 62 22 C56 28 44 28 38 22 Z" stroke="#FF8A00" strokeWidth="3.5" strokeDasharray="60" strokeDashoffset="60" style={{ animation: 'drawpath 1s .3s ease forwards' }} />
            <text x="50" y="62" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="19" fill="#FF3B30">CMC</text>
          </svg>
          <div className="font-display text-white text-5xl mt-4 tracking-wide">{pct}%</div>
          <div className="text-white/50 text-xs tracking-[0.35em] mt-2 font-heading">CRAZY MOMO CORNER</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
