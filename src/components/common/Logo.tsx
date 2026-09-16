import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = false }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-8 h-8 rounded-xl',
    lg: 'w-10 h-10 rounded-xl',
    xl: 'w-14 h-14 rounded-2xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div 
        className={`relative overflow-hidden flex items-center justify-center shadow-md bg-white border border-slate-100 ${sizeClasses[size]}`}
      >
        {!imgError ? (
          <img 
            src="/logo.jpg" 
            alt="PipelinePro Logo" 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center font-black text-white text-xs">
            P
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
            PipelinePro
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              CRM
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Enterprise Pipeline OS</span>
        </div>
      )}
    </div>
  );
};
