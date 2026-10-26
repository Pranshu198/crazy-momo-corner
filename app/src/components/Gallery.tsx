import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const PHOTOS = [
  { src: 'img/twister-nobg.webp', cap: 'Potato Twister — masala girta hua' },
  { src: 'img/cheese-nobg.webp', cap: 'Liquid Cheese Twister — cheese ki baarish' },
  { src: 'img/kurkure.jpg', cap: 'Kurkure Momos — crunch ka king' },
  { src: 'img/steam.jpg', cap: 'Steam Momos — bamboo steamer fresh' },
  { src: 'img/paneer-nobg.webp', cap: 'Paneer Tandoori — smoky char' },
  { src: 'img/gravy.jpg', cap: 'Gravy Momos — creamy masala' },
  { src: 'img/platter-nobg.webp', cap: 'Crazy Mixed Platter — sab ek saath' },
  { src: 'img/fried.jpg', cap: 'Fried Momos — golden crispy' },
]
export default function Gallery() {
  const [light, setLight] = useState<number | null>(null)
  const nav = useCallback((dir: number) => setLight(l => l === null ? l : (l + dir + PHOTOS.length) % PHOTOS.length), [])
  useEffect(() => {
    if (light === null) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLight(null); if (e.key === 'ArrowRight') nav(1); if (e.key === 'ArrowLeft') nav(-1) }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [light, nav])
  return (
    <section id="gallery" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="font-heading text-xs tracking-[0.3em] mut">10 — GALLERY</div>
        <h2 className="font-display uppercase text-[clamp(2.2rem,6vw,4.2rem)] leading-none mt-2">Dekho, <span className="font-accent normal-case grad-text text-[1.15em]">lalchao</span>, order karo</h2>
        <div className="columns-2 md:columns-3 gap-4 mt-10 [column-fill:balance]">
          {PHOTOS.map((p, i) => (
            <motion.button key={p.src} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (i % 3) * 0.08 }}
              onClick={() => setLight(i)} className="relative w-full mb-4 break-inside-avoid rounded-[22px] overflow-hidden group img-frame text-left" aria-label={`Badi photo dekho: ${p.cap}`}>
              <img src={`${import.meta.env.BASE_URL}${p.src}`} alt={`${p.cap} — Crazy Momo Corner, Uttam Nagar`} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[4/3]'}`} />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent text-white text-sm font-heading font-bold p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity">{p.cap}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {light !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[88] bg-black/95 flex flex-col items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Gallery lightbox">
            <button onClick={() => setLight(null)} aria-label="Band karo" className="absolute top-4 right-4 w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white"><X /></button>
            <img src={`${import.meta.env.BASE_URL}${PHOTOS[light].src}`} alt={PHOTOS[light].cap} className="max-h-[76vh] w-auto max-w-full rounded-[22px] object-contain" />
            <div className="text-white font-heading font-bold mt-4 text-center">{PHOTOS[light].cap}</div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => nav(-1)} aria-label="Pichli photo" className="w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white active:scale-90"><ChevronLeft /></button>
              <button onClick={() => nav(1)} aria-label="Agli photo" className="w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white active:scale-90"><ChevronRight /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
