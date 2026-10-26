# CRAZY MOMO CORNER — ULTRA HEAVY WEBSITE PROMPT (Ready to Copy)
> Neeche ki line se lekar END tak pura copy karke Lovable / v0 / Claude / ChatGPT / Cursor — jahan bhi site banwani ho — wahan paste kar do.

---

COPY FROM HERE ↓↓↓

# ROLE
You are a world-class senior creative developer + award-winning UI/UX designer (Awwwards level). Build a COMPLETE, PRODUCTION-READY, ultra-premium website for a momos restaurant. This is NOT a demo, NOT a wireframe, NOT a landing-page skeleton. Deliver the full working project with every section, every animation and every interaction actually implemented. If anything is missing, the task is FAILED.

# BUSINESS DATA — USE EXACTLY THIS, DO NOT CHANGE, DO NOT INVENT
- Business name: **Crazy Momo Corner**
- Tagline: "Uttam Nagar ke sabse crazy momos" (use this line, Hinglish flavour allowed in headings)
- Address (EXACT, from the shop's own Instagram post caption + post image): **Shop No. 12, Plot No. O-1, Block O, Vijay Vihar, Uttam Nagar, New Delhi – 110059** (area tag: Uttam Nagar East)
- Google Maps directions link: https://www.google.com/maps/search/?api=1&query=Crazy+Momo+Corner+Vijay+Vihar+Uttam+Nagar+New+Delhi+110059
- Phone / Call / WhatsApp (PRIMARY — owner-confirmed for the website): **+91 88260 18524**
- Call link: tel:+918826018524
- WhatsApp order link: https://wa.me/918826018524?text=Hi%20Crazy%20Momo%20Corner!%20Mujhe%20order%20karna%20hai.
- Instagram: https://www.instagram.com/crazymomocorner_uttamnagar (handle: @crazymomocorner_uttamnagar)
- Rating to show: ★ 5.0 (29 ratings on Justdial)
- Timing to show (from Instagram bio): **Open Daily — 5:30 PM to 11:00 PM**
- STRICT: Do NOT invent a full street address, do NOT invent owner name, do NOT invent prices for dishes where price is marked "ADD_PRICE". Keep a single central data file (src/data/site.ts + src/data/menu.ts) where phone, timing, address line and every price can be edited in ONE place. Every price in the UI must come from menu.ts only.

# TECH STACK — MANDATORY, NO SUBSTITUTES
- React 18 + Vite + TypeScript (strict mode)
- Tailwind CSS v4 (utility-first, custom theme tokens) + CSS variables for theming
- Framer Motion — page/element animations, layout animations, AnimatePresence
- GSAP + ScrollTrigger — scroll-driven animation, pinning, parallax, horizontal scroll
- Lenis — buttery smooth scrolling, synced with GSAP ticker
- Three.js + @react-three/fiber + @react-three/drei — the 360° dish viewer
- lucide-react — icons only (no emoji as icons)
- Google Fonts via fontsource or link: Display = "Anton" (or Bebas Neue), Headings = "Space Grotesk", Body = "Outfit", Accent/handwritten = "Caveat"
- State: React context for theme + cart-like order-list; no backend, no fake login
- Output must run with `npm install && npm run dev` and build clean with `npm run build` — zero TS errors, zero console errors.

# THEME — AMOLED DARK FIRST + TOGGLE (CRITICAL)
- DEFAULT theme = AMOLED true black: background #000000, surfaces #0A0A0A / #111111, borders rgba(255,255,255,0.08)
- Accent palette: fiery red #FF3B30 → orange #FF8A00 gradient (steamed/chilli heat), fresh green accent #22C55E only for VEG dot, red dot for NON-VEG
- LIGHT theme: warm off-white #FFF8F0 background, ink #14100C text, same red-orange accent. Light theme must look equally designed — not an inverted afterthought.
- Theme toggle in navbar: Sun/Moon lucide icon, smooth 400ms cross-fade transition on background/color, choice saved in localStorage, respects prefers-color-scheme on first visit, NO flash of wrong theme (inline script in index.html before React mounts).
- Every component, image card, 3D canvas and shadow must work in BOTH themes. Hard-coded dark-only colors = FAILED.

# MENU DATA — BUILD THESE CATEGORIES & DISHES IN menu.ts
Each dish: id, name, category, veg:boolean, price (number or "ADD_PRICE"), spiceLevel 0-3, description (1 appetising line, Hinglish touch allowed), tags (bestseller / must-try / new / chef-special), image keyword.
Categories & dishes (minimum):
1. **Steam Momos** — Veg Steam, Paneer Steam, Chicken Steam, Corn & Cheese Steam
2. **Fried & Kurkure** — Veg Fried, Chicken Fried, Veg Kurkure, Paneer Kurkure, Chicken Kurkure (bestseller)
3. **Tandoori Momos** — Veg Tandoori, Paneer Tandoori, Chicken Tandoori, Afghani Veg, Afghani Paneer, Afghani Chicken (bestseller)
4. **Gravy Momos** — Makhani Gravy, Kadai Gravy, Chilli Gravy, Butter Masala Gravy (Veg / Paneer / Chicken variants)
5. **Special / Fusion** — Cheese Burst, Pizza Momos, Peri Peri Momos, Malai Momos, Jhol Achar Momos
6. **Platters** — Veg Platter, Non-Veg Platter, Mixed Crazy Platter (bestseller)
7. **Sides & Chinese** — Veg Spring Rolls, Hakka Noodles, Fried Rice, Honey Chilli Potato, Chilli Paneer Dry, Manchurian, Peri Peri Fries, Potato Twister (shop's own post highlights this), Masala Fries
8. **Combos** — Momo + Fries + Drink combo cards (exact combo contents = editable data in menu.ts, owner will confirm)
9. **Beverages & Chutney Specials** — Cold Drink, Virgin Mint Mojito (if served), Extra Spicy Red Chutney highlight card
Signature dishes for the 360° showcase (exactly these 6): Chicken Kurkure Momos, Afghani Chicken Momos, Paneer Tandoori Momos, Cheese Burst Momos, Veg Steam Momos (Hero Classic), Crazy Mixed Platter.

# 360° 3D DISH VIEWER — THE HERO FEATURE (DO NOT SKIP / DO NOT FAKE WITH A STATIC IMAGE)
- Every signature dish gets a real interactive 360° viewer:
  - Implementation A (preferred): React Three Fiber scene — a stylised 3D plate (cylinder + rim), momos as smooth rounded geometry (sphere squashed + pleated top knot via torus knot / lathe geometry), steam particles floating up (animated points), studio lighting (key + rim), Environment preset, ContactShadows.
  - Controls: drag to rotate 360° (OrbitControls with enablePan=false, min/max polar angle locked), scroll/pinch to zoom, auto-rotate that pauses on interaction and resumes after 3s idle.
  - Implementation B (fallback if model too heavy): 36-frame turntable image sequence, drag scrubs frames — must still feel like true 360°.
- Viewer opens as a full-screen immersive modal/section per dish with: dish name in giant display type, price, spice meter, veg dot, description, quantity stepper, "Add to Order List", "Order on WhatsApp" (pre-filled message with dish + qty).
- In the menu grid, hovering a signature dish card shows a slow auto-rotating preview; a "360° View" button with Rotate3d icon opens the full viewer.
- Performance: lazy-load the 3D canvas (React.lazy), DPR capped at 2, pause rendering when off-screen/modal closed.

# SECTIONS — ALL MANDATORY, IN THIS ORDER
1. **Preloader** — logo mark "CMC" / momo icon drawing itself (SVG stroke animation), percentage counter 0→100, curtain lift exit. Max 1.8s, skippable on click.
2. **Announcement marquee** — infinite scrolling strip: "FRESH • HOT • STEAMED TO ORDER • UTTAM NAGAR • CALL 88260 18524 •" repeating, slight rotate(-2deg), red gradient bg.
3. **Navbar** — glass blur, logo + name, links (Home, 360° Specials, Menu, Why Us, Gallery, Reviews, Visit Us), theme toggle, "Order Now" magnetic button, mobile hamburger with full-screen animated menu. Shrinks + adds border on scroll.
4. **HERO** — full viewport, AMOLED black, giant display typography "CRAZY MOMO CORNER" with:
   - **Typing effect** rotating words with blinking cursor: "STEAM MOMOS", "KURKURE MOMOS", "TANDOORI MOMOS", "AFGHANI MOMOS", "GRAVY MOMOS" (type → hold → delete loop, variable speed, never layout-shift).
   - A rotating 360° hero dish (R3F canvas or turntable) floating right/centre with glow, steam, parallax on mouse move.
   - Floating badge chips (★5.0 Rated, Uttam Nagar, Till 11 PM), CTA buttons: "Explore Menu", "Order on WhatsApp", scroll indicator.
   - Background: subtle grain, radial red glow, floating blurred momo/chilli shapes with parallax layers.
5. **Stats strip** — animated counters on scroll into view: 5.0 rating, 29+ happy ratings, 30+ dishes, 7 days open.
6. **Signature 360° Showcase** — pinned GSAP ScrollTrigger section: as user scrolls, dishes change one by one (scroll-driven story), big index number 01–06, name cross-fades, 360 viewer stays centre. On mobile: snap-scroll horizontal cards with same viewer.
7. **Full Menu** — sticky category tabs + search box + Veg Only toggle + Spice filter. Cards: image, veg/non-veg dot, name, desc, spice meter (flame icons), price, tags, "+ Add" button, 360 button where signature. Layout animates with Framer Motion layout on filter. "ADD_PRICE" items show "Price — shop par confirm karein" instead of a fake number.
8. **Order List (mini cart)** — items added from menu collect in a slide-in drawer: qty +/-, total only when all prices are numbers (otherwise show "Total shop par confirm hoga"), one-tap "Send Order on WhatsApp" that builds a clean formatted WhatsApp message (dish × qty lines) to +91 88260 18524, and "Call to Order".
9. **Why Crazy Momo Corner** — 4 cards with icons + scroll reveal: Fresh dough daily, Loaded filling, Signature spicy chutney, Pocket-friendly. Add a horizontal-scroll "From Steam to Sizzle" process strip: Dough → Filling → Pleating → Steaming/Tandoor → Chutney → Serve (6 steps).
10. **Gallery** — masonry grid, hover zoom + caption, click lightbox with arrows/keyboard, images lazy-loaded (use high-quality Unsplash momos/dumplings/street-food photos via source URLs with food keywords; alt text on every image).
11. **Reviews** — ★5.0 headline, auto-scrolling testimonial marquee (pause on hover), review cards written generically about taste/chutney/kurkure crunch WITHOUT fake person names/photos — use initials avatars + "Justdial review" label.
12. **Offers strip** — 2–3 offer cards as editable data in site.ts with a clear "Offer shop par confirm karein" note (do NOT invent a specific % discount as fact — use placeholder text field OFFER_TEXT the owner can edit).
13. **Visit Us** — full address "Shop No. 12, Plot No. O-1, Block O, Vijay Vihar, Uttam Nagar, New Delhi – 110059", timing "Open Daily 5:30 PM – 11:00 PM", big Call button, WhatsApp button, "Get Directions" button using the Maps link from BUSINESS DATA, embedded map iframe pinned to Vijay Vihar, Uttam Nagar.
14. **Instagram section** — "@crazymomocorner_uttamnagar" big handle, Follow button to the Instagram URL, grid of 6 food tiles that link out to Instagram.
15. **Footer** — name, quick links, categories, contact, timing, credit line "Made with ❤ in Uttam Nagar" (heart as lucide icon), back-to-top button.
16. **Floating buttons** — WhatsApp float (bottom-right, pulse ring) + Call float on mobile, appear after 400px scroll.

# ANIMATION & EFFECTS — ULTRA LEVEL, ALL REQUIRED
- Lenis smooth scroll + GSAP ScrollTrigger reveals: fade-up, stagger children, clip-path reveals for headings, image scale-from-1.2 parallax inside frames.
- Split-text effect: hero & section headings animate char-by-char / word-by-word on scroll.
- Marquees: at least 3 (announcement, big outlined text "MOMOS • MOMOS • MOMOS" behind menu, reviews).
- Magnetic buttons on primary CTAs, hover shine sweep on cards, tilt-on-hover (max 8deg) for signature cards.
- Custom cursor on desktop: dot + trailing ring that scales on interactive elements (disable on touch, keep native cursor as fallback).
- Scroll progress bar top (gradient), section numbers, active-nav highlighting via IntersectionObserver.
- Page micro-interactions: button ripples/tap scale, toast on "Added to order list", skeleton shimmer while images load.
- Respect prefers-reduced-motion: disable heavy animation. 60fps target — transform/opacity only, will-change sparingly.

# TYPOGRAPHY & DESIGN TOKENS
- Display font Anton, uppercase, tight tracking, sizes clamp() based — hero up to clamp(3.5rem, 12vw, 10rem).
- Section titles: Anton/Space Grotesk mix with one italic Caveat accent word in accent colour (e.g., "hamare *crazy* specials").
- Radius: cards 20–28px, buttons full-pill. Shadows: soft, warm-tinted in light theme; glow in dark.
- Consistent spacing scale, max-w-7xl containers, mobile-first responsive: 360px → 4K. Nothing overflows horizontally. Ever.

# SEO, META & SCHEMA
- index.html: title "Crazy Momo Corner — Best Momos in Uttam Nagar, Delhi", meta description with phone, Open Graph tags, theme-color #000000, favicon = inline SVG momo/CMC mark.
- JSON-LD Restaurant schema: name, telephone +91-88260-18524, address (streetAddress "Shop No. 12, Plot No. O-1, Block O, Vijay Vihar", addressLocality Uttam Nagar, addressRegion Delhi, postalCode 110059, addressCountry IN), servesCuisine "Momos, Chinese, Fast Food", aggregateRating 5.0 / 29, sameAs Instagram URL, openingHours "Mo-Su 17:30-23:00".
- Semantic HTML5, aria-labels on icon buttons, alt text, focus-visible states, colour contrast AA in both themes.

# CODE QUALITY — STRICT RULES
- Component files: Preloader, Navbar, Hero, TypingText, Marquee, Stats, Showcase360, DishViewer360 (R3F), MenuSection, OrderDrawer, WhyUs, ProcessStrip, Gallery, Reviews, Offers, VisitUs, InstagramSection, Footer, FloatingButtons, CustomCursor, ThemeToggle — each in src/components/.
- All data ONLY in src/data/. No hard-coded phone/price/instagram anywhere else.
- No lorem ipsum anywhere. No "TODO" left in code. No dead buttons — every button either navigates, opens the viewer/drawer, calls, or opens WhatsApp.
- README.md at root: how to run, how to edit prices/menu (menu.ts), how to change phone/timing (site.ts), how the owner adds real dish photos to replace the 3D/Unsplash images.
- Final reply (after building) must include: file tree, how the 360 viewer works, checklist confirming every section above is done. If any requirement was cut, SAY SO explicitly — hiding a cut = FAILED.

# ACCEPTANCE CHECKLIST (verify before saying "done")
□ AMOLED black default + light theme toggle, saved, no flash  □ Typing effect in hero runs smoothly
□ 360° viewer: drag rotate + zoom + auto-rotate works for all 6 signature dishes  □ GSAP pinned showcase changes dishes on scroll
□ Menu: tabs + search + veg filter all actually filter  □ Order drawer builds a correct WhatsApp message to 8826018524
□ Every call button dials +918826018524  □ Instagram links all point to @crazymomocorner_uttamnagar
□ Mobile 360px: no overflow, floats don't cover content  □ Build passes, console clean, Lighthouse-style performance (lazy 3D, lazy images)

Build it now — complete, heavy, and beautiful. No shortcuts.

COPY TILL HERE ↑↑↑ END

---
## Chai Wala ki note (prompt ke bahar) — UPDATED 27 Oct, Instagram posts check karke
- Address MIL GAYA: Post #2 ki image par "SHOP NO. 12, VIJAY VIHAR, UTTAM NAGAR, NEW DELHI - 110059" aur sabse purani post (#11) ke caption me "Shop no 12, plot no 0-1, Block O, vijay vihar uttam nagar" — dono mila ke pura address prompt me daal diya hai.
- Timing bio se: **5:30 PM – 11 PM** (prompt me update).
- Post #2 caption se: Momos • Combos • Fries • Drinks + Potato Twister bhi milta hai — menu me add kar diya.
- Purani collab post me **20% discount code PROVIRATZONE** tha (June ka) — abhi valid hai ya nahi, owner se confirm kiye bina site par live mat karna; isiliye prompt ke offers me placeholder hi rakha hai.
- ⚠️ NUMBER CONFLICT: Tumne diya 88260 18524 (prompt me PRIMARY yahi hai), lekin Insta bio me 8384004337 aur post ki image me 96509 40495 hai. Site live karne se pehle owner se confirm kar lena kaun sa number final hai.
- Prices abhi bhi nahi mile — prompt me "ADD_PRICE" hi hai. Owner se menu photo leke menu.ts me daalna hoga.
