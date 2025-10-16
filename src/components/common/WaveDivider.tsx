interface WaveDividerProps {
  className?: string;
  fillColor?: string;
  opacity?: number;
}

const WaveDivider = ({ 
  className = "", 
  fillColor = "#2563eb", 
  opacity = 0.1 
}: WaveDividerProps) => {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="relative block w-full h-24 sm:h-32 lg:h-40 xl:h-48"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fillColor} stopOpacity={opacity} />
            <stop offset="50%" stopColor={fillColor} stopOpacity={opacity * 0.8} />
            <stop offset="100%" stopColor={fillColor} stopOpacity={opacity * 0.6} />
          </linearGradient>
        </defs>
        
        {/* Wave 1 - Main wave */}
        <path
          d="M0,160L48,170C96,180,192,200,288,200C384,200,480,180,576,170C672,160,768,160,864,170C960,180,1056,200,1152,200C1248,200,1344,180,1392,170L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="url(#waveGradient)"
          className="animate-pulse"
        />
        
        {/* Wave 2 - Secondary wave for depth */}
        <path
          d="M0,120L48,130C96,140,192,160,288,160C384,160,480,140,576,130C672,120,768,120,864,130C960,140,1056,160,1152,160C1248,160,1344,140,1392,130L1440,120L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={fillColor}
          fillOpacity={opacity * 0.7}
          className="animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        
        {/* Wave 3 - Accent wave */}
        <path
          d="M0,80L48,90C96,100,192,120,288,120C384,120,480,100,576,90C672,80,768,80,864,90C960,100,1056,120,1152,120C1248,120,1344,100,1392,90L1440,80L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={fillColor}
          fillOpacity={opacity * 0.4}
          className="animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Wave 4 - Deep accent wave */}
        <path
          d="M0,40L48,50C96,60,192,80,288,80C384,80,480,60,576,50C672,40,768,40,864,50C960,60,1056,80,1152,80C1248,80,1344,60,1392,50L1440,40L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={fillColor}
          fillOpacity={opacity * 0.2}
          className="animate-pulse"
          style={{ animationDelay: '3s' }}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
