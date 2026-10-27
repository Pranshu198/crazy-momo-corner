import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Stats from './components/Stats'
import Showcase360 from './components/Showcase360'
import PlateBuilder from './components/PlateBuilder'
import MenuWall from './components/MenuWall'
import DeliveryScooter from './components/DeliveryScooter'
import GlowFollower from './components/GlowFollower'
import SideIndicator from './components/SideIndicator'
import OrderDrawer from './components/OrderDrawer'
import DishViewer360 from './components/DishViewer360'
import WhyUs from './components/WhyUs'
import ProcessStrip from './components/ProcessStrip'
import Gallery from './components/Gallery'
import Reviews from './components/Reviews'
import Offers from './components/Offers'
import VisitUs from './components/VisitUs'
import InstagramSection from './components/InstagramSection'
import Footer from './components/Footer'
import FloatingButtons from './components/FloatingButtons'
import CustomCursor from './components/CustomCursor'
import { SITE } from './data/site'

gsap.registerPlugin(ScrollTrigger)

function Toast() {
  const { toast, setDrawerOpen } = useApp()
  return (
    <AnimatePresence>
      {toast && (
        <motion.button initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} onClick={() => setDrawerOpen(true)}
          className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-[92] flex items-center gap-2 bg-[#111] text-white border border-white/15 rounded-full pl-4 pr-5 py-3 shadow-2xl text-sm font-heading font-bold whitespace-nowrap max-w-[92vw] overflow-hidden text-ellipsis">
          <CheckCircle2 size={17} className="text-[#22C55E] shrink-0" /> <span className="overflow-hidden text-ellipsis">{toast}</span> <span className="grad-text shrink-0">Dekho →</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function Shell() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | null = null
    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
      return () => { gsap.ticker.remove(tick); lenis?.destroy() }
    }
  }, [])
  // GSAP scroll choreography — reveals, clip-path headings, parallax layers
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.fromTo(el, { y: 48, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.95, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-clip]').forEach(el => {
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)', y: 26 }, {
          clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
        const sp = parseFloat(el.dataset.parallax || '10')
        gsap.fromTo(el, { yPercent: -sp / 2 }, {
          yPercent: sp / 2, ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 2400)
    return () => { window.clearTimeout(t); ctx.revert() }
  }, [])
  // Magnetic buttons (desktop)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const els = document.querySelectorAll<HTMLElement>('[data-magnetic]')
    const cleanups: (() => void)[] = []
    els.forEach(el => {
      const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)` }
      const leave = () => { el.style.transform = '' }
      el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave)
      cleanups.push(() => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) })
    })
    return () => cleanups.forEach(c => c())
  }, [])
  return (
    <div className="min-h-screen">
      <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 right-0 h-[3px] grad-bg origin-left z-[96]" aria-hidden />
      <div className="grain grain-overlay fixed inset-0 z-[2] pointer-events-none opacity-70" aria-hidden />
      <GlowFollower />
      <SideIndicator />
      <Preloader />
      <CustomCursor />
      <Navbar />
      <div className="pt-[64px]">
        <div className="-rotate-2 -mx-4 grad-bg text-white py-2 shadow-lg relative z-20">
          <Marquee items={`FRESH • HOT • STEAMED TO ORDER • UTTAM NAGAR • CALL ${SITE.phoneDisplay.replace('+91 ', '')} • FREE DELIVERY 1 KM (₹200+) • `} speed={22} className="text-[13px]" />
        </div>
      </div>
      <main>
        <Hero />
        <Stats />
        <div className="relative rotate-[1.2deg] -mx-4 surface border-y line py-2.5 overflow-hidden z-10 shadow-lg" aria-hidden>
          <Marquee items="BUILD YOUR PLATE • 360° MOMOS • STREET KA ASLI SWAD • " outline speed={38} className="text-[clamp(1.6rem,4.5vw,3rem)] opacity-70" />
        </div>
        <Showcase360 />
        <PlateBuilder />
        <MenuWall />
        <DeliveryScooter />
        <WhyUs />
        <ProcessStrip />
        <Gallery />
        <Reviews />
        <Offers />
        <VisitUs />
        <InstagramSection />
      </main>
      <Footer />
      <FloatingButtons />
      <OrderDrawer />
      <DishViewer360 />
      <Toast />
    </div>
  )
}

export default function App() {
  return <AppProvider><Shell /></AppProvider>
}
