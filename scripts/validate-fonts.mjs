import { createElement, ELEMENT_TYPES } from '../src/utils/elements.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) console.log('✅', msg)
  else { console.error('❌ FAIL:', msg); failures++ }
}

const textEl = createElement(ELEMENT_TYPES.TEXT)
assert(textEl.props.fontFamily === 'monospace', 'Default font is monospace')
assert(textEl.props.bold === false, 'Default bold is false')
assert(textEl.props.italic === false, 'Default italic is false')

console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
