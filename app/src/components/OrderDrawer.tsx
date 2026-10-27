import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { NTFY_SERVER, NTFY_TOPIC, waLink } from '../data/site'
import { postOrder, recordOrder, sendNtfyOrder } from '../data/orders'

export default function OrderDrawer() {
  const { drawerOpen, setDrawerOpen, order, setQty, clear, site: SITE } = useApp()
  const [custName, setCustName] = useState('')
  const [custPhone, setCustPhone] = useState('')
  const allPriced = order.length > 0 && order.every(i => i.dish.price !== 'ADD_PRICE')
  const total = order.reduce((s, i) => s + (i.dish.price === 'ADD_PRICE' ? 0 : i.dish.price * i.qty), 0)
  const message = () => {
    const lines = order.map((i, n) => `${n + 1}. ${i.dish.name} x ${i.qty}${i.dish.price === 'ADD_PRICE' ? ' (price confirm kar dein)' : ` — ₹${(i.dish.price as number) * i.qty}`}`)
    const who = custName.trim() ? `\nNaam: ${custName.trim()}${custPhone.trim() ? ` (${custPhone.trim()})` : ''}` : ''
    return `Hi Crazy Momo Corner! Mera order:\n${lines.join('\n')}\n${allPriced ? `Total: ₹${total}` : 'Total: shop par confirm hoga'}${who}`
  }
  const sendOrder = () => {
    const saved = recordOrder({
      customerName: custName.trim(), customerPhone: custPhone.trim(),
      items: order.map(i => ({ name: i.dish.name, qty: i.qty, price: i.dish.price })),
      total: allPriced ? total : null,
    })
    /* Cross-device notification (ntfy) + optional extra endpoint — dono fire-and-forget */
    sendNtfyOrder(saved, SITE.ntfyServer ?? NTFY_SERVER, SITE.ntfyTopic ?? NTFY_TOPIC)
    postOrder(saved, SITE.orderEndpoint)
    window.open(waLink(message(), SITE.whatsappBase), '_blank')
  }
  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" aria-hidden />
          <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[86] w-full max-w-md surface border-l line flex flex-col shadow-2xl" role="dialog" aria-modal="true" aria-label="Order list">
            <div className="flex items-center justify-between p-5 border-b line">
              <h3 className="font-display uppercase text-2xl flex items-center gap-2"><ShoppingBag className="text-[#FF8A00]" /> Order List</h3>
              <button onClick={() => setDrawerOpen(false)} aria-label="Order list band karo" className="w-10 h-10 grid place-items-center rounded-full surface2 active:scale-90 transition-transform"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {order.length === 0 && <p className="mut text-center py-14">Order list khaali hai.<br />Menu se apni pasand add karo!</p>}
              {order.map(i => (
                <div key={i.dish.id} className="surface2 rounded-2xl p-3.5 flex gap-3 items-center">
                  <img decoding="async" src={`${import.meta.env.BASE_URL}${i.dish.img}`} alt="" className="w-14 h-14 rounded-xl object-cover img-frame shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-bold text-sm leading-snug">{i.dish.name}</div>
                    <div className="mut text-xs mt-0.5">{i.dish.price === 'ADD_PRICE' ? 'Price shop par confirm hoga' : `₹${i.dish.price} x ${i.qty} = ₹${(i.dish.price as number) * i.qty}`}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setQty(i.dish.id, i.qty - 1)} aria-label="Kam karo" className="w-11 h-11 grid place-items-center rounded-full surface active:scale-90"><Minus size={14} /></button>
                    <span className="w-5 text-center font-bold text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.dish.id, i.qty + 1)} aria-label="Badhao" className="w-11 h-11 grid place-items-center rounded-full surface active:scale-90"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            {order.length > 0 && (
              <div className="p-5 border-t line space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <input value={custName} onChange={e => setCustName(e.target.value)} placeholder="Aapka naam (optional)" aria-label="Aapka naam" className="surface2 border line rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF8A00]" />
                  <input value={custPhone} onChange={e => setCustPhone(e.target.value)} placeholder="Phone (optional)" inputMode="tel" aria-label="Aapka phone number" className="surface2 border line rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF8A00]" />
                </div>
                <div className="flex justify-between font-heading font-bold text-lg"><span>Total</span><span>{allPriced ? `₹${total}` : 'Shop par confirm hoga'}</span></div>
                <button onClick={sendOrder} className="block w-full text-center bg-[#25D366] text-[#04240f] font-bold rounded-full py-3.5 active:scale-[0.98] transition-transform">Send Order on WhatsApp</button>
                <div className="flex gap-2">
                  <a href={SITE.phoneTel} className="flex-1 flex items-center justify-center gap-2 grad-bg text-white font-bold rounded-full py-3 active:scale-[0.98] transition-transform"><Phone size={16} /> Call to Order</a>
                  <button onClick={clear} className="flex items-center gap-2 rounded-full border line px-4 font-bold active:scale-95 transition-transform"><Trash2 size={16} /> Clear</button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
