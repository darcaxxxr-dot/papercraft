import { Rnd } from 'react-rnd'
import { useDesigner } from '../hooks/useDesigner.js'
import { getPaperStyle, mmToPx, pxToMm } from '../utils/paper.js'
import ElementRenderer from './elements/ElementRenderer.jsx'

export default function Canvas() {
  const { state, actions } = useDesigner()
  const { paper, elements, selectedElementId, showGuides } = state
  const paperStyle = getPaperStyle(paper)

  const grid = [mmToPx(1), mmToPx(1)]

  return (
    <main className="flex-1 min-w-0 overflow-auto bg-sage/20 p-8 flex justify-center items-start">
      <div className="flex flex-col items-center">
        <div
          id="print-area"
          style={paperStyle}
          className="bg-white shadow-xl border border-ink/20 relative overflow-hidden"
          data-testid="paper-canvas"
          onClick={() => actions.selectElement(null)}
        >
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-center px-4 py-6 text-ink/40 pointer-events-none">
              <div>
                <p className="text-sm font-medium">Kanvas kosong</p>
                <p className="text-xs mt-1">Tambahkan elemen dari Toolbox</p>
              </div>
            </div>
          )}

          {/* Guides */}
          {showGuides && (
            <div className="absolute inset-0 pointer-events-none no-print z-20">
              {paper.marginMm > 0 && (
                <div
                  className="absolute border-2 border-dashed border-sage-dark/50"
                  style={{
                    left: `${mmToPx(paper.marginMm)}px`,
                    top: `${mmToPx(paper.marginMm)}px`,
                    right: `${mmToPx(paper.marginMm)}px`,
                    bottom: `${mmToPx(paper.marginMm)}px`,
                  }}
                />
              )}
              <div className="absolute top-0 bottom-0 w-px" style={{ left: '50%', transform: 'translateX(-50%)', borderLeft: '1px dashed rgba(192, 106, 74, 0.5)', background: 'transparent' }} />
              <div className="absolute left-0 right-0 h-px" style={{ top: '50%', transform: 'translateY(-50%)', borderTop: '1px dashed rgba(192, 106, 74, 0.5)', background: 'transparent' }} />
            </div>
          )}

          {/* Elements */}
          {elements.map((el) => {
            const isSelected = el.id === selectedElementId

            return (
              <Rnd
                key={el.id}
                size={{ width: mmToPx(el.w), height: mmToPx(el.h) }}
                position={{ x: mmToPx(el.x), y: mmToPx(el.y) }}
                dragGrid={grid}
                resizeGrid={grid}
                bounds="parent"
                enableResizing={isSelected}
                onDragStop={(e, d) => {
                  actions.updateElement(el.id, {
                    x: Number(pxToMm(d.x).toFixed(1)),
                    y: Number(pxToMm(d.y).toFixed(1)),
                  })
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  actions.updateElement(el.id, {
                    w: Number(pxToMm(parseFloat(ref.style.width)).toFixed(1)),
                    h: Number(pxToMm(parseFloat(ref.style.height)).toFixed(1)),
                    x: Number(pxToMm(position.x).toFixed(1)),
                    y: Number(pxToMm(position.y).toFixed(1)),
                  })
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  actions.selectElement(el.id)
                }}
                className={`group ${isSelected ? 'ring-2 ring-terracotta z-10' : 'hover:ring-1 hover:ring-sage-dark/60'}`}
                style={{ boxSizing: 'border-box', zIndex: el.zIndex || 0 }}
              >
                <div className="w-full h-full overflow-hidden pointer-events-none select-none">
                  <ElementRenderer element={el} />
                </div>
              </Rnd>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-ink/60 font-mono">
          {paper.widthMm} × {paper.heightMm} mm | {elements.length} elemen
        </p>
      </div>
    </main>
  )
}
