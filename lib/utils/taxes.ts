// Configuration des taxes
export const TAX_RATE = 0.20 // TVA de 20% (standard en Russie)
export const FREE_SHIPPING_THRESHOLD = 10000 // Livraison gratuite à partir de 10000 ₽
export const SHIPPING_COST = 500 // Coût de livraison standard

export interface PriceBreakdown {
  subtotal: number
  tax: number
  shipping: number
  total: number
}

/**
 * Calcule le détail des prix avec taxes et livraison
 */
export function calculatePriceBreakdown(subtotal: number): PriceBreakdown {
  const tax = subtotal * TAX_RATE
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + tax + shipping

  return {
    subtotal,
    tax,
    shipping,
    total,
  }
}

/**
 * Formate un prix en roubles
 */
export function formatPrice(price: number, locale: string = 'ru-RU'): string {
  return `${price.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`
}
