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
- Site par SIRF poster-menu ki items hain — Steam/Fried/Kurkure/Gravy Momos (Veg/Soya/Paneer/Cheese & Corn), Twisters (Plain/Kurkure — liquid cheese sirf add-on topping hai, alag dish nahi), Spring Rolls, Fries, Soups, delivery-only Noodles, Chilli Potato, Veg Manchurian, Cold Drink.
- Signature 360 dishes (6): Veg Steam, Paneer Fried, Paneer Kurkure, Cheese & Corn Gravy, Kurkure Potato Twister, Kurkure Spring Roll.
- 3D food textures `src/three/textures.ts` (texture pack) me hain — dough / kurkure / fried / gravy / cheese.
- Menu Wall ke baad "Delivery Scooter" scroll section hai (`src/components/DeliveryScooter.tsx`) — Free Home Delivery upto 1 KM, orders above ₹200.

## Fonts & Type Styles (Round 4)
- **Display (chunky, "Tako" style):** Titan One — hero headline, section titles, Menu Wall chapters, builder headings. Single weight (400) by design.
- **Script accent ("Spicy" retro style):** Lobster — accent words, `.text-script-3d` utility (white outline + dark red extrusion) in `src/index.css`.
- **3D block effect ("FOOD" style):** `.text-3d` + `.text-3d-gold/orange/red/cream` utilities in `src/index.css` — layered text-shadow extrusion; colours theme-aware via `--extr-*` CSS vars.
- **Body/UI:** Manrope (400/600/800). Bricolage Grotesque aur Caveat hata diye gaye hain.
- Line doodles (chilli, star, swirl, fork, steam, leaf): `src/components/Doodles.tsx`.

## Owner Admin Panel — `/admin`
Browser me site ke URL ke aakhir me `/admin` likho (jaise `https://pranshu198.github.io/crazy-momo-corner/admin/`). Public site par admin ka koi link/button nahi hai — sirf direct URL se khulta hai.
**Abhi koi password nahi hai** (baad me lagega — `src/data/site.ts` me `ADMIN_PASSWORD` field ready hai).

### Admin me kya-kya hai (7 tabs)
1. **Dashboard** — menu items, sold-out, ADD_PRICE items, aaj ke orders + revenue ke stat cards, quick buttons.
2. **Orders** — order inbox. Status workflow (New → Preparing → Ready → Delivered / Cancelled), naam/phone search, status filter, delete, delivered saaf, CSV export.
3. **Menu Editor** — har dish ki Half/Full price (khaali = "shop par confirm"), Sold Out toggle, Visible toggle, tags, spice level, description.
4. **Site Settings** — timing, phone, WhatsApp number, address, Instagram, marquee/announcement text, free-delivery threshold + radius, ntfy topic/server, extra order endpoint, SEO title/description, default theme.
5. **Offers** — teeno offer cards ka text.
6. **QR Studio** — site URL ka QR (256/512/1024 px), PNG download — counter par print karke lagane ke liye.
7. **Data** — settings Export/Import JSON, Print Menu (site se), Danger-zone Reset.

### Admin ki limits (zaroor padho)
- Changes **sirf usi browser/device** ke localStorage me save hoti hain (key: `cmc_overrides`). Dusre phone par wahi changes nahi dikhengi.
- **Sabke liye permanent** karni ho to: Data tab se **Export JSON** karke file developer ko bhej do — wahi values `src/data/menu.ts` / `site.ts` me daal di jayengi, phir build + deploy.
- Sold Out wali dish par site par "Sold Out" badge aata hai aur Add band ho jata hai; Visible off wali dish site se gayab ho jati hai.

## Orders kaise aate hain (WhatsApp + ntfy)
Customer "Send Order on WhatsApp" dabata hai to teen kaam hote hain:
1. **WhatsApp** par order message khulta hai (ye hamesha hota hai — pakka record).
2. Order usi device ke localStorage (`cmc_orders`) me save hota hai — admin ke Orders tab me "Is device" badge ke saath dikhta hai.
3. **ntfy push** — order `https://ntfy.sh` ke secret topic par POST hota hai.

### ntfy setup (har device se order notification ke liye)
1. Owner apne Android phone me free **ntfy app** install kare (Play Store).
2. App me **Subscribe to topic** dabakar ye topic daale: `cmc-orders-w4mzmliynmpw`
   - **Ye topic ek secret password jaisa hai** — jiske paas hoga, use saare orders dikhenge. Kisi ke saath share mat karo. Topic Admin → Site Settings se badla bhi ja sakta hai (naya topic daalo, app me naye topic par subscribe karo).
3. Admin → Orders tab me **"Test Notification Bhejo"** dabakar test kar lo — phone par push aana chahiye.
4. Admin ka Orders tab khulne par ntfy se pichle **24 ghante** ke orders auto-fetch hote hain ("ntfy live" badge). Dhyaan do: free ntfy.sh cache kuch ghanton ka hota hai — purane orders live sync se gayab ho sakte hain; WhatsApp + device-local list hi final record hai. Order ka status sirf usi device par save hota hai jahan change kiya.
5. (Optional) `ORDER_ENDPOINT` (site.ts) ya Admin Settings ka endpoint field — FormSubmit jaisi email service ka AJAX URL daalne par orders wahan bhi POST hote hain. Khaali hai to sirf WhatsApp + ntfy + local kaam karta hai.
