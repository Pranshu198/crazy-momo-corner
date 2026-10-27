import { useEffect, useState } from 'react'
const WORDS = ['STEAM MOMOS', 'KURKURE MOMOS', 'FRIED MOMOS', 'GRAVY MOMOS', 'CHEESE TWISTER']
export default function TypingText() {
  const [text, setText] = useState('')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setText(WORDS[0]); return }
    let wi = 0, ci = 0, deleting = false, timer = 0
    const tick = () => {
      const word = WORDS[wi]
      if (!deleting) { ci++; setText(word.slice(0, ci)); if (ci === word.length) { deleting = true; timer = window.setTimeout(tick, 1600); return } timer = window.setTimeout(tick, 65 + Math.random() * 60) }
      else { ci--; setText(word.slice(0, ci)); if (ci === 0) { deleting = false; wi = (wi + 1) % WORDS.length; timer = window.setTimeout(tick, 350); return } timer = window.setTimeout(tick, 32) }
    }
    timer = window.setTimeout(tick, 300)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <span className="inline-flex items-baseline min-h-[1.2em]" aria-live="off">
      <span className="grad-text">{text}</span>
      <span className="cursor-blink grad-bg inline-block w-[3px] h-[0.85em] ml-1 translate-y-[0.1em]" aria-hidden />
    </span>
  )
}
