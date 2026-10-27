import { useRef, type ReactNode, type MouseEvent } from 'react'

/** Desktop tilt + glare wrapper (max 8deg). Touch devices: no-op via pointer check. */
export default function Tilt({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent) => {
    const el = ref.current; if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`)
    el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }
  const onLeave = () => { const el = ref.current; if (!el) return; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`tilt-wrap ${className}`}>
      <div className="tilt-inner relative h-full">{children}<span className="tilt-glare" aria-hidden /></div>
    </div>
  )
}
