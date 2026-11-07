/**
 * Paper size controls. Reads/writes paper state from DesignerContext.
 * @module components/PaperSettings
 */
import { useDesigner } from '../hooks/useDesigner.js'
import { PAPER_PRESETS } from '../utils/paper.js'

/**
 * Numeric input with label. Clamps value to [min, max].
 * @param {Object} props
 * @param {string} props.label
 * @param {number} props.value
 * @param {(v: number) => void} props.onChange
 * @param {number} [props.min=1]
 * @param {number} [props.max=1000]
 */
function NumberField({ label, value, onChange, min = 1, max = 1000 }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink/80 mb-1">
        {label}
      </span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const raw = Number(e.target.value)
          const clamped = Number.isFinite(raw)
            ? Math.min(max, Math.max(min, raw))
            : min
          onChange(clamped)
        }}
        className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper text-ink-deep rounded
                   focus:outline-none focus:ring-2 focus:ring-sage"
      />
    </label>
  )
}

export default function PaperSettings() {
  const { state, actions } = useDesigner()
  const { paper } = state

  /**
   * Handle preset change. Sets preset + dimensions atomically.
   * @param {React.ChangeEvent<HTMLSelectElement>} e
   */
  const handlePreset = (e) => {
    const presetKey = e.target.value
    if (presetKey === 'custom') {
      actions.setPaper({ preset: 'custom' })
      return
    }
    const preset = PAPER_PRESETS[presetKey]
    if (!preset) return
    actions.setPaper({
      preset: presetKey,
      widthMm: preset.widthMm,
      heightMm: preset.heightMm,
    })
  }

  return (
    <aside className="w-72 shrink-0 border-r border-ink/20 bg-[#f4ead7] p-4 overflow-y-auto no-print font-sans">
      <h2 className="text-sm font-serif font-semibold text-ink-deep mb-3">
        Ukuran Kertas
      </h2>

      <div className="space-y-3">
        <label className="block">
          <span className="block text-xs font-medium text-ink/80 mb-1">
            Preset
          </span>
          <select
            value={paper.preset}
            onChange={handlePreset}
            className="w-full px-2 py-1.5 text-sm border border-ink/30 bg-paper text-ink-deep rounded
                       focus:outline-none focus:ring-2 focus:ring-sage"
          >
            {Object.entries(PAPER_PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>

        <NumberField
          label="Lebar (mm)"
          value={paper.widthMm}
          onChange={(v) => actions.setPaper({ widthMm: v, preset: 'custom' })}
        />

        <NumberField
          label="Tinggi (mm)"
          value={paper.heightMm}
          onChange={(v) => actions.setPaper({ heightMm: v, preset: 'custom' })}
        />

        <NumberField
          label="Margin (mm)"
          value={paper.marginMm}
          min={0}
          onChange={(v) => actions.setPaper({ marginMm: v })}
        />

        <div className="pt-2 border-t border-ink/20">
          <p className="text-xs text-ink/60">
            <span className="font-medium text-ink-deep">Ringkasan:</span>{' '}
            {paper.widthMm} × {paper.heightMm} mm
            {paper.marginMm > 0 && ` (margin ${paper.marginMm}mm)`}
          </p>
        </div>
      </div>
    </aside>
  )
}
