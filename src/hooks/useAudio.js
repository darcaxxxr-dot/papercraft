import { useState, useEffect, useRef } from 'react'

const AUDIO_URL = 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('papercraft_muted') === 'true'
  })
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_URL)
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }

    const audio = audioRef.current
    let disposed = false
    const removeInteractionListeners = () => {
      document.removeEventListener('pointerdown', startAudio)
      document.removeEventListener('keydown', startAudio)
    }
    const startAudio = () => {
      if (disposed || isMuted) return
      audio.play().then(() => {
        removeInteractionListeners()
      }).catch((error) => {
        if (error.name !== 'NotAllowedError') {
          console.error('Pemutaran audio ambient gagal:', error)
        }
      })
    }

    if (isMuted) {
      audio.pause()
    } else {
      document.addEventListener('pointerdown', startAudio)
      document.addEventListener('keydown', startAudio)
      startAudio()
    }

    localStorage.setItem('papercraft_muted', isMuted)

    return () => {
      disposed = true
      removeInteractionListeners()
      audio.pause()
    }
  }, [isMuted])

  const toggleMute = () => setIsMuted((prev) => !prev)

  return { isMuted, toggleMute }
}
