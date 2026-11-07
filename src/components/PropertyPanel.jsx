import { useDesigner } from '../hooks/useDesigner.js'

function NumberField({ label, value, onChange, min = 0, max = 1000, step = 1 }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium text-ink/80 mb-1">{label}</span>
      <input
        type="number"
        value={value === undefined ? '' : value}
        min={min} max={max} step={step}
        onChange={(e) => {
          const val = e.target.value
          if (val === '') {
            onChange('')
            return
          }
          const num = Number(val)
          if (Number.isFinite(num)) onChange(num)
        }}
        onBlur={(e) => {
          let num = Number(e.target.value)
          if (!Number.isFinite(num) || e.target.value === '') num = min
          onChange(Math.min(max, Math.max(min, num)))
        }}
        className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded focus:outline-none focus:ring-2 focus:ring-sage"
      />
    </label>
  )
}

export default function PropertyPanel() {
  const { state, actions } = useDesigner()
  const { selectedElementId, elements } = state

  const selectedEl = elements.find((el) => el.id === selectedElementId)

  if (!selectedEl) {
    return (
      <aside className="w-72 shrink-0 border-l border-ink/20 bg-[#f4ead7] p-4 overflow-y-auto no-print font-sans">
        <h2 className="text-sm font-serif font-semibold text-ink-deep mb-2">Properti Elemen</h2>
        <p className="text-xs text-ink/70">Pilih elemen di kanvas untuk mengedit propertinya.</p>
        <p className="text-xs text-ink/50 mt-4 italic">Tips: Tekan tombol <b>Delete</b> di keyboard untuk menghapus elemen yang dipilih.</p>
      </aside>
    )
  }

  const update = (patch) => actions.updateElement(selectedEl.id, patch)
  const updateProps = (propPatch) => update({ props: { ...selectedEl.props, ...propPatch } })

  const isText = selectedEl.type === 'text' || selectedEl.type === 'dynamicText'
  const isList = selectedEl.type === 'itemList'
  const isImage = selectedEl.type === 'image'
  const isBarcode = selectedEl.type === 'barcode'
  const isQR = selectedEl.type === 'qr'
  const isDivider = selectedEl.type === 'divider'

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updateProps({ src: ev.target.result })
    reader.readAsDataURL(file)
  }

  const FontControls = () => (
    <>
      <label className="block mb-3">
        <span className="block text-xs font-medium text-ink/80 mb-1">Font Family</span>
        <select
          value={selectedEl.props.fontFamily || 'monospace'}
          onChange={(e) => updateProps({ fontFamily: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded focus:outline-none"
        >
          <option value="monospace">Monospace (Standar)</option>
          <option value="Arial, sans-serif">Arial (Sans-Serif)</option>
          <option value="'Courier New', Courier, monospace">ESC/POS Font A (Courier)</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <NumberField label="Font Size (px)" value={selectedEl.props.fontSize || 12} onChange={(v) => updateProps({ fontSize: v })} min={6} max={72} />
        <div className="flex items-end pb-3 gap-3">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={selectedEl.props.bold || false} onChange={(e) => updateProps({ bold: e.target.checked })} />
            <span className="text-sm font-bold">B</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={selectedEl.props.italic || false} onChange={(e) => updateProps({ italic: e.target.checked })} />
            <span className="text-sm italic font-serif">I</span>
          </label>
        </div>
      </div>
      <label className="block mb-3">
        <span className="block text-xs font-medium text-ink/80 mb-1">Rata Teks (Align)</span>
        <select
          value={selectedEl.props.align || 'left'}
          onChange={(e) => updateProps({ align: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded focus:outline-none"
        >
          <option value="left">Kiri (Left)</option>
          <option value="center">Tengah (Center)</option>
          <option value="right">Kanan (Right)</option>
        </select>
      </label>
    </>
  )

  return (
    <aside className="w-72 shrink-0 border-l border-ink/20 bg-[#f4ead7] p-4 overflow-y-auto no-print font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-serif font-semibold text-ink-deep">Properti</h2>
        <span className="text-[10px] uppercase bg-paper-dark text-ink/70 px-2 py-0.5 rounded font-mono">
          {selectedEl.type}
        </span>
      </div>

      <div className="space-y-4">
        {/* Posisi & Ukuran */}
        <div>
          <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">Posisi & Ukuran (mm)</h3>
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="X" value={selectedEl.x} onChange={(v) => update({ x: v })} />
            <NumberField label="Y" value={selectedEl.y} onChange={(v) => update({ y: v })} />
            <NumberField label="Lebar" value={selectedEl.w} onChange={(v) => update({ w: v })} min={1} />
            <NumberField label="Tinggi" value={selectedEl.h} onChange={(v) => update({ h: v })} min={1} />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => actions.sendBackward(selectedEl.id)} className="flex-1 px-2 py-1 text-xs border border-ink/30 bg-paper rounded hover:bg-paper-dark">
              ⬇ Bawa ke Belakang
            </button>
            <button onClick={() => actions.bringForward(selectedEl.id)} className="flex-1 px-2 py-1 text-xs border border-ink/30 bg-paper rounded hover:bg-paper-dark">
              ⬆ Bawa ke Depan
            </button>
          </div>
        </div>

        {isText && (
          <div>
            <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">Teks & Font</h3>
            <label className="block mb-3">
              <span className="block text-xs font-medium text-ink/80 mb-1">Konten</span>
              <input
                type="text"
                value={selectedEl.props.content || selectedEl.props.binding || ''}
                onChange={(e) => updateProps(selectedEl.type === 'text' ? { content: e.target.value } : { binding: e.target.value })}
                className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </label>
            <FontControls />
          </div>
        )}

        {isList && (
          <div>
            <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">Daftar Item & Font</h3>
            <FontControls />
          </div>
        )}

        {isDivider && (
          <div>
            <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">Garis Pemisah</h3>
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Ketebalan (px)" value={selectedEl.props.thickness || 1} onChange={(v) => updateProps({ thickness: v })} min={1} max={10} />
              <label className="block mb-3">
                <span className="block text-xs font-medium text-ink/80 mb-1">Warna</span>
                <input type="color" value={selectedEl.props.color || '#000000'} onChange={(e) => updateProps({ color: e.target.value })} className="w-full h-[34px] p-0 border rounded cursor-pointer" />
              </label>
            </div>
            <label className="block mb-3">
              <span className="block text-xs font-medium text-ink/80 mb-1">Gaya Garis</span>
              <select value={selectedEl.props.style || 'solid'} onChange={(e) => updateProps({ style: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded">
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </label>
          </div>
        )}

        {isImage && (
          <div>
            <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">Gambar / Logo</h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-xs text-ink/60 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-paper-dark file:text-ink-deep hover:file:bg-sage/30" />
          </div>
        )}

        {isBarcode && (
          <div>
            <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">Barcode</h3>
            <label className="block mb-3">
              <span className="block text-xs font-medium text-ink/80 mb-1">Value</span>
              <input type="text" value={selectedEl.props.value || ''} onChange={(e) => updateProps({ value: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded" />
            </label>
            <label className="block mb-3">
              <span className="block text-xs font-medium text-ink/80 mb-1">Format</span>
              <select value={selectedEl.props.format || 'CODE128'} onChange={(e) => updateProps({ format: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded">
                <option value="CODE128">CODE128 (Teks/Angka)</option>
                <option value="EAN13">EAN13 (13 Angka)</option>
                <option value="UPC">UPC (12 Angka)</option>
                <option value="CODE39">CODE39 (Teks/Angka)</option>
              </select>
            </label>
            <NumberField label="Tinggi Garis (px)" value={selectedEl.props.height ?? 40} onChange={(v) => updateProps({ height: v })} min={1} max={500} />
          </div>
        )}

        {isQR && (
          <div>
            <h3 className="text-xs font-semibold text-ink-deep border-b border-ink/20 pb-1 mb-2">QR Code</h3>
            <label className="block mb-3">
              <span className="block text-xs font-medium text-ink/80 mb-1">Value / URL</span>
              <input type="text" value={selectedEl.props.value || ''} onChange={(e) => updateProps({ value: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded" />
            </label>
            <NumberField label="Ukuran QR (px)" value={selectedEl.props.size ?? 60} onChange={(v) => updateProps({ size: v })} min={1} max={500} />
          </div>
        )}

        <div className="pt-4 border-t mt-6">
          <button onClick={() => actions.deleteElement(selectedEl.id)} className="w-full px-3 py-2 text-sm font-medium text-white bg-terracotta rounded hover:bg-[#a95032] transition-colors">
            Hapus Elemen
          </button>
        </div>
      </div>
    </aside>
  )
}
