/**
 * LocalStorage utilities for saving and loading templates.
 * @module utils/storage
 */

const STORAGE_KEY = 'trd_templates'

/**
 * Get all saved templates.
 * @returns {Record<string, Object>}
 */
export function getAllTemplates() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('Failed to parse templates from localStorage', err)
    return {}
  }
}

/**
 * Save a template by name.
 * @param {string} name
 * @param {Object} state - The state to save (paper, elements, data).
 */
export function saveTemplate(name, state) {
  const templates = getAllTemplates()
  templates[name] = {
    paper: state.paper,
    elements: state.elements,
    data: state.data,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

/**
 * Load a template by name.
 * @param {string} name
 * @returns {Object|null}
 */
export function loadTemplate(name) {
  const templates = getAllTemplates()
  return templates[name] || null
}

/**
 * Delete a template by name.
 * @param {string} name
 */
export function deleteTemplate(name) {
  const templates = getAllTemplates()
  delete templates[name]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

/**
 * Export current state to a downloadable .hla file.
 * @param {Object} state
 * @param {string} [filename='template.hla']
 */
export function exportToFile(state, filename = 'template.hla') {
  const data = {
    paper: state.paper,
    elements: state.elements,
    data: state.data,
    exportedAt: new Date().toISOString(),
    version: '1.0',
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse a .hla file content and return valid state object.
 * @param {string} jsonString
 * @returns {Object|null}
 */
export function parseFileToState(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    if (!parsed.paper || !parsed.elements) throw new Error('Invalid format')
    return parsed
  } catch (err) {
    console.error('Failed to parse template file', err)
    return null
  }
}
