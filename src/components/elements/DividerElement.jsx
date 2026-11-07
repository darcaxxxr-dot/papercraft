export default function DividerElement({ element }) {
  const { thickness = 1, style = 'solid', color = '#000000' } = element.props

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div
        style={{
          width: '100%',
          borderBottom: `${thickness}px ${style} ${color}`,
        }}
      />
    </div>
  )
}
