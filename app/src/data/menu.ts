export type Price = number | 'ADD_PRICE'
export interface Dish {
  id: string; name: string; category: string; veg: boolean;
  price: Price; fullPrice?: number; spice: 0|1|2|3;
  desc: string; tags?: string[]; img: string; signature?: boolean; color?: string;
  /** Admin overrides se runtime par set hota hai */
  soldOut?: boolean;
  /** Price block labels (default HALF / FULL; pieces ke liye 1 PC / 2 PCS) */
  halfLabel?: string; fullLabel?: string;
}
export const ADD_PRICE_LABEL = 'Price — shop par confirm karein'
export const CATEGORIES = ['Steam Momos','Fried Momos','Kurkure Momos','Gravy Momos','Sides & Chinese','Soups & Beverages'] as const
const d = (x: Dish) => x
export const MENU: Dish[] = [
  // STEAM (poster prices, half/full)
  d({id:'steam-veg',name:'Veg Steam Momos',category:'Steam Momos',veg:true,price:50,fullPrice:90,spice:1,desc:'Soft, juicy, fresh dough — classic street style, lal chutney ke saath.',tags:['bestseller'],img:'img/steam.jpg',signature:true,color:'#e8e3d5'}),
  d({id:'steam-soya',name:'Soya Steam Momos',category:'Steam Momos',veg:true,price:60,fullPrice:110,spice:1,desc:'Protein-loaded soya filling, halka masala, full swad.',img:'img/steam.jpg'}),
  d({id:'steam-paneer',name:'Paneer Steam Momos',category:'Steam Momos',veg:true,price:70,fullPrice:120,spice:1,desc:'Naram paneer filling, har bite me creamy feel.',tags:['must-try'],img:'img/steam.jpg'}),
  d({id:'steam-cheese-corn',name:'Cheese & Corn Steam Momos',category:'Steam Momos',veg:true,price:80,fullPrice:150,spice:0,desc:'Cheesy corn filling — bachon ka favourite.',img:'img/steam.jpg'}),
  // FRIED
  d({id:'fried-veg',name:'Veg Fried Momos',category:'Fried Momos',veg:true,price:60,fullPrice:100,spice:2,desc:'Golden crispy bahar, juicy andar — perfect crunch.',img:'img/fried.jpg'}),
  d({id:'fried-soya',name:'Soya Fried Momos',category:'Fried Momos',veg:true,price:70,fullPrice:120,spice:2,desc:'Crispy soya momos, chutney ke saath double maza.',img:'img/fried.jpg'}),
  d({id:'fried-paneer',name:'Paneer Fried Momos',category:'Fried Momos',veg:true,price:80,fullPrice:130,spice:2,desc:'Paneer bhara, kurkura fried — shaam ka star.',tags:['must-try'],img:'img/fried.jpg',signature:true,color:'#e09a2e'}),
  d({id:'fried-cheese-corn',name:'Cheese & Corn Fried Momos',category:'Fried Momos',veg:true,price:90,fullPrice:160,spice:1,desc:'Crunchy coating, melty cheese-corn centre.',img:'img/fried.jpg'}),
  // KURKURE
  d({id:'kurkure-veg',name:'Veg Kurkure Momos',category:'Kurkure Momos',veg:true,price:70,fullPrice:130,spice:2,desc:'Extra crunchy Kurkure style momos — upar se masala, andar full swad. Awaaz wala crunch!',img:'img/kurkure.jpg'}),
  d({id:'kurkure-soya',name:'Soya Kurkure Momos',category:'Kurkure Momos',veg:true,price:80,fullPrice:140,spice:2,desc:'Extra crunchy Kurkure style — soya filling, upar se masala, full swad.',img:'img/kurkure.jpg'}),
  d({id:'kurkure-paneer',name:'Paneer Kurkure Momos',category:'Kurkure Momos',veg:true,price:90,fullPrice:150,spice:2,desc:'Crunch ka king — extra crunchy Kurkure style, upar se masala. Sabse zyada bikne wala!',tags:['bestseller','chef-special'],img:'img/kurkure.jpg',signature:true,color:'#d97c1e'}),
  d({id:'kurkure-cheese-corn',name:'Cheese & Corn Kurkure Momos',category:'Kurkure Momos',veg:true,price:100,fullPrice:170,spice:1,desc:'Kurkure crunch ke andar cheesy corn dil — upar se halka masala.',img:'img/kurkure.jpg'}),
  // GRAVY
  d({id:'gravy-veg',name:'Veg Gravy Momos',category:'Gravy Momos',veg:true,price:70,fullPrice:130,spice:3,desc:'Rich masala gravy me doobe momos — roti-bhool swad.',img:'img/gravy.jpg'}),
  d({id:'gravy-soya',name:'Soya Gravy Momos',category:'Gravy Momos',veg:true,price:80,fullPrice:140,spice:3,desc:'Soya momos spicy gravy ke saath, full meal feel.',img:'img/gravy.jpg'}),
  d({id:'gravy-paneer',name:'Paneer Gravy Momos',category:'Gravy Momos',veg:true,price:90,fullPrice:150,spice:3,desc:'Paneer momos makhani-masala gravy me.',img:'img/gravy.jpg'}),
  d({id:'gravy-cheese-corn',name:'Cheese & Corn Gravy Momos',category:'Gravy Momos',veg:true,price:100,fullPrice:170,spice:2,desc:'Creamy gravy + cheesy filling = crazy combo.',tags:['must-try'],img:'img/gravy.jpg',signature:true,color:'#e8641c'}),
  // SIDES & CHINESE (poster prices)
  d({id:'twister',name:'Potato Twister',category:'Sides & Chinese',veg:true,price:40,fullPrice:70,halfLabel:'1 PC',fullLabel:'2 PCS',spice:2,desc:'Spiral potato on stick — 1 Pc ₹40, 2 Pcs ₹70. Shop ki shaan!',tags:['bestseller'],img:'img/twister-nobg.webp'}),
  d({id:'twister-kurkure',name:'Kurkure Potato Twister',category:'Sides & Chinese',veg:true,price:50,fullPrice:90,halfLabel:'1 PC',fullLabel:'2 PCS',spice:2,desc:'Extra crunchy Kurkure style twister, upar se masala — 1 Pc ₹50, 2 Pcs ₹90.',img:'img/ktwister.webp',signature:true,color:'#d97c1e'}),
  d({id:'springroll-noodles',name:'Noodles Spring Roll',category:'Sides & Chinese',veg:true,price:40,fullPrice:70,halfLabel:'1 PC',fullLabel:'2 PCS',spice:1,desc:'Noodles bhara crispy roll — 1 Pc ₹40, 2 Pcs ₹70.',img:'img/springroll.webp'}),
  d({id:'springroll-kurkure',name:'Kurkure Spring Roll',category:'Sides & Chinese',veg:true,price:50,fullPrice:90,halfLabel:'1 PC',fullLabel:'2 PCS',spice:2,desc:'Extra crunchy Kurkure style roll, upar se masala — 1 Pc ₹50, 2 Pcs ₹90.',tags:['must-try'],img:'img/kspringroll.webp',signature:true,color:'#d97c1e'}),
  d({id:'fries-salted',name:'Salted Fries',category:'Sides & Chinese',veg:true,price:40,fullPrice:70,spice:0,desc:'Classic golden fries, halka namak.',img:'img/fries.webp'}),
  d({id:'fries-peri',name:'Peri Peri Fries',category:'Sides & Chinese',veg:true,price:50,fullPrice:80,spice:3,desc:'Peri peri masala fries — teekha aur tangy.',img:'img/fries.webp'}),
  d({id:'noodles-chowmin',name:'Veg Chowmin',category:'Sides & Chinese',veg:true,price:60,fullPrice:100,spice:2,desc:'Sirf delivery ke liye — street style chowmin.',img:'img/noodles.webp'}),
  d({id:'noodles-garlic',name:'Veg Garlic Chowmin',category:'Sides & Chinese',veg:true,price:80,fullPrice:130,spice:2,desc:'Sirf delivery — lehsun ka tadka chowmin.',img:'img/noodles.webp'}),
  d({id:'noodles-singapuri',name:'Singapuri Noodles',category:'Sides & Chinese',veg:true,price:90,fullPrice:140,spice:3,desc:'Sirf delivery — curry-masala Singapuri style.',img:'img/noodles.webp'}),
  d({id:'noodles-hakka',name:'Hakka Noodles',category:'Sides & Chinese',veg:true,price:90,fullPrice:140,spice:2,desc:'Sirf delivery — wok tossed hakka noodles.',img:'img/noodles.webp'}),
  d({id:'chilli-potato',name:'Chilli Potato',category:'Sides & Chinese',veg:true,price:100,fullPrice:150,spice:3,desc:'Crispy potato fingers, spicy chilli sauce me.',img:'img/chilli.webp'}),
  d({id:'honey-chilli-potato',name:'Honey Chilli Potato',category:'Sides & Chinese',veg:true,price:110,fullPrice:160,spice:2,desc:'Meetha-teekha honey chilli glaze.',img:'img/chilli.webp'}),
  d({id:'manchurian',name:'Veg Manchurian Gravy',category:'Sides & Chinese',veg:true,price:110,fullPrice:160,spice:2,desc:'Veg manchurian balls, garma-garam gravy me.',img:'img/manchurian.webp'}),
  // SOUPS & BEVERAGES
  d({id:'soup-tomato',name:'Tomato Soup',category:'Soups & Beverages',veg:true,price:50,spice:0,desc:'Winter special — 1 glass garam tomato soup.',img:'img/soup.webp'}),
  d({id:'soup-mixveg',name:'Mix Veg Soup',category:'Soups & Beverages',veg:true,price:50,spice:0,desc:'Winter special — sabziyon wala garam soup, 1 glass.',img:'img/soup.webp'}),
  d({id:'coldrink',name:'Cold Drink (MRP par)',category:'Soups & Beverages',veg:true,price:'ADD_PRICE',spice:0,desc:'Coke, Sprite, Fanta, Pepsi — MRP par uplabdh.',img:'img/fries.webp'}),
]
export const SIGNATURES = MENU.filter(m => m.signature)
export const priceLabel = (dish: Dish) => dish.price === 'ADD_PRICE' ? ADD_PRICE_LABEL : `₹${dish.price}${dish.fullPrice ? ` / ₹${dish.fullPrice}` : ''}`
export const dishById = (id: string, menu: Dish[] = MENU) => menu.find(m => m.id === id)

// ---------- BUILD YOUR PLATE (saari prices poster matrix se, sirf yahi file se) ----------
export interface BSize { label: string; sub?: string; price: Price }
export interface BOption { id: string; label: string; desc?: string; img: string }
export interface BuilderCategory { id: string; label: string; accent: string; img: string; blurb: string }
export const BUILDER_CATEGORIES: BuilderCategory[] = [
  { id: 'momos', label: 'Momos', accent: 'apni plate banao', img: 'img/kurkure.jpg', blurb: 'Variant → style → plate size, step by step' },
  { id: 'twister', label: 'Potato Twister', accent: 'spiral wala star', img: 'img/twister-nobg.webp', blurb: 'Plain ya Kurkure — liquid cheese add-on ke saath' },
  { id: 'rolls', label: 'Spring Rolls', accent: 'crispy roll', img: 'img/springroll.webp', blurb: 'Noodles bhara ya extra crunchy Kurkure style' },
  { id: 'chinese', label: 'Noodles & Chinese', accent: 'wok se seedha', img: 'img/noodles.webp', blurb: 'Chowmin, hakka, chilli potato, manchurian (sirf delivery)' },
  { id: 'fries', label: 'Fries & Sides', accent: 'side me best', img: 'img/fries.webp', blurb: 'Salted ya fiery peri peri fries' },
  { id: 'soups', label: 'Soups', accent: 'garam ghunt', img: 'img/soup.webp', blurb: 'Winter special garam soup, 1 glass' },
]
export const MOMO_VARIANTS: BOption[] = [
  { id: 'veg', label: 'Veg', desc: 'Mixed veg masala filling', img: 'img/steam.jpg' },
  { id: 'soya', label: 'Soya', desc: 'Protein-loaded soya filling', img: 'img/steam.jpg' },
  { id: 'paneer', label: 'Paneer', desc: 'Naram creamy paneer filling', img: 'img/steam.jpg' },
  { id: 'cheese-corn', label: 'Cheese & Corn', desc: 'Cheesy corn filling', img: 'img/steam.jpg' },
]
export const MOMO_STYLES: BOption[] = [
  { id: 'steam', label: 'Steam', desc: 'Bhaap me naram-naram, classic', img: 'img/steam.jpg' },
  { id: 'fried', label: 'Fried', desc: 'Golden crispy bahar, juicy andar', img: 'img/fried.jpg' },
  { id: 'kurkure', label: 'Kurkure', desc: 'Extra crunchy style — upar se masala', img: 'img/kurkure.jpg' },
  { id: 'gravy', label: 'Gravy', desc: 'Rich masala gravy me dooba hua', img: 'img/gravy.jpg' },
]
export const MOMO_SIZES: BSize[] = [
  { label: 'Half Plate', sub: '5 Pcs', price: 0 },
  { label: 'Full Plate', sub: '10 Pcs', price: 0 },
]
/** Momos price matrix — MENU dishes se live lookup (id = `${style}-${variant}`) */
export const momoDish = (styleId: string, variantId: string, menu: Dish[] = MENU) => menu.find(m => m.id === `${styleId}-${variantId}`)
export interface PieceOption extends BOption { sizes: BSize[] }
export const TWISTER_OPTIONS: PieceOption[] = [
  { id: 'twister', label: 'Plain Twister', desc: 'Classic spiral potato, upar se masala', img: 'img/twister-nobg.webp', sizes: [{ label: '1 Pc', price: 40 }, { label: '2 Pcs', price: 70 }] },
  { id: 'twister-kurkure', label: 'Kurkure Twister', desc: 'Extra crunchy Kurkure style, upar se masala', img: 'img/ktwister.webp', sizes: [{ label: '1 Pc', price: 50 }, { label: '2 Pcs', price: 90 }] },
]
export const ROLL_OPTIONS: PieceOption[] = [
  { id: 'springroll-noodles', label: 'Noodles Spring Roll', desc: 'Noodles bhara crispy roll', img: 'img/springroll.webp', sizes: [{ label: '1 Pc', price: 40 }, { label: '2 Pcs', price: 70 }] },
  { id: 'springroll-kurkure', label: 'Kurkure Spring Roll', desc: 'Extra crunchy Kurkure style roll', img: 'img/kspringroll.webp', sizes: [{ label: '1 Pc', price: 50 }, { label: '2 Pcs', price: 90 }] },
]
export const CHINESE_IDS = ['noodles-chowmin', 'noodles-garlic', 'noodles-singapuri', 'noodles-hakka', 'chilli-potato', 'honey-chilli-potato', 'manchurian']
export const FRIES_IDS = ['fries-salted', 'fries-peri']
export const SOUP_IDS = ['soup-tomato', 'soup-mixveg']
/** Kisi bhi dish ke size options (Half/Full, 1 Pc/2 Pcs ya single serve) */
export const dishSizes = (dish: Dish): BSize[] =>
  dish.fullPrice
    ? [{ label: dish.halfLabel ? '1 Pc' : 'Half Plate', sub: dish.category.includes('Momos') ? '5 Pcs' : undefined, price: dish.price }, { label: dish.halfLabel ? '2 Pcs' : 'Full Plate', sub: dish.category.includes('Momos') ? '10 Pcs' : undefined, price: dish.fullPrice }]
    : [{ label: dish.category === 'Soups & Beverages' ? '1 Glass' : '1 Serve', price: dish.price }]
