import { motion } from 'framer-motion'
import { ChefHat, CircleDot, Flame, Hand, Soup, Wind } from 'lucide-react'
const STEPS = [
  { icon: CircleDot, label: 'Dough', text: 'Taaza aata ghuthna' },
  { icon: Hand, label: 'Filling', text: 'Loaded masala bharai' },
  { icon: ChefHat, label: 'Pleating', text: 'Haath ki kala, har fold' },
  { icon: Wind, label: 'Steaming / Tandoor', text: 'Bhaap ya aanch' },
  { icon: Flame, label: 'Chutney', text: 'Signature lal chutney' },
  { icon: Soup, label: 'Serve', text: 'Garam, turant' },
]
export default function ProcessStrip() {
  return (
    <section aria-label="From Steam to Sizzle — process" className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h3 className="font-display uppercase text-3xl sm:text-4xl">From Steam <span className="grad-text">to Sizzle</span></h3>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 sm:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))] pt-8 pb-4 snap-x" style={{ scrollbarWidth: 'none' }}>
        {STEPS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="snap-start shrink-0 w-52 surface border line rounded-[24px] p-5">
            <div className="flex items-center justify-between"><s.icon className="text-[#FF8A00]" size={26} /><span className="font-display text-3xl opacity-20">0{i + 1}</span></div>
            <div className="font-heading font-bold mt-4">{s.label}</div>
            <div className="mut text-sm mt-1">{s.text}</div>
            {i < STEPS.length - 1 && <div className="mt-4 h-0.5 w-full grad-bg rounded-full opacity-60" aria-hidden />}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
