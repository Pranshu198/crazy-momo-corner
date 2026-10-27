import { motion } from 'framer-motion'
import { Flame, Layers, Wallet, Wheat } from 'lucide-react'

const CARDS = [
  { icon: Wheat, title: 'Fresh Dough Daily', text: 'Har din taaza ghutha aata — kabhi purana stock nahi. Isiliye momos soft aur halka lagte hain.', big: true },
  { icon: Layers, title: 'Loaded Filling', text: 'Har momo me bharpur filling — pehle bite se aakhri bite tak swad hi swad.', big: false },
  { icon: Flame, title: 'Signature Spicy Chutney', text: 'Hamari lal mirch chutney hi asli hero hai — teekhi, tangy aur bilkul addictive.', big: false },
  { icon: Wallet, title: 'Pocket-Friendly', text: 'Steam momos sirf ₹50 se shuru — student budget me full party.', big: true },
]
export default function WhyUs() {
  return (
    <section id="why" className="py-24 sm:py-28 surface border-y line clip-slant relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="font-heading text-xs tracking-[0.3em] mut" data-reveal>09 — WHY US</div>
        <h2 className="font-display uppercase text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.95] mt-2" data-clip>Crazy hi <span className="grad-text">Kyun?</span></h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10">
          {CARDS.map((c, i) => (
            <motion.article key={c.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.09, duration: 0.55 }}
              className={`jump-hover card-shine relative border line rounded-[26px] p-6 sm:p-7 ${c.big ? 'lg:col-span-2 grad-bg text-white shadow-hard-ink border-transparent' : 'surface2'} ${i % 2 ? 'lg:rotate-[0.5deg]' : 'lg:-rotate-[0.5deg]'}`}>
              <span className={`inline-grid place-items-center w-[52px] h-[52px] rounded-2xl shadow-lg ${c.big ? 'bg-black/25 text-white' : 'grad-bg text-white'}`}><c.icon size={24} /></span>
              <h3 className="font-heading font-bold text-lg sm:text-xl mt-4">{c.title}</h3>
              <p className={`text-sm mt-2 leading-relaxed max-w-md ${c.big ? 'text-white/85' : 'mut'}`}>{c.text}</p>
            </motion.article>
          ))}
          <motion.figure initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}
            className="jump-hover relative lg:col-span-2 rounded-[26px] overflow-hidden img-frame border line min-h-[190px]">
            <img decoding="async" src={`${import.meta.env.BASE_URL}img/kurkure.jpg`} alt="Kurkure Momos — crunch ka king, Crazy Momo Corner" width={1600} height={1600} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <figcaption className="absolute bottom-3 left-3 sticker sticker-dark text-xs px-3 py-1.5 -rotate-2">Crunch ka king — Kurkure Momos</figcaption>
          </motion.figure>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="jump-hover sm:col-span-2 lg:col-span-4 surface2 border line rounded-[26px] p-6 sm:p-7 flex items-center gap-5 -rotate-[0.4deg]">
            <span className="font-display text-[clamp(2.6rem,6vw,4rem)] leading-none grad-text shrink-0">₹50</span>
            <p className="font-heading font-bold leading-snug">se shuru — full plate ₹90.<br /><span className="mut font-body font-semibold text-sm">Student budget, restaurant wala swad. Bas itni si baat hai.</span></p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
