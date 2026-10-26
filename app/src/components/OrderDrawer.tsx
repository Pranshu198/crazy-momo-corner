import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Phone, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { SITE, waLink } from '../data/site'

export default function OrderDrawer() {
  const { drawerOpen, setDrawerOpen, order, setQty, clear } = useApp()
  const allPriced = order.length > 0 && order.every(i => i.dish.price !== 'ADD_PRICE')
  const total = order.reduce((s, i) => s + (i.dish.price === 'ADD_PRICE' ? 0 : i.dish.price * i.qty), 0)
  const message = () => {
    const lines = order.map((i, n) => `${n + 1}. ${i.dish.name} x ${i.qty}${i.dish.price === 'ADD_PRICE' ? ' (price confirm kar dein)' : ` — ₹${(i.dish.price as number) * i.qty}`}`)
    return `Hi Crazy Momo Corner! Mera order:\n${lines.join('\n')}\n${allPriced ? `Total: ₹${total}` : 'Total: shop par confirm hoga'}`
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
                  <img src={`${import.meta.env.BASE_URL}${i.dish.img}`} alt="" className="w-14 h-14 rounded-xl object-cover img-frame shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="font-heading font-bold text-sm leading-snug">{i.dish.name}</div>
                    <div className="mut text-xs mt-0.5">{i.dish.price === 'ADD_PRICE' ? 'Price shop par confirm hoga' : `₹${i.dish.price} x ${i.qty} = ₹${(i.dish.price as number) * i.qty}`}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setQty(i.dish.id, i.qty - 1)} aria-label="Kam karo" className="w-8 h-8 grid place-items-center rounded-full surface active:scale-90"><Minus size={14} /></button>
                    <span className="w-5 text-center font-bold text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.dish.id, i.qty + 1)} aria-label="Badhao" className="w-8 h-8 grid place-items-center rounded-full surface active:scale-90"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            {order.length > 0 && (
              <div className="p-5 border-t line space-y-3">
                <div className="flex justify-between font-heading font-bold text-lg"><span>Total</span><span>{allPriced ? `₹${total}` : 'Shop par confirm hoga'}</span></div>
                <a href={waLink(message())} target="_blank" rel="noreferrer" className="block text-center bg-[#25D366] text-[#04240f] font-bold rounded-full py-3.5 active:scale-[0.98] transition-transform">Send Order on WhatsApp</a>
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
