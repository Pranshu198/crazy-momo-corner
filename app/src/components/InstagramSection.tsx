import { Camera } from 'lucide-react'
import { SITE } from '../data/site'
const TILES = ['img/steam.jpg', 'img/kurkure.jpg', 'img/twister-nobg.webp', 'img/cheese-nobg.webp', 'img/gravy.jpg', 'img/kspringroll.webp']
export default function InstagramSection() {
  return (
    <section aria-label="Instagram" className="py-14 sm:py-20 surface border-y line overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <Camera size={40} className="mx-auto text-[#FF8A00]" aria-hidden />
        <a href={SITE.instagram} target="_blank" rel="noreferrer" className="block font-display uppercase leading-none mt-4 text-[clamp(1.5rem,6vw,3.6rem)] break-all hover:grad-text transition-all">{SITE.instagramHandle}</a>
        <p className="mut mt-3">Roz ke fresh photos, naye items aur offers — sab pehle Instagram par.</p>
        <a href={SITE.instagram} target="_blank" rel="noreferrer" className="inline-block mt-5 grad-bg text-white font-bold rounded-full px-8 py-3.5 shadow-xl active:scale-95 transition-transform">Follow Karo</a>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-3 sm:grid-cols-6 gap-3 mt-10">
        {TILES.map((t, i) => (
          <a key={t} href={SITE.instagram} target="_blank" rel="noreferrer" className="rounded-[18px] overflow-hidden group img-frame" aria-label={`Instagram par dekho — Crazy Momo Corner photo ${i + 1}`}>
            <img decoding="async" src={`${import.meta.env.BASE_URL}${t}`} alt={`Crazy Momo Corner Instagram food photo ${i + 1}`} loading="lazy" className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
          </a>
        ))}
      </div>
    </section>
  )
}
