import { motion } from 'framer-motion'
import { Flame, Layers, Wallet, Wheat } from 'lucide-react'

const CARDS = [
  { icon: Wheat, title: 'Fresh Dough Daily', text: 'Har din taaza ghutha aata — kabhi purana stock nahi. Isiliye momos soft aur halka lagte hain.' },
  { icon: Layers, title: 'Loaded Filling', text: 'Har momo me bharpur filling — pehle bite se aakhri bite tak swad hi swad.' },
  { icon: Flame, title: 'Signature Spicy Chutney', text: 'Hamari lal mirch chutney hi asli hero hai — teekhi, tangy aur bilkul addictive.' },
  { icon: Wallet, title: 'Pocket-Friendly', text: 'Steam momos sirf ₹50 se shuru — student budget me full party.' },
]
export default function WhyUs() {
  return (
    <section id="why" className="py-20 surface border-y line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="font-heading text-xs tracking-[0.3em] mut">09 — WHY US</div>
        <h2 className="font-display uppercase text-[clamp(2.2rem,6vw,4.2rem)] leading-none mt-2">Crazy hi <span className="font-accent normal-case grad-text text-[1.15em]">kyun?</span></h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {CARDS.map((c, i) => (
            <motion.article key={c.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.55 }}
              className="card-shine surface2 border line rounded-[24px] p-6 hover:-translate-y-1.5 transition-transform">
              <span className="w-13 h-13 inline-grid place-items-center w-[52px] h-[52px] rounded-2xl grad-bg text-white shadow-lg"><c.icon size={24} /></span>
              <h3 className="font-heading font-bold text-lg mt-4">{c.title}</h3>
              <p className="mut text-sm mt-2 leading-relaxed">{c.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
