import { useEffect, useRef } from 'react'
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null); const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`; const t = e.target as HTMLElement; const hot = t.closest('a,button,[data-cursor]'); if (ring.current) ring.current.style.scale = hot ? '1.9' : '1' }
    const loop = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; if (ring.current) ring.current.style.translate = `${rx}px ${ry}px`; raf = requestAnimationFrame(loop) }
    window.addEventListener('mousemove', move); raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div ref={dot} className="custom-cursor fixed top-0 left-0 z-[95] pointer-events-none hidden md:block" aria-hidden><div className="w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full grad-bg" /></div>
      <div ref={ring} className="custom-cursor fixed top-0 left-0 z-[95] pointer-events-none hidden md:block transition-[scale] duration-200" aria-hidden><div className="w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FF8A00]/70" /></div>
    </>
  )
}
