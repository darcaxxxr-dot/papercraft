import { useDesigner } from '../../hooks/useDesigner.js'
import { resolveTemplate } from '../../utils/binding.js'

export default function DynamicTextElement({ element }) {
  const { state } = useDesigner()
  const { props } = element

  const resolvedText = resolveTemplate(props.binding, state.data)
  
  // Jika masih ada kurung kurawal, berarti placeholder belum diisi
  const isPlaceholder = resolvedText.includes('{{')

  const style = {
    fontSize: `${props.fontSize}px`,
    fontFamily: props.fontFamily || 'monospace',
    fontWeight: props.bold ? 'bold' : 'normal',
    fontStyle: props.italic ? 'italic' : 'normal',
    lineHeight: 1.2,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textAlign: props.align || 'left',
    width: '100%',
  }

  return (
    <div 
      style={style} 
      className={isPlaceholder ? 'text-slate-400 italic' : ''}
    >
      {resolvedText}
    </div>
  )
}
