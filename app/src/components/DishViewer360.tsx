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
import { applyFoodTex, makeFoodTexture, type TexKind } from '../three/textures'

const useIsMobile = () => useMemo(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches, [])

/* ================= Per-dish scene config — sirf REAL poster-menu signatures ================= */
interface Placed { model: 'gyoza' | 'bun'; tex: TexKind; pos: [number, number, number]; s?: number; rot?: number }
interface SceneCfg { mode: 'momos' | 'twister' | 'rolls'; tex: TexKind; steam: number; accent: string; plate: number; sauce?: boolean; items?: Placed[] }
const ring = (n: number, r: number): [number, number, number][] => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 + 0.5; return [Math.cos(a) * r, 0, Math.sin(a) * r] })
const ringItems = (model: 'gyoza' | 'bun', tex: TexKind, centreS = 1, ringS = 0.92): Placed[] =>
  [{ model, tex, pos: [0, 0, 0], s: centreS }, ...ring(5, 0.95).map(p => ({ model, tex, pos: p, s: ringS }))]
function sceneConfig(dish: Dish): SceneCfg {
  switch (dish.id) {
    case 'steam-veg': return { mode: 'momos', tex: 'dough', steam: 190, accent: '#d4af37', plate: 1, items: ringItems('bun', 'dough', 1.05, 0.92) }
    case 'fried-paneer': return { mode: 'momos', tex: 'fried', steam: 55, accent: '#FF8A00', plate: 1, items: ringItems('gyoza', 'fried', 1.02, 0.94) }
    case 'kurkure-paneer': return { mode: 'momos', tex: 'kurkure', steam: 22, accent: '#FF8A00', plate: 1, items: ringItems('gyoza', 'kurkure', 1.02, 0.94) }
    case 'gravy-cheese-corn': return { mode: 'momos', tex: 'gravy', steam: 165, accent: '#e8641c', plate: 1.05, sauce: true, items: ringItems('gyoza', 'gravy', 1.0, 0.9) }
    case 'twister-cheese': return { mode: 'twister', tex: 'cheese', steam: 42, accent: '#ffb400', plate: 0.92 }
    case 'springroll-kurkure': return { mode: 'rolls', tex: 'kurkure', steam: 26, accent: '#d8541c', plate: 1 }
    default: {
      const tex: TexKind = dish.category === 'Kurkure Momos' ? 'kurkure' : dish.category === 'Gravy Momos' ? 'gravy' : dish.category === 'Fried Momos' ? 'fried' : 'dough'
      const model: 'gyoza' | 'bun' = dish.category === 'Steam Momos' ? 'bun' : 'gyoza'
      return { mode: 'momos', tex, steam: dish.category === 'Steam Momos' || dish.category === 'Gravy Momos' ? 150 : 80, accent: dish.color ?? '#d4af37', plate: 1, sauce: dish.category === 'Gravy Momos', items: ringItems(model, tex) }
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
        <meshStandardMaterial map={tex.map} bumpMap={tex.bump} bumpScale={tex.bumpScale} roughnessMap={tex.roughMap} roughness={tex.roughness} envMapIntensity={tex.envMapIntensity} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusKnotGeometry args={[0.13, 0.055, 90, 12]} />
        <meshStandardMaterial map={tex.map} roughness={tex.roughness} envMapIntensity={tex.envMapIntensity} />
      </mesh>
    </group>
  )
}
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() { return this.state.err ? this.props.fallback : this.props.children }
}

/** Real free CC 3D models: Gyoza + Steam Bun GLB, self-hosted in public/models/ */
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
  const cheeseTex = useMemo(() => makeFoodTexture('cheese'), [])
  const potato = useMemo(() => new THREE.TubeGeometry(new Helix(1.9, 0.3, 8), 260, 0.088, 10, false), [])
  const cheese = useMemo(() => new THREE.TubeGeometry(new Helix(1.94, 0.315, 8, 0.55), 260, 0.042, 8, false), [])
  return (
    <group position={[0, 0.42, 0]} rotation={[0.12, 0, 0.1]}>
      <mesh position={[0, 0.05, 0]}>{/* skewer */}
        <cylinderGeometry args={[0.032, 0.032, 2.6, 10]} />
        <meshStandardMaterial color="#b98a4e" roughness={0.8} />
      </mesh>
      <mesh geometry={potato} position={[0, 0.1, 0]} castShadow>
        <meshStandardMaterial map={golden.map} bumpMap={golden.bump} bumpScale={golden.bumpScale} roughnessMap={golden.roughMap} roughness={golden.roughness} envMapIntensity={golden.envMapIntensity} color="#ffc266" />
      </mesh>
      <mesh geometry={cheese} position={[0, 0.16, 0]}>
        <meshStandardMaterial map={cheeseTex.map} bumpMap={cheeseTex.bump} bumpScale={cheeseTex.bumpScale} roughnessMap={cheeseTex.roughMap} roughness={cheeseTex.roughness} envMapIntensity={cheeseTex.envMapIntensity} emissive={cheeseTex.emissive} emissiveIntensity={cheeseTex.emissiveIntensity} />
      </mesh>
    </group>
  )
}

/* ================= Kurkure Spring Rolls — capsule rolls plate par ================= */
function RollsGroup() {
  const tex = useMemo(() => makeFoodTexture('kurkure'), [])
  const rolls = useMemo(() => [
    { p: [-0.72, 0.62, -0.42] as [number, number, number], r: 0.5 },
    { p: [0.05, 0.62, -0.62] as [number, number, number], r: 0.15 },
    { p: [0.78, 0.62, -0.3] as [number, number, number], r: -0.35 },
    { p: [-0.45, 0.62, 0.5] as [number, number, number], r: 1.15 },
    { p: [0.5, 0.62, 0.55] as [number, number, number], r: 0.85 },
    { p: [0, 0.88, 0.02] as [number, number, number], r: 0.45 },
  ], [])
  return (
    <group>
      {rolls.map((r, i) => (
        <mesh key={i} position={r.p} rotation={[0, r.r, Math.PI / 2]} castShadow>
          <capsuleGeometry args={[0.21, 0.78, 8, 18]} />
          <meshStandardMaterial map={tex.map} bumpMap={tex.bump} bumpScale={tex.bumpScale} roughnessMap={tex.roughMap} roughness={tex.roughness} envMapIntensity={tex.envMapIntensity} />
        </mesh>
      ))}
      {/* centre chutney bowl */}
      <group position={[0, 0.42, 0]}>
        <mesh><cylinderGeometry args={[0.4, 0.28, 0.24, 28]} /><meshStandardMaterial color="#0d0d0d" roughness={0.3} metalness={0.4} /></mesh>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.35, 0.35, 0.05, 28]} /><meshStandardMaterial color="#c22318" roughness={0.15} envMapIntensity={1.2} /></mesh>
      </group>
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

/* ================= Steam particles (per-dish density, mobile par halved) ================= */
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
  useEffect(() => { const s = scene as THREE.Scene & { environmentIntensity?: number }; s.environmentIntensity = 0.55 }, [scene])
  return null
}

export function DishScene({ dish, height = '100%' }: { dish: Dish; height?: string }) {
  const [interacting, setInteracting] = useState(false)
  const idle = useRef<number>(0)
  const isMobile = useIsMobile()
  const cfg = useMemo(() => sceneConfig(dish), [dish])
  const fallbackItems = cfg.items ?? []
  const gravyTex = useMemo(() => makeFoodTexture('gravy'), [])
  const steamCount = isMobile ? Math.round(cfg.steam * 0.45) : cfg.steam
  return (
    <div style={{ height }} className="w-full" role="img" aria-label={`${dish.name} ka interactive 360 degree 3D view — drag karke ghumao`}>
      <Canvas dpr={isMobile ? [1, 1.5] : [1, 2]} camera={{ position: [0, 2.6, 4.6], fov: 42 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }} frameloop="always">
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
            {cfg.sauce && ( /* gravy sauce pool — glossy, cream-swirled */
              <mesh position={[0, 0.4, 0]} scale={[cfg.plate, 1, cfg.plate]} receiveShadow>
                <cylinderGeometry args={[1.55, 1.55, 0.1, 48]} />
                <meshStandardMaterial map={gravyTex.map} bumpMap={gravyTex.bump} bumpScale={0.05} roughnessMap={gravyTex.roughMap} roughness={gravyTex.roughness} envMapIntensity={1.25} />
              </mesh>
            )}
            {cfg.mode === 'twister' ? <TwisterGroup /> : cfg.mode === 'rolls' ? <RollsGroup /> : (
              <ModelBoundary fallback={<>{fallbackItems.map((p, i) => <Momo key={i} position={[p.pos[0], 0.78, p.pos[2]]} kind={p.tex} scale={p.s ?? 0.95} />)}</>}>
                <Suspense fallback={null}><ModelItems items={cfg.items ?? []} /></Suspense>
              </ModelBoundary>
            )}
            {cfg.tex === 'kurkure' ? <Garnish kind="chilli" /> : cfg.mode === 'twister' ? <Garnish kind="green" /> : cfg.tex === 'gravy' ? <Garnish kind="both" /> : null}
            <Steam count={steamCount} />
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
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Quantity kam karo" className="w-11 h-11 grid place-items-center rounded-full bg-white/10 active:scale-90"><Minus size={16} /></button>
                <span className="font-display text-xl w-6 text-center" aria-live="polite">{qty}</span>
                <button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="Quantity badhao" className="w-11 h-11 grid place-items-center rounded-full bg-white/10 active:scale-90"><Plus size={16} /></button>
              </div>
              <button onClick={() => { add(dish, qty); setQty(1) }} className="flex items-center gap-2 rounded-full grad-bg text-black font-bold px-6 py-3 min-h-[48px] active:scale-95 transition"><ShoppingBag size={18} /> Add to Order List</button>
              <a href={waLink(`Hi Crazy Momo Corner! Mujhe ${qty} x ${dish.name} order karna hai.`)} target="_blank" rel="noreferrer" className="rounded-full bg-[#25D366] text-[#04240f] font-bold px-6 py-3 min-h-[48px] inline-flex items-center active:scale-95 transition">Order on WhatsApp</a>
              <span className="text-white/40 text-xs">{SITE.timingShort} • {SITE.phoneDisplay}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
