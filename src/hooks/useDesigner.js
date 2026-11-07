/**
 * Access designer state and actions.
 * Must be used inside <DesignerProvider>.
 * @module hooks/useDesigner
 */
import { useContext } from 'react'
import { DesignerContext } from '../context/DesignerContext.jsx'

/**
 * @returns {{ state: Object, actions: Object }}
 * @throws {Error} If called outside <DesignerProvider>.
 */
export function useDesigner() {
  const ctx = useContext(DesignerContext)
  if (!ctx) {
    throw new Error(
      'useDesigner must be used inside <DesignerProvider>.',
    )
  }
  return ctx
}
