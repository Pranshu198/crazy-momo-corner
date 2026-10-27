import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useApp } from '../context/AppContext'

gsap.registerPlugin(ScrollTrigger)

function ScooterSVG() {
  return (
    <svg viewBox="0 0 360 220" className="w-full h-auto drop-shadow-2xl" role="img" aria-label="Crazy Momo Corner delivery scooty — driver aur branded delivery box ke saath">
      <g fill="#9a9a9a">
        <circle className="puff" cx="18" cy="180" r="6" opacity="0.5" />
        <circle className="puff" cx="30" cy="188" r="4.5" opacity="0.4" />
        <circle className="puff" cx="8" cy="190" r="3.5" opacity="0.3" />
      </g>
      <circle cx="80" cy="172" r="28" fill="#191919" />
      <circle cx="80" cy="172" r="17" fill="none" stroke="#8f8f8f" strokeWidth="3" />
      <g className="scooter-wheel wheel-spin">
        <line x1="80" y1="157" x2="80" y2="187" stroke="#c9c9c9" strokeWidth="3" />
        <line x1="65" y1="172" x2="95" y2="172" stroke="#c9c9c9" strokeWidth="3" />
        <line x1="69" y1="161" x2="91" y2="183" stroke="#c9c9c9" strokeWidth="3" />
        <circle cx="80" cy="172" r="5.5" fill="#FF8A00" />
      </g>
      <circle cx="294" cy="172" r="28" fill="#191919" />
      <circle cx="294" cy="172" r="17" fill="none" stroke="#8f8f8f" strokeWidth="3" />
      <g className="scooter-wheel wheel-spin">
        <line x1="294" y1="157" x2="294" y2="187" stroke="#c9c9c9" strokeWidth="3" />
        <line x1="279" y1="172" x2="309" y2="172" stroke="#c9c9c9" strokeWidth="3" />
        <line x1="283" y1="161" x2="305" y2="183" stroke="#c9c9c9" strokeWidth="3" />
        <circle cx="294" cy="172" r="5.5" fill="#FF8A00" />
      </g>
      <path d="M50 172 C44 128 72 102 124 98 L128 158 C100 148 72 158 62 172 Z" fill="#FF3B30" />
      <path d="M262 156 A36 36 0 0 1 326 156" fill="none" stroke="#FF3B30" strokeWidth="9" strokeLinecap="round" />
      <rect x="126" y="150" width="122" height="13" rx="6.5" fill="#d92c22" />
      <path d="M238 62 C262 76 272 108 268 162 L236 162 C240 118 238 88 226 70 Z" fill="#FF3B30" />
      <line x1="238" y1="66" x2="222" y2="48" stroke="#222" strokeWidth="7" strokeLinecap="round" />
      <circle cx="219" cy="46" r="6" fill="#222" />
      <circle cx="253" cy="86" r="10" fill="#ffe9a8" stroke="#d4af37" strokeWidth="3" />
      <rect x="118" y="94" width="84" height="17" rx="8.5" fill="#222" />
      <line x1="70" y1="102" x2="86" y2="118" stroke="#222" strokeWidth="6" strokeLinecap="round" />
      <rect x="24" y="34" width="80" height="68" rx="11" fill="#FF8A00" stroke="#141414" strokeWidth="3.5" />
      <circle cx="64" cy="52" r="7.5" fill="#FFF8F0" stroke="#141414" strokeWidth="2" />
      <path d="M58 50 q2 -5 4 0 M62 50 q2 -5 4 0 M66 50 q2 -5 4 0" fill="none" stroke="#141414" strokeWidth="1.6" strokeLinecap="round" />
      <text x="64" y="76" textAnchor="middle" fontFamily="Titan One, sans-serif" fontWeight="800" fontSize="13.5" fill="#141414">CRAZY</text>
      <text x="64" y="92" textAnchor="middle" fontFamily="Titan One, sans-serif" fontWeight="800" fontSize="13.5" fill="#141414">MOMO</text>
      <path d="M150 110 L178 148 L200 148" fill="none" stroke="#2b3a55" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M134 50 Q164 42 172 72 L166 108 L130 106 Q122 70 134 50 Z" fill="#FFC400" />
      <path d="M160 60 Q198 66 226 56" fill="none" stroke="#FFC400" strokeWidth="11" strokeLinecap="round" />
      <circle cx="229" cy="55" r="6.5" fill="#e8a87c" />
      <circle cx="142" cy="32" r="13.5" fill="#e8a87c" />
      <path d="M127 32 A15 15 0 0 1 157 32 Z" fill="#FF3B30" />
      <rect x="125" y="30" width="34" height="5" rx="2.5" fill="#141414" />
    </svg>
  )
}

export default function DeliveryScooter() {
  const { site } = useApp()
  const secRef = useRef<HTMLElement>(null)
  const scooterRef = useRef<HTMLDivElement>(null)
  const bobRef = useRef<HTMLDivElement>(null)

  const WORDS: { t: string; cls: string }[] = [
    { t: 'FREE', cls: 'grad-text' },
    { t: 'HOME', cls: 'dlv-pill' },
    { t: 'DELIVERY', cls: 'text-[#FFB400]' },
    { t: 'UPTO', cls: 'opacity-70' },
    { t: `${site.freeRadiusKm} KM`, cls: 'text-[#FFB400]' },
    { t: 'ON', cls: 'opacity-70' },
    { t: 'ORDERS', cls: '' },
    { t: 'ABOVE', cls: '' },
    { t: `₹${site.freeThreshold}`, cls: 'dlv-pill' },
  ]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      /* Sirf transform/opacity animate hota hai — jank-free */
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: secRef.current, start: 'top 90%', end: 'bottom 78%',
          scrub: 0.8, invalidateOnRefresh: true,
        },
      })
      tl.fromTo(scooterRef.current,
        { x: () => -(scooterRef.current?.offsetWidth ?? 260) - 40 },
        { x: () => (secRef.current?.offsetWidth ?? 360) + 40, duration: 1 }, 0)
      tl.fromTo('.dlv-letter',
        { y: -26, opacity: 0 },
        { keyframes: [{ y: 3, opacity: 1, duration: 0.045 }, { y: 0, duration: 0.025 }], stagger: 0.011 }, 0)
      /* Gentle sine bob — scrub se alag, hamesha smooth */
      gsap.to(bobRef.current, { y: -5, duration: 0.85, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to('.puff', { scale: 1.5, opacity: 0.08, transformOrigin: 'center', duration: 0.7, repeat: -1, yoyo: true, stagger: 0.18, ease: 'sine.inOut' })
    }, secRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="delivery" ref={secRef} className="relative py-20 sm:py-28 surface border-y line overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="font-heading text-xs tracking-[0.3em] mut" data-reveal>FREE DELIVERY — SCROLL KARO, SCOOTY AAYEGI</div>
        <h2 className="font-display uppercase leading-[1.08] mt-5 text-[clamp(1.85rem,7.2vw,4.4rem)] text-3d" aria-label={`Free home delivery upto ${site.freeRadiusKm} KM on orders above ${site.freeThreshold} rupees`}>
          {WORDS.map((w, i) => (
            <span key={i} className={`inline-block whitespace-nowrap mx-1 sm:mx-1.5 my-1 ${w.cls}`} aria-hidden>
              {w.t.split('').map((ch, j) => (
                <span key={j} className="dlv-letter inline-block">{ch === ' ' ? '\u00A0' : ch}</span>
              ))}
            </span>
          ))}
        </h2>
        <p className="font-heading italic font-semibold text-lg sm:text-xl text-[#FF8A00] mt-4">Scooty nikli hai — garam momos raste me hain!</p>
      </div>
      <div className="relative h-[218px] sm:h-[268px] mt-2 sm:mt-4" aria-hidden>
        <div className="speed-line absolute top-[52px] right-[8%] w-24 sm:w-36" />
        <div className="speed-line absolute top-[92px] right-[20%] w-16 sm:w-24" style={{ animationDelay: '0.35s' }} />
        <div className="speed-line absolute top-[128px] right-[4%] w-20 sm:w-28" style={{ animationDelay: '0.7s' }} />
        <div ref={scooterRef} className="absolute bottom-9 left-0 w-[228px] sm:w-[320px] will-change-transform">
          <div ref={bobRef} className="will-change-transform">
            <ScooterSVG />
            <div className="mx-auto mt-1 h-3 w-[78%] rounded-[50%] bg-black/35 blur-md" />
          </div>
        </div>
        <div className="road-dash absolute bottom-5 inset-x-3 sm:inset-x-8" />
      </div>
    </section>
  )
}
