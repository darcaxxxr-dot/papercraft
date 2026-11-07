import { useEffect } from 'react'
import { useDesigner } from './useDesigner.js'

/**
 * Hook to handle Delete/Backspace key to remove selected element.
 * Ignores events when user is typing in an input/textarea.
 */
export function useKeyboardDelete() {
  const { state, actions } = useDesigner()

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Jangan hapus jika user sedang mengetik di form
      const tag = document.activeElement.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedElementId) {
        e.preventDefault()
        actions.deleteElement(state.selectedElementId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.selectedElementId, actions])
}
