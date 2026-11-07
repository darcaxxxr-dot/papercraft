import { resolveTemplate, buildItemList } from '../src/utils/binding.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) console.log('✅', msg)
  else { console.error('❌ FAIL:', msg); failures++ }
}

// resolveTemplate
assert(resolveTemplate('Hello {{name}}', { name: 'World' }) === 'Hello World', 'Basic template resolution')
assert(resolveTemplate('{{ a }} and {{ b }}', { a: 'X', b: 'Y' }) === 'X and Y', 'Multiple placeholders')
assert(resolveTemplate('Missing {{unknown}}', { name: 'X' }) === 'Missing {{unknown}}', 'Unknown placeholder stays as-is')
assert(
  resolveTemplate('Hello {{name}}', { name: '' }) === 'Hello {{name}}',
  'Empty string preserves placeholder',
)
assert(
  resolveTemplate('Hello {{name}}', { name: null }) === 'Hello {{name}}',
  'Null preserves placeholder',
)
assert(resolveTemplate('Empty {{}}', {}) === 'Empty {{}}', 'Empty placeholder handled')
assert(resolveTemplate('', { a: 1 }) === '', 'Empty string handled')
assert(resolveTemplate(null, {}) === '', 'Null handled')
assert(resolveTemplate('{{num}}', { num: 0 }) === '0', 'Zero handled as string')

// buildItemList
const items = [
  { name: 'A', qty: 2, price: 1000 },
  { name: 'B', qty: 1, price: 5000 }
]
const built = buildItemList(items)
assert(built.length === 2, 'buildItemList returns correct length')
assert(built[0].subtotal === 2000, 'buildItemList calculates subtotal correctly')
assert(built[1].name === 'B', 'buildItemList preserves name')
assert(buildItemList(null).length === 0, 'buildItemList handles null')

// buildItemList with invalid data
const dirty = [{ name: 'C', qty: '2', price: '500' }]
const builtDirty = buildItemList(dirty)
assert(builtDirty[0].qty === 2, 'buildItemList coerces string qty to number')
assert(builtDirty[0].price === 500, 'buildItemList coerces string price to number')
assert(builtDirty[0].subtotal === 1000, 'buildItemList calculates subtotal from coerced numbers')

console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
