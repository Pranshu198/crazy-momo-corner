import { useEffect, useRef } from 'react'

/** Animated gradient glow that drifts + follows the cursor (desktop only, hidden <768px via CSS .glow-follower). */
export default function GlowFollower() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current; if (!el) return
    let raf = 0; let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const loop = () => { x += (tx - x) * 0.06; y += (ty - y) * 0.06; el.style.transform = `translate(${x - 260}px, ${y - 260}px)`; raf = requestAnimationFrame(loop) }
    window.addEventListener('mousemove', onMove, { passive: true }); raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} aria-hidden className="glow-follower fixed top-0 left-0 w-[520px] h-[520px] rounded-full pointer-events-none z-[1] opacity-[0.13] blur-3xl" style={{ background: 'radial-gradient(closest-side,#FF3B30,#FF8A00 55%,transparent)' }} />
}
