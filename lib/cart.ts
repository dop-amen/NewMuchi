export type CartItem = {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
  category?: string
  size?: string
  color?: string
  // Raw comma-separated options from the product, so the cart page can render pickers
  sizeOptions?: string
  colorOptions?: string
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function addToCart(item: Omit<CartItem, 'quantity'>) {
  const cart = getCart()
  const existing = cart.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1 })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function removeFromCart(id: number) {
  const cart = getCart().filter(i => i.id !== id)
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function updateQuantity(id: number, quantity: number) {
  const cart = getCart().map(i => i.id === id ? { ...i, quantity } : i)
  localStorage.setItem('cart', JSON.stringify(cart))
}

// Sets the chosen size/color for a specific cart line (picked from the cart page)
export function setCartItemVariant(id: number, updates: { size?: string; color?: string }) {
  const cart = getCart().map(i => i.id === id ? { ...i, ...updates } : i)
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function clearCart() {
  localStorage.removeItem('cart')
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + item.price * item.quantity, 0)
}

// True only when every item in the cart is a wallet (used for delivery-charge tier)
export function isWalletOnlyCart(cart: CartItem[]): boolean {
  if (cart.length === 0) return false
  return cart.every(item => item.category?.toLowerCase().includes('wallet'))
}

// True only when every cart item that has size/color options has a selection made
export function isCartVariantComplete(cart: CartItem[]): boolean {
  return cart.every(item => {
    const sizeOk = !item.sizeOptions || !!item.size
    const colorOk = !item.colorOptions || !!item.color
    return sizeOk && colorOk
  })
}