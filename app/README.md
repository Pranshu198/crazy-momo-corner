# Crazy Momo Corner — Website (React + Vite + TypeScript)

Uttam Nagar ke sabse crazy momos — premium one-page website with interactive 360° 3D dish viewer, full menu, order list (WhatsApp), dark/light theme.

## Run karna hai
```bash
npm install
npm run dev      # local development
npm run build    # production build -> dist/
```

## Owner ke liye — kya kahan change hota hai

**Sirf 2 files edit karni hain — `src/data/` ke andar:**

### 1. Phone, timing, address, offers → `src/data/site.ts`
- `phoneDisplay` / `phoneTel` / `whatsappBase` — number badalna ho to teeno me naya number.
- `timing` — shop ki timing.
- `address`, `mapsLink`, `mapsEmbed` — address/maps.
- `offers[].text` — `OFFER_TEXT` ki jagah asli offer likho. Jab tak confirm na ho, offer live mat karo.

### 2. Menu aur prices → `src/data/menu.ts`
- Har dish ek line me hai: `name`, `price` (half plate), `fullPrice` (full plate).
- Jinki price abhi shop se confirm nahi hui, unme `price: 'ADD_PRICE'` hai — site par number ki jagah "Price — shop par confirm karein" dikhta hai. Asli price milte hi number daal do, site khud update ho jayegi.
- Nayi dish add karna: kisi existing line ko copy karke name/price/img badal do. `category` wahi rakho jo `CATEGORIES` me hai.
- Dish ki photo: `public/img/` me image daalo aur dish ke `img` me uska path likho (jaise `img/steam.jpg`).

### Real dish photos lagana
1. Dish ki saaf photo (square, achhi light) `public/img/` me rakho — naam simple rakho, jaise `kurkure-paneer.jpg`.
2. `src/data/menu.ts` me us dish ki `img:` value naye path se badal do.
3. `npm run build` karke dobara deploy karo. Bas!

## 360° viewer kaise kaam karta hai
Signature dishes (menu.ts me `signature: true`) par Three.js ka real 3D scene khulta hai — plate + momos ki 3D geometry, steam particles, studio lighting. Drag = rotate, scroll/pinch = zoom, auto-rotate rukta hai jab user touch karta hai, 3 sec baad phir shuru. 3D momo ka rang dish ke `color` field se aata hai.

## Theme
Default AMOLED black. Navbar ke sun/moon button se light theme. Choice browser me save hoti hai.

## Round 3 notes (menu purity)
- Site par SIRF poster-menu ki items hain — Steam/Fried/Kurkure/Gravy Momos (Veg/Soya/Paneer/Cheese & Corn), Twisters (Plain/Kurkure/Liquid Cheese), Spring Rolls, Fries, Soups, delivery-only Noodles, Chilli Potato, Veg Manchurian, Cold Drink.
- Signature 360 dishes (6): Veg Steam, Paneer Fried, Paneer Kurkure, Cheese & Corn Gravy, Liquid Cheese Potato Twister, Kurkure Spring Roll.
- 3D food textures `src/three/textures.ts` (texture pack) me hain — dough / kurkure / fried / gravy / cheese.
- Menu Wall ke baad "Delivery Scooter" scroll section hai (`src/components/DeliveryScooter.tsx`) — Free Home Delivery upto 1 KM, orders above ₹200.

## Fonts & Type Styles (Round 4)
- **Display (chunky, "Tako" style):** Titan One — hero headline, section titles, Menu Wall chapters, builder headings. Single weight (400) by design.
- **Script accent ("Spicy" retro style):** Lobster — accent words, `.text-script-3d` utility (white outline + dark red extrusion) in `src/index.css`.
- **3D block effect ("FOOD" style):** `.text-3d` + `.text-3d-gold/orange/red/cream` utilities in `src/index.css` — layered text-shadow extrusion; colours theme-aware via `--extr-*` CSS vars.
- **Body/UI:** Manrope (400/600/800). Bricolage Grotesque aur Caveat hata diye gaye hain.
- Line doodles (chilli, star, swirl, fork, steam, leaf): `src/components/Doodles.tsx`.
