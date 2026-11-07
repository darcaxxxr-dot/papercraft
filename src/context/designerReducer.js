/**
 * Pure reducer for the designer state.
 * Testable without React — no JSX, no React imports.
 * @module context/designerReducer
 */

/**
 * Initial state shape.
 * @type {Object}
 */
export const INITIAL_STATE = {
  paper: {
    preset: 'p58',
    widthMm: 58,
    heightMm: 100,
    marginMm: 0,
  },
  elements: [],
  data: {
    storeName: '',
    address: '',
    receiptNo: '',
    date: '',
    cashier: '',
    footer: '',
    items: [],
    discount: 0,
    taxPercent: 0,
  },
  selectedElementId: null,
  showGuides: true,
}

/**
 * Action type constants.
 * @type {Record<string, string>}
 */
export const ACTIONS = {
  SET_PAPER: 'SET_PAPER',
  ADD_ELEMENT: 'ADD_ELEMENT',
  UPDATE_ELEMENT: 'UPDATE_ELEMENT',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
  SELECT_ELEMENT: 'SELECT_ELEMENT',
  SET_DATA: 'SET_DATA',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  LOAD_TEMPLATE: 'LOAD_TEMPLATE',
  RESET: 'RESET',
  TOGGLE_GUIDES: 'TOGGLE_GUIDES',
  BRING_FORWARD: 'BRING_FORWARD',
  SEND_BACKWARD: 'SEND_BACKWARD',
}

/**
 * Pure reducer. Always returns a NEW state reference for known actions
 * (never mutates the input). Unknown actions return the same reference.
 *
 * @param {Object} state - Current state.
 * @param {{ type: string, payload?: any }} action
 * @returns {Object} New state.
 */
export function designerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PAPER:
      return {
        ...state,
        paper: { ...state.paper, ...action.payload },
      }
    case ACTIONS.ADD_ELEMENT:
      return {
        ...state,
        elements: [...state.elements, action.payload],
      }
    case ACTIONS.UPDATE_ELEMENT:
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.payload.id
            ? { ...el, ...action.payload.patch }
            : el,
        ),
      }
    case ACTIONS.DELETE_ELEMENT:
      return {
        ...state,
        elements: state.elements.filter(
          (el) => el.id !== action.payload.id,
        ),
        selectedElementId:
          state.selectedElementId === action.payload.id
            ? null
            : state.selectedElementId,
      }
    case ACTIONS.SELECT_ELEMENT:
      return {
        ...state,
        selectedElementId: action.payload.id,
      }
    case ACTIONS.SET_DATA:
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      }
    case ACTIONS.SET_ITEMS:
      return {
        ...state,
        data: { ...state.data, items: action.payload },
      }
    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          items: [...state.data.items, action.payload],
        },
      }
    case ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          items: state.data.items.map((item, idx) =>
            idx === action.payload.index
              ? { ...item, ...action.payload.patch }
              : item,
          ),
        },
      }
    case ACTIONS.DELETE_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          items: state.data.items.filter(
            (_, idx) => idx !== action.payload.index,
          ),
        },
      }
    case ACTIONS.LOAD_TEMPLATE:
      return {
        ...INITIAL_STATE,
        ...action.payload,
        selectedElementId: null,
      }
    case ACTIONS.RESET:
      return { ...INITIAL_STATE }
    case ACTIONS.TOGGLE_GUIDES:
      return {
        ...state,
        showGuides: !state.showGuides,
      }
    case ACTIONS.BRING_FORWARD: {
      const maxZ = Math.max(...state.elements.map((el) => el.zIndex || 0), 0)
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.payload.id ? { ...el, zIndex: maxZ + 1 } : el,
        ),
      }
    }
    case ACTIONS.SEND_BACKWARD: {
      const minZ = Math.min(...state.elements.map((el) => el.zIndex || 0), 0)
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === action.payload.id ? { ...el, zIndex: minZ - 1 } : el,
        ),
      }
    }
    default:
      return state
  }
}
