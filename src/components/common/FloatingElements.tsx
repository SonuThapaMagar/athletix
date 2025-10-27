interface FloatingElementsProps {
  count?: number
  variant?: 'particles' | 'shapes' | 'sports'
  className?: string
  colors?: string[]
}

const FloatingElements = ({ 
  count = 6, 
  variant = 'particles', 
  className = '',
  colors = ['blue-500', 'emerald-500', 'purple-500', 'orange-500', 'cyan-500', 'pink-500']
}: FloatingElementsProps) => {
  const generateElements = () => {
    const elements = []
    
    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length]
      const size = variant === 'particles' ? 
        Math.random() * 4 + 1 : // 1-5px for particles
        Math.random() * 20 + 10 // 10-30px for shapes
      
      const animationDelay = Math.random() * 3
      const duration = Math.random() * 4 + 2 // 2-6 seconds
      
      elements.push({
        id: i,
        color,
        size,
        animationDelay,
        duration,
        position: {
          top: Math.random() * 80 + 10, // 10-90%
          left: Math.random() * 80 + 10, // 10-90%
        }
      })
    }
    
    return elements
  }

  const elements = generateElements()

  const getElementStyle = (element: any) => {
    const baseStyle = {
      position: 'absolute' as const,
      top: `${element.position.top}%`,
      left: `${element.position.left}%`,
      width: `${element.size}px`,
      height: `${element.size}px`,
      animationDelay: `${element.animationDelay}s`,
      animationDuration: `${element.duration}s`
    }

    switch (variant) {
      case 'particles':
        return {
          ...baseStyle,
          backgroundColor: `var(--color-${element.color})`,
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'ping'
        }
      case 'shapes':
        return {
          ...baseStyle,
          backgroundColor: `var(--color-${element.color})`,
          borderRadius: Math.random() > 0.5 ? '50%' : '20%',
          opacity: 0.2,
          animation: 'pulse'
        }
      case 'sports':
        return {
          ...baseStyle,
          backgroundColor: `var(--color-${element.color})`,
          borderRadius: '50%',
          opacity: 0.4,
          animation: Math.random() > 0.5 ? 'bounce' : 'ping'
        }
      default:
        return baseStyle
    }
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element) => (
        <div
          key={element.id}
          className={`bg-${element.color}/20 animate-${variant === 'particles' ? 'ping' : variant === 'shapes' ? 'pulse' : 'bounce'}`}
          style={getElementStyle(element)}
        />
      ))}
    </div>
  )
}

export default FloatingElements



