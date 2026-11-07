/**
 * Element factory and schema definitions.
 * @module utils/elements
 */

export const ELEMENT_TYPES = {
  TEXT: 'text',
  DYNAMIC_TEXT: 'dynamicText',
  ITEM_LIST: 'itemList',
  IMAGE: 'image',
  BARCODE: 'barcode',
  QR: 'qr',
  DIVIDER: 'divider',
}

/**
 * Generate a unique element ID.
 * @returns {string}
 */
export function generateId() {
  return `el_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Get default properties for each element type.
 * @param {string} type
 * @returns {Object}
 */
function getDefaultProps(type) {
  switch (type) {
    case ELEMENT_TYPES.TEXT:
      return { content: 'Teks Baru', fontSize: 12, bold: false, italic: false, align: 'left', fontFamily: 'monospace' }
    case ELEMENT_TYPES.DYNAMIC_TEXT:
      return { binding: '{{storeName}}', fontSize: 12, bold: false, italic: false, align: 'left', fontFamily: 'monospace' }
    case ELEMENT_TYPES.ITEM_LIST:
      return { fontSize: 10, align: 'left', showPrice: true, fontFamily: 'monospace', bold: false, italic: false }
    case ELEMENT_TYPES.IMAGE:
      return { src: '', alt: 'Logo' }
    case ELEMENT_TYPES.BARCODE:
      return { value: '1234567890', format: 'CODE128', height: 40 }
    case ELEMENT_TYPES.QR:
      return { value: 'https://example.com', size: 40 }
    case ELEMENT_TYPES.DIVIDER:
      return { thickness: 1, style: 'solid', color: '#000000' }
    default:
      return {}
  }
}

/**
 * Create a new element object.
 * @param {string} type - One of ELEMENT_TYPES.
 * @param {Object} [overrides={}] - Overrides for x, y, w, h, or props.
 * @returns {Object} Element object.
 */
export function createElement(type, overrides = {}) {
  if (!Object.values(ELEMENT_TYPES).includes(type)) {
    throw new Error(`Unknown element type: ${type}`)
  }

  // Tentukan tinggi default berdasarkan tipe
  // Item List butuh ruang lebih besar (30mm) agar teks tidak terpotong
  let defaultHeight = 10
  if (type === ELEMENT_TYPES.ITEM_LIST) defaultHeight = 30
  if (type === ELEMENT_TYPES.IMAGE) defaultHeight = 20

  return {
    id: generateId(),
    type,
    x: 2,
    y: 2,
    w: 50,
    h: defaultHeight,
    zIndex: 0,
    props: getDefaultProps(type),
    ...overrides,
    props: { ...getDefaultProps(type), ...(overrides.props || {}) },
  }
}
