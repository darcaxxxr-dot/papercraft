// Mock localStorage untuk Node.js
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null },
  setItem(key, value) { this.store[key] = value },
  removeItem(key) { delete this.store[key] },
  clear() { this.store = {} }
}

import { saveTemplate, loadTemplate, getAllTemplates, deleteTemplate } from '../src/utils/storage.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) console.log('✅', msg)
  else { console.error('❌ FAIL:', msg); failures++ }
}

const dummyState = { paper: { widthMm: 58 }, elements: [], data: { storeName: 'Test' } }

saveTemplate('Toko A', dummyState)
assert(getAllTemplates()['Toko A'].data.storeName === 'Test', 'saveTemplate saves correctly')

const loaded = loadTemplate('Toko A')
assert(loaded.paper.widthMm === 58, 'loadTemplate returns correct data')

deleteTemplate('Toko A')
assert(getAllTemplates()['Toko A'] === undefined, 'deleteTemplate removes correctly')
assert(loadTemplate('Unknown') === null, 'loadTemplate returns null if not found')

// Test File I/O Parsers (mock Blob/URL tidak diperlukan untuk test parser)
import { parseFileToState } from '../src/utils/storage.js'

const validJson = JSON.stringify({ paper: { widthMm: 58 }, elements: [], data: {} })
assert(parseFileToState(validJson) !== null, 'parseFileToState handles valid JSON')
assert(parseFileToState('invalid json') === null, 'parseFileToState rejects invalid JSON')

console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
