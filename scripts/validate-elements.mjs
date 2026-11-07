import { createElement, ELEMENT_TYPES } from '../src/utils/elements.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) console.log('✅', msg)
  else { console.error('❌ FAIL:', msg); failures++ }
}

// Factory tests
const textEl = createElement(ELEMENT_TYPES.TEXT)
assert(textEl.id.startsWith('el_'), 'ID generated correctly')
assert(textEl.type === 'text', 'Type set correctly')
assert(textEl.x === 2 && textEl.y === 2, 'Default position correct')
assert(textEl.props.content === 'Teks Baru', 'Default content correct')

const barcodeEl = createElement(ELEMENT_TYPES.BARCODE, { y: 20 })
assert(barcodeEl.y === 20, 'Override y works')
assert(barcodeEl.props.format === 'CODE128', 'Default barcode format correct')

const qrEl = createElement(ELEMENT_TYPES.QR, { props: { size: 50 } })
assert(qrEl.props.size === 50, 'Props override works')
assert(qrEl.props.value === 'https://example.com', 'Default QR value preserved')

try {
  createElement('unknown_type')
  assert(false, 'Unknown type throws error')
} catch (err) {
  assert(err.message.includes('Unknown element type'), 'Unknown type throws error')
}

console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
