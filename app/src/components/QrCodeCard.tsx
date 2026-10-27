import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode as QrIcon } from 'lucide-react'

export function siteUrl(): string {
  if (typeof window === 'undefined') return 'https://pranshu198.github.io/crazy-momo-corner/'
  return window.location.origin + import.meta.env.BASE_URL
}

/** Site URL ka QR — locally generate hota hai, koi external service nahi */
export default function QrCodeCard({ size = 176, download = false, title = 'Scan karke site kholo' }: { size?: number; download?: boolean; title?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const url = siteUrl()
  useEffect(() => {
    if (canvasRef.current) QRCode.toCanvas(canvasRef.current, url, { width: size * 2, margin: 2, color: { dark: '#14100C', light: '#ffffff' } }).catch(() => { /* ignore */ })
  }, [url, size])
  const dl = () => {
    const c = canvasRef.current; if (!c) return
    const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'crazy-momo-corner-qr.png'; a.click()
  }
  return (
    <div className="flex items-center gap-4">
      <span className="bg-white rounded-2xl p-2 shrink-0 shadow-md">
        <canvas ref={canvasRef} style={{ width: size / 1.6, height: size / 1.6 }} aria-label={`Site ka QR code — ${url}`} />
      </span>
      <div>
        <div className="font-heading font-bold flex items-center gap-1.5"><QrIcon size={16} className="text-[#FF8A00]" /> {title}</div>
        <p className="mut text-xs mt-1 leading-relaxed break-all">{url}</p>
        {download && <button onClick={dl} className="mt-2.5 flex items-center gap-1.5 rounded-full border line px-4 py-2 text-sm font-bold active:scale-95 transition-transform"><Download size={15} /> QR Download (Print ke liye)</button>}
      </div>
    </div>
  )
}
