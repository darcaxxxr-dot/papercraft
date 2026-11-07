import { useDesigner } from '../hooks/useDesigner.js'
import { ELEMENT_TYPES, createElement } from '../utils/elements.js'

const DYNAMIC_FIELDS = [
  { key: 'storeName', label: 'Nama Toko' },
  { key: 'address', label: 'Alamat' },
  { key: 'receiptNo', label: 'No. Struk' },
  { key: 'date', label: 'Tanggal' },
  { key: 'cashier', label: 'Kasir' },
  { key: 'footer', label: 'Footer / Ucapan' },
]

const STATIC_TOOLS = [
  { type: ELEMENT_TYPES.TEXT, label: 'Teks Statis (Custom)' },
  { type: ELEMENT_TYPES.ITEM_LIST, label: 'List Item (Tabel)' },
  { type: ELEMENT_TYPES.IMAGE, label: 'Logo / Gambar' },
  { type: ELEMENT_TYPES.BARCODE, label: 'Barcode' },
  { type: ELEMENT_TYPES.QR, label: 'QR Code' },
  { type: ELEMENT_TYPES.DIVIDER, label: 'Garis Pemisah' },
]

export default function Toolbox() {
  const { state, actions } = useDesigner()

  const handleAdd = (type, customProps = null) => {
    // Hitung posisi Y agar elemen baru selalu di bawah elemen terakhir
    // Ditambah jarak 8mm agar tidak menumpuk
    const offsetY = state.elements.length > 0 
      ? Math.max(...state.elements.map(e => e.y + e.h)) + 2 
      : 2

    const overrides = { y: offsetY }
    if (customProps) {
      overrides.props = customProps
    }

    const newEl = createElement(type, overrides)
    actions.addElement(newEl)
  }

  return (
    <div className="p-4 border-b border-ink/20 font-sans">
      <h2 className="text-sm font-serif font-semibold text-ink-deep mb-3">Toolbox</h2>
      
      {/* Teks Dinamis (Data Struk) */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-ink/70 mb-2">Data Struk</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {DYNAMIC_FIELDS.map((field) => (
            <button
              key={field.key}
              onClick={() => handleAdd(ELEMENT_TYPES.DYNAMIC_TEXT, { binding: `{{${field.key}}}` })}
              className="text-left px-2 py-1.5 text-xs border border-ink/30 bg-paper text-ink-deep rounded hover:bg-ink hover:text-paper transition-colors truncate"
              title={`Tambahkan {{${field.key}}}`}
            >
              + {field.label}
            </button>
          ))}
        </div>
      </div>

      {/* Elemen Lainnya */}
      <div>
        <h3 className="text-xs font-semibold text-ink/70 mb-2">Elemen Lainnya</h3>
        <div className="grid grid-cols-1 gap-1.5">
          {STATIC_TOOLS.map((tool) => (
            <button
              key={tool.type}
              onClick={() => handleAdd(tool.type)}
              className="text-left px-3 py-2 text-sm border border-ink/30 bg-paper text-ink-deep rounded hover:bg-ink hover:text-paper transition-colors"
            >
              + {tool.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
