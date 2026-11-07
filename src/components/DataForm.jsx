import { useDesigner } from '../hooks/useDesigner.js'
import { calcTotal, formatCurrency } from '../utils/calc.js'

export default function DataForm() {
  const { state, actions } = useDesigner()
  const { data } = state

  const handleDataChange = (field, value) => {
    actions.setData({ [field]: value })
  }

  const handleAddItem = () => {
    actions.addItem({ name: '', qty: 1, price: 0 })
  }

  const handleUpdateItem = (idx, field, value) => {
    actions.updateItem(idx, { [field]: value })
  }

  const handleDeleteItem = (idx) => {
    actions.deleteItem(idx)
  }

  const handleFillSample = () => {
    actions.setData({
      storeName: 'Toko Makmur',
      address: 'Jl. Sudirman No. 123',
      receiptNo: 'INV-20231107-001',
      date: new Date().toLocaleDateString('id-ID'),
      cashier: 'Budi',
      footer: 'Terima kasih atas kunjungan Anda!',
      discount: 5000,
      taxPercent: 10,
    })
    actions.setItems([
      { name: 'Kopi Hitam', qty: 2, price: 15000 },
      { name: 'Roti Bakar', qty: 1, price: 25000 },
    ])
  }

  const totals = calcTotal({
    items: data.items,
    discount: data.discount || 0,
    taxPercent: data.taxPercent || 0,
  })

  return (
    <div className="p-4 space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-serif font-semibold text-ink-deep">Data Struk</h2>
        <button onClick={handleFillSample} className="text-xs px-2 py-1 bg-terracotta text-white rounded hover:opacity-90 transition-colors">
          Isi Contoh
        </button>
      </div>

      <div className="space-y-3">
        {['storeName', 'address', 'receiptNo', 'date', 'cashier', 'footer'].map((field) => (
          <label key={field} className="block">
            <span className="block text-xs font-medium text-ink/80 mb-1 capitalize">
              {field.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <input
              type="text"
              value={data[field] || ''}
              onChange={(e) => handleDataChange(field, e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded focus:outline-none focus:ring-2 focus:ring-sage"
            />
          </label>
        ))}

        <div className="pt-2 border-t border-ink/20 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-ink-deep">Daftar Item</h3>
            <button onClick={handleAddItem} className="text-xs px-2 py-1 bg-sage text-white rounded hover:bg-sage-dark">
              + Tambah Baris
            </button>
          </div>
          
          <div className="space-y-2">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-2 border border-ink/20 rounded bg-paper">
                <div className="flex gap-1 items-center">
                  <input
                    type="text"
                    placeholder="Nama Item"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-ink/30 bg-white rounded w-0"
                  />
                  <button onClick={() => handleDeleteItem(idx)} className="text-terracotta hover:text-[#a95032] px-1 font-bold text-lg leading-none">
                    ×
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="w-16">
                    <span className="text-[10px] text-ink/60 mb-0.5 block">Qty</span>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => handleUpdateItem(idx, 'qty', Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-ink/30 bg-white rounded text-center"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-ink/60 mb-0.5 block">Harga (Rp)</span>
                    <input
                      type="number"
                      placeholder="Harga"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(idx, 'price', Number(e.target.value))}
                      className="w-full px-2 py-1 text-sm border border-ink/30 bg-white rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-ink/20 mt-4 space-y-3">
          <label className="block">
            <span className="block text-xs font-medium text-ink/80 mb-1">Diskon (Rp)</span>
            <input type="number" value={data.discount || 0} onChange={(e) => handleDataChange('discount', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded" />
          </label>
          <label className="block">
            <span className="block text-xs font-medium text-ink/80 mb-1">Pajak (%)</span>
            <input type="number" value={data.taxPercent || 0} onChange={(e) => handleDataChange('taxPercent', Number(e.target.value))} className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper rounded" />
          </label>

          <div className="bg-paper-dark p-3 rounded text-sm space-y-1 mt-4 border border-ink/10">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-terracotta">
                <span>Diskon</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            {totals.taxAmount > 0 && (
              <div className="flex justify-between text-ink/70">
                <span>Pajak ({data.taxPercent}%)</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-bold text-ink-deep pt-2 border-t border-ink/20 mt-1">
              <span>Total</span>
              <span className="text-sage-dark">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
