export type Price = number | 'ADD_PRICE'
export interface Dish {
  id: string; name: string; category: string; veg: boolean;
  price: Price; fullPrice?: number; spice: 0|1|2|3;
  desc: string; tags?: string[]; img: string; signature?: boolean; color?: string;
}
export const ADD_PRICE_LABEL = 'Price — shop par confirm karein'
export const CATEGORIES = ['Steam Momos','Fried Momos','Pan Fried Momos','Kurkure Momos','Gravy Momos','Tandoori & Afghani','Special / Fusion','Platters','Sides & Chinese','Soups & Beverages'] as const
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
  d({id:'fried-paneer',name:'Paneer Fried Momos',category:'Fried Momos',veg:true,price:80,fullPrice:130,spice:2,desc:'Paneer bhara, kurkura fried — shaam ka star.',img:'img/fried.jpg'}),
  d({id:'fried-cheese-corn',name:'Cheese & Corn Fried Momos',category:'Fried Momos',veg:true,price:90,fullPrice:160,spice:1,desc:'Crunchy coating, melty cheese-corn centre.',img:'img/fried.jpg'}),
  // PAN FRIED
  d({id:'pan-veg',name:'Veg Pan Fried Momos',category:'Pan Fried Momos',veg:true,price:70,fullPrice:110,spice:2,desc:'Tawa par sekhe hue, halki charred edges ke saath.',img:'img/panfried.jpg'}),
  d({id:'pan-soya',name:'Soya Pan Fried Momos',category:'Pan Fried Momos',veg:true,price:80,fullPrice:130,spice:2,desc:'Pan-fried soya momos, smoky street flavour.',img:'img/panfried.jpg'}),
  d({id:'pan-paneer',name:'Paneer Pan Fried Momos',category:'Pan Fried Momos',veg:true,price:80,fullPrice:140,spice:2,desc:'Paneer momos tawa-fried, upar se masala chhidka.',tags:['must-try'],img:'img/panfried.jpg'}),
  // KURKURE
  d({id:'kurkure-veg',name:'Veg Kurkure Momos',category:'Kurkure Momos',veg:true,price:70,fullPrice:130,spice:2,desc:'Extra crunchy Kurkure style momos — upar se masala, andar full swad. Awaaz wala crunch!',img:'img/kurkure.jpg'}),
  d({id:'kurkure-soya',name:'Soya Kurkure Momos',category:'Kurkure Momos',veg:true,price:80,fullPrice:140,spice:2,desc:'Extra crunchy Kurkure style — soya filling, upar se masala, full swad.',img:'img/kurkure.jpg'}),
  d({id:'kurkure-paneer',name:'Paneer Kurkure Momos',category:'Kurkure Momos',veg:true,price:90,fullPrice:150,spice:2,desc:'Crunch ka king — extra crunchy Kurkure style, upar se masala. Sabse zyada bikne wala!',tags:['bestseller','chef-special'],img:'img/kurkure.jpg',signature:true,color:'#c4622d'}),
  d({id:'kurkure-cheese-corn',name:'Cheese & Corn Kurkure Momos',category:'Kurkure Momos',veg:true,price:100,fullPrice:170,spice:1,desc:'Kurkure crunch ke andar cheesy corn dil — upar se halka masala.',img:'img/kurkure.jpg'}),
  // GRAVY
  d({id:'gravy-veg',name:'Veg Gravy Momos',category:'Gravy Momos',veg:true,price:70,fullPrice:130,spice:3,desc:'Rich masala gravy me doobe momos — roti-bhool swad.',img:'img/gravy.jpg'}),
  d({id:'gravy-soya',name:'Soya Gravy Momos',category:'Gravy Momos',veg:true,price:80,fullPrice:140,spice:3,desc:'Soya momos spicy gravy ke saath, full meal feel.',img:'img/gravy.jpg'}),
  d({id:'gravy-paneer',name:'Paneer Gravy Momos',category:'Gravy Momos',veg:true,price:90,fullPrice:150,spice:3,desc:'Paneer momos makhani-masala gravy me.',img:'img/gravy.jpg'}),
  d({id:'gravy-cheese-corn',name:'Cheese & Corn Gravy Momos',category:'Gravy Momos',veg:true,price:100,fullPrice:170,spice:2,desc:'Creamy gravy + cheesy filling = crazy combo.',img:'img/gravy.jpg'}),
  // TANDOORI & AFGHANI (not on poster — ADD_PRICE)
  d({id:'tandoori-veg',name:'Veg Tandoori Momos',category:'Tandoori & Afghani',veg:true,price:'ADD_PRICE',spice:3,desc:'Tandoor ki aanch, smoky masala coating.',img:'img/paneer-nobg.webp'}),
  d({id:'tandoori-paneer',name:'Paneer Tandoori Momos',category:'Tandoori & Afghani',veg:true,price:'ADD_PRICE',spice:3,desc:'Charred paneer momos, mint chutney ke saath.',tags:['chef-special'],img:'img/paneer-nobg.webp',signature:true,color:'#b3502e'}),
  d({id:'afghani-veg',name:'Afghani Veg Momos',category:'Tandoori & Afghani',veg:true,price:'ADD_PRICE',spice:1,desc:'Malai-cream marinade, naram aur royal swad.',img:'img/gravy.jpg'}),
  d({id:'afghani-paneer',name:'Afghani Paneer Momos',category:'Tandoori & Afghani',veg:true,price:'ADD_PRICE',spice:1,desc:'Creamy afghani paneer momos — melt-in-mouth.',tags:['must-try'],img:'img/gravy.jpg',signature:true,color:'#e6d7b8'}),
  // SPECIAL / FUSION (ADD_PRICE)
  d({id:'pizza-momos',name:'Pizza Momos',category:'Special / Fusion',veg:true,price:'ADD_PRICE',spice:1,desc:'Pizza topping style momos — cheese, herbs, full fusion.',tags:['new'],img:'img/fried.jpg'}),
  d({id:'peri-peri-momos',name:'Peri Peri Momos',category:'Special / Fusion',veg:true,price:'ADD_PRICE',spice:3,desc:'Peri peri masala ka fiery twist.',tags:['new'],img:'img/kurkure.jpg'}),
  d({id:'malai-momos',name:'Malai Momos',category:'Special / Fusion',veg:true,price:'ADD_PRICE',spice:0,desc:'Malai gravy me naram momos, halka meetha touch.',img:'img/gravy.jpg'}),
  d({id:'jhol-momos',name:'Jhol Achar Momos',category:'Special / Fusion',veg:true,price:'ADD_PRICE',spice:2,desc:'Til-tel jhol achar ke saath Nepali style.',tags:['new'],img:'img/steam.jpg'}),
  // PLATTERS (ADD_PRICE)
  d({id:'platter-veg',name:'Veg Platter',category:'Platters',veg:true,price:'ADD_PRICE',spice:2,desc:'Steam + fried + kurkure — ek plate me sab kuch.',img:'img/platter-nobg.webp'}),
  d({id:'platter-crazy',name:'Crazy Mixed Platter',category:'Platters',veg:true,price:'ADD_PRICE',spice:2,desc:'Sabhi best styles ek saath — group ke liye perfect.',tags:['bestseller'],img:'img/platter-nobg.webp',signature:true,color:'#a8742c'}),
  // SIDES & CHINESE (poster prices)
  d({id:'twister',name:'Potato Twister',category:'Sides & Chinese',veg:true,price:40,spice:2,desc:'Spiral potato on stick — 1 Pc ₹40, 2 Pcs ₹70. Shop ki shaan!',tags:['bestseller'],img:'img/twister-nobg.webp'}),
  d({id:'twister-cheese',name:'Liquid Cheese Potato Twister',category:'Sides & Chinese',veg:true,price:'ADD_PRICE',spice:2,desc:'Plain ya Kurkure twister — dono par garam liquid cheese ki baarish, upar se halka masala.',tags:['chef-special','new'],img:'img/cheese-nobg.webp',signature:true,color:'#e0a21a'}),
  d({id:'twister-kurkure',name:'Kurkure Potato Twister',category:'Sides & Chinese',veg:true,price:50,spice:2,desc:'Extra crunchy Kurkure style twister, upar se masala — 1 Pc ₹50, 2 Pcs ₹90.',img:'img/ktwister.jpg'}),
  d({id:'springroll-noodles',name:'Noodles Spring Roll',category:'Sides & Chinese',veg:true,price:40,spice:1,desc:'Noodles bhara crispy roll — 1 Pc ₹40, 2 Pcs ₹70.',img:'img/springroll.jpg'}),
  d({id:'springroll-kurkure',name:'Kurkure Spring Roll',category:'Sides & Chinese',veg:true,price:50,spice:2,desc:'Extra crunchy Kurkure style roll, upar se masala — 1 Pc ₹50, 2 Pcs ₹90.',img:'img/kspringroll.jpg'}),
  d({id:'fries-salted',name:'Salted Fries',category:'Sides & Chinese',veg:true,price:40,fullPrice:70,spice:0,desc:'Classic golden fries, halka namak.',img:'img/fries.jpg'}),
  d({id:'fries-peri',name:'Peri Peri Fries',category:'Sides & Chinese',veg:true,price:50,fullPrice:80,spice:3,desc:'Peri peri masala fries — teekha aur tangy.',img:'img/fries.jpg'}),
  d({id:'noodles-chowmin',name:'Veg Chowmin',category:'Sides & Chinese',veg:true,price:60,fullPrice:100,spice:2,desc:'Sirf delivery ke liye — street style chowmin.',img:'img/noodles.jpg'}),
  d({id:'noodles-garlic',name:'Veg Garlic Chowmin',category:'Sides & Chinese',veg:true,price:80,fullPrice:130,spice:2,desc:'Sirf delivery — lehsun ka tadka chowmin.',img:'img/noodles.jpg'}),
  d({id:'noodles-singapuri',name:'Singapuri Noodles',category:'Sides & Chinese',veg:true,price:90,fullPrice:140,spice:3,desc:'Sirf delivery — curry-masala Singapuri style.',img:'img/noodles.jpg'}),
  d({id:'noodles-hakka',name:'Hakka Noodles',category:'Sides & Chinese',veg:true,price:90,fullPrice:140,spice:2,desc:'Sirf delivery — wok tossed hakka noodles.',img:'img/noodles.jpg'}),
  d({id:'chilli-potato',name:'Chilli Potato',category:'Sides & Chinese',veg:true,price:100,fullPrice:150,spice:3,desc:'Crispy potato fingers, spicy chilli sauce me.',img:'img/chilli.jpg'}),
  d({id:'honey-chilli-potato',name:'Honey Chilli Potato',category:'Sides & Chinese',veg:true,price:110,fullPrice:160,spice:2,desc:'Meetha-teekha honey chilli glaze.',img:'img/chilli.jpg'}),
  d({id:'manchurian',name:'Veg Manchurian Gravy',category:'Sides & Chinese',veg:true,price:110,fullPrice:160,spice:2,desc:'Veg manchurian balls, garma-garam gravy me.',img:'img/manchurian.jpg'}),
  // SOUPS & BEVERAGES
  d({id:'soup-tomato',name:'Tomato Soup',category:'Soups & Beverages',veg:true,price:50,spice:0,desc:'Winter special — 1 glass garam tomato soup.',img:'img/soup.jpg'}),
  d({id:'soup-mixveg',name:'Mix Veg Soup',category:'Soups & Beverages',veg:true,price:50,spice:0,desc:'Winter special — sabziyon wala garam soup, 1 glass.',img:'img/soup.jpg'}),
  d({id:'coldrink',name:'Cold Drink (MRP par)',category:'Soups & Beverages',veg:true,price:'ADD_PRICE',spice:0,desc:'Coke, Sprite, Fanta, Pepsi — MRP par uplabdh.',img:'img/fries.jpg'}),
  d({id:'mojito',name:'Virgin Mint Mojito',category:'Soups & Beverages',veg:true,price:'ADD_PRICE',spice:0,desc:'Taaza pudina mojito — momos ke saath perfect pair.',tags:['new'],img:'img/soup.jpg'}),
]
export const SIGNATURES = MENU.filter(m => m.signature)
export const priceLabel = (dish: Dish) => dish.price === 'ADD_PRICE' ? ADD_PRICE_LABEL : `₹${dish.price}${dish.fullPrice ? ` / ₹${dish.fullPrice}` : ''}`
