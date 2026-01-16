import React from 'react';
import logoFull from '@/assets/athletix-logo.svg';
import logoIcon from '@/assets/athletix-logo-icon.svg';
import logoHorizontal from '@/assets/athletix-logo-horizontal.svg';

type AthletixLogoProps = {
  variant?: 'full' | 'icon' | 'horizontal';
  className?: string;
  width?: number | string;
  height?: number | string;
  showText?: boolean;
};

const AthletixLogo: React.FC<AthletixLogoProps> = ({
  variant = 'full',
  className = '',
  width,
  height,
  showText = true,
}) => {
  const getLogoPath = () => {
    switch (variant) {
      case 'icon':
        return logoIcon;
      case 'horizontal':
        return logoHorizontal;
      default:
        return logoFull;
    }
  };

  const defaultDimensions = {
    full: { width: 280, height: 80 },
    icon: { width: 200, height: 60 },
    horizontal: { width: 320, height: 90 },
  };

  const dimensions = defaultDimensions[variant];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={getLogoPath()}
        alt="Athletix Logo"
        width={width || dimensions.width}
        height={height || dimensions.height}
        className="object-contain"
      />
    </div>
  );
};

export default AthletixLogo;
