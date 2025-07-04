
import React from 'react';

interface SakuraIconProps {
  className?: string;
  size?: number;
}

const SakuraIcon: React.FC<SakuraIconProps> = ({ className = "", size = 64 }) => {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <img src="/iso-saku.png" alt="Sakura Dental Logo" className="w-full h-full" />
    </div>
  );
};

export default SakuraIcon;
