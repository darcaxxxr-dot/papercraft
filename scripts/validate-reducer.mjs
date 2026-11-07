/**
 * Standalone validation for designerReducer.
 * Run: node scripts/validate-reducer.mjs
 * Exits non-zero on any failure.
 */
import {
  ACTIONS,
  INITIAL_STATE,
  designerReducer,
} from '../src/context/designerReducer.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) {
    console.log('✅', msg)
  } else {
    console.error('❌ FAIL:', msg)
    failures++
  }
}
const notSameRef = (a, b) => a !== b
const clone = (o) => JSON.parse(JSON.stringify(o))

// --- initial state sanity ---
assert(INITIAL_STATE.paper.widthMm === 58, 'INITIAL paper width = 58')
assert(INITIAL_STATE.paper.heightMm === 100, 'INITIAL paper height = 100')
assert(INITIAL_STATE.elements.length === 0, 'INITIAL elements empty')
assert(INITIAL_STATE.selectedElementId === null, 'INITIAL no selection')
assert(Array.isArray(INITIAL_STATE.data.items), 'INITIAL items is array')

// --- SET_PAPER ---
{
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.SET_PAPER,
    payload: { widthMm: 80 },
  })
  assert(s.paper.widthMm === 80, 'SET_PAPER sets widthMm=80')
  assert(s.paper.heightMm === 100, 'SET_PAPER preserves heightMm')
  assert(s.paper.preset === 'p58', 'SET_PAPER preserves preset')
  assert(notSameRef(s.paper, INITIAL_STATE.paper), 'SET_PAPER new paper ref')
  assert(notSameRef(s, INITIAL_STATE), 'SET_PAPER new state ref')
  assert(INITIAL_STATE.paper.widthMm === 58, 'SET_PAPER no mutation of initial')
}

// --- ADD_ELEMENT ---
{
  const el = { id: 'e1', type: 'text', x: 0, y: 0, w: 10, h: 10 }
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.ADD_ELEMENT,
    payload: el,
  })
  assert(s.elements.length === 1, 'ADD_ELEMENT appends')
  assert(s.elements[0].id === 'e1', 'ADD_ELEMENT stores correctly')
  assert(notSameRef(s.elements, INITIAL_STATE.elements), 'ADD_ELEMENT new array')
  assert(INITIAL_STATE.elements.length === 0, 'ADD_ELEMENT no mutation of initial')
}

// --- UPDATE_ELEMENT ---
{
  const base = {
    ...clone(INITIAL_STATE),
    elements: [
      { id: 'e1', x: 0, y: 0, w: 10 },
      { id: 'e2', x: 5, y: 5, w: 10 },
    ],
  }
  const s = designerReducer(base, {
    type: ACTIONS.UPDATE_ELEMENT,
    payload: { id: 'e1', patch: { x: 10 } },
  })
  assert(s.elements[0].x === 10, 'UPDATE_ELEMENT patches matching id')
  assert(s.elements[0].y === 0, 'UPDATE_ELEMENT preserves unspecified fields')
  assert(s.elements[1].x === 5, 'UPDATE_ELEMENT leaves other elements')
  assert(notSameRef(s.elements[0], base.elements[0]), 'UPDATE_ELEMENT new element ref')
}

// --- DELETE_ELEMENT (selected) ---
{
  const base = {
    ...clone(INITIAL_STATE),
    elements: [{ id: 'e1' }, { id: 'e2' }],
    selectedElementId: 'e1',
  }
  const s = designerReducer(base, {
    type: ACTIONS.DELETE_ELEMENT,
    payload: { id: 'e1' },
  })
  assert(s.elements.length === 1, 'DELETE_ELEMENT removes one')
  assert(s.elements[0].id === 'e2', 'DELETE_ELEMENT keeps correct one')
  assert(s.selectedElementId === null, 'DELETE_ELEMENT clears selection if matches')
}

// --- DELETE_ELEMENT (non-selected) ---
{
  const base = {
    ...clone(INITIAL_STATE),
    elements: [{ id: 'e1' }, { id: 'e2' }],
    selectedElementId: 'e1',
  }
  const s = designerReducer(base, {
    type: ACTIONS.DELETE_ELEMENT,
    payload: { id: 'e2' },
  })
  assert(s.selectedElementId === 'e1', 'DELETE_ELEMENT preserves selection if different')
}

// --- SELECT_ELEMENT ---
{
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.SELECT_ELEMENT,
    payload: { id: 'e1' },
  })
  assert(s.selectedElementId === 'e1', 'SELECT_ELEMENT sets id')
}

// --- SET_DATA ---
{
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.SET_DATA,
    payload: { storeName: 'Toko A' },
  })
  assert(s.data.storeName === 'Toko A', 'SET_DATA sets storeName')
  assert(s.data.address === '', 'SET_DATA preserves other fields')
  assert(notSameRef(s.data, INITIAL_STATE.data), 'SET_DATA new data ref')
  assert(INITIAL_STATE.data.storeName === '', 'SET_DATA no mutation of initial')
}

// --- SET_ITEMS ---
{
  const items = [{ name: 'a', qty: 1, price: 1000 }]
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.SET_ITEMS,
    payload: items,
  })
  assert(s.data.items.length === 1, 'SET_ITEMS replaces items')
  assert(s.data.items[0].name === 'a', 'SET_ITEMS stores items correctly')
}

// --- ADD_ITEM ---
{
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.ADD_ITEM,
    payload: { name: 'a', qty: 1, price: 1000 },
  })
  assert(s.data.items.length === 1, 'ADD_ITEM appends')
  assert(notSameRef(s.data.items, INITIAL_STATE.data.items), 'ADD_ITEM new items array')
}

// --- UPDATE_ITEM ---
{
  const base = {
    ...clone(INITIAL_STATE),
    data: {
      ...clone(INITIAL_STATE.data),
      items: [
        { name: 'a', qty: 1, price: 1000 },
        { name: 'b', qty: 2, price: 2000 },
      ],
    },
  }
  const s = designerReducer(base, {
    type: ACTIONS.UPDATE_ITEM,
    payload: { index: 0, patch: { qty: 5 } },
  })
  assert(s.data.items[0].qty === 5, 'UPDATE_ITEM patches by index')
  assert(s.data.items[1].qty === 2, 'UPDATE_ITEM leaves other items')
  assert(s.data.items[0].name === 'a', 'UPDATE_ITEM preserves other fields')
}

// --- DELETE_ITEM ---
{
  const base = {
    ...clone(INITIAL_STATE),
    data: {
      ...clone(INITIAL_STATE.data),
      items: [{ name: 'a' }, { name: 'b' }],
    },
  }
  const s = designerReducer(base, {
    type: ACTIONS.DELETE_ITEM,
    payload: { index: 0 },
  })
  assert(s.data.items.length === 1, 'DELETE_ITEM removes one')
  assert(s.data.items[0].name === 'b', 'DELETE_ITEM keeps correct one')
}

// --- LOAD_TEMPLATE ---
{
  const template = {
    paper: { preset: 'p80', widthMm: 80, heightMm: 150, marginMm: 2 },
    elements: [{ id: 'x1', type: 'text' }],
    data: { ...clone(INITIAL_STATE.data), storeName: 'Loaded' },
  }
  const s = designerReducer(INITIAL_STATE, {
    type: ACTIONS.LOAD_TEMPLATE,
    payload: template,
  })
  assert(s.paper.widthMm === 80, 'LOAD_TEMPLATE replaces paper')
  assert(s.elements.length === 1, 'LOAD_TEMPLATE replaces elements')
  assert(s.data.storeName === 'Loaded', 'LOAD_TEMPLATE replaces data')
  assert(s.selectedElementId === null, 'LOAD_TEMPLATE clears selection')
}

// --- RESET ---
{
  const polluted = {
    ...clone(INITIAL_STATE),
    elements: [{ id: 'e1' }],
    selectedElementId: 'e1',
  }
  const s = designerReducer(polluted, { type: ACTIONS.RESET })
  assert(s.elements.length === 0, 'RESET clears elements')
  assert(s.selectedElementId === null, 'RESET clears selection')
  assert(s.paper.widthMm === 58, 'RESET restores default paper')
}

// --- unknown action ---
{
  const s = designerReducer(INITIAL_STATE, { type: 'UNKNOWN_ACTION' })
  assert(s === INITIAL_STATE, 'unknown action returns same state ref')
}

// --- summary ---
console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
