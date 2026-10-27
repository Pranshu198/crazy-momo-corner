import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Phone } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function FloatingButtons() {
  const { site: SITE } = useApp()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', on, { passive: true }); on()
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed bottom-[5.7rem] sm:bottom-5 right-4 z-[75] flex flex-col gap-3" style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
          <a href={SITE.phoneTel} aria-label="Call karo — Crazy Momo Corner" className="sm:hidden w-13 h-13 w-[52px] h-[52px] grid place-items-center rounded-full grad-bg text-white shadow-2xl active:scale-90 transition-transform"><Phone size={22} /></a>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp par order karo" className="pulse-ring w-[56px] h-[56px] grid place-items-center rounded-full bg-[#25D366] text-white shadow-2xl active:scale-90 transition-transform"><MessageCircle size={26} /></a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
