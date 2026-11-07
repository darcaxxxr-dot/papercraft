import { useState, useEffect } from 'react'
import { DesignerProvider } from './context/DesignerContext.jsx'
import Layout from './components/Layout.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import { useAutoSave, loadAutoSave } from './hooks/useAutoSave.js'
import { useDesigner } from './hooks/useDesigner.js'
import { useAudio } from './hooks/useAudio.js'

function AppInitializer({ children }) {
  const { actions } = useDesigner()
  useAutoSave()

  useEffect(() => {
    const saved = loadAutoSave()
    if (saved && saved.elements && saved.elements.length > 0) {
      actions.loadTemplate(saved)
    }
  }, [])

  return children
}

function App() {
  const [isEntered, setIsEntered] = useState(() => {
    const saved = loadAutoSave()
    return saved !== null && saved.elements !== undefined
  })

  const [isTransitioning, setIsTransitioning] = useState(false)
  const { isMuted, toggleMute } = useAudio()

  const handleNavigation = (targetState) => {
    setIsTransitioning(true)

    setTimeout(() => {
      setIsEntered(targetState)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    }, 800)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-paper text-ink-deep font-serif">
      {isTransitioning && <LoadingScreen />}

      <div className={`w-full h-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {!isEntered ? (
          <WelcomeScreen
            onEnter={() => handleNavigation(true)}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
        ) : (
          <DesignerProvider>
            <AppInitializer>
              <Layout
                isMuted={isMuted}
                toggleMute={toggleMute}
                onGoHome={() => handleNavigation(false)}
              />
            </AppInitializer>
          </DesignerProvider>
        )}
      </div>
    </div>
  )
}

export default App
