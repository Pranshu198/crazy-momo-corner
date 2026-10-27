import * as THREE from 'three'

/* =====================================================================
   CRAZY MOMO TEXTURE PACK — procedural, high-res (1024) canvas textures.
   Har dish style ke liye: colour map + bump map + roughness map,
   VIBRANT / saturated colours (dull/washed nahi), PBR-ready.
   Note: sirf visual style — koi recipe/process yahan encode nahi hai.
   ===================================================================== */
export type TexKind = 'dough' | 'kurkure' | 'fried' | 'gravy' | 'cheese'

export interface FoodTex {
  map: THREE.CanvasTexture
  bump: THREE.CanvasTexture
  roughMap: THREE.CanvasTexture
  roughness: number
  bumpScale: number
  envMapIntensity: number
  emissive?: string
  emissiveIntensity?: number
}

const cache = new Map<TexKind, FoodTex>()

const BASE: Record<TexKind, string> = {
  dough: '#f8eed4',    // soft warm cream dough
  kurkure: '#d8541c',  // deep orange-red masala crunch
  fried: '#eda62b',    // vivid golden blistered
  gravy: '#e8641c',    // glossy rich orange sauce
  cheese: '#ffb400',   // saturated liquid-cheese yellow
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)

function canvases() {
  const S = 1024
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c }
  const map = mk(), bump = mk(), rough = mk()
  return { S, map, bump, rough, mx: map.getContext('2d')!, bx: bump.getContext('2d')!, rx: rough.getContext('2d')! }
}

function speckles(mx: CanvasRenderingContext2D, bx: CanvasRenderingContext2D, S: number, n: number, colors: string[], aMax: number, rMax: number, bumpAlpha = 0.5) {
  for (let i = 0; i < n; i++) {
    const col = colors[Math.floor(Math.random() * colors.length)]
    mx.fillStyle = col; mx.globalAlpha = rnd(0.04, aMax)
    const r = rnd(0.8, rMax), px = rnd(0, S), py = rnd(0, S)
    mx.beginPath(); mx.arc(px, py, r, 0, 7); mx.fill()
    const gv = Math.floor(rnd(50, 215))
    bx.fillStyle = `rgb(${gv},${gv},${gv})`; bx.globalAlpha = rnd(0.1, bumpAlpha)
    bx.beginPath(); bx.arc(px, py, r * 1.15, 0, 7); bx.fill()
  }
  mx.globalAlpha = 1; bx.globalAlpha = 1
}

function swirls(x: CanvasRenderingContext2D, S: number, n: number, style: (i: number) => string, wMin = 8, wMax = 16) {
  x.lineCap = 'round'
  for (let i = 0; i < n; i++) {
    x.strokeStyle = style(i); x.lineWidth = rnd(wMin, wMax); x.globalAlpha = rnd(0.1, 0.3)
    x.beginPath(); x.moveTo(rnd(0, S), rnd(0, S))
    x.bezierCurveTo(rnd(0, S), rnd(0, S), rnd(0, S), rnd(0, S), rnd(0, S), rnd(0, S)); x.stroke()
  }
  x.globalAlpha = 1
}

function finish(map: HTMLCanvasElement, bump: HTMLCanvasElement, rough: HTMLCanvasElement, extra: Partial<FoodTex>): FoodTex {
  const tex = (c: HTMLCanvasElement, srgb = false) => {
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.6, 1.6); t.anisotropy = 8
    if (srgb) t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  return {
    map: tex(map, true), bump: tex(bump), roughMap: tex(rough),
    roughness: extra.roughness ?? 0.7, bumpScale: extra.bumpScale ?? 0.2,
    envMapIntensity: extra.envMapIntensity ?? 0.7,
    emissive: extra.emissive, emissiveIntensity: extra.emissiveIntensity,
  }
}

function makeDough(): FoodTex {
  const { S, map, bump, rough, mx, bx, rx } = canvases()
  mx.fillStyle = BASE.dough; mx.fillRect(0, 0, S, S)
  bx.fillStyle = '#7a7a7a'; bx.fillRect(0, 0, S, S)
  rx.fillStyle = '#e2e2e2'; rx.fillRect(0, 0, S, S) // matte — high roughness everywhere
  // flour dusting — soft pale blotches
  for (let i = 0; i < 90; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(24, 90)
    const g = mx.createRadialGradient(px, py, 2, px, py, pr)
    g.addColorStop(0, `rgba(255,253,244,${rnd(0.1, 0.3)})`); g.addColorStop(1, 'rgba(255,253,244,0)')
    mx.fillStyle = g; mx.beginPath(); mx.arc(px, py, pr, 0, 7); mx.fill()
  }
  // pleat shading — soft warm shadow folds
  for (let i = 0; i < 46; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(30, 110)
    const g = mx.createRadialGradient(px, py, 2, px, py, pr)
    g.addColorStop(0, `rgba(196,150,84,${rnd(0.06, 0.16)})`); g.addColorStop(1, 'rgba(196,150,84,0)')
    mx.fillStyle = g; mx.beginPath(); mx.arc(px, py, pr, 0, 7); mx.fill()
    const gb = bx.createRadialGradient(px, py, 2, px, py, pr)
    gb.addColorStop(0, 'rgba(70,70,70,0.35)'); gb.addColorStop(1, 'rgba(70,70,70,0)')
    bx.fillStyle = gb; bx.beginPath(); bx.arc(px, py, pr, 0, 7); bx.fill()
  }
  // golden kiss spots — halki sek lagi jagah
  speckles(mx, bx, S, 2400, ['#ffffff', '#e8cf9e', '#d9b26e'], 0.14, 3.2, 0.3)
  return finish(map, bump, rough, { roughness: 0.88, bumpScale: 0.07, envMapIntensity: 0.45 })
}

function makeKurkure(): FoodTex {
  const { S, map, bump, rough, mx, bx, rx } = canvases()
  mx.fillStyle = BASE.kurkure; mx.fillRect(0, 0, S, S)
  bx.fillStyle = '#8a8a8a'; bx.fillRect(0, 0, S, S)
  rx.fillStyle = '#f2f2f2'; rx.fillRect(0, 0, S, S) // dry crunch = rough
  // masala tones — deep reds, fiery oranges, golden flecks
  speckles(mx, bx, S, 17000, ['#ff8c1f', '#a82e04', '#ffb03a', '#7e1f02', '#ff6a00'], 0.5, 6.5, 0.65)
  // crumb chunks — big proud bumps
  for (let i = 0; i < 1500; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(3, 12)
    mx.fillStyle = Math.random() > 0.5 ? '#ffab3d' : '#93300a'; mx.globalAlpha = rnd(0.3, 0.65)
    mx.beginPath(); mx.arc(px, py, pr, 0, 7); mx.fill()
    bx.fillStyle = '#f0f0f0'; bx.globalAlpha = rnd(0.4, 0.9)
    bx.beginPath(); bx.arc(px, py, pr, 0, 7); bx.fill()
    rx.fillStyle = '#ffffff'; rx.globalAlpha = rnd(0.2, 0.5)
    rx.beginPath(); rx.arc(px, py, pr, 0, 7); rx.fill()
  }
  mx.globalAlpha = 1; bx.globalAlpha = 1; rx.globalAlpha = 1
  return finish(map, bump, rough, { roughness: 0.96, bumpScale: 0.6, envMapIntensity: 0.35 })
}

function makeFried(): FoodTex {
  const { S, map, bump, rough, mx, bx, rx } = canvases()
  mx.fillStyle = BASE.fried; mx.fillRect(0, 0, S, S)
  bx.fillStyle = '#808080'; bx.fillRect(0, 0, S, S)
  rx.fillStyle = '#b4b4b4'; rx.fillRect(0, 0, S, S) // mid roughness base
  // blistered bubbles — raised golden domes with hot highlights
  for (let i = 0; i < 900; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(3, 13)
    const g = mx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, 1, px, py, pr)
    g.addColorStop(0, `rgba(255,224,150,${rnd(0.25, 0.5)})`); g.addColorStop(0.7, `rgba(214,138,32,${rnd(0.1, 0.3)})`); g.addColorStop(1, 'rgba(160,95,20,0)')
    mx.fillStyle = g; mx.beginPath(); mx.arc(px, py, pr, 0, 7); mx.fill()
    bx.fillStyle = '#e8e8e8'; bx.globalAlpha = rnd(0.3, 0.7); bx.beginPath(); bx.arc(px, py, pr * 0.9, 0, 7); bx.fill(); bx.globalAlpha = 1
  }
  // oil sheen patches — roughness map dark = glossy
  for (let i = 0; i < 42; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(28, 90)
    const g = rx.createRadialGradient(px, py, 2, px, py, pr)
    g.addColorStop(0, `rgba(30,30,30,${rnd(0.4, 0.75)})`); g.addColorStop(1, 'rgba(30,30,30,0)')
    rx.fillStyle = g; rx.beginPath(); rx.arc(px, py, pr, 0, 7); rx.fill()
  }
  // halki toasted edges
  speckles(mx, bx, S, 5200, ['#fff0b8', '#b96f14', '#8a4d0d'], 0.3, 3.8, 0.45)
  return finish(map, bump, rough, { roughness: 1.0, bumpScale: 0.3, envMapIntensity: 0.9 })
}

function makeGravy(): FoodTex {
  const { S, map, bump, rough, mx, bx, rx } = canvases()
  mx.fillStyle = BASE.gravy; mx.fillRect(0, 0, S, S)
  bx.fillStyle = '#8c8c8c'; bx.fillRect(0, 0, S, S)
  rx.fillStyle = '#2e2e2e'; rx.fillRect(0, 0, S, S) // glossy sauce
  // rich sauce depth — darker masala pools + bright orange highlights
  for (let i = 0; i < 60; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(30, 110)
    const dark = Math.random() > 0.45
    const g = mx.createRadialGradient(px, py, 2, px, py, pr)
    g.addColorStop(0, dark ? `rgba(146,52,8,${rnd(0.15, 0.35)})` : `rgba(255,150,50,${rnd(0.15, 0.32)})`); g.addColorStop(1, 'rgba(0,0,0,0)')
    mx.fillStyle = g; mx.beginPath(); mx.arc(px, py, pr, 0, 7); mx.fill()
  }
  // cream swirls
  swirls(mx, S, 18, () => '#fff6e2', 7, 15)
  swirls(bx, S, 10, () => '#a8a8a8', 6, 12)
  // coriander specks
  speckles(mx, bx, S, 900, ['#1e7a2e', '#2f9e44', '#14521f'], 0.55, 3.4, 0.3)
  speckles(mx, bx, S, 2600, ['#ff9a3c', '#c24e10'], 0.22, 3.4, 0.35)
  return finish(map, bump, rough, { roughness: 0.5, bumpScale: 0.12, envMapIntensity: 1.15 })
}

function makeCheese(): FoodTex {
  const { S, map, bump, rough, mx, bx, rx } = canvases()
  mx.fillStyle = BASE.cheese; mx.fillRect(0, 0, S, S)
  bx.fillStyle = '#909090'; bx.fillRect(0, 0, S, S)
  rx.fillStyle = '#222222'; rx.fillRect(0, 0, S, S) // very glossy
  // melty highlights — lighter glossy ribbons
  swirls(mx, S, 22, () => (Math.random() > 0.5 ? '#ffd84d' : '#ffcf1f'), 10, 22)
  swirls(mx, S, 8, () => '#fff3b0', 5, 10)
  // cheese bubbles
  for (let i = 0; i < 260; i++) {
    const px = rnd(0, S), py = rnd(0, S), pr = rnd(2, 8)
    mx.fillStyle = '#ffe066'; mx.globalAlpha = rnd(0.15, 0.4)
    mx.beginPath(); mx.arc(px, py, pr, 0, 7); mx.fill()
    bx.fillStyle = '#d8d8d8'; bx.globalAlpha = rnd(0.2, 0.5); bx.beginPath(); bx.arc(px, py, pr, 0, 7); bx.fill(); bx.globalAlpha = 1
  }
  mx.globalAlpha = 1
  speckles(mx, bx, S, 1200, ['#f59e0b', '#fff0a8'], 0.2, 3.2, 0.25)
  return finish(map, bump, rough, { roughness: 0.42, bumpScale: 0.08, envMapIntensity: 1.3, emissive: '#8a5200', emissiveIntensity: 0.28 })
}

const MAKERS: Record<TexKind, () => FoodTex> = { dough: makeDough, kurkure: makeKurkure, fried: makeFried, gravy: makeGravy, cheese: makeCheese }

export function makeFoodTexture(kind: TexKind): FoodTex {
  const hit = cache.get(kind)
  if (hit) return hit
  const out = MAKERS[kind]()
  cache.set(kind, out)
  return out
}

/** GLB model ke saare meshes par texture pack apply (PBR: map + bump + roughnessMap) */
export function applyFoodTex(root: THREE.Object3D, kind: TexKind) {
  const tex = makeFoodTexture(kind)
  root.traverse(o => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh) {
      const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
      mat.map = tex.map; mat.bumpMap = tex.bump; mat.bumpScale = tex.bumpScale
      mat.roughnessMap = tex.roughMap; mat.roughness = tex.roughness
      mat.envMapIntensity = tex.envMapIntensity; mat.metalness = 0; mat.color.set('#ffffff')
      if (tex.emissive) { mat.emissive = new THREE.Color(tex.emissive); mat.emissiveIntensity = tex.emissiveIntensity ?? 0 }
      mesh.material = mat; mesh.castShadow = true
    }
  })
}
