import { MENU, type Dish, type Price } from './menu'
import { SITE } from './site'

/* ================= Owner Admin overrides =================
   Panel se ki gayi changes isi browser ke localStorage me save hoti hain
   aur menu.ts / site.ts ke defaults ke UPAR merge hoti hain.
   Kal ko sabke liye permanent karni ho to exported JSON developer ko do —
   wahi values src/data files me daal di jayengi. */

export interface DishOverride {
  price?: Price
  /** null = Full price hata do (sirf single serve) */
  fullPrice?: number | null
  soldOut?: boolean
  hidden?: boolean
  tags?: string[]
  spice?: 0 | 1 | 2 | 3
  desc?: string
}
export interface SiteOverride {
  timing?: string
  phoneDisplay?: string
  /** Sirf digits, country code ke saath (e.g. 918826018524) */
  whatsappNumber?: string
  announcement?: string
  marqueeText?: string
  address?: string
  offers?: string[]
  freeThreshold?: number
  freeRadiusKm?: number
  seoTitle?: string
  seoDescription?: string
  instagram?: string
  defaultTheme?: 'dark' | 'light'
  orderEndpoint?: string
  ntfyTopic?: string
  ntfyServer?: string
}
export interface Overrides {
  dishes: Record<string, DishOverride>
  site: SiteOverride
}
export const EMPTY_OVERRIDES: Overrides = { dishes: {}, site: {} }
const LS_KEY = 'cmc_overrides'


function isPrice(v: unknown): v is Price {
  return v === 'ADD_PRICE' || (typeof v === 'number' && Number.isFinite(v) && v >= 0)
}
/** Import / localStorage se aaya hua data safai ke saath validate */
export function sanitizeOverrides(raw: unknown): Overrides {
  const out: Overrides = { dishes: {}, site: {} }
  if (!raw || typeof raw !== 'object') return out
  const r = raw as { dishes?: unknown; site?: unknown }
  if (r.dishes && typeof r.dishes === 'object') {
    for (const [id, v] of Object.entries(r.dishes as Record<string, unknown>)) {
      if (!MENU.some(m => m.id === id) || !v || typeof v !== 'object') continue
      const o = v as Record<string, unknown>; const d: DishOverride = {}
      if (isPrice(o.price)) d.price = o.price
      if (o.fullPrice === null || (typeof o.fullPrice === 'number' && Number.isFinite(o.fullPrice))) d.fullPrice = o.fullPrice as number | null
      if (typeof o.soldOut === 'boolean') d.soldOut = o.soldOut
      if (typeof o.hidden === 'boolean') d.hidden = o.hidden
      if (Array.isArray(o.tags)) d.tags = o.tags.filter(t => typeof t === 'string').slice(0, 4) as string[]
      if (typeof o.spice === 'number' && o.spice >= 0 && o.spice <= 3) d.spice = o.spice as 0 | 1 | 2 | 3
      if (typeof o.desc === 'string' && o.desc.trim()) d.desc = o.desc
      if (Object.keys(d).length) out.dishes[id] = d
    }
  }
  if (r.site && typeof r.site === 'object') {
    const s = r.site as Record<string, unknown>
    if (typeof s.timing === 'string' && s.timing.trim()) out.site.timing = s.timing
    if (typeof s.phoneDisplay === 'string' && s.phoneDisplay.trim()) out.site.phoneDisplay = s.phoneDisplay
    if (typeof s.whatsappNumber === 'string' && /^\d{10,15}$/.test(s.whatsappNumber.replace(/\D/g, ''))) out.site.whatsappNumber = s.whatsappNumber.replace(/\D/g, '')
    if (typeof s.announcement === 'string') out.site.announcement = s.announcement
    if (typeof s.marqueeText === 'string') out.site.marqueeText = s.marqueeText
    if (typeof s.address === 'string' && s.address.trim()) out.site.address = s.address
    if (typeof s.seoTitle === 'string' && s.seoTitle.trim()) out.site.seoTitle = s.seoTitle
    if (typeof s.seoDescription === 'string' && s.seoDescription.trim()) out.site.seoDescription = s.seoDescription
    if (typeof s.instagram === 'string' && s.instagram.trim()) out.site.instagram = s.instagram
    if (s.defaultTheme === 'dark' || s.defaultTheme === 'light') out.site.defaultTheme = s.defaultTheme
    if (typeof s.orderEndpoint === 'string') out.site.orderEndpoint = s.orderEndpoint
    if (typeof s.ntfyTopic === 'string' && /^[a-zA-Z0-9_-]{3,80}$/.test(s.ntfyTopic.trim())) out.site.ntfyTopic = s.ntfyTopic.trim()
    if (typeof s.ntfyServer === 'string' && /^https?:\/\//.test(s.ntfyServer.trim())) out.site.ntfyServer = s.ntfyServer.trim().replace(/\/$/, '')
    if (Array.isArray(s.offers)) out.site.offers = s.offers.slice(0, 3).map(x => (typeof x === 'string' ? x : ''))
    if (typeof s.freeThreshold === 'number' && Number.isFinite(s.freeThreshold)) out.site.freeThreshold = s.freeThreshold
    if (typeof s.freeRadiusKm === 'number' && Number.isFinite(s.freeRadiusKm)) out.site.freeRadiusKm = s.freeRadiusKm
  }
  return out
}

export function loadOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? sanitizeOverrides(JSON.parse(raw)) : { dishes: {}, site: {} }
  } catch { return { dishes: {}, site: {} } }
}
export function saveOverrides(o: Overrides) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(o)) } catch { /* private mode */ }
}

/** Defaults + overrides = site par dikhne wala menu (hidden dishes gayab, soldOut flag ke saath) */
export function applyDishOverrides(menu: Dish[], ov: Overrides): Dish[] {
  return menu
    .filter(d => !ov.dishes[d.id]?.hidden)
    .map(d => {
      const o = ov.dishes[d.id]
      if (!o) return d
      const full = o.fullPrice === null ? undefined : (o.fullPrice ?? d.fullPrice)
      return { ...d, price: o.price ?? d.price, fullPrice: full, soldOut: !!o.soldOut, tags: o.tags ?? d.tags, spice: o.spice ?? d.spice, desc: o.desc ?? d.desc }
    })
}

export type SiteData = typeof SITE & {
  marqueeText?: string; seoTitle?: string; seoDescription?: string;
  defaultTheme?: 'dark' | 'light'; orderEndpoint?: string; ntfyTopic?: string; ntfyServer?: string;
}
/** Defaults + overrides = effective site data (phone / WhatsApp / timing / offers / delivery copy) */
export function applySiteOverrides(ov: Overrides): SiteData {
  const s = ov.site
  const num = s.whatsappNumber
  const base = { ...SITE }
  if (s.timing) { base.timing = s.timing }
  if (s.phoneDisplay) base.phoneDisplay = s.phoneDisplay
  if (num) {
    base.phoneTel = `tel:+${num}`
    base.whatsappBase = `https://wa.me/${num}?text=`
    base.whatsapp = base.whatsappBase + encodeURIComponent('Hi Crazy Momo Corner! Mujhe order karna hai.')
  }
  if (s.announcement !== undefined) base.announcement = s.announcement
  const ext = base as SiteData
  if (s.marqueeText !== undefined) ext.marqueeText = s.marqueeText
  if (s.seoTitle) ext.seoTitle = s.seoTitle
  if (s.seoDescription) ext.seoDescription = s.seoDescription
  if (s.defaultTheme) ext.defaultTheme = s.defaultTheme
  if (s.orderEndpoint !== undefined) ext.orderEndpoint = s.orderEndpoint
  if (s.ntfyTopic) ext.ntfyTopic = s.ntfyTopic
  if (s.ntfyServer) ext.ntfyServer = s.ntfyServer
  if (s.freeThreshold !== undefined) base.freeThreshold = s.freeThreshold
  if (s.freeRadiusKm !== undefined) base.freeRadiusKm = s.freeRadiusKm
  if (s.offers) base.offers = SITE.offers.map((o, i) => ({ ...o, text: s.offers![i] ?? o.text }))
  if (s.address) base.address = s.address
  if (s.instagram) { base.instagram = s.instagram }
  base.freeDelivery = `Free Home Delivery within ${base.freeRadiusKm} KM on orders above ₹${base.freeThreshold}`
  return base
}
