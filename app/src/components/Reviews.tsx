import { Star } from 'lucide-react'
import { SITE } from '../data/site'
import Marquee from './Marquee'

const REVIEWS = [
  { init: 'R', text: 'Kurkure momos ka crunch alag hi level ka hai. Chutney itni teekhi aur tasty, baar baar aana padta hai.' },
  { init: 'A', text: 'Steam momos bilkul soft aur fresh. Itne kam price me itni loaded filling kahin nahi milti.' },
  { init: 'S', text: 'Gravy momos try kiye — gravy ka swad restaurant jaisa. Uttam Nagar me best momos yahi hain.' },
  { init: 'P', text: 'Potato twister bachon ko bohot pasand aaya. Cheese wala twister to bilkul viral wala taste hai.' },
  { init: 'N', text: 'Paneer momos me filling bharpur hoti hai, naam ke nahi. Staff bhi friendly hai.' },
  { init: 'V', text: 'Shaam ko garam-garam momos aur woh lal chutney — perfect combo. Rating 5 star bilkul sahi hai.' },
]
function Card({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <article className="w-[300px] sm:w-[340px] shrink-0 surface border line rounded-[22px] p-5 mx-2">
      <div className="flex gap-0.5" aria-label="5 star review">{[0, 1, 2, 3, 4].map(i => <Star key={i} size={15} className="text-[#FF8A00]" fill="#FF8A00" />)}</div>
      <p className="text-sm mt-3 leading-relaxed">“{r.text}”</p>
      <div className="flex items-center gap-2.5 mt-4">
        <span className="w-9 h-9 rounded-full grad-bg text-white grid place-items-center font-display text-sm">{r.init}</span>
        <span className="text-xs mut font-heading tracking-wider">JUSTDIAL REVIEW</span>
      </div>
    </article>
  )
}
export default function Reviews() {
  const row = [...REVIEWS, ...REVIEWS]
  return (
    <section id="reviews" className="py-20 surface border-y line overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex justify-center gap-1" aria-hidden>{[0, 1, 2, 3, 4].map(i => <Star key={i} size={26} className="text-[#FF8A00]" fill="#FF8A00" />)}</div>
        <h2 className="font-display uppercase text-[clamp(2.4rem,7vw,4.8rem)] leading-none mt-3 text-3d">{SITE.rating.toFixed(1)} — {SITE.ratingCount} Ratings</h2>
        <p className="mut mt-2">Justdial par log kya keh rahe hain — <span className="font-accent text-xl text-script-soft">sach me crazy swad</span></p>
      </div>
      <div className="marquee-paused mt-10 overflow-hidden" aria-label="Customer reviews">
        <div className="marquee-track py-2" style={{ ['--mq' as string]: '55s' }}>
          <div className="flex shrink-0">{row.slice(0, REVIEWS.length).map((r, i) => <Card key={i} r={r} />)}</div>
          <div className="flex shrink-0" aria-hidden>{row.slice(REVIEWS.length).map((r, i) => <Card key={i} r={r} />)}</div>
        </div>
      </div>
      <Marquee items="5 STAR SWAD • " speed={30} className="mt-8 text-sm mut" />
    </section>
  )
}
