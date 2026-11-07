/**
 * React Context provider for designer state.
 * Wraps useReducer and exposes state + action creators.
 * @module context/DesignerContext
 */
import { createContext, useMemo, useReducer } from 'react'
import {
  ACTIONS,
  INITIAL_STATE,
  designerReducer,
} from './designerReducer.js'

/**
 * Context object. Consume via useDesigner hook.
 * @type {React.Context}
 */
export const DesignerContext = createContext(null)

/**
 * Provider component. Wrap the app root with this.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Object} [props.initialState] - Optional override for testing.
 * @returns {JSX.Element}
 */
export function DesignerProvider({ children, initialState = INITIAL_STATE }) {
  const [state, dispatch] = useReducer(designerReducer, initialState)

  const actions = useMemo(
    () => ({
      setPaper: (payload) =>
        dispatch({ type: ACTIONS.SET_PAPER, payload }),
      addElement: (element) =>
        dispatch({ type: ACTIONS.ADD_ELEMENT, payload: element }),
      updateElement: (id, patch) =>
        dispatch({ type: ACTIONS.UPDATE_ELEMENT, payload: { id, patch } }),
      deleteElement: (id) =>
        dispatch({ type: ACTIONS.DELETE_ELEMENT, payload: { id } }),
      selectElement: (id) =>
        dispatch({ type: ACTIONS.SELECT_ELEMENT, payload: { id } }),
      setData: (payload) =>
        dispatch({ type: ACTIONS.SET_DATA, payload }),
      setItems: (items) =>
        dispatch({ type: ACTIONS.SET_ITEMS, payload: items }),
      addItem: (item) =>
        dispatch({ type: ACTIONS.ADD_ITEM, payload: item }),
      updateItem: (index, patch) =>
        dispatch({ type: ACTIONS.UPDATE_ITEM, payload: { index, patch } }),
      deleteItem: (index) =>
        dispatch({ type: ACTIONS.DELETE_ITEM, payload: { index } }),
      loadTemplate: (template) =>
        dispatch({ type: ACTIONS.LOAD_TEMPLATE, payload: template }),
      reset: () => dispatch({ type: ACTIONS.RESET }),
      toggleGuides: () => dispatch({ type: ACTIONS.TOGGLE_GUIDES }),
      bringForward: (id) =>
        dispatch({ type: ACTIONS.BRING_FORWARD, payload: { id } }),
      sendBackward: (id) =>
        dispatch({ type: ACTIONS.SEND_BACKWARD, payload: { id } }),
    }),
    [],
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return (
    <DesignerContext.Provider value={value}>
      {children}
    </DesignerContext.Provider>
  )
}
