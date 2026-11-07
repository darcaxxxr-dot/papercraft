export default function TextElement({ element }) {
  const { props } = element
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
  return <div style={style}>{props.content}</div>
}
