import { Component, Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Minus, Plus, Rotate3d, ShoppingBag, X } from 'lucide-react'
import type { Dish } from '../data/menu'
import { ADD_PRICE_LABEL } from '../data/menu'
import { SITE, waLink } from '../data/site'
import { useApp } from '../context/AppContext'

function Momo({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.42, 40, 32]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusKnotGeometry args={[0.13, 0.055, 90, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.1, 0]} scale={[1, 0.82, 1]} visible={false}><sphereGeometry args={[0.4, 8, 8]} /></mesh>
    </group>
  )
}

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  render() { return this.state.err ? this.props.fallback : this.props.children }
}

/** Real free CC models (Poly Pizza): Gyoza + Steam Bun, self-hosted in public/models/ */
function ModelMomos({ dish, arrangement }: { dish: Dish; arrangement: [number, number, number][] }) {
  const isSteam = dish.id === 'steam-veg'
  const url = `${import.meta.env.BASE_URL}models/${isSteam ? 'steambun' : 'gyoza'}.glb`
  const { scene } = useGLTF(url)
  const clones = useMemo(() => arrangement.map((_, i) => {
    const c = scene.clone(true)
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const s = (i === 0 ? 1.0 : 0.9) / maxDim
    c.scale.setScalar(s)
    c.position.set(-center.x * s, -box.min.y * s, -center.z * s)
    c.traverse(o => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone() as THREE.MeshStandardMaterial
        if (mat.color) mat.color.lerp(new THREE.Color(dish.color ?? '#ffffff'), 0.38)
        mat.roughness = 0.55
        mesh.material = mat
      }
    })
    const wrap = new THREE.Group(); wrap.add(c)
    wrap.rotation.y = (i / arrangement.length) * Math.PI * 2 + 0.4
    return wrap
  }), [scene, arrangement, dish.color])
  return (
    <>
      {clones.map((c, i) => (
        <group key={i} position={[arrangement[i][0], 0.38, arrangement[i][2]]}>
          <primitive object={c} />
        </group>
      ))}
    </>
  )
}

function Steam() {
  const ref = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const n = 130; const positions = new Float32Array(n * 3); const speeds = new Float32Array(n)
    for (let i = 0; i < n; i++) { positions[i * 3] = (Math.random() - 0.5) * 2.4; positions[i * 3 + 1] = Math.random() * 2.4; positions[i * 3 + 2] = (Math.random() - 0.5) * 2.4; speeds[i] = 0.25 + Math.random() * 0.55 }
    return { positions, speeds }
  }, [])
  useFrame((state, delta) => {
    const pts = ref.current; if (!pts) return
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < speeds.length; i++) { arr[i * 3 + 1] += speeds[i] * delta; arr[i * 3] += Math.sin(t * 1.4 + i) * delta * 0.12; if (arr[i * 3 + 1] > 2.6) arr[i * 3 + 1] = 0.15 }
    pts.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.09} color="#ffffff" transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  )
}

export function DishScene({ dish, height = '100%' }: { dish: Dish; height?: string }) {
  const [interacting, setInteracting] = useState(false)
  const idle = useRef<number>(0)
  const color = dish.color ?? '#e8e3d5'
  const arrangement = useMemo(() => {
    const pts: [number, number, number][] = [[0, 0.62, 0]]
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; pts.push([Math.cos(a) * 0.95, 0.62, Math.sin(a) * 0.95]) }
    return pts
  }, [])
  return (
    <div style={{ height }} className="w-full" role="img" aria-label={`${dish.name} ka interactive 360 degree 3D view — drag karke ghumao`}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2.6, 4.6], fov: 42 }} gl={{ antialias: true, alpha: true }} frameloop="always">
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[4, 6, 3]} intensity={2.2} color="#fff2df" />
          <directionalLight position={[-5, 3, -4]} intensity={1.1} color="#FF8A00" />
          <pointLight position={[0, 3.5, 0]} intensity={12} color="#FF3B30" distance={9} />
          <group position={[0, -0.55, 0]}>
            <mesh receiveShadow position={[0, 0.18, 0]}>
              <cylinderGeometry args={[1.85, 1.55, 0.36, 56]} />
              <meshStandardMaterial color="#17130f" roughness={0.25} metalness={0.65} />
            </mesh>
            <mesh position={[0, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.72, 0.07, 14, 64]} />
              <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <sphereGeometry args={[0.3, 24, 18]} />
              <meshStandardMaterial color="#c22318" roughness={0.35} />
            </mesh>
            <ModelBoundary fallback={<>{arrangement.map((p, i) => <Momo key={i} position={p} color={color} scale={i === 0 ? 1.08 : 0.95} />)}</>}>
              <Suspense fallback={null}>
                <ModelMomos dish={dish} arrangement={arrangement} />
              </Suspense>
            </ModelBoundary>
            <Steam />
          </group>
          <ContactShadows position={[0, -1.5, 0]} opacity={0.55} scale={9} blur={2.6} far={3} />
          <Environment preset="city" />
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
              <h3 className="font-display uppercase leading-none text-[clamp(2rem,7vw,4rem)] flex-1 min-w-[200px]">{dish.name}</h3>
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
