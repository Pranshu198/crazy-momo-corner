import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Dish } from '../data/menu'

export interface OrderItem { dish: Dish; qty: number }
interface AppState {
  theme: 'dark' | 'light'; toggleTheme: () => void;
  order: OrderItem[]; add: (d: Dish, qty?: number) => void; setQty: (id: string, qty: number) => void; clear: () => void; count: number;
  drawerOpen: boolean; setDrawerOpen: (v: boolean) => void;
  viewerDish: Dish | null; setViewerDish: (d: Dish | null) => void;
  toast: string | null;
}
const Ctx = createContext<AppState | null>(null)
export const useApp = () => { const c = useContext(Ctx); if (!c) throw new Error('AppContext missing'); return c }

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'))
  const [order, setOrder] = useState<OrderItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewerDish, setViewerDish] = useState<Dish | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>(0)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('cmc-theme', theme) } catch { /* private mode */ }
  }, [theme])
  const toggleTheme = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), [])

  const showToast = useCallback((msg: string) => {
    setToast(msg); window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }, [])
  const add = useCallback((d: Dish, qty = 1) => {
    setOrder(prev => { const ex = prev.find(i => i.dish.id === d.id); return ex ? prev.map(i => i.dish.id === d.id ? { ...i, qty: i.qty + qty } : i) : [...prev, { dish: d, qty }] })
    showToast(`${d.name} order list me add ho gaya`)
  }, [showToast])
  const setQty = useCallback((id: string, qty: number) => setOrder(prev => qty <= 0 ? prev.filter(i => i.dish.id !== id) : prev.map(i => i.dish.id === id ? { ...i, qty } : i)), [])
  const clear = useCallback(() => setOrder([]), [])
  const count = useMemo(() => order.reduce((s, i) => s + i.qty, 0), [order])

  const value = useMemo(() => ({ theme, toggleTheme, order, add, setQty, clear, count, drawerOpen, setDrawerOpen, viewerDish, setViewerDish, toast }),
    [theme, toggleTheme, order, add, setQty, clear, count, drawerOpen, viewerDish, toast])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
