interface AnimatedWavesProps {
  position?: 'top' | 'bottom' | 'both'
  colors?: {
    primary: string
    secondary: string
    accent: string
  }
  opacity?: number
  className?: string
  variant?: string
}

const AnimatedWaves = ({ 
  position = 'bottom',
  colors = {
    primary: '#3b82f6',
    secondary: '#10b981', 
    accent: '#06b6d4'
  },
  opacity = 0.3,
  className = '',
  variant = 'default'
}: AnimatedWavesProps) => {
  const waveId = `wave-${variant}-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Bottom Wave */}
      {position === 'bottom' || position === 'both' ? (
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-current/5 to-transparent">
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z" fill={`url(#${waveId}-bottom-1)`} opacity={opacity}>
              <animateTransform attributeName="transform" type="translate" values="0,0; 50,0; 0,0" dur="8s" repeatCount="indefinite"/>
            </path>
            <path d="M0,80 C300,20 600,100 900,80 C1050,70 1200,110 1200,80 L1200,120 L0,120 Z" fill={`url(#${waveId}-bottom-2)`} opacity={opacity * 0.7}>
              <animateTransform attributeName="transform" type="translate" values="0,0; -30,0; 0,0" dur="6s" repeatCount="indefinite"/>
            </path>
          </svg>
          <defs>
            <linearGradient id={`${waveId}-bottom-1`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={opacity}/>
              <stop offset="100%" stopColor={colors.secondary} stopOpacity={opacity * 0.3}/>
            </linearGradient>
            <linearGradient id={`${waveId}-bottom-2`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.secondary} stopOpacity={opacity * 0.7}/>
              <stop offset="100%" stopColor={colors.accent} stopOpacity={opacity * 0.3}/>
            </linearGradient>
          </defs>
        </div>
      ) : null}

      {/* Top Wave */}
      {position === 'top' || position === 'both' ? (
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-current/5 to-transparent">
          <svg className="absolute top-0 left-0 w-full h-full rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,0 L0,0 Z" fill={`url(#${waveId}-top)`} opacity={opacity * 0.7}>
              <animateTransform attributeName="transform" type="translate" values="0,0; -40,0; 0,0" dur="10s" repeatCount="indefinite"/>
            </path>
          </svg>
          <defs>
            <linearGradient id={`${waveId}-top`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={opacity * 0.7}/>
              <stop offset="100%" stopColor={colors.secondary} stopOpacity={opacity * 0.3}/>
            </linearGradient>
          </defs>
        </div>
      ) : null}
    </div>
  )
}

export default AnimatedWaves



