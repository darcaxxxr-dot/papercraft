import { useDesigner } from '../../hooks/useDesigner.js'
import { buildItemList } from '../../utils/binding.js'

const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num)

export default function ItemListElement({ element }) {
  const { state } = useDesigner()
  const { props } = element
  const items = buildItemList(state.data.items)

  const containerStyle = {
    fontSize: `${props.fontSize || 10}px`,
    fontFamily: props.fontFamily || 'monospace',
    fontWeight: props.bold ? 'bold' : 'normal',
    fontStyle: props.italic ? 'italic' : 'normal',
    lineHeight: '1.5',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'table',
    borderCollapse: 'collapse',
    color: '#000000',
    paddingTop: '4px',
  }

  if (items.length === 0) {
    return <div style={containerStyle} className="text-slate-400 italic">[Belum ada item]</div>
  }

  return (
    <div style={containerStyle}>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'table-row-group', borderBottom: '1px dashed #cbd5e1' }}>
          <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', fontWeight: 'bold', paddingTop: '4px', paddingBottom: '2px', textAlign: 'left' }}>
              {item.name}
            </div>
            <div style={{ display: 'table-cell', fontWeight: 'bold', paddingTop: '4px', paddingBottom: '2px', textAlign: 'right' }}>
              {formatNumber(item.subtotal)}
            </div>
          </div>
          <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', fontSize: '0.9em', color: '#555', paddingBottom: '6px', textAlign: 'left' }}>
              {item.qty} x {formatNumber(item.price)}
            </div>
            <div style={{ display: 'table-cell', paddingBottom: '6px' }}></div>
          </div>
        </div>
      ))}
    </div>
  )
}
