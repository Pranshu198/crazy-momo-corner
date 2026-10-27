import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { SITE, waLink } from '../data/site'
export default function VisitUs() {
  return (
    <section id="visit" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="font-heading text-xs tracking-[0.3em] mut">13 — VISIT US</div>
        <h2 className="font-display uppercase text-[clamp(2.2rem,6vw,4.2rem)] leading-none mt-2 text-3d">Shop Par <span className="font-accent normal-case text-script-3d text-[1.15em]">aao na</span></h2>
        <div className="grid lg:grid-cols-5 gap-6 mt-10">
          <div className="lg:col-span-2 surface border line rounded-[26px] p-6 sm:p-8 flex flex-col gap-5">
            <div className="flex gap-3.5">
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-2xl grad-bg text-white"><MapPin size={20} /></span>
              <div><div className="font-heading font-bold">Address</div><p className="mut text-sm mt-1 leading-relaxed">{SITE.address}</p></div>
            </div>
            <div className="flex gap-3.5">
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-2xl grad-bg text-white"><Clock size={20} /></span>
              <div><div className="font-heading font-bold">Timing</div><p className="mut text-sm mt-1">{SITE.timing}</p></div>
            </div>
            <div className="flex gap-3.5">
              <span className="w-11 h-11 shrink-0 grid place-items-center rounded-2xl grad-bg text-white"><Phone size={20} /></span>
              <div><div className="font-heading font-bold">Call / WhatsApp</div><p className="mut text-sm mt-1">{SITE.phoneDisplay} • {SITE.freeDelivery}</p></div>
            </div>
            <div className="flex flex-col gap-2.5 mt-auto pt-2">
              <a href={SITE.phoneTel} className="text-center grad-bg text-white font-bold rounded-full py-3.5 active:scale-[0.98] transition-transform">Call Karo — {SITE.phoneDisplay}</a>
              <a href={waLink('Hi Crazy Momo Corner! Mujhe order karna hai.')} target="_blank" rel="noreferrer" className="text-center bg-[#25D366] text-[#04240f] font-bold rounded-full py-3.5 active:scale-[0.98] transition-transform">WhatsApp par Order Karo</a>
              <a href={SITE.mapsLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full border line font-bold py-3.5 active:scale-[0.98] transition-transform"><Navigation size={16} /> Get Directions</a>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-[26px] overflow-hidden border line min-h-[320px] img-frame">
            <iframe title="Crazy Momo Corner location — Vijay Vihar, Uttam Nagar, New Delhi" src={SITE.mapsEmbed} className="w-full h-full min-h-[320px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </div>
      </div>
    </section>
  )
}
