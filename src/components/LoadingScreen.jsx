export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper transition-opacity">
      <div className="relative flex items-center justify-center w-28 h-28">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-ink/30 animate-[spin_4s_linear_infinite]"></div>
        <div className="w-20 h-20 bg-[#f4ead7] rounded-2xl shadow-[inset_0_2px_10px_rgba(137,105,70,0.1)] flex items-center justify-center animate-pulse">
          <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
            <path d="M29 17h42a8 8 0 0 1 8 8v53l-8-6-8 6-8-6-8 6-8-6-8 6V25a8 8 0 0 1 8-8Z" stroke="#76583f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M40 40h22M40 56h17" stroke="#76583f" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <p className="mt-8 text-ink font-serif italic text-lg tracking-widest animate-pulse">Crafting...</p>
    </div>
  )
}
