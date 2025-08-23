import React from 'react';

interface GlowEffectProps {
  children: React.ReactNode;
  color: string;
  intensity?: number;
  isActive?: boolean;
}

export const GlowEffect: React.FC<GlowEffectProps> = ({ 
  children, 
  color, 
  intensity = 10,
  isActive = true 
}) => {
  return (
    <div 
      style={{ 
        filter: isActive ? `drop-shadow(0 0 ${intensity}px ${color})` : 'none',
        transition: 'filter 0.3s ease',
      }}
    >
      {children}
    </div>
  );
};
