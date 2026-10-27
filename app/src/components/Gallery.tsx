import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const PHOTOS = [
  { src: 'img/twister-nobg.webp', w: 1280, h: 1920, cap: 'Potato Twister — masala girta hua', span: 'col-span-2 row-span-2' },
  { src: 'img/ktwister.webp', w: 1920, h: 1280, cap: 'Kurkure Potato Twister — extra crunchy spiral', span: '' },
  { src: 'img/kurkure.jpg', w: 1600, h: 1600, cap: 'Kurkure Momos — crunch ka king', span: '' },
  { src: 'img/steam.jpg', w: 1920, h: 1280, cap: 'Steam Momos — steamer fresh', span: 'md:row-span-2' },
  { src: 'img/kspringroll.webp', w: 1920, h: 1280, cap: 'Kurkure Spring Roll — extra crunchy signature', span: '' },
  { src: 'img/noodles.webp', w: 1920, h: 1280, cap: 'Hakka Noodles — wok tossed', span: '' },
  { src: 'img/gravy.jpg', w: 1920, h: 1280, cap: 'Gravy Momos — creamy masala', span: 'md:col-span-2' },
  { src: 'img/manchurian.webp', w: 1920, h: 1280, cap: 'Veg Manchurian Gravy — garma garam', span: 'md:col-span-2' },
  { src: 'img/chilli.webp', w: 1920, h: 1280, cap: 'Chilli Potato — fiery glaze', span: '' },
  { src: 'img/fried.jpg', w: 1920, h: 1280, cap: 'Fried Momos — golden crispy', span: '' },
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
    <section id="gallery" className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="font-heading text-xs tracking-[0.3em] mut" data-reveal>10 — GALLERY</div>
        <h2 className="font-display uppercase text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.95] mt-2 text-3d" data-clip>Dekho, <span className="font-accent normal-case text-script-3d text-[1.12em]">lalchao</span>, order karo</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[185px] gap-3.5 mt-10 [grid-auto-flow:dense]">
          {PHOTOS.map((p, i) => (
            <motion.button key={p.src} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (i % 4) * 0.07, duration: 0.5 }}
              onClick={() => setLight(i)} className={`jump-hover relative w-full h-full rounded-[22px] overflow-hidden group img-frame text-left ${p.span} ${i % 3 === 1 ? 'rotate-[0.5deg]' : i % 3 === 2 ? '-rotate-[0.5deg]' : ''}`} aria-label={`Badi photo dekho: ${p.cap}`}>
              <img decoding="async" src={`${import.meta.env.BASE_URL}${p.src}`} alt={`${p.cap} — Crazy Momo Corner, Uttam Nagar`} width={p.w} height={p.h} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent text-white text-[13px] font-heading font-bold p-3.5 pt-9 opacity-0 max-md:opacity-100 group-hover:opacity-100 transition-opacity">{p.cap}</span>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {light !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[88] bg-black/95 flex flex-col items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Gallery lightbox">
            <button onClick={() => setLight(null)} aria-label="Band karo" className="absolute top-4 right-4 w-11 h-11 grid place-items-center rounded-full bg-white/10 text-white"><X /></button>
            <img decoding="async" src={`${import.meta.env.BASE_URL}${PHOTOS[light].src}`} alt={PHOTOS[light].cap} width={PHOTOS[light].w} height={PHOTOS[light].h} className="max-h-[76vh] w-auto max-w-full rounded-[22px] object-contain" />
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
