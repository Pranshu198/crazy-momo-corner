export const SITE = {
  name: 'Crazy Momo Corner',
  tagline: 'Uttam Nagar ke sabse crazy momos',
  phoneDisplay: '+91 88260 18524',
  phoneTel: 'tel:+918826018524',
  whatsapp: 'https://wa.me/918826018524?text=Hi%20Crazy%20Momo%20Corner!%20Mujhe%20order%20karna%20hai.',
  whatsappBase: 'https://wa.me/918826018524?text=',
  instagram: 'https://www.instagram.com/crazymomocorner_uttamnagar',
  instagramHandle: '@crazymomocorner_uttamnagar',
  address: 'Shop No. 12, Plot No. O-1, Block O, Vijay Vihar, Uttam Nagar, New Delhi – 110059',
  area: 'Uttam Nagar, New Delhi',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Crazy+Momo+Corner+Vijay+Vihar+Uttam+Nagar+New+Delhi+110059',
  mapsEmbed: 'https://www.google.com/maps?q=Vijay+Vihar,+Uttam+Nagar,+New+Delhi+110059&output=embed',
  timing: 'Open Daily — 5:30 PM to 11:00 PM',
  timingShort: '5:30 PM – 11:00 PM',
  freeThreshold: 200,
  freeRadiusKm: 1,
  announcement: '',
  rating: 5.0,
  ratingCount: 29,
  freeDelivery: 'Free Home Delivery within 1 KM on orders above ₹200',
  offers: [
    { title: 'Offer 1', text: 'OFFER_TEXT — owner yahan current offer daalein' },
    { title: 'Offer 2', text: 'OFFER_TEXT — owner yahan current offer daalein' },
    { title: 'Offer 3', text: 'OFFER_TEXT — owner yahan current offer daalein' },
  ],
  offerNote: 'Offer shop par confirm karein',
}
export const waLink = (msg: string, base: string = SITE.whatsappBase) => base + encodeURIComponent(msg)
/** Admin password — abhi khaali hai (koi password nahi). Owner baad me yahan set karega. */
export const ADMIN_PASSWORD = ''
/** Orders receive karne ke liye endpoint (FormSubmit AJAX URL jaisa). Khaali = orders sirf WhatsApp + usi device ke localStorage me. */
export const ORDER_ENDPOINT = ''
/** ntfy cross-device order notifications — topic ek secret password jaisa hai, kisi ke saath share mat karo */
export const NTFY_SERVER = 'https://ntfy.sh'
export const NTFY_TOPIC = 'cmc-orders-w4mzmliynmpw'
