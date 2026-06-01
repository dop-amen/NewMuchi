export interface Product {
  id: string
  name: string
  nameBn?: string
  price: number
  originalPrice?: number
  image: string
  category: 'men' | 'women' | 'casual' | 'formal' | 'accessories'
  description: string
  sizes: string[]
  inStock: boolean
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  date: string
  productId?: string
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Brown Leather Sandal',
    nameBn: 'ক্লাসিক ব্রাউন লেদার স্যান্ডেল',
    price: 1499,
    originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop',
    category: 'men',
    description: 'Handcrafted premium leather sandal with cushioned sole for all-day comfort. Perfect for casual outings and everyday wear.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Tan Formal Leather Sandal',
    nameBn: 'ট্যান ফর্মাল লেদার স্যান্ডেল',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop',
    category: 'formal',
    description: 'Elegant formal sandal crafted from genuine leather. Ideal for office wear and formal occasions.',
    sizes: ['39', '40', '41', '42', '43'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Women Casual Kolhapuri',
    nameBn: 'মহিলাদের ক্যাজুয়াল কলহাপুরি',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
    category: 'women',
    description: 'Traditional Kolhapuri style sandal with modern comfort. Handstitched with premium leather.',
    sizes: ['36', '37', '38', '39', '40'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Premium Leather Belt',
    nameBn: 'প্রিমিয়াম লেদার বেল্ট',
    price: 899,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500&h=500&fit=crop',
    category: 'accessories',
    description: 'Genuine leather belt with brass buckle. Durable and stylish accessory for any outfit.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Casual Comfort Slide',
    nameBn: 'ক্যাজুয়াল কমফোর্ট স্লাইড',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
    category: 'casual',
    description: 'Ultra-comfortable slide sandal with memory foam insole. Perfect for home and casual outings.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Leather Wallet',
    nameBn: 'লেদার ওয়ালেট',
    price: 699,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop',
    category: 'accessories',
    description: 'Bifold leather wallet with multiple card slots and coin pocket. Compact yet spacious design.',
    sizes: ['One Size'],
    inStock: true,
  },
]

export const reviews: Review[] = [
  {
    id: '1',
    name: 'রাহুল আহমেদ',
    rating: 5,
    comment: 'অসাধারণ মানের স্যান্ডেল! খুব আরামদায়ক এবং দেখতেও সুন্দর। ডেলিভারিও সময়মতো হয়েছে।',
    date: '2024-03-15',
    productId: '1',
  },
  {
    id: '2',
    name: 'সাবরিনা খান',
    rating: 5,
    comment: 'আমার জন্য পারফেক্ট! লেদারের কোয়ালিটি অনেক ভালো। আবারও অর্ডার করব।',
    date: '2024-03-10',
    productId: '3',
  },
  {
    id: '3',
    name: 'মাহমুদ হাসান',
    rating: 4,
    comment: 'ভালো প্রোডাক্ট, দাম অনুযায়ী মান ঠিক আছে। সার্ভিসও ভালো ছিল।',
    date: '2024-03-08',
    productId: '2',
  },
  {
    id: '4',
    name: 'নাজমুল ইসলাম',
    rating: 5,
    comment: 'ঈদের আগে অর্ডার দিয়েছিলাম, সময়মতো পেয়েছি। প্রোডাক্ট দেখে খুশি হয়েছি।',
    date: '2024-03-05',
    productId: '1',
  },
  {
    id: '5',
    name: 'ফারিয়া রহমান',
    rating: 5,
    comment: 'বেল্টটা অনেক সুন্দর, হাজব্যান্ডের জন্য নিয়েছিলাম। ও অনেক পছন্দ করেছে।',
    date: '2024-02-28',
    productId: '4',
  },
  {
    id: '6',
    name: 'তানভীর হক',
    rating: 4,
    comment: 'কোয়ালিটি ভালো, তবে সাইজ একটু বড় হয়েছে। পরের বার ছোট সাইজ নেব।',
    date: '2024-02-25',
    productId: '5',
  },
]

export const WHATSAPP_NUMBER = '+8801969592755'

export function getWhatsAppLink(message: string): string {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/88${WHATSAPP_NUMBER}?text=${encodedMessage}`
}
