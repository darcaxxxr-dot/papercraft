/**
 * Paper conversion and style utilities.
 * Pure functions — no side effects, no dependencies on React or DOM.
 * @module utils/paper
 */

/** Standard DPI used by browsers for CSS pixel conversion. */
export const DEFAULT_DPI = 96

/** Conversion constant: 1 inch = 25.4 millimeters. */
const MM_PER_INCH = 25.4

/**
 * Convert millimeters to CSS pixels.
 * @param {number} mm - Length in millimeters.
 * @param {number} [dpi=96] - Dots per inch (default 96 = CSS standard).
 * @returns {number} Length in pixels.
 */
export function mmToPx(mm, dpi = DEFAULT_DPI) {
  return (mm / MM_PER_INCH) * dpi
}

/**
 * Convert CSS pixels to millimeters.
 * @param {number} px - Length in pixels.
 * @param {number} [dpi=96] - Dots per inch.
 * @returns {number} Length in millimeters.
 */
export function pxToMm(px, dpi = DEFAULT_DPI) {
  return (px * MM_PER_INCH) / dpi
}

/**
 * Paper size presets in millimeters.
 * @type {Record<string, { label: string, widthMm: number, heightMm: number }>}
 */
export const PAPER_PRESETS = {
  p58: { label: '58mm (Thermal)', widthMm: 58, heightMm: 100 },
  p80: { label: '80mm (Thermal)', widthMm: 80, heightMm: 150 },
  p110: { label: '110mm (Thermal)', widthMm: 110, heightMm: 200 },
  a4: { label: 'A4 (210×297mm)', widthMm: 210, heightMm: 297 },
}

/**
 * Compute CSS style object for rendering the paper canvas on screen.
 * Values are converted from mm to px. Invalid input falls back to 58×100mm.
 * @param {Object} params
 * @param {number} params.widthMm - Paper width in mm.
 * @param {number} params.heightMm - Paper height in mm.
 * @param {number} [params.marginMm=0] - Uniform margin in mm.
 * @returns {{ width: string, height: string, padding: string, boxSizing: string }}
 */
export function getPaperStyle({ widthMm, heightMm, marginMm = 0 }) {
  const safeW = Number.isFinite(widthMm) && widthMm > 0 ? widthMm : 58
  const safeH = Number.isFinite(heightMm) && heightMm > 0 ? heightMm : 100
  const safeM = Number.isFinite(marginMm) && marginMm >= 0 ? marginMm : 0
  return {
    width: `${mmToPx(safeW)}px`,
    height: `${mmToPx(safeH)}px`,
    padding: `${mmToPx(safeM)}px`,
    boxSizing: 'border-box',
  }
}

/**
 * Build @page CSS rule for print. Uses physical units (mm), so browser
 * print engine produces 1:1 output at the target paper size.
 * @param {Object} params
 * @param {number} params.widthMm - Paper width in mm.
 * @param {number} params.heightMm - Paper height in mm.
 * @returns {string} CSS string with @page rule.
 */
export function buildPrintCSS({ widthMm, heightMm }) {
  const w = Number.isFinite(widthMm) && widthMm > 0 ? widthMm : 58
  const h = Number.isFinite(heightMm) && heightMm > 0 ? heightMm : 100
  return `@page { size: ${w}mm ${h}mm; margin: 0; }`
}
