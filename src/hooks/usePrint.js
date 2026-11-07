import { buildPrintCSS } from '../utils/paper.js'

function normalizeModernColors(clonedDocument) {
  const element = clonedDocument.getElementById('print-area')
  if (!element) throw new Error('Area struk tidak ditemukan untuk ekspor.')

  const canvas = clonedDocument.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Browser tidak mendukung konversi warna untuk ekspor.')

  canvas.width = 1
  canvas.height = 1

  const colorCache = new Map()
  const normalizeValue = (value) => value.replace(/oklab\([^)]*\)|oklch\([^)]*\)/gi, (color) => {
    if (!colorCache.has(color)) {
      context.clearRect(0, 0, 1, 1)
      context.fillStyle = 'rgba(0, 0, 0, 0)'
      context.fillStyle = color
      context.fillRect(0, 0, 1, 1)
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data
      colorCache.set(color, `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`)
    }
    return colorCache.get(color)
  })

  const elements = [element, ...element.querySelectorAll('*')]
  elements.forEach((node) => {
    const styles = clonedDocument.defaultView.getComputedStyle(node)
    for (let index = 0; index < styles.length; index += 1) {
      const property = styles[index]
      if (property.startsWith('--')) continue

      const value = styles.getPropertyValue(property)
      if (value.includes('oklab(') || value.includes('oklch(')) {
        node.style.setProperty(property, normalizeValue(value))
      }
    }
  })
}

async function captureReceipt(element) {
  const html2canvas = (await import('html2canvas')).default
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    onclone: normalizeModernColors,
  })
}

export function usePrint() {
  // Fitur Print bawaan browser (cadangan)
  const printReceipt = (paper) => {
    const styleId = 'trd-print-style'
    let styleEl = document.getElementById(styleId)
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = styleId
      document.head.appendChild(styleEl)
    }
    const css = buildPrintCSS(paper)
    styleEl.innerHTML = `
      ${css}
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
        body * { visibility: hidden; }
        #print-area, #print-area * { visibility: visible; }
        #print-area {
          position: absolute !important; left: 0 !important; top: 0 !important;
          margin: 0 !important; padding: 0 !important;
          width: ${paper.widthMm}mm !important; height: ${paper.heightMm}mm !important;
          box-shadow: none !important; border: none !important;
        }
      }
    `
    window.print()
    const cleanup = () => { if (styleEl) styleEl.innerHTML = ''; window.removeEventListener('afterprint', cleanup) }
    window.addEventListener('afterprint', cleanup)
  }

  // Fitur Export PDF 1:1 (Bypass Dialog Print)
  const exportPDF = async (paper) => {
    const element = document.getElementById('print-area')
    if (!element) return

    // Sembunyikan seleksi/garis saat capture
    element.classList.add('exporting')
    
    try {
      const { jsPDF } = await import('jspdf')
      const canvas = await captureReceipt(element)
      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF({
        orientation: paper.widthMm > paper.heightMm ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [paper.widthMm, paper.heightMm]
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, paper.widthMm, paper.heightMm)
      pdf.save('struk.pdf')
    } catch (err) {
      alert('Gagal mengekspor PDF: ' + err.message)
    } finally {
      element.classList.remove('exporting')
    }
  }

  // Fitur Export Image 1:1
  const exportImage = async (paper) => {
    const element = document.getElementById('print-area')
    if (!element) return

    element.classList.add('exporting')
    
    try {
      const canvas = await captureReceipt(element)
      const link = document.createElement('a')
      link.download = 'struk.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      alert('Gagal mengekspor Gambar: ' + err.message)
    } finally {
      element.classList.remove('exporting')
    }
  }

  return { printReceipt, exportPDF, exportImage }
}
