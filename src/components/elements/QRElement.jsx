import { QRCodeSVG } from 'qrcode.react'

export default function QRElement({ element }) {
  const { value, size = 60 } = element.props
  const safeSize = Math.max(10, size)

  if (!value) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100 border border-slate-300 rounded text-[10px] text-slate-500">
        [QR Kosong]
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-white">
      <QRCodeSVG
        value={value}
        size={safeSize}
        bgColor="#ffffff"
        fgColor="#000000"
        level="L"
        includeMargin={false}
      />
    </div>
  )
}
