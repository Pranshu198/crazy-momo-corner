import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import {
  ArrowLeft, Bell, Copy, Download, LayoutDashboard, ListOrdered, Megaphone, Printer,
  QrCode as QrIcon, RefreshCw, Save, Settings as SettingsIcon, ShoppingBag, Trash2, TriangleAlert, Upload,
} from 'lucide-react'
import { CATEGORIES, MENU, type Dish } from '../data/menu'
import { NTFY_SERVER, NTFY_TOPIC, SITE } from '../data/site'
import { sanitizeOverrides, type Overrides } from '../data/overrides'
import {
  fetchNtfyOrders, isToday, loadOrders, ordersToCSV, saveOrders, sendNtfyTest,
  type OrderStatus, type StoredOrder,
} from '../data/orders'
import { useApp } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'
import { siteUrl } from './QrCodeCard'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ListOrdered },
  { id: 'menu', label: 'Menu Editor', icon: ShoppingBag },
  { id: 'settings', label: 'Site Settings', icon: SettingsIcon },
  { id: 'offers', label: 'Offers', icon: Megaphone },
  { id: 'qr', label: 'QR Studio', icon: QrIcon },
  { id: 'data', label: 'Data', icon: Save },
] as const
type TabId = (typeof TABS)[number]['id']
const STATUSES: OrderStatus[] = ['New', 'Preparing', 'Ready', 'Delivered', 'Cancelled']
const STATUS_COLORS: Record<OrderStatus, string> = { New: '#FF8A00', Preparing: '#FFC400', Ready: '#22C55E', Delivered: '#888', Cancelled: '#FF3B30' }

const inp = 'w-full surface2 border line rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF8A00]'
const lbl = 'block text-xs font-heading font-bold tracking-wider mut mb-1.5 uppercase'
const card = 'surface border line rounded-[22px] p-5'
const btn = 'flex items-center gap-2 rounded-full font-bold text-sm px-5 py-2.5 active:scale-95 transition-transform'

interface DishDraft { price: string; full: string; soldOut: boolean; hidden: boolean; tags: string; spice: number; desc: string }
const draftOf = (d: Dish): DishDraft => ({
  price: d.price === 'ADD_PRICE' ? '' : String(d.price),
  full: d.fullPrice !== undefined ? String(d.fullPrice) : '',
  soldOut: !!d.soldOut, hidden: false, tags: (d.tags ?? []).join(', '), spice: d.spice, desc: d.desc,
})

export default function AdminPanel() {
  const { menu, site, overrides, updateOverrides, resetOverrides } = useApp()
  const [tab, setTab] = useState<TabId>('dashboard')
  const [savedMsg, setSavedMsg] = useState('')
  const flash = (m: string) => { setSavedMsg(m); window.setTimeout(() => setSavedMsg(''), 2600) }

  /* ---------- Menu drafts (merged values se prefill) ---------- */
  const [dishDrafts, setDishDrafts] = useState<Record<string, DishDraft>>(() => Object.fromEntries(menu.map(d => [d.id, draftOf(d)])))
  useEffect(() => { setDishDrafts(Object.fromEntries(menu.map(d => [d.id, { ...draftOf(d), hidden: !!overrides.dishes[d.id]?.hidden }]))) }, [overrides]) // eslint-disable-line
  const setDish = (id: string, p: Partial<DishDraft>) => setDishDrafts(prev => ({ ...prev, [id]: { ...prev[id], ...p } }))

  const saveMenu = () => {
    const next: Overrides = { dishes: { ...overrides.dishes }, site: { ...overrides.site } }
    for (const def of MENU) {
      const dr = dishDrafts[def.id]; if (!dr) continue
      const o: Overrides['dishes'][string] = {}
      const price: number | 'ADD_PRICE' = dr.price.trim() === '' ? 'ADD_PRICE' : Number(dr.price)
      if (price !== def.price && !(Number.isNaN(price as number))) o.price = price
      if (dr.full.trim() === '') { if (def.fullPrice !== undefined) o.fullPrice = null }
      else { const f = Number(dr.full); if (!Number.isNaN(f) && f !== def.fullPrice) o.fullPrice = f }
      if (dr.soldOut) o.soldOut = true
      if (dr.hidden) o.hidden = true
      const tags = dr.tags.split(',').map(t => t.trim()).filter(Boolean)
      if (tags.join('|') !== (def.tags ?? []).join('|')) o.tags = tags
      if (dr.spice !== def.spice) o.spice = dr.spice as 0 | 1 | 2 | 3
      if (dr.desc.trim() && dr.desc !== def.desc) o.desc = dr.desc
      if (Object.keys(o).length) next.dishes[def.id] = o; else delete next.dishes[def.id]
    }
    updateOverrides(next); flash('Menu save ho gaya — site par live apply!')
  }

  /* ---------- Site drafts ---------- */
  const [sd, setSd] = useState({
    timing: site.timing, phoneDisplay: site.phoneDisplay,
    whatsappNumber: (site.whatsappBase.match(/wa\.me\/(\d+)/)?.[1]) ?? '918826018524',
    announcement: overrides.site.announcement ?? '', marqueeText: overrides.site.marqueeText ?? '',
    address: site.address, offers: SITE.offers.map((o, i) => overrides.site.offers?.[i] ?? o.text),
    freeThreshold: String(site.freeThreshold), freeRadiusKm: String(site.freeRadiusKm),
    seoTitle: overrides.site.seoTitle ?? '', seoDescription: overrides.site.seoDescription ?? '',
    instagram: site.instagram, defaultTheme: overrides.site.defaultTheme ?? '',
    orderEndpoint: overrides.site.orderEndpoint ?? '',
    ntfyTopic: site.ntfyTopic ?? NTFY_TOPIC, ntfyServer: site.ntfyServer ?? NTFY_SERVER,
  })
  const setS = (p: Partial<typeof sd>) => setSd(prev => ({ ...prev, ...p }))
  const saveSettings = () => {
    const s: Overrides['site'] = {}
    if (sd.timing !== SITE.timing) s.timing = sd.timing
    if (sd.phoneDisplay !== SITE.phoneDisplay) s.phoneDisplay = sd.phoneDisplay
    if (sd.whatsappNumber.replace(/\D/g, '') !== '918826018524') s.whatsappNumber = sd.whatsappNumber.replace(/\D/g, '')
    if (sd.announcement) s.announcement = sd.announcement
    if (sd.marqueeText) s.marqueeText = sd.marqueeText
    if (sd.address !== SITE.address) s.address = sd.address
    if (sd.offers.some((t, i) => t !== SITE.offers[i].text)) s.offers = sd.offers
    if (Number(sd.freeThreshold) !== SITE.freeThreshold) s.freeThreshold = Number(sd.freeThreshold)
    if (Number(sd.freeRadiusKm) !== SITE.freeRadiusKm) s.freeRadiusKm = Number(sd.freeRadiusKm)
    if (sd.seoTitle) s.seoTitle = sd.seoTitle
    if (sd.seoDescription) s.seoDescription = sd.seoDescription
    if (sd.instagram !== SITE.instagram) s.instagram = sd.instagram
    if (sd.defaultTheme === 'dark' || sd.defaultTheme === 'light') s.defaultTheme = sd.defaultTheme
    if (sd.orderEndpoint) s.orderEndpoint = sd.orderEndpoint
    if (sd.ntfyTopic !== NTFY_TOPIC) s.ntfyTopic = sd.ntfyTopic
    if (sd.ntfyServer !== NTFY_SERVER) s.ntfyServer = sd.ntfyServer
    updateOverrides({ dishes: overrides.dishes, site: s }); flash('Settings save ho gayi!')
  }
  const saveOffers = () => {
    const s = { ...overrides.site }
    if (sd.offers.some((t, i) => t !== SITE.offers[i].text)) s.offers = sd.offers; else delete s.offers
    updateOverrides({ dishes: overrides.dishes, site: s }); flash('Offers save ho gaye!')
  }

  /* ---------- Orders ---------- */
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>(() => loadOrders())
  const [ntfyOrders, setNtfyOrders] = useState<StoredOrder[]>([])
  const [statusMap, setStatusMap] = useState<Record<string, OrderStatus>>(() => { try { return JSON.parse(localStorage.getItem('cmc_order_status') || '{}') } catch { return {} } })
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('cmc_order_hidden') || '[]') } catch { return [] } })
  const [syncNote, setSyncNote] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const ntfyServer = site.ntfyServer ?? NTFY_SERVER
  const ntfyTopic = site.ntfyTopic ?? NTFY_TOPIC

  const refreshNtfy = async () => {
    setSyncNote('ntfy se sync ho raha hai…')
    const fetched = await fetchNtfyOrders(ntfyServer, ntfyTopic)
    if (fetched === null) { setSyncNote('ntfy se live sync nahi ho paya — orders WhatsApp par aaye honge.'); return }
    setNtfyOrders(fetched); setSyncNote(`ntfy live sync ho gaya — pichle 24 ghante ke ${fetched.length} orders mile.`)
  }
  useEffect(() => { if (tab === 'orders') { setLocalOrders(loadOrders()); refreshNtfy() } }, [tab]) // eslint-disable-line

  const allOrders = useMemo(() => {
    const byId = new Map<string, StoredOrder & { source: string }>()
    for (const o of ntfyOrders) if (!hiddenIds.includes(o.id)) byId.set(o.id, { ...o, status: statusMap[o.id] ?? o.status, source: 'ntfy live' })
    for (const o of localOrders) byId.set(o.id, { ...o, source: 'Is device' })
    return [...byId.values()].sort((a, b) => b.at - a.at)
  }, [localOrders, ntfyOrders, statusMap, hiddenIds])
  const shownOrders = allOrders.filter(o =>
    (statusFilter === 'All' || o.status === statusFilter) &&
    (!search || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerPhone.includes(search)))
  const todayOrders = allOrders.filter(o => isToday(o.at) && o.status !== 'Cancelled')
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total ?? 0), 0)

  const setStatus = (o: StoredOrder & { source: string }, st: OrderStatus) => {
    if (o.source === 'Is device') { const next = localOrders.map(x => x.id === o.id ? { ...x, status: st } : x); setLocalOrders(next); saveOrders(next) }
    else { const next = { ...statusMap, [o.id]: st }; setStatusMap(next); try { localStorage.setItem('cmc_order_status', JSON.stringify(next)) } catch { /* ignore */ } }
  }
  const deleteOrder = (o: StoredOrder & { source: string }) => {
    if (o.source === 'Is device') { const next = localOrders.filter(x => x.id !== o.id); setLocalOrders(next); saveOrders(next) }
    else { const next = [...hiddenIds, o.id]; setHiddenIds(next); try { localStorage.setItem('cmc_order_hidden', JSON.stringify(next)) } catch { /* ignore */ } }
  }
  const clearDelivered = () => {
    const nextLocal = localOrders.filter(o => o.status !== 'Delivered'); setLocalOrders(nextLocal); saveOrders(nextLocal)
    const delNtfy = ntfyOrders.filter(o => (statusMap[o.id] ?? o.status) === 'Delivered').map(o => o.id)
    const nh = [...hiddenIds, ...delNtfy]; setHiddenIds(nh); try { localStorage.setItem('cmc_order_hidden', JSON.stringify(nh)) } catch { /* ignore */ }
    flash('Delivered orders saaf ho gaye')
  }
  const download = (name: string, content: string, type = 'application/json') => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href)
  }

  /* ---------- QR Studio ---------- */
  const qrCanvas = useRef<HTMLCanvasElement>(null)
  const [qrSize, setQrSize] = useState(512)
  useEffect(() => {
    if (tab === 'qr' && qrCanvas.current) QRCode.toCanvas(qrCanvas.current, siteUrl(), { width: qrSize, margin: 2, color: { dark: '#14100C', light: '#ffffff' } }).catch(() => { /* ignore */ })
  }, [tab, qrSize])
  const downloadQr = () => { const c = qrCanvas.current; if (!c) return; const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = `crazy-momo-qr-${qrSize}.png`; a.click() }

  const importRef = useRef<HTMLInputElement>(null)
  const onImport = (f: File) => {
    f.text().then(t => { try { updateOverrides(sanitizeOverrides(JSON.parse(t))); flash('Import ho gaya — settings apply!') } catch { flash('Galat file hai — JSON check karo') } })
  }

  const stats = [
    { label: 'Total Menu Items', value: MENU.length },
    { label: 'Abhi Visible Items', value: menu.length },
    { label: 'Sold Out Items', value: menu.filter(d => d.soldOut).length },
    { label: 'ADD_PRICE Items', value: menu.filter(d => d.price === 'ADD_PRICE').length },
    { label: 'Aaj ke Orders', value: todayOrders.length },
    { label: 'Aaj ki Revenue (priced)', value: `₹${todayRevenue}` },
  ]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
          <span className="font-display uppercase text-xl">Owner <span className="grad-text">Admin</span></span>
          <span className="text-[11px] font-heading font-bold tracking-wider px-2.5 py-1 rounded-full border line mut">SIRF YE DEVICE • NO BACKEND</span>
          <span className="ml-auto flex items-center gap-2">
            {savedMsg && <span className="text-sm font-bold text-[#22C55E]">{savedMsg}</span>}
            <ThemeToggle />
            <a href={import.meta.env.BASE_URL} className="flex items-center gap-1.5 rounded-full border line px-4 py-2 text-sm font-bold active:scale-95 transition-transform"><ArrowLeft size={15} /> Site par wapas</a>
          </span>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <p className="flex items-center gap-2 text-sm surface border line rounded-2xl px-4 py-3"><TriangleAlert size={16} className="text-[#FF8A00] shrink-0" /> Password abhi set nahi hai — baad me lagega. Abhi jo bhi is URL ko kholega, panel dikhega — isiliye admin ka link kahin public nahi hai.</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 grid lg:grid-cols-[210px_1fr] gap-6 items-start">
        <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:sticky lg:top-[76px] pb-1" aria-label="Admin sections">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 font-heading font-bold text-sm whitespace-nowrap transition-all ${tab === t.id ? 'grad-bg text-white shadow-lg' : 'surface border line'}`}>
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0">
          {tab === 'dashboard' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map(s => (
                  <div key={s.label} className={card}>
                    <div className="font-display text-3xl sm:text-4xl grad-text">{s.value}</div>
                    <div className="mut text-xs font-heading font-bold tracking-wider mt-1.5 uppercase">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className={card}>
                <h3 className="font-display uppercase text-xl">Quick Kaam</h3>
                <div className="flex flex-wrap gap-2.5 mt-4">
                  <button onClick={() => setTab('orders')} className={`${btn} grad-bg text-white`}><ListOrdered size={16} /> Orders Dekho</button>
                  <button onClick={() => setTab('menu')} className={`${btn} border line`}><ShoppingBag size={16} /> Price Badlo</button>
                  <a href={`${import.meta.env.BASE_URL}#menu`} target="_blank" rel="noreferrer" className={`${btn} border line`}><Printer size={16} /> Print Menu (site se)</a>
                  <button onClick={() => setTab('qr')} className={`${btn} border line`}><QrIcon size={16} /> QR Banao</button>
                </div>
                <p className="mut text-sm mt-4 leading-relaxed">Saari changes <b className="text-current">isi browser/device</b> par save hoti hain (localStorage). Sabke liye permanent karni ho to Data tab se JSON export karke developer ko bhej do — wo code me daal dega.</p>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className={card}><div className="font-display text-3xl grad-text">{todayOrders.length}</div><div className="mut text-xs font-heading font-bold tracking-wider mt-1 uppercase">Aaj ke Orders</div></div>
                <div className={card}><div className="font-display text-3xl grad-text">₹{todayRevenue}</div><div className="mut text-xs font-heading font-bold tracking-wider mt-1 uppercase">Aaj ki Revenue (sirf priced)</div></div>
              </div>
              <div className={`${card} space-y-3`}>
                <h3 className="font-display uppercase text-lg flex items-center gap-2"><Bell size={18} className="text-[#FF8A00]" /> Har device se order paane ke liye — ntfy setup</h3>
                <ol className="text-sm mut space-y-1.5 list-decimal ml-5 leading-relaxed">
                  <li>Phone me free <b className="text-current">ntfy app</b> install karo (Play Store se).</li>
                  <li>App me <b className="text-current">Subscribe to topic</b> me ye topic daalo — ye topic tumhara secret password jaisa hai, kisi ko mat do:</li>
                </ol>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="surface2 border line rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold">{ntfyTopic}</code>
                  <button onClick={() => { navigator.clipboard?.writeText(ntfyTopic); flash('Topic copy ho gaya') }} className={`${btn} border line`}><Copy size={15} /> Copy</button>
                  <button onClick={async () => flash(await sendNtfyTest(ntfyServer, ntfyTopic) ? 'Test notification bheja — phone check karo!' : 'Test fail — internet/topic check karo')} className={`${btn} grad-bg text-white`}><Bell size={15} /> Test Notification Bhejo</button>
                </div>
                <p className="text-sm mut leading-relaxed">Customer order karega to push notification turant aayega — pura order usme likha hoga. Dhyan do: free ntfy.sh par purane messages kuch ghanton baad cache se hat sakte hain; WhatsApp message aur is device ki list hi pakka record hai. Status (Preparing/Ready…) sirf is device par save hota hai.</p>
                {syncNote && <p className="text-sm font-semibold">{syncNote}</p>}
              </div>
              <div className="flex flex-wrap gap-2.5 items-center">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Naam ya phone se search…" className={`${inp} !w-auto flex-1 min-w-[180px]`} />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${inp} !w-auto`} aria-label="Status filter">
                  <option>All</option>{STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <button onClick={refreshNtfy} className={`${btn} border line`}><RefreshCw size={15} /> Refresh</button>
                <button onClick={() => download('cmc-orders.csv', ordersToCSV(allOrders), 'text/csv')} className={`${btn} border line`}><Download size={15} /> CSV Export</button>
                <button onClick={clearDelivered} className={`${btn} border line`}><Trash2 size={15} /> Delivered Saaf</button>
              </div>
              <div className="space-y-3">
                {shownOrders.length === 0 && <p className="mut text-center py-10">Koi order nahi mila. Naye orders yahan dikhenge.</p>}
                {shownOrders.map(o => (
                  <article key={o.id} className={card}>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_COLORS[o.status] }} aria-hidden />
                      <span className="font-heading font-bold">{o.customerName || 'Customer'}</span>
                      {o.customerPhone && <span className="mut text-sm">{o.customerPhone}</span>}
                      <span className="mut text-xs">{new Date(o.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                      <span className="text-[10px] font-heading font-bold tracking-widest px-2 py-0.5 rounded-full border line uppercase">{o.source}</span>
                      <span className="ml-auto font-display text-lg">{o.total === null ? 'Confirm @ Shop' : `₹${o.total}`}</span>
                      <button onClick={() => deleteOrder(o)} aria-label="Order delete karo" className="w-9 h-9 grid place-items-center rounded-full surface2 active:scale-90"><Trash2 size={15} /></button>
                    </div>
                    <ul className="mt-2.5 text-sm mut space-y-0.5">
                      {o.items.map((i, n) => <li key={n}>{i.name} × {i.qty}{i.price === 'ADD_PRICE' ? ' (price confirm)' : ` — ₹${(i.price as number) * i.qty}`}</li>)}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {STATUSES.map(st => (
                        <button key={st} onClick={() => setStatus(o, st)} className={`rounded-full px-3.5 py-1.5 text-xs font-heading font-bold transition-all ${o.status === st ? 'text-white' : 'border line'}`} style={o.status === st ? { background: STATUS_COLORS[st] } : undefined}>{st}</button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {tab === 'menu' && (
            <div className="space-y-8">
              {CATEGORIES.map(cat => (
                <div key={cat}>
                  <h3 className="font-display uppercase text-xl mb-3">{cat}</h3>
                  <div className="space-y-3">
                    {MENU.filter(d => d.category === cat).map(d => {
                      const dr = dishDrafts[d.id] ?? draftOf(d)
                      return (
                        <div key={d.id} className={`${card} space-y-3.5`}>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-heading font-bold">{d.name}</span>
                            <span className="mut text-xs">Default: {d.price === 'ADD_PRICE' ? 'Confirm' : `₹${d.price}`}{d.fullPrice ? ` / ₹${d.fullPrice}` : ''}</span>
                            <span className="ml-auto flex gap-4 text-sm font-heading font-semibold">
                              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={dr.soldOut} onChange={e => setDish(d.id, { soldOut: e.target.checked })} className="w-4.5 h-4.5 w-[18px] h-[18px] accent-[#FF3B30]" /> Sold Out</label>
                              <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={!dr.hidden} onChange={e => setDish(d.id, { hidden: !e.target.checked })} className="w-[18px] h-[18px] accent-[#22C55E]" /> Visible</label>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div><label className={lbl}>{d.halfLabel ?? 'Half'} Price (₹) — khaali = confirm</label><input value={dr.price} onChange={e => setDish(d.id, { price: e.target.value })} inputMode="numeric" className={inp} /></div>
                            <div><label className={lbl}>{d.fullLabel ?? 'Full'} Price (₹)</label><input value={dr.full} onChange={e => setDish(d.id, { full: e.target.value })} inputMode="numeric" placeholder="Khaali = nahi hai" className={inp} /></div>
                            <div><label className={lbl}>Spice (0–3)</label>
                              <select value={dr.spice} onChange={e => setDish(d.id, { spice: Number(e.target.value) })} className={inp}>{[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                            <div><label className={lbl}>Tags (comma se)</label><input value={dr.tags} onChange={e => setDish(d.id, { tags: e.target.value })} placeholder="bestseller, must-try" className={inp} /></div>
                          </div>
                          <div><label className={lbl}>Description</label><textarea value={dr.desc} onChange={e => setDish(d.id, { desc: e.target.value })} rows={2} className={inp} /></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button onClick={saveMenu} className={`${btn} grad-bg text-white !px-7 !py-3.5 sticky bottom-4 shadow-2xl`}><Save size={17} /> Menu Save Karo</button>
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-5">
              <div className={card}>
                <h3 className="font-display uppercase text-lg mb-4">Shop Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>Timing Text</label><input value={sd.timing} onChange={e => setS({ timing: e.target.value })} className={inp} /></div>
                  <div><label className={lbl}>Phone (Display)</label><input value={sd.phoneDisplay} onChange={e => setS({ phoneDisplay: e.target.value })} className={inp} /></div>
                  <div><label className={lbl}>WhatsApp Number (country code ke saath, sirf digits)</label><input value={sd.whatsappNumber} onChange={e => setS({ whatsappNumber: e.target.value })} inputMode="numeric" className={inp} /></div>
                  <div><label className={lbl}>Instagram URL</label><input value={sd.instagram} onChange={e => setS({ instagram: e.target.value })} className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Address</label><textarea value={sd.address} onChange={e => setS({ address: e.target.value })} rows={2} className={inp} /></div>
                </div>
              </div>
              <div className={card}>
                <h3 className="font-display uppercase text-lg mb-4">Delivery & Marquee</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>Free Delivery — kam se kam order (₹)</label><input value={sd.freeThreshold} onChange={e => setS({ freeThreshold: e.target.value })} inputMode="numeric" className={inp} /></div>
                  <div><label className={lbl}>Free Delivery Radius (KM)</label><input value={sd.freeRadiusKm} onChange={e => setS({ freeRadiusKm: e.target.value })} inputMode="decimal" className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Upar wali Marquee Patti ka Text (khaali = default)</label><input value={sd.marqueeText} onChange={e => setS({ marqueeText: e.target.value })} placeholder="FRESH • HOT • …" className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Announcement Text (khaali = default)</label><input value={sd.announcement} onChange={e => setS({ announcement: e.target.value })} className={inp} /></div>
                </div>
              </div>
              <div className={card}>
                <h3 className="font-display uppercase text-lg mb-4">Orders — ntfy & Endpoint</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>ntfy Topic (= secret, kisi ko mat do)</label><input value={sd.ntfyTopic} onChange={e => setS({ ntfyTopic: e.target.value })} className={inp} /></div>
                  <div><label className={lbl}>ntfy Server</label><input value={sd.ntfyServer} onChange={e => setS({ ntfyServer: e.target.value })} className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Extra Order Endpoint (optional — FormSubmit AJAX URL)</label><input value={sd.orderEndpoint} onChange={e => setS({ orderEndpoint: e.target.value })} placeholder="https://formsubmit.co/ajax/your@email.com" className={inp} /></div>
                </div>
              </div>
              <div className={card}>
                <h3 className="font-display uppercase text-lg mb-4">SEO & Theme</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>Site Title (browser/Google)</label><input value={sd.seoTitle} onChange={e => setS({ seoTitle: e.target.value })} placeholder="Crazy Momo Corner — Best Momos in Uttam Nagar, Delhi" className={inp} /></div>
                  <div><label className={lbl}>Default Theme (naye visitor ke liye)</label>
                    <select value={sd.defaultTheme} onChange={e => setS({ defaultTheme: e.target.value })} className={inp}>
                      <option value="">System / Dark (default)</option><option value="dark">Dark (AMOLED)</option><option value="light">Light</option>
                    </select></div>
                  <div className="sm:col-span-2"><label className={lbl}>Meta Description</label><textarea value={sd.seoDescription} onChange={e => setS({ seoDescription: e.target.value })} rows={2} placeholder="Google search me dikhne wala description" className={inp} /></div>
                </div>
              </div>
              <button onClick={saveSettings} className={`${btn} grad-bg text-white !px-7 !py-3.5 shadow-xl`}><Save size={17} /> Settings Save Karo</button>
            </div>
          )}

          {tab === 'offers' && (
            <div className={`${card} space-y-4`}>
              <h3 className="font-display uppercase text-lg">Offers Editor</h3>
              <p className="mut text-sm">Teeno offer cards ka text. Site par neeche "{SITE.offerNote}" note ke saath dikhta hai.</p>
              {sd.offers.map((t, i) => (
                <div key={i}><label className={lbl}>Offer {i + 1}</label>
                  <textarea value={t} rows={2} onChange={e => { const next = [...sd.offers]; next[i] = e.target.value; setS({ offers: next }) }} className={inp} /></div>
              ))}
              <button onClick={saveOffers} className={`${btn} grad-bg text-white`}><Save size={16} /> Offers Save Karo</button>
            </div>
          )}

          {tab === 'qr' && (
            <div className={`${card} text-center space-y-4`}>
              <h3 className="font-display uppercase text-lg">QR Studio</h3>
              <p className="mut text-sm">Counter par lagane ke liye site ka QR. Print karke dukaan par chipka do — scan karte hi site khulegi.</p>
              <div className="inline-block bg-white rounded-3xl p-3 shadow-lg"><canvas ref={qrCanvas} style={{ width: 220, height: 220 }} aria-label="Site QR code bada" /></div>
              <p className="font-mono text-sm font-bold break-all">{siteUrl()}</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <select value={qrSize} onChange={e => setQrSize(Number(e.target.value))} className={`${inp} !w-auto`} aria-label="QR size">
                  <option value={256}>256 px</option><option value={512}>512 px</option><option value={1024}>1024 px (print best)</option>
                </select>
                <button onClick={downloadQr} className={`${btn} grad-bg text-white`}><Download size={16} /> PNG Download</button>
              </div>
            </div>
          )}

          {tab === 'data' && (
            <div className="space-y-5">
              <div className={card}>
                <h3 className="font-display uppercase text-lg mb-2">Export / Import</h3>
                <p className="mut text-sm leading-relaxed">Export ki hui JSON file developer ko bhej do to saari changes <b className="text-current">sabke liye permanent</b> code me daal di jayengi. Import se kisi dusri device ki settings yahan aa jayengi.</p>
                <div className="flex flex-wrap gap-2.5 mt-4">
                  <button onClick={() => download('cmc-settings.json', JSON.stringify(overrides, null, 2))} className={`${btn} grad-bg text-white`}><Download size={16} /> Export JSON</button>
                  <button onClick={() => importRef.current?.click()} className={`${btn} border line`}><Upload size={16} /> Import JSON</button>
                  <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = '' }} />
                  <a href={`${import.meta.env.BASE_URL}#menu`} target="_blank" rel="noreferrer" className={`${btn} border line`}><Printer size={16} /> Print Menu (site se)</a>
                </div>
              </div>
              <div className={`${card} !border-[#FF3B30]/50`}>
                <h3 className="font-display uppercase text-lg text-[#FF3B30] mb-2">Danger Zone</h3>
                <p className="mut text-sm">Saari admin changes (prices, settings, offers) hat jayengi aur site wapas original menu par aa jayegi. Orders isse delete nahi hote.</p>
                <button onClick={() => { if (window.confirm('Pakka? Saari admin changes reset ho jayengi.')) { resetOverrides(); flash('Sab reset ho gaya — defaults wapas!') } }} className="mt-4 flex items-center gap-2 rounded-full bg-[#FF3B30] text-white font-bold text-sm px-5 py-2.5 active:scale-95 transition-transform"><Trash2 size={16} /> Reset to Defaults</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
