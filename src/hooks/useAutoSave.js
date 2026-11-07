import { useEffect, useRef } from 'react'
import { useDesigner } from './useDesigner.js'

const AUTOSAVE_KEY = 'trd_autosave'

export function useAutoSave() {
  const { state } = useDesigner()
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state))
      } catch (err) {
        console.error('Auto-save gagal (mungkin localStorage penuh):', err)
      }
    }, 1000)

    return () => clearTimeout(timeoutRef.current)
  }, [state])
}

export function loadAutoSave() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
