
import React from 'react';

interface SakuraIconProps {
  className?: string;
  size?: number;
}

const SakuraIcon: React.FC<SakuraIconProps> = ({ className = "", size = 64 }) => {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Sakura flower petals */}
        <g transform="translate(50,50)">
          {/* Center circle */}
          <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
          
          {/* 5 petals arranged in a circle */}
          {[0, 1, 2, 3, 4].map((index) => (
            <g key={index} transform={`rotate(${index * 72})`}>
              <path
                d="M 0,-6 C -8,-20 -20,-25 -15,-35 C -10,-25 -8,-20 0,-15 C 8,-20 10,-25 15,-35 C 20,-25 8,-20 0,-6 Z"
                fill="#FF6E63"
                className="drop-shadow-sm"
              />
            </g>
          ))}
          
          {/* Inner decoration */}
          <circle cx="0" cy="0" r="3" fill="#FF6E63" />
          <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

export default SakuraIcon;
