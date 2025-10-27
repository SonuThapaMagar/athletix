interface AnimatedBackgroundProps {
  variant?: 'sports' | 'login' | 'signup' | 'default'
  className?: string
}

const AnimatedBackground = ({ variant = 'default', className = '' }: AnimatedBackgroundProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'login':
        return {
          gradient: 'from-blue-50 via-white to-emerald-50',
          colors: {
            primary: 'blue-500',
            secondary: 'emerald-500',
            accent: 'cyan-500',
            tertiary: 'purple-500'
          }
        }
      case 'signup':
        return {
          gradient: 'from-orange-50 via-white to-red-50',
          colors: {
            primary: 'orange-500',
            secondary: 'red-500',
            accent: 'yellow-500',
            tertiary: 'pink-500'
          }
        }
      case 'sports':
        return {
          gradient: 'from-emerald-50 via-white to-blue-50',
          colors: {
            primary: 'emerald-500',
            secondary: 'blue-500',
            accent: 'cyan-500',
            tertiary: 'purple-500'
          }
        }
      default:
        return {
          gradient: 'from-gray-50 via-white to-gray-50',
          colors: {
            primary: 'gray-500',
            secondary: 'blue-500',
            accent: 'emerald-500',
            tertiary: 'purple-500'
          }
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Floating geometric shapes */}
      <div className={`absolute top-20 left-10 w-32 h-32 bg-${styles.colors.primary}/10 rounded-full blur-3xl animate-pulse`}></div>
      <div className={`absolute top-40 right-20 w-24 h-24 bg-${styles.colors.secondary}/10 rounded-full blur-2xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute bottom-20 left-1/4 w-28 h-28 bg-${styles.colors.accent}/10 rounded-full blur-xl animate-pulse`} style={{ animationDelay: '4s' }}></div>
      <div className={`absolute top-1/2 right-1/4 w-20 h-20 bg-${styles.colors.tertiary}/10 rounded-full blur-lg animate-pulse`} style={{ animationDelay: '1s' }}></div>
      
      {/* Abstract sports equipment shapes */}
      <div className={`absolute top-1/3 left-1/3 w-16 h-16 bg-gradient-to-br from-${styles.colors.primary}/20 to-${styles.colors.secondary}/20 rounded-full rotate-45 animate-spin`} style={{ animationDuration: '20s' }}></div>
      <div className={`absolute bottom-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-${styles.colors.accent}/20 to-${styles.colors.primary}/20 rounded-full animate-bounce`} style={{ animationDuration: '3s' }}></div>
      <div className={`absolute top-1/4 right-1/2 w-8 h-8 bg-gradient-to-br from-${styles.colors.tertiary}/20 to-${styles.colors.secondary}/20 rounded-full animate-ping`}></div>
      
      {/* Abstract field lines */}
      <div className={`absolute top-1/2 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-${styles.colors.primary}/30 to-transparent rotate-12 animate-pulse`}></div>
      <div className={`absolute bottom-1/3 right-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-${styles.colors.secondary}/30 to-transparent -rotate-12 animate-pulse`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute top-1/3 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-${styles.colors.accent}/30 to-transparent rotate-45 animate-pulse`} style={{ animationDelay: '2s' }}></div>
      
      {/* Animated waves */}
      <div className={`absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-${styles.colors.primary}/5 to-transparent`}>
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z" fill={`url(#waveGradient1-${variant})`} opacity="0.3">
            <animateTransform attributeName="transform" type="translate" values="0,0; 50,0; 0,0" dur="8s" repeatCount="indefinite"/>
          </path>
          <path d="M0,80 C300,20 600,100 900,80 C1050,70 1200,110 1200,80 L1200,120 L0,120 Z" fill={`url(#waveGradient2-${variant})`} opacity="0.2">
            <animateTransform attributeName="transform" type="translate" values="0,0; -30,0; 0,0" dur="6s" repeatCount="indefinite"/>
          </path>
        </svg>
        <defs>
          <linearGradient id={`waveGradient1-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`var(--color-${styles.colors.primary})`} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={`var(--color-${styles.colors.secondary})`} stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id={`waveGradient2-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`var(--color-${styles.colors.secondary})`} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={`var(--color-${styles.colors.accent})`} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </div>

      {/* Top wave */}
      <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-${styles.colors.primary}/5 to-transparent`}>
        <svg className="absolute top-0 left-0 w-full h-full rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,0 L0,0 Z" fill={`url(#topWaveGradient-${variant})`} opacity="0.2">
            <animateTransform attributeName="transform" type="translate" values="0,0; -40,0; 0,0" dur="10s" repeatCount="indefinite"/>
          </path>
        </svg>
        <defs>
          <linearGradient id={`topWaveGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`var(--color-${styles.colors.primary})`} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={`var(--color-${styles.colors.secondary})`} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
      </div>

      {/* Floating particles */}
      <div className={`absolute top-1/4 left-1/4 w-2 h-2 bg-${styles.colors.primary}/20 rounded-full animate-ping`}></div>
      <div className={`absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-${styles.colors.secondary}/30 rounded-full animate-ping`} style={{ animationDelay: '1s' }}></div>
      <div className={`absolute bottom-1/3 left-1/3 w-1 h-1 bg-${styles.colors.accent}/40 rounded-full animate-ping`} style={{ animationDelay: '2s' }}></div>
      <div className={`absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-${styles.colors.tertiary}/25 rounded-full animate-ping`} style={{ animationDelay: '3s' }}></div>
    </div>
  )
}

export default AnimatedBackground



