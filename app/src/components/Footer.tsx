import { ArrowUp, Clock, Heart, MapPin, Phone, Share2 } from 'lucide-react'
import { CATEGORIES } from '../data/menu'
import { useApp } from '../context/AppContext'
import { siteUrl } from './QrCodeCard'
export default function Footer() {
  const { site: SITE, notify } = useApp()
  const share = async () => { const url = siteUrl(); try { if (navigator.share) { await navigator.share({ title: 'Crazy Momo Corner', text: 'Uttam Nagar ke sabse crazy momos!', url }); return } await navigator.clipboard.writeText(url); notify('Site ka link copy ho gaya!') } catch { /* cancelled */ } }
  const go = (h: string) => document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className="border-t line surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl overflow-hidden bg-black ring-1 ring-black/20 shrink-0 shadow-lg"><img src={`${import.meta.env.BASE_URL}img/logo-mascot.webp`} alt="Crazy Momo Corner logo — crazy momo mascot" className="w-full h-full object-cover" /></span>
            <span className="font-display uppercase text-xl">Crazy <span className="grad-text">Momo</span> Corner</span>
          </div>
          <p className="mut text-sm mt-3 leading-relaxed">{SITE.tagline}. 100% Pure Veg momos, twisters, noodles aur bohot kuch.</p>
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="inline-block mt-3 font-heading font-bold text-sm text-[#FF8A00]">{SITE.instagramHandle}</a>
        </div>
        <nav aria-label="Footer quick links">
          <h4 className="font-heading font-bold tracking-wider text-sm">QUICK LINKS</h4>
          <ul className="mt-4 space-y-2.5 text-sm mut">
            {[['Home', '#home'], ['360° Specials', '#specials'], ['Menu', '#menu'], ['Why Us', '#why'], ['Gallery', '#gallery'], ['Reviews', '#reviews'], ['Visit Us', '#visit']].map(([l, h]) => (
              <li key={h}><button onClick={() => go(h)} className="hover:text-[#FF8A00] transition-colors">{l}</button></li>
            ))}
          </ul>
        </nav>
        <div>
          <h4 className="font-heading font-bold tracking-wider text-sm">CATEGORIES</h4>
          <ul className="mt-4 space-y-2.5 text-sm mut">
            {CATEGORIES.slice(0, 7).map(c => <li key={c}><button onClick={() => go('#menu')} className="hover:text-[#FF8A00] transition-colors">{c}</button></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-bold tracking-wider text-sm">CONTACT</h4>
          <ul className="mt-4 space-y-3 text-sm mut">
            <li className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5 text-[#FF3B30]" /> {SITE.address}</li>
            <li className="flex gap-2"><Clock size={16} className="shrink-0 mt-0.5 text-[#FF8A00]" /> {SITE.timing}</li>
            <li><a href={SITE.phoneTel} className="flex gap-2 hover:text-[#FF8A00] transition-colors"><Phone size={16} className="shrink-0 mt-0.5 text-[#FF3B30]" /> {SITE.phoneDisplay}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-3 text-xs mut">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span className="flex items-center gap-1.5">Made with <Heart size={13} className="text-[#FF3B30]" fill="#FF3B30" aria-label="love" /> in Uttam Nagar</span>
          <span className="flex items-center gap-4"><button onClick={share} className="flex items-center gap-1.5 font-heading font-bold hover:text-[#FF8A00] transition-colors"><Share2 size={14} /> Share</button><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Upar jao" className="flex items-center gap-1.5 font-heading font-bold hover:text-[#FF8A00] transition-colors"><ArrowUp size={14} /> Back to Top</button></span>
        </div>
      </div>
    </footer>
  )
}
