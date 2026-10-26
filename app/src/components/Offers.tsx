import { motion } from 'framer-motion'
import { BadgePercent, Info } from 'lucide-react'
import { SITE } from '../data/site'
export default function Offers() {
  return (
    <section aria-label="Offers" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-display uppercase text-[clamp(2rem,5.5vw,3.6rem)] leading-none">Aaj ke <span className="grad-text">Offers</span></h2>
        <div className="grid sm:grid-cols-3 gap-5 mt-8">
          {SITE.offers.map((o, i) => (
            <motion.article key={o.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-[24px] p-6 grad-bg text-white shadow-xl">
              <BadgePercent size={90} className="absolute -right-4 -bottom-4 opacity-20" aria-hidden />
              <div className="font-heading text-xs tracking-[0.3em] font-bold">{o.title.toUpperCase()}</div>
              <p className="font-heading font-bold text-lg mt-2 relative">{o.text}</p>
            </motion.article>
          ))}
        </div>
        <p className="flex items-center gap-2 mut text-sm mt-5"><Info size={15} /> {SITE.offerNote} — koi bhi offer final shop par hi confirm hoga.</p>
      </div>
    </section>
  )
}
