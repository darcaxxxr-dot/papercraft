export default function ImageElement({ element }) {
  if (!element.props.src) {
    return (
      <div className="bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] text-slate-500 w-full h-full rounded">
        Upload Logo
      </div>
    )
  }
  return (
    <img
      src={element.props.src}
      alt={element.props.alt || 'Logo'}
      className="w-full h-full object-contain"
      draggable={false}
      style={{ pointerEvents: 'none' }}
    />
  )
}
