/**
 * Receipt calculation utilities.
 * Pure functions — no side effects, no dependencies.
 * @module utils/calc
 */

/**
 * Calculate subtotal from an items array.
 * Invalid entries (missing qty/price, negative) are treated as 0.
 * @param {Array<{ qty: number, price: number }>} items
 * @returns {number} Subtotal = sum(qty * price).
 */
export function calcSubtotal(items) {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, item) => {
    const qty = Number(item?.qty)
    const price = Number(item?.price)
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 0
    const safePrice = Number.isFinite(price) && price > 0 ? price : 0
    return sum + safeQty * safePrice
  }, 0)
}

/**
 * Calculate grand total from items, discount, and tax.
 * Negative discount/tax are clamped to 0.
 * @param {Object} params
 * @param {Array} params.items - Array of { qty, price }.
 * @param {number} [params.discount=0] - Absolute discount amount.
 * @param {number} [params.taxPercent=0] - Tax percentage (0-100).
 * @returns {{ subtotal: number, discount: number, taxAmount: number, total: number }}
 */
export function calcTotal({ items, discount = 0, taxPercent = 0 }) {
  const subtotal = calcSubtotal(items)
  const safeDiscount =
    Number.isFinite(discount) && discount > 0 ? discount : 0
  const safeTaxPercent =
    Number.isFinite(taxPercent) && taxPercent > 0 ? taxPercent : 0
  const afterDiscount = Math.max(0, subtotal - safeDiscount)
  const taxAmount = (afterDiscount * safeTaxPercent) / 100
  return {
    subtotal,
    discount: safeDiscount,
    taxAmount,
    total: afterDiscount + taxAmount,
  }
}

/**
 * Format a number as a localized currency string.
 * Falls back to "<CURRENCY> <number>" if locale/currency are invalid.
 * @param {number} value
 * @param {string} [locale='id-ID']
 * @param {string} [currency='IDR']
 * @returns {string}
 */
export function formatCurrency(value, locale = 'id-ID', currency = 'IDR') {
  const num = Number(value)
  const safeNum = Number.isFinite(num) ? num : 0
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(safeNum)
  } catch {
    return `${currency} ${safeNum.toFixed(0)}`
  }
}
