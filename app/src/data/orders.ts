/* ================= Orders (device-local + optional endpoint) =================
   Customer "Send Order" dabata hai to order:
   1) WhatsApp par jaata hai (hamesha),
   2) is device ke localStorage "cmc_orders" me save hota hai (admin inbox ke liye),
   3) ORDER_ENDPOINT set ho to wahan POST bhi hota hai (har device se receive ke liye). */

export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled'
export interface StoredOrderItem { name: string; qty: number; price: number | 'ADD_PRICE' }
export interface StoredOrder {
  id: string; at: number; customerName: string; customerPhone: string;
  items: StoredOrderItem[]; total: number | null; status: OrderStatus;
}
const LS_KEY = 'cmc_orders'

export function loadOrders(): StoredOrder[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr.filter(o => o && typeof o.id === 'string' && Array.isArray(o.items)) : []
  } catch { return [] }
}
export function saveOrders(list: StoredOrder[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 300))) } catch { /* full/blocked */ }
}
export function recordOrder(o: Omit<StoredOrder, 'id' | 'at' | 'status'>): StoredOrder {
  const full: StoredOrder = { ...o, id: `o${Date.now().toString(36)}${Math.floor(Math.random() * 999)}`, at: Date.now(), status: 'New' }
  saveOrders([full, ...loadOrders()])
  return full
}
/** Endpoint par bhejo — fail ho to chup chaap ignore (WhatsApp to gaya hi hai) */
export function postOrder(o: StoredOrder, endpoint?: string) {
  if (!endpoint) return
  try {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `Naya Order — Crazy Momo Corner (${o.customerName || 'Customer'})`,
        customer: o.customerName, phone: o.customerPhone,
        items: o.items.map(i => `${i.name} x ${i.qty}`).join('\n'),
        total: o.total === null ? 'Shop par confirm hoga' : `₹${o.total}`,
        time: new Date(o.at).toLocaleString('en-IN'),
      }),
    }).catch(() => { /* offline */ })
  } catch { /* ignore */ }
}
export function ordersToCSV(list: StoredOrder[]): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const rows = [['Time', 'Name', 'Phone', 'Items', 'Total', 'Status'].join(',')]
  for (const o of list) {
    rows.push([
      esc(new Date(o.at).toLocaleString('en-IN')), esc(o.customerName), esc(o.customerPhone),
      esc(o.items.map(i => `${i.name} x${i.qty}`).join('; ')),
      esc(o.total === null ? 'Confirm at shop' : o.total), esc(o.status),
    ].join(','))
  }
  return rows.join('\n')
}
export const isToday = (ts: number) => { const d = new Date(ts); const n = new Date(); return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }

/* ================= ntfy cross-device sync =================
   Order POST hota hai {server}/{topic} par (ntfy JSON publish).
   Owner ntfy app me isi topic par subscribe karke instant push paata hai.
   Admin inbox GET {server}/{topic}/json?poll=1&since=24h se recent orders merge karta hai. */
export function orderMessageText(o: StoredOrder): string {
  const lines = o.items.map((i, n) => `${n + 1}. ${i.name} x ${i.qty}${i.price === 'ADD_PRICE' ? ' (price confirm)' : ` — ₹${(i.price as number) * i.qty}`}`)
  const total = o.total === null ? 'Total: shop par confirm hoga' : `Total: ₹${o.total}`
  const who = o.customerName || o.customerPhone ? `\nCustomer: ${o.customerName || '-'} ${o.customerPhone ? `(${o.customerPhone})` : ''}` : ''
  const compact = JSON.stringify({ id: o.id, ts: o.at, items: o.items, total: o.total, customer: { name: o.customerName, phone: o.customerPhone } })
  return `${lines.join('\n')}\n${total}${who}\nORDER_JSON:${compact}`
}
export function sendNtfyOrder(o: StoredOrder, server?: string, topic?: string) {
  if (!server || !topic) return
  try {
    fetch(server, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, title: 'New Order — Crazy Momo Corner', message: orderMessageText(o), priority: 5, tags: ['shopping_cart', 'fire'] }),
    }).catch(() => { /* ntfy fail ho to bhi order fail nahi hoga */ })
  } catch { /* ignore */ }
}
export function sendNtfyTest(server?: string, topic?: string): Promise<boolean> {
  if (!server || !topic) return Promise.resolve(false)
  return fetch(server, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, title: 'Test — Crazy Momo Corner', message: 'Test notification hai — admin panel se bheja gaya. Sab set hai!', priority: 4, tags: ['white_check_mark'] }),
  }).then(r => r.ok).catch(() => false)
}
interface NtfyMsg { message?: string }
export async function fetchNtfyOrders(server?: string, topic?: string): Promise<StoredOrder[] | null> {
  if (!server || !topic) return null
  try {
    const res = await fetch(`${server}/${topic}/json?poll=1&since=24h`)
    if (!res.ok) return null
    const text = await res.text()
    const out: StoredOrder[] = []
    for (const line of text.split('\n')) {
      if (!line.trim()) continue
      try {
        const m = JSON.parse(line) as NtfyMsg & { event?: string }
        if ((m as { event?: string }).event !== 'message' || !m.message) continue
        const marker = m.message.split('ORDER_JSON:')[1]
        if (!marker) continue
        const j = JSON.parse(marker.trim()) as { id: string; ts: number; items: StoredOrderItem[]; total: number | null; customer: { name: string; phone: string } }
        out.push({ id: j.id, at: j.ts, customerName: j.customer?.name ?? '', customerPhone: j.customer?.phone ?? '', items: j.items ?? [], total: j.total ?? null, status: 'New' })
      } catch { /* line skip */ }
    }
    return out
  } catch { return null }
}
