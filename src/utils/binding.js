import { calcTotal } from './calc.js'

export function resolveTemplate(template, data) {
  if (!template || typeof template !== 'string') return ''
  if (!data) return template

  const totals = calcTotal({
    items: data.items || [],
    discount: data.discount || 0,
    taxPercent: data.taxPercent || 0,
  })

  // Suntikkan semua nilai kalkulasi ke dalam data
  const virtualData = {
    ...data,
    subtotal: totals.subtotal,
    discount: totals.discount,
    taxAmount: totals.taxAmount,
    total: totals.total,
  }

  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
    const cleanKey = key.trim()
    const value = virtualData[cleanKey]

    if (value === undefined || value === null || value === '') {
      return match
    }

    const currencyKeys = ['total', 'price', 'subtotal', 'discount', 'taxAmount']
    if (currencyKeys.includes(cleanKey) && typeof value === 'number') {
      return new Intl.NumberFormat('id-ID').format(value)
    }

    return String(value)
  })
}

export function buildItemList(items) {
  if (!Array.isArray(items)) return []
  return items.map((item) => {
    const qty = Number(item.qty) || 0
    const price = Number(item.price) || 0
    return {
      name: item.name || '-',
      qty,
      price,
      subtotal: qty * price,
    }
  })
}
