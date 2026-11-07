/**
 * Standalone validation script for src/utils/*.
 * Run with: node scripts/validate-utils.mjs
 * Exits non-zero if any assertion fails.
 */
import {
  mmToPx,
  pxToMm,
  PAPER_PRESETS,
  getPaperStyle,
  buildPrintCSS,
} from '../src/utils/paper.js'
import {
  calcSubtotal,
  calcTotal,
  formatCurrency,
} from '../src/utils/calc.js'

let failures = 0
const assert = (cond, msg) => {
  if (cond) {
    console.log('✅', msg)
  } else {
    console.error('❌ FAIL:', msg)
    failures++
  }
}
const near = (a, b, tol = 0.01) => Math.abs(a - b) < tol

// --- paper.js ---
assert(near(mmToPx(25.4), 96), 'mmToPx(25.4) ≈ 96')
assert(near(pxToMm(96), 25.4), 'pxToMm(96) ≈ 25.4')
assert(near(pxToMm(mmToPx(80)), 80), 'roundtrip 80mm ≈ 80mm')
assert(near(pxToMm(mmToPx(58)), 58), 'roundtrip 58mm ≈ 58mm')

assert(Object.keys(PAPER_PRESETS).length === 4, 'PAPER_PRESETS has 4 entries')
assert(PAPER_PRESETS.p58.widthMm === 58, 'p58 width = 58mm')
assert(PAPER_PRESETS.a4.widthMm === 210, 'a4 width = 210mm')

const style = getPaperStyle({ widthMm: 58, heightMm: 100, marginMm: 2 })
assert(style.width.endsWith('px'), 'getPaperStyle width has px unit')
assert(style.width === `${mmToPx(58)}px`, 'getPaperStyle width = mmToPx(58)px')
assert(near(pxToMm(parseFloat(style.width)), 58), 'getPaperStyle width converts back to 58mm')
assert(style.boxSizing === 'border-box', 'getPaperStyle uses border-box')

const fallbackStyle = getPaperStyle({ widthMm: -10, heightMm: NaN })
assert(fallbackStyle.width === `${mmToPx(58)}px`, 'invalid width falls back to 58mm')
assert(fallbackStyle.height === `${mmToPx(100)}px`, 'invalid height falls back to 100mm')

const css = buildPrintCSS({ widthMm: 58, heightMm: 100 })
assert(css.includes('@page'), 'buildPrintCSS contains @page')
assert(css.includes('58mm'), 'buildPrintCSS contains 58mm')
assert(css.includes('100mm'), 'buildPrintCSS contains 100mm')
assert(css.includes('margin: 0'), 'buildPrintCSS has margin: 0')

// --- calc.js ---
const items = [
  { qty: 2, price: 10000 },
  { qty: 1, price: 5000 },
]
assert(calcSubtotal(items) === 25000, 'calcSubtotal = 25000')
assert(calcSubtotal([]) === 0, 'calcSubtotal([]) = 0')
assert(calcSubtotal(null) === 0, 'calcSubtotal(null) = 0')
assert(
  calcSubtotal([{ qty: -1, price: 1000 }]) === 0,
  'calcSubtotal ignores negative qty',
)

const result = calcTotal({ items, discount: 5000, taxPercent: 10 })
assert(result.subtotal === 25000, 'calcTotal subtotal = 25000')
assert(result.discount === 5000, 'calcTotal discount = 5000')
assert(near(result.taxAmount, 2000), 'calcTotal taxAmount = 2000 (10% of 20000)')
assert(near(result.total, 22000), 'calcTotal total = 22000')

const noTax = calcTotal({ items })
assert(noTax.taxAmount === 0, 'no tax → taxAmount = 0')
assert(noTax.total === 25000, 'no discount, no tax → total = subtotal')

const clamped = calcTotal({ items, discount: -100, taxPercent: -5 })
assert(clamped.discount === 0, 'negative discount clamped to 0')
assert(clamped.taxAmount === 0, 'negative tax clamped to 0')
assert(clamped.total === 25000, 'clamped total = subtotal')

const oversized = calcTotal({ items, discount: 999999 })
assert(oversized.total === 0, 'discount > subtotal → total = 0 (not negative)')

const formatted = formatCurrency(22000, 'id-ID', 'IDR')
assert(typeof formatted === 'string', 'formatCurrency returns string')
assert(formatted.includes('22'), 'formatCurrency contains 22')
assert(formatted.length > 0, 'formatCurrency non-empty')

// --- summary ---
console.log('')
if (failures === 0) {
  console.log('✅ ALL VALIDATIONS PASSED')
  process.exit(0)
} else {
  console.error(`❌ VALIDATION FAILED — ${failures} assertion(s) failed`)
  process.exit(1)
}
