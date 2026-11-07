import Barcode from 'react-barcode'

export default function BarcodeElement({ element }) {
  const { value, format = 'CODE128', height = 40 } = element.props
  const safeHeight = Math.max(10, height)

  if (!value) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-500">
        [Barcode Kosong]
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white">
      <Barcode
        value={value}
        format={format}
        width={1.5}
        height={safeHeight}
        displayValue={true}
        background="#ffffff"
        lineColor="#000000"
        margin={0}
      />
    </div>
  )
}
