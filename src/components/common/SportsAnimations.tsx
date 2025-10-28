interface SportsAnimationsProps {
  variant?: 'login' | 'signup' | 'sports' | 'default'
  className?: string
}

const SportsAnimations = ({ variant = 'default', className = '' }: SportsAnimationsProps) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'login':
        return {
          gradient: 'from-blue-50 via-white to-emerald-50',
          primary: 'blue-500',
          secondary: 'emerald-500',
          accent: 'cyan-500',
          tertiary: 'purple-500',
          waveColors: {
            primary: '#3b82f6',
            secondary: '#10b981',
            accent: '#06b6d4'
          }
        }
      case 'signup':
        return {
          gradient: 'from-orange-50 via-white to-red-50',
          primary: 'orange-500',
          secondary: 'red-500',
          accent: 'yellow-500',
          tertiary: 'pink-500',
          waveColors: {
            primary: '#f97316',
            secondary: '#ef4444',
            accent: '#f59e0b'
          }
        }
      case 'sports':
        return {
          gradient: 'from-emerald-50 via-white to-blue-50',
          primary: 'emerald-500',
          secondary: 'blue-500',
          accent: 'cyan-500',
          tertiary: 'purple-500',
          waveColors: {
            primary: '#10b981',
            secondary: '#3b82f6',
            accent: '#06b6d4'
          }
        }
      default:
        return {
          gradient: 'from-gray-50 via-white to-gray-50',
          primary: 'gray-500',
          secondary: 'blue-500',
          accent: 'emerald-500',
          tertiary: 'purple-500',
          waveColors: {
            primary: '#6b7280',
            secondary: '#3b82f6',
            accent: '#10b981'
          }
        }
    }
  }

  const config = getVariantConfig()

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating geometric shapes representing different sports */}
      <div className={`absolute top-20 left-10 w-32 h-32 bg-${config.primary}/10 rounded-full blur-3xl animate-pulse`}></div>
      <div className={`absolute top-40 right-20 w-24 h-24 bg-${config.secondary}/10 rounded-full blur-2xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute bottom-20 left-1/4 w-28 h-28 bg-${config.accent}/10 rounded-full blur-xl animate-pulse`} style={{ animationDelay: '4s' }}></div>
      <div className={`absolute top-1/2 right-1/4 w-20 h-20 bg-${config.tertiary}/10 rounded-full blur-lg animate-pulse`} style={{ animationDelay: '1s' }}></div>
      
      {/* Abstract sports equipment shapes */}
      <div className={`absolute top-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-${config.primary}/20 to-${config.secondary}/20 rounded-full rotate-45 animate-spin`} style={{ animationDuration: '20s' }}></div>
      <div className={`absolute bottom-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-${config.accent}/20 to-${config.primary}/20 rounded-full animate-bounce`} style={{ animationDuration: '3s' }}></div>
      <div className={`absolute top-1/4 right-1/2 w-8 h-8 bg-gradient-to-br from-${config.tertiary}/20 to-${config.secondary}/20 rounded-full animate-ping`}></div>
      
      {/* Abstract sports field lines */}
      <div className={`absolute top-1/2 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-${config.primary}/30 to-transparent rotate-12 animate-pulse`}></div>
      <div className={`absolute bottom-1/3 right-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-${config.secondary}/30 to-transparent -rotate-12 animate-pulse`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute top-1/3 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-${config.accent}/30 to-transparent rotate-45 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      
      {/* Animated waves representing movement */}
      <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-${config.primary}/5 to-transparent`}>
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z" fill={`url(#sportsWaveGradient1-${variant})`} opacity="0.3">
            <animateTransform attributeName="transform" type="translate" values="0,0; 50,0; 0,0" dur="8s" repeatCount="indefinite"/>
          </path>
          <path d="M0,80 C300,20 600,100 900,80 C1050,70 1200,110 1200,80 L1200,120 L0,120 Z" fill={`url(#sportsWaveGradient2-${variant})`} opacity="0.2">
            <animateTransform attributeName="transform" type="translate" values="0,0; -30,0; 0,0" dur="6s" repeatCount="indefinite"/>
          </path>
        </svg>
        <defs>
          <linearGradient id={`sportsWaveGradient1-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={config.waveColors.primary} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={config.waveColors.secondary} stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id={`sportsWaveGradient2-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={config.waveColors.secondary} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={config.waveColors.accent} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </div>

      {/* Top wave */}
      <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-${config.primary}/5 to-transparent`}>
        <svg className="absolute top-0 left-0 w-full h-full rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,0 L0,0 Z" fill={`url(#sportsTopWaveGradient-${variant})`} opacity="0.2">
            <animateTransform attributeName="transform" type="translate" values="0,0; -40,0; 0,0" dur="10s" repeatCount="indefinite"/>
          </path>
        </svg>
        <defs>
          <linearGradient id={`sportsTopWaveGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={config.waveColors.primary} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={config.waveColors.secondary} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </div>

      {/* Floating particles representing energy/movement */}
      <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-${config.primary}/20 rounded-full animate-ping`}></div>
      <div className={`absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-${config.secondary}/30 rounded-full animate-ping`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute bottom-1/3 left-1/3 w-1 h-1 bg-${config.accent}/40 rounded-full animate-ping`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-${config.tertiary}/25 rounded-full animate-ping`} style={{ animationDelay: '3s' }}></div>
    </div>
  )
}

export default SportsAnimations






