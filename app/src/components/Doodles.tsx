/* Hand-drawn line doodles (FOOD ref style) — white/cream stroke SVGs, theme-aware via --doodle */
const P = {
  chilli: 'M14 44c10 8 26 6 34-6 6-9 4-20-2-26 2 6-1 12-6 15M46 12c-1-5 2-8 6-9',
  star: 'M32 6l5 21 21 5-21 5-5 21-5-21-21-5 21-5z',
  swirl: 'M10 34c10-14 30-14 36-2 5 10-6 20-15 15-7-4-4-13 3-15 6-2 10 4 8 9',
  fork: 'M24 8v14M17 8v10a7 7 0 0 0 14 0V8M24 22v34M44 8c-5 6-5 14 0 18v30',
  steam: 'M22 54c-5-8 5-13 0-21-4-7 4-11 1-19M42 54c-5-8 5-13 0-21-4-7 4-11 1-19',
  leaf: 'M52 12C34 14 16 26 14 50c24-2 36-20 38-38zM18 46C26 34 38 24 48 16',
}
type K = keyof typeof P
const SETS: Record<string, { k: K; s: React.CSSProperties; d: string; half?: boolean }[]> = {
  hero: [
    { k: 'chilli', s: { top: '-14px', right: '6%', width: 54, ['--dr' as string]: '-10deg' }, d: '0s' },
    { k: 'steam', s: { top: '-30px', left: '38%', width: 40, ['--dr' as string]: '4deg' }, d: '0.8s', half: true },
    { k: 'star', s: { bottom: '6%', right: '-8px', width: 42, ['--dr' as string]: '12deg' }, d: '1.6s' },
    { k: 'swirl', s: { bottom: '-16px', left: '4%', width: 52, ['--dr' as string]: '-6deg' }, d: '0.4s', half: true },
    { k: 'leaf', s: { top: '30%', left: '-16px', width: 40, ['--dr' as string]: '8deg' }, d: '2s', half: true },
  ],
  section: [
    { k: 'star', s: { top: '-18px', right: '4%', width: 38, ['--dr' as string]: '10deg' }, d: '0.3s' },
    { k: 'fork', s: { bottom: '-8px', left: '2%', width: 36, ['--dr' as string]: '-8deg' }, d: '1.1s', half: true },
    { k: 'chilli', s: { top: '-10px', left: '16%', width: 44, ['--dr' as string]: '-12deg' }, d: '1.8s', half: true },
  ],
}
export default function Doodles({ variant = 'section' }: { variant?: 'hero' | 'section' }) {
  return (
    <span className="absolute inset-0 pointer-events-none" aria-hidden>
      {SETS[variant].map((d, i) => (
        <svg key={i} viewBox="0 0 64 64" className={`doodle ${d.half ? 'doodle-half' : ''}`} style={{ ...d.s, animationDelay: d.d }} fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={P[d.k]} />
        </svg>
      ))}
    </span>
  )
}
