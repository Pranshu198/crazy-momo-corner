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
          <motion.img initial={{ scale: 0.6, rotate: -8, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} src={`${import.meta.env.BASE_URL}img/logo-mascot.webp`} alt="Crazy Momo Corner — crazy momo mascot logo" className="w-[118px] h-[118px] rounded-[28px] object-cover shadow-2xl" />
          <div className="font-display text-white text-5xl mt-4 tracking-wide">{pct}%</div>
          <div className="text-white/50 text-xs tracking-[0.35em] mt-2 font-heading">CRAZY MOMO CORNER</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
