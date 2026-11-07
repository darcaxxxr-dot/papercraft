import { useState, useRef } from 'react'
import Canvas from './Canvas.jsx'
import PaperSettings from './PaperSettings.jsx'
import Toolbox from './Toolbox.jsx'
import PropertyPanel from './PropertyPanel.jsx'
import DataForm from './DataForm.jsx'
import { useDesigner } from '../hooks/useDesigner.js'
import { usePrint } from '../hooks/usePrint.js'
import { useKeyboardDelete } from '../hooks/useKeyboardDelete.js'
import { saveTemplate, loadTemplate, getAllTemplates, exportToFile, parseFileToState } from '../utils/storage.js'
import defaultTemplate from '../templates/default.json'

export default function Layout({ isMuted, toggleMute, onGoHome }) {
  const { state, actions } = useDesigner()
  const [activeTab, setActiveTab] = useState('design')
  const showGuides = state.showGuides
  const { exportPDF, exportImage } = usePrint()
  const fileInputRef = useRef(null)

  useKeyboardDelete()

  const handleSaveLocal = () => {
    const name = prompt('Masukkan nama template (lokal):')
    if (!name) return
    saveTemplate(name, state)
    alert(`Template "${name}" berhasil disimpan ke browser!`)
  }

  const handleLoadLocal = () => {
    const templates = getAllTemplates()
    const names = Object.keys(templates)
    if (names.length === 0) return alert('Belum ada template lokal tersimpan.')
    const name = prompt(`Pilih template lokal:\n${names.join('\n')}`)
    if (!name) return
    const loaded = loadTemplate(name)
    if (loaded) {
      actions.loadTemplate(loaded)
      alert('Template lokal berhasil dimuat!')
    } else {
      alert('Template tidak ditemukan.')
    }
  }

  const handleExportFile = () => {
    exportToFile(state, 'desain-struk.hla')
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const loaded = parseFileToState(ev.target.result)
      if (loaded) {
        actions.loadTemplate(loaded)
        alert('Template .hla berhasil dimuat!')
      } else {
        alert('Format file .hla tidak valid.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleLoadSample = () => {
    if(confirm('Ganti kanvas saat ini dengan contoh template?')) {
      actions.loadTemplate(defaultTemplate)
    }
  }

  const handleClearCanvas = () => {
    if(confirm('Apakah Anda yakin ingin membersihkan seluruh kanvas? Semua elemen akan dihapus.')) {
      actions.reset()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-paper text-ink-deep overflow-hidden">
      <header className="shrink-0 bg-ink-deep text-paper px-4 py-3 flex items-center justify-between shadow-md no-print overflow-x-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            className="p-1.5 text-paper/70 hover:text-paper hover:bg-ink rounded transition-colors"
            title="Kembali ke Halaman Awal"
            aria-label="Kembali ke Halaman Awal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <h1 className="text-xl font-serif font-semibold tracking-wide whitespace-nowrap">PaperCraft</h1>
          <span className="text-xs text-paper/60 bg-ink px-2 py-0.5 rounded hidden sm:inline-block font-sans">v1.0</span>
        </div>
        <div className="flex items-center gap-2 font-sans text-sm">
          <button onClick={() => actions.toggleGuides()} className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap border border-transparent ${showGuides ? 'bg-ink text-paper' : 'bg-transparent text-paper/60 border-paper/20 hover:border-paper/50'}`}>
            {showGuides ? '👁 Sembunyikan Garis Bantu' : '👁 Tampilkan Garis Bantu'}
          </button>
          
          <div className="w-px h-6 bg-paper/20 mx-1"></div>

          <button onClick={handleClearCanvas} className="px-3 py-1.5 text-xs bg-terracotta hover:bg-[#a95032] rounded flex items-center gap-1 whitespace-nowrap text-white">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Bersihkan
          </button>

          <div className="w-px h-6 bg-paper/20 mx-1"></div>

          <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-xs bg-sage-dark hover:bg-sage text-white rounded flex items-center gap-1 whitespace-nowrap">
            Buka .hla
          </button>
          <input type="file" accept=".hla" ref={fileInputRef} onChange={handleImportFile} className="hidden" />
          <button onClick={handleExportFile} className="px-3 py-1.5 text-xs bg-ink hover:bg-ink-deep border border-paper/20 rounded flex items-center gap-1 whitespace-nowrap text-paper">
             Simpan .hla
          </button>

          <div className="w-px h-6 bg-paper/20 mx-1"></div>

          <button onClick={handleLoadSample} className="px-3 py-1.5 text-xs bg-terracotta hover:bg-[#b06d4e] text-white rounded whitespace-nowrap">
            Contoh
          </button>
          
          <div className="w-px h-6 bg-paper/20 mx-1"></div>

          <button onClick={() => exportImage(state.paper)} className="px-3 py-1.5 text-xs bg-sage hover:bg-sage-dark text-white rounded flex items-center gap-1 whitespace-nowrap">
            Gambar
          </button>
          <button onClick={() => exportPDF(state.paper)} className="px-4 py-1.5 text-sm bg-terracotta hover:bg-[#b06d4e] text-white rounded shadow flex items-center gap-1 whitespace-nowrap font-semibold">
            PDF
          </button>
          <button onClick={toggleMute} className="ml-2 p-1.5 text-paper/60 hover:text-paper transition-colors" title={isMuted ? 'Unmute Music' : 'Mute Music'} aria-label={isMuted ? 'Unmute music' : 'Mute music'}>
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        <aside className="w-72 shrink-0 border-r border-ink/20 bg-[#f4ead7] overflow-y-auto flex flex-col no-print">
          <div className="flex border-b border-ink/20 font-sans">
            <button onClick={() => setActiveTab('design')} className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'design' ? 'text-ink-deep bg-paper border-b-2 border-ink-deep' : 'text-ink/70 hover:bg-paper/50'}`}>Desain</button>
            <button onClick={() => setActiveTab('data')} className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'data' ? 'text-ink-deep bg-paper border-b-2 border-ink-deep' : 'text-ink/70 hover:bg-paper/50'}`}>Data Struk</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'design' ? (<><Toolbox /><PaperSettings /></>) : (<DataForm />)}
          </div>
        </aside>

        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  )
}
