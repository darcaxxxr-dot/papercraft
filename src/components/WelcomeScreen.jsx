import './WelcomeScreen.css'

export default function WelcomeScreen({ onEnter, isMuted, toggleMute }) {
  const handleEnter = () => {
    onEnter()
  }

  return (
    <main className="scene" id="scene" aria-label="PaperCraft welcome screen">
      <div className="sky"></div><div className="sun-glow"></div>
      <div className="cloud c1"></div><div className="cloud c2"></div><div className="cloud c3"></div>

      <svg className="hills" viewBox="0 0 1440 650" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path className="hill-back" d="M0 260 Q170 170 330 245 T650 235 T980 200 T1440 210 V650 H0Z"/>
        <path fill="#aab99f" d="M0 350 Q180 240 370 315 T720 295 T1060 280 T1440 300 V650 H0Z"/>
        <path className="hill-mid" d="M0 430 Q170 315 360 395 T720 360 T1080 355 T1440 380 V650 H0Z"/>
        <path className="hill-front" d="M0 520 Q200 410 410 475 T800 455 T1150 440 T1440 475 V650 H0Z"/>
        <path fill="#d9d5b9" opacity=".48" d="M0 570 Q250 500 480 550 T900 520 T1440 540 V650 H0Z"/>
      </svg>

      <svg className="village" viewBox="0 0 300 220" aria-hidden="true">
        <g stroke="#786b56" strokeWidth="2" strokeLinejoin="round">
          <path fill="#e8d7b8" d="M25 105h75v77H25z"/><path fill="#bd8062" d="M15 108l48-42 48 42z"/>
          <path fill="#e8d7b8" d="M105 85h83v98h-83z"/><path fill="#c17c5e" d="M96 88l50-47 52 47z"/>
          <path fill="#e8d7b8" d="M190 105h68v78h-68z"/><path fill="#c17c5e" d="M182 108l42-38 42 38z"/>
          <path fill="#e7d6b9" d="M216 15h28v91h-28z"/><path fill="#b9775b" d="M211 18l19-18 20 18z"/>
          <path fill="#8b7659" d="M54 145h17v37H54zM135 135h20v48h-20zM218 145h14v38h-14z"/>
          <g fill="#71836b" stroke="none"><circle cx="17" cy="173" r="18"/><circle cx="280" cy="173" r="25"/><circle cx="185" cy="180" r="20"/></g>
          <g fill="#8da080" stroke="none"><circle cx="35" cy="185" r="17"/><circle cx="268" cy="190" r="19"/></g>
        </g>
        <g fill="#8a765c"><rect x="38" y="120" width="10" height="12"/><rect x="82" y="120" width="10" height="12"/><rect x="122" y="103" width="12" height="15"/><rect x="163" y="103" width="12" height="15"/><rect x="202" y="121" width="10" height="12"/><rect x="240" y="121" width="10" height="12"/></g>
      </svg>

      <svg className="branch" viewBox="0 0 460 260" aria-hidden="true">
        <path d="M-15 15 Q110 40 210 120 T440 210" fill="none" stroke="#6c6246" strokeWidth="9" strokeLinecap="round"/>
        <g fill="#7d8c65" stroke="#6d7958" strokeWidth="1.2">
          <path d="M70 49Q30 0 10 29Q22 76 70 49Z"/><path d="M110 72Q83 15 55 35Q63 85 110 72Z"/>
          <path d="M150 95Q136 37 105 52Q105 100 150 95Z"/><path d="M190 119Q187 62 154 70Q145 117 190 119Z"/>
          <path d="M225 145Q232 91 201 92Q183 136 225 145Z"/><path d="M270 166Q285 117 253 111Q228 151 270 166Z"/>
          <path d="M312 188Q338 146 307 132Q274 167 312 188Z"/><path d="M95 95Q45 80 40 111Q76 133 95 95Z"/>
          <path d="M145 122Q95 111 95 142Q132 161 145 122Z"/><path d="M205 155Q159 151 166 181Q205 194 205 155Z"/>
        </g>
      </svg>

      <i className="leaf" aria-hidden="true"></i><i className="leaf" aria-hidden="true"></i><i className="leaf" aria-hidden="true"></i>

      <button
        onClick={toggleMute}
        className="absolute top-6 right-6 z-50 p-3 bg-paper/50 hover:bg-paper/80 rounded-full border border-ink/20 text-ink transition-all"
        title={isMuted ? 'Unmute Music' : 'Mute Music'}
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      >
        {isMuted ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
        )}
      </button>

      <section className="center">
        <button className="mark" onClick={handleEnter} aria-label="Enter PaperCraft" title="Enter PaperCraft">
          <svg viewBox="0 0 100 100" role="img" aria-label="PaperCraft receipt mark">
            <path d="M29 17h42a8 8 0 0 1 8 8v53l-8-6-8 6-8-6-8 6-8-6-8 6V25a8 8 0 0 1 8-8Z"
              fill="none" stroke="#76583f" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M40 40h22M40 56h17" fill="none" stroke="#76583f" strokeWidth="7" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="wordmark">PaperCraft</h1>
        <button className="enter" onClick={handleEnter} type="button">click to Enter</button>
      </section>

      <footer className="credit">HLA</footer>
    </main>
  )
}
