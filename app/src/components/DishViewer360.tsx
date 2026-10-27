import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Minus, Plus, Rotate3d, ShoppingBag, X } from 'lucide-react'
import type { Dish } from '../data/menu'
import { ADD_PRICE_LABEL } from '../data/menu'
import { SITE, waLink } from '../data/site'
import { useApp } from '../context/AppContext'

/* ================= Procedural food textures (canvas noise / bump / char) ================= */
type TexKind = 'steam' | 'kurkure' | 'afghani' | 'tandoori' | 'fried' | 'gravy' | 'cheese'
interface FoodTex { map: THREE.CanvasTexture; bump: THREE.CanvasTexture; rough: number; bumpScale: number }
const texCache = new Map<TexKind, FoodTex>()
const BASE: Record<TexKind, string> = {
  steam: '#efe6d0', kurkure: '#c05a1e', afghani: '#eed9ae', tandoori: '#a34a24', fried: '#d99a3d', gravy: '#8f3d16', cheese: '#e8a91c',
}
function makeFoodTexture(kind: TexKind): FoodTex {
  const hit = texCache.get(kind); if (hit) return hit
  const S = 1024
  const c = document.createElement('canvas'); c.width = c.height = S
  const x = c.getContext('2d')!
  const b = document.createElement('canvas'); b.width = b.height = S
  const bx = b.getContext('2d')!
  x.fillStyle = BASE[kind]; x.fillRect(0, 0, S, S)
  bx.fillStyle = '#808080'; bx.fillRect(0, 0, S, S)
  const rnd = (a: number, b2: number) => a + Math.random() * (b2 - a)
  const speckles = kind === 'kurkure' ? 15000 : kind === 'steam' ? 2600 : 7500
  const contrast = kind === 'kurkure' ? 0.5 : kind === 'steam' ? 0.1 : 0.3
  for (let i = 0; i < speckles; i++) {
    const g = Math.random()
    const col = g > 0.5 ? '255,240,210' : kind === 'kurkure' ? '70,30,5' : '90,50,20'
    x.fillStyle = `rgba(${col},${rnd(0.04, contrast)})`
    const r = rnd(0.8, kind === 'kurkure' ? 6.5 : 3.6)
    x.beginPath(); x.arc(rnd(0, S), rnd(0, S), r, 0, 7); x.fill()
    const gv = Math.floor(rnd(60, 200))
    bx.fillStyle = `rgba(${gv},${gv},${gv},${rnd(0.15, 0.6)})`
    bx.beginPath(); bx.arc(rnd(0, S), rnd(0, S), r * 1.15, 0, 7); bx.fill()
  }
  if (kind === 'tandoori' || kind === 'fried') { // charred dark patches
    for (let i = 0; i < 30; i++) {
      const px = rnd(0, S), py = rnd(0, S), pr = rnd(14, 52)
      const gr = x.createRadialGradient(px, py, 2, px, py, pr)
      gr.addColorStop(0, `rgba(28,12,4,${rnd(0.35, 0.65)})`); gr.addColorStop(1, 'rgba(28,12,4,0)')
      x.fillStyle = gr; x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill()
    }
  }
  if (kind === 'afghani' || kind === 'gravy' || kind === 'cheese') { // creamy glossy swirls
    x.lineWidth = rnd(8, 14); x.lineCap = 'round'
    for (let i = 0; i < 16; i++) {
      x.strokeStyle = kind === 'gravy' ? `rgba(255,120,40,${rnd(0.08, 0.2)})` : `rgba(255,250,235,${rnd(0.1, 0.26)})`
      x.beginPath(); x.moveTo(rnd(0, S), rnd(0, S)); x.bezierCurveTo(rnd(0, S), rnd(0, S), rnd(0, S), rnd(0, S), rnd(0, S), rnd(0, S)); x.stroke()
    }
  }
  if (kind === 'kurkure') { // crumb chunks — strong bump
    for (let i = 0; i < 1200; i++) {
      const px = rnd(0, S), py = rnd(0, S), pr = rnd(3, 11)
      x.fillStyle = `rgba(${Math.random() > 0.5 ? '255,170,60' : '120,50,10'},${rnd(0.25, 0.6)})`
      x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill()
      bx.fillStyle = `rgba(235,235,235,${rnd(0.3, 0.8)})`; bx.beginPath(); bx.arc(px, py, pr, 0, 7); bx.fill()
    }
  }
  const map = new THREE.CanvasTexture(c); map.wrapS = map.wrapT = THREE.RepeatWrapping; map.repeat.set(1.6, 1.6); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8
  const bump = new THREE.CanvasTexture(b); bump.wrapS = bump.wrapT = THREE.RepeatWrapping; bump.repeat.set(1.6, 1.6); bump.anisotropy = 8
  const rough = kind === 'steam' ? 0.85 : kind === 'kurkure' ? 0.95 : kind === 'afghani' || kind === 'cheese' ? 0.32 : kind === 'gravy' ? 0.28 : 0.6
  const out: FoodTex = { map, bump, rough, bumpScale: kind === 'kurkure' ? 0.55 : kind === 'steam' ? 0.06 : 0.22 }
  texCache.set(kind, out); return out
}
function applyFoodTex(root: THREE.Object3D, kind: TexKind) {
  const tex = makeFoodTexture(kind)
  root.traverse(o => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh) {
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone() as THREE.MeshStandardMaterial
      mat.map = tex.map; mat.bumpMap = tex.bump; mat.bumpScale = tex.bumpScale
      mat.roughness = tex.rough; mat.metalness = 0; mat.color.set('#ffffff')
      mesh.material = mat; mesh.castShadow = true
    }
  })
}

/* ================= Per-dish scene config — har signature alag dikhega ================= */
interface Placed { model: 'gyoza' | 'bun'; tex: TexKind; pos: [number, number, number]; s?: number; rot?: number }
interface SceneCfg { mode: 'momos' | 'twister' | 'platter'; tex: TexKind; steam: number; accent: string; plate: number; items?: Placed[] }
const ring = (n: number, r: number): [number, number, number][] => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + 0.5; return [Math.cos(a) * r, 0, Math.sin(a) * r] })
function sceneConfig(dish: Dish): SceneCfg {
  switch (dish.id) {
    case 'steam-veg': return { mode: 'momos', tex: 'steam', steam: 175, accent: '#d4af37', plate: 1, items: [{ model: 'bun', tex: 'steam', pos: [0, 0, 0], s: 1.05 }, ...ring(5, 0.95).map(p => ({ model: 'bun' as const, tex: 'steam' as TexKind, pos: p, s: 0.92 }))] }
    case 'kurkure-paneer': return { mode: 'momos', tex: 'kurkure', steam: 22, accent: '#FF8A00', plate: 1, items: [{ model: 'gyoza', tex: 'kurkure', pos: [0, 0, 0], s: 1.02 }, ...ring(5, 0.93).map(p => ({ model: 'gyoza' as const, tex: 'kurkure' as TexKind, pos: p, s: 0.94 }))] }
    case 'afghani-paneer': return { mode: 'momos', tex: 'afghani', steam: 80, accent: '#e6d7b8', plate: 1, items: [{ model: 'gyoza', tex: 'afghani', pos: [0, 0, 0], s: 1.0 }, ...ring(5, 0.9).map(p => ({ model: 'gyoza' as const, tex: 'afghani' as TexKind, pos: p, s: 0.9 }))] }
    case 'tandoori-paneer': return { mode: 'momos', tex: 'tandoori', steam: 48, accent: '#FF3B30', plate: 1, items: [{ model: 'gyoza', tex: 'tandoori', pos: [0, 0, 0], s: 1.1 }, ...ring(5, 1.08).map(p => ({ model: 'gyoza' as const, tex: 'tandoori' as TexKind, pos: p, s: 1.02 }))] }
    case 'twister-cheese': return { mode: 'twister', tex: 'cheese', steam: 42, accent: '#e0a21a', plate: 0.92 }
    case 'platter-crazy': return { mode: 'platter', tex: 'fried', steam: 65, accent: '#d4af37', plate: 1.3, items: [
      { model: 'gyoza', tex: 'kurkure', pos: [-1.05, 0, -0.55], s: 0.95 }, { model: 'gyoza', tex: 'tandoori', pos: [1.05, 0, -0.55], s: 0.95 },
      { model: 'gyoza', tex: 'fried', pos: [-1.05, 0, 0.75], s: 0.95 }, { model: 'bun', tex: 'steam', pos: [1.05, 0, 0.75], s: 0.9 },
      { model: 'bun', tex: 'steam', pos: [0, 0, -1.15], s: 0.9 }, { model: 'gyoza', tex: 'afghani', pos: [0, 0, 1.2], s: 0.92 }] }
    default: {
      const tex: TexKind = dish.category === 'Kurkure Momos' ? 'kurkure' : dish.category === 'Gravy Momos' ? 'gravy' : dish.category === 'Fried Momos' ? 'fried' : dish.category === 'Tandoori & Afghani' ? 'tandoori' : 'steam'
      const model: 'gyoza' | 'bun' = dish.category === 'Steam Momos' ? 'bun' : 'gyoza'
      return { mode: 'momos', tex, steam: 90, accent: dish.color ?? '#d4af37', plate: 1, items: [{ model, tex, pos: [0, 0, 0] }, ...ring(5, 0.95).map(p => ({ model, tex, pos: p, s: 0.92 }))] }
    }
  }
}

/* ================= Procedural fallback momo ================= */
function Momo({ position, kind, scale = 1 }: { position: [number, number, number]; kind: TexKind; scale?: number }) {
  const tex = useMemo(() => makeFoodTexture(kind), [kind])
  return (
    <group position={position} scale={scale}>
      <mesh castShadow scale={[1, 0.86, 1]}>
        <sphereGeometry args={[0.42, 40, 32]} />
        <meshStandardMaterial map={tex.map} bumpMap={tex.bump} bumpScale={tex.bumpScale} roughness={tex.rough} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusKnotGeometry args={[0.13, 0.055, 90, 12]} />
        <meshStandardMaterial map={tex.map} roughness={tex.rough} />
      </mesh>
    </group>
  )
}
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() { return this.state.err ? this.props.fallback : this.props.children }
}

/** Real free CC models (Poly Pizza): Gyoza + Steam Bun, self-hosted in public/models/ */
function ModelItems({ items }: { items: Placed[] }) {
  const gyoza = useGLTF(`${import.meta.env.BASE_URL}models/gyoza.glb`)
  const bun = useGLTF(`${import.meta.env.BASE_URL}models/steambun.glb`)
  const groups = useMemo(() => items.map((it, i) => {
    const src = it.model === 'bun' ? bun.scene : gyoza.scene
    const c = src.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const s = (it.s ?? 0.95) / maxDim
    c.scale.setScalar(s)
    c.position.set(-center.x * s, -box.min.y * s, -center.z * s)
    applyFoodTex(c, it.tex)
    const wrap = new THREE.Group(); wrap.add(c)
    wrap.rotation.y = it.rot ?? (i * 1.13 + 0.4)
    return wrap
  }), [items, gyoza.scene, bun.scene])
  return <>{groups.map((g, i) => <group key={i} position={[items[i].pos[0], 0.4, items[i].pos[2]]}><primitive object={g} /></group>)}</>
}

/* ================= Spiral Potato Twister (helix) + liquid cheese ================= */
class Helix extends THREE.Curve<THREE.Vector3> {
  h: number; r: number; turns: number; phase: number
  constructor(h: number, r: number, turns: number, phase = 0) { super(); this.h = h; this.r = r; this.turns = turns; this.phase = phase }
  getPoint(t: number, target = new THREE.Vector3()) { const a = 2 * Math.PI * this.turns * t + this.phase; return target.set(Math.cos(a) * this.r, (t - 0.5) * this.h, Math.sin(a) * this.r) }
}
function TwisterGroup() {
  const golden = useMemo(() => makeFoodTexture('fried'), [])
  const potato = useMemo(() => new THREE.TubeGeometry(new Helix(1.9, 0.3, 8), 260, 0.088, 10, false), [])
  const cheese = useMemo(() => new THREE.TubeGeometry(new Helix(1.94, 0.315, 8, 0.55), 260, 0.042, 8, false), [])
  return (
    <group position={[0, 0.42, 0]} rotation={[0.12, 0, 0.1]}>
      <mesh position={[0, 0.05, 0]}>{/* skewer */}
        <cylinderGeometry args={[0.032, 0.032, 2.6, 10]} />
        <meshStandardMaterial color="#b98a4e" roughness={0.8} />
      </mesh>
      <mesh geometry={potato} position={[0, 0.1, 0]} castShadow>
        <meshStandardMaterial map={golden.map} bumpMap={golden.bump} bumpScale={0.3} roughness={0.55} color="#f0b45a" />
      </mesh>
      <mesh geometry={cheese} position={[0, 0.16, 0]}>
        <meshStandardMaterial color="#ffb400" roughness={0.16} metalness={0.02} emissive="#7a4d00" emissiveIntensity={0.25} />
      </mesh>
    </group>
  )
}

/* ================= Garnish: coriander + chilli flakes ================= */
function Garnish({ kind }: { kind: 'green' | 'chilli' | 'both' }) {
  const flakes = useMemo(() => {
    const arr: { p: [number, number, number]; r: number; s: number }[] = []
    for (let i = 0; i < 42; i++) { const a = Math.random() * Math.PI * 2; const rad = 0.35 + Math.random() * 1.25; arr.push({ p: [Math.cos(a) * rad, 0.42 + Math.random() * 0.05, Math.sin(a) * rad], r: Math.random() * Math.PI, s: 0.6 + Math.random() * 0.9 }) }
    return arr
  }, [])
  return (
    <group>
      {flakes.map((f, i) => (
        <mesh key={i} position={f.p} rotation={[-Math.PI / 2 + (Math.random() - 0.5) * 0.7, 0, f.r]} scale={f.s}>
          <planeGeometry args={[0.075, 0.05]} />
          <meshStandardMaterial color={kind === 'green' || (kind === 'both' && i % 2 === 0) ? '#2f9e44' : '#c22318'} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

/* ================= Steam particles (per-dish density) ================= */
function Steam({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3); const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) { positions[i * 3] = (Math.random() - 0.5) * 2.4; positions[i * 3 + 1] = Math.random() * 2.4; positions[i * 3 + 2] = (Math.random() - 0.5) * 2.4; speeds[i] = 0.25 + Math.random() * 0.55 }
    return { positions, speeds }
  }, [count])
  useFrame((state, delta) => {
    const pts = ref.current; if (!pts) return
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < speeds.length; i++) { arr[i * 3 + 1] += speeds[i] * delta; arr[i * 3] += Math.sin(t * 1.4 + i) * delta * 0.12; if (arr[i * 3 + 1] > 2.6) arr[i * 3 + 1] = 0.15 }
    pts.geometry.attributes.position.needsUpdate = true
  })
  if (count <= 0) return null
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.09} color="#ffffff" transparent opacity={0.32} depthWrite={false} sizeAttenuation />
    </points>
  )
}

function EnvTune() {
  const { scene } = useThree()
  useEffect(() => { const s = scene as THREE.Scene & { environmentIntensity?: number }; s.environmentIntensity = 0.5 }, [scene])
  return null
}

export function DishScene({ dish, height = '100%' }: { dish: Dish; height?: string }) {
  const [interacting, setInteracting] = useState(false)
  const idle = useRef<number>(0)
  const cfg = useMemo(() => sceneConfig(dish), [dish])
  const fallbackItems = cfg.items ?? []
  return (
    <div style={{ height }} className="w-full" role="img" aria-label={`${dish.name} ka interactive 360 degree 3D view — drag karke ghumao`}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2.6, 4.6], fov: 42 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.06 }} frameloop="always">
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 3]} intensity={2.2} color="#fff2df" />
          <directionalLight position={[-5, 3, -4]} intensity={1.1} color="#FF8A00" />
          <pointLight position={[0, 3.5, 0]} intensity={12} color="#FF3B30" distance={9} />
          <spotLight position={[0, 6, 2.5]} angle={0.5} penumbra={0.9} intensity={60} color="#fff6e8" />
          <group position={[0, -0.55, 0]}>
            {/* Plate — per-dish size + accent rim */}
            <mesh receiveShadow position={[0, 0.18, 0]} scale={[cfg.plate, 1, cfg.plate]}>
              <cylinderGeometry args={[1.85, 1.55, 0.36, 56]} />
              <meshStandardMaterial color="#17130f" roughness={0.25} metalness={0.65} />
            </mesh>
            <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[cfg.plate, cfg.plate, 1]}>
              <torusGeometry args={[1.72, 0.07, 14, 64]} />
              <meshStandardMaterial color={cfg.accent} roughness={0.3} metalness={0.8} />
            </mesh>
            {cfg.mode === 'platter' && ( /* centre chutney bowl */
              <group position={[0, 0.4, 0]}>
                <mesh><cylinderGeometry args={[0.42, 0.3, 0.26, 28]} /><meshStandardMaterial color="#0d0d0d" roughness={0.3} metalness={0.4} /></mesh>
                <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.37, 0.37, 0.05, 28]} /><meshStandardMaterial color="#c22318" roughness={0.18} /></mesh>
              </group>
            )}
            {cfg.mode === 'twister' ? <TwisterGroup /> : (
              <ModelBoundary fallback={<>{fallbackItems.map((p, i) => <Momo key={i} position={[p.pos[0], 0.78, p.pos[2]]} kind={p.tex} scale={p.s ?? 0.95} />)}</>}>
                <Suspense fallback={null}><ModelItems items={cfg.items ?? []} /></Suspense>
              </ModelBoundary>
            )}
            {cfg.mode !== 'momos' || cfg.tex === 'kurkure' || cfg.tex === 'tandoori' ? <Garnish kind={cfg.tex === 'kurkure' ? 'chilli' : cfg.mode === 'twister' ? 'green' : 'both'} /> : null}
            <Steam count={cfg.steam} />
          </group>
          <ContactShadows position={[0, -1.5, 0]} opacity={0.55} scale={9} blur={2.6} far={3} />
          <Environment preset="city" />
          <EnvTune />
          <OrbitControls enablePan={false} minPolarAngle={0.65} maxPolarAngle={1.45} minDistance={3.2} maxDistance={7.5}
            autoRotate={!interacting} autoRotateSpeed={1.6}
            onStart={() => { setInteracting(true); window.clearTimeout(idle.current) }}
            onEnd={() => { idle.current = window.setTimeout(() => setInteracting(false), 3000) }} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default function DishViewer360() {
  const { viewerDish, setViewerDish, add } = useApp()
  const [qty, setQty] = useState(1)
  const dish = viewerDish
  return (
    <AnimatePresence>
      {dish && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/95 text-white flex flex-col" role="dialog" aria-modal="true" aria-label={`${dish.name} 360 viewer`}>
          <button onClick={() => setViewerDish(null)} aria-label="Viewer band karo" className="absolute top-4 right-4 z-10 w-11 h-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition"><X /></button>
          <div className="flex-1 min-h-0 relative">
            <DishScene dish={dish} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/60 text-xs tracking-widest font-heading whitespace-nowrap"><Rotate3d size={15} /> DRAG = 360° • SCROLL / PINCH = ZOOM</div>
          </div>
          <div className="p-5 sm:p-8 max-w-3xl mx-auto w-full">
            <div className="flex items-start gap-3 flex-wrap">
              <span className="mt-2 w-4 h-4 shrink-0 rounded-[4px] border-2 border-[#22C55E] grid place-items-center" aria-label="Pure Veg"><span className="w-2 h-2 rounded-full bg-[#22C55E]" /></span>
              <h3 className="font-display uppercase leading-none text-[clamp(2rem,7vw,4.2rem)] flex-1 min-w-[200px]">{dish.name}</h3>
              <div className="text-right">
                <div className="font-display text-2xl grad-text">{dish.price === 'ADD_PRICE' ? '—' : `₹${dish.price}`}</div>
                <div className="text-white/50 text-xs">{dish.price === 'ADD_PRICE' ? ADD_PRICE_LABEL : dish.fullPrice ? `Full plate ₹${dish.fullPrice}` : 'Half plate'}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3" aria-label={`Spice level ${dish.spice} of 3`}>
              {[0, 1, 2].map(i => <Flame key={i} size={18} className={i < dish.spice ? 'text-[#FF3B30]' : 'text-white/20'} fill={i < dish.spice ? '#FF3B30' : 'transparent'} />)}
              <span className="text-white/50 text-xs ml-2 font-heading tracking-wider">SPICE METER</span>
            </div>
            <p className="text-white/70 mt-3 max-w-xl">{dish.desc}</p>
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-3 rounded-full border border-white/15 px-2 py-1.5">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Quantity kam karo" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 active:scale-90"><Minus size={16} /></button>
                <span className="font-display text-xl w-6 text-center" aria-live="polite">{qty}</span>
                <button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Quantity badhao" className="w-9 h-9 grid place-items-center rounded-full bg-white/10 active:scale-90"><Plus size={16} /></button>
              </div>
              <button onClick={() => { add(dish, qty); setQty(1) }} className="flex items-center gap-2 rounded-full grad-bg text-black font-bold px-6 py-3 active:scale-95 transition"><ShoppingBag size={18} /> Add to Order List</button>
              <a href={waLink(`Hi Crazy Momo Corner! Mujhe ${qty} x ${dish.name} order karna hai.`)} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] text-[#04240f] font-bold px-6 py-3 active:scale-95 transition">Order on WhatsApp</a>
              <span className="text-white/40 text-xs">{SITE.timingShort} • {SITE.phoneDisplay}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
