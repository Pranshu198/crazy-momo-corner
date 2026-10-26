import { Moon, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext'
export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp()
  return (
    <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Light theme on karo' : 'Dark theme on karo'}
      className="w-10 h-10 grid place-items-center rounded-full border line surface hover:scale-110 active:scale-95 transition-transform">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
