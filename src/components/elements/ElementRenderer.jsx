import { ELEMENT_TYPES } from '../../utils/elements.js'
import TextElement from './TextElement.jsx'
import DynamicTextElement from './DynamicTextElement.jsx'
import ItemListElement from './ItemListElement.jsx'
import ImageElement from './ImageElement.jsx'
import BarcodeElement from './BarcodeElement.jsx'
import QRElement from './QRElement.jsx'
import DividerElement from './DividerElement.jsx'

export default function ElementRenderer({ element }) {
  switch (element.type) {
    case ELEMENT_TYPES.TEXT: return <TextElement element={element} />
    case ELEMENT_TYPES.DYNAMIC_TEXT: return <DynamicTextElement element={element} />
    case ELEMENT_TYPES.ITEM_LIST: return <ItemListElement element={element} />
    case ELEMENT_TYPES.IMAGE: return <ImageElement element={element} />
    case ELEMENT_TYPES.BARCODE: return <BarcodeElement element={element} />
    case ELEMENT_TYPES.QR: return <QRElement element={element} />
    case ELEMENT_TYPES.DIVIDER: return <DividerElement element={element} />
    default: return null
  }
}
