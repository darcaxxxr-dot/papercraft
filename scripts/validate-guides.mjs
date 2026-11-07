import {
  ACTIONS,
  INITIAL_STATE,
  designerReducer,
} from '../src/context/designerReducer.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) console.log('✅', msg)
  else {
    console.error('❌ FAIL:', msg)
    failures++
  }
}

// Default state
assert(INITIAL_STATE.showGuides === true, 'INITIAL showGuides = true')

// TOGGLE_GUIDES: true → false
{
  const s = designerReducer(INITIAL_STATE, { type: ACTIONS.TOGGLE_GUIDES })
  assert(s.showGuides === false, 'TOGGLE_GUIDES: true → false')
  assert(s !== INITIAL_STATE, 'TOGGLE_GUIDES returns new state ref')
  assert(
    INITIAL_STATE.showGuides === true,
    'TOGGLE_GUIDES does not mutate initial state',
  )
  assert(
    s.paper === INITIAL_STATE.paper,
    'TOGGLE_GUIDES preserves paper reference (shallow spread)',
  )
}

// TOGGLE_GUIDES: false → true
{
  const off = { ...INITIAL_STATE, showGuides: false }
  const s = designerReducer(off, { type: ACTIONS.TOGGLE_GUIDES })
  assert(s.showGuides === true, 'TOGGLE_GUIDES: false → true')
}

// SET_PAPER preserves showGuides
{
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.SET_PAPER,
    payload: { widthMm: 80 },
  })
  assert(s.showGuides === true, 'SET_PAPER preserves showGuides')
}

console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
