import React, { useState } from 'react';
import { TeamMember } from '../../types/crm';

interface AvatarProps {
  user: TeamMember;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ user, size = 'sm', showName = false, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[11px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm'
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} title={`${user.name} (${user.role})`}>
      <div 
        className={`relative rounded-full flex items-center justify-center font-semibold text-white overflow-hidden shadow-sm flex-shrink-0 ${sizeClasses[size]}`}
        style={{ backgroundColor: user.color || '#579bfc' }}
      >
        {!imgError && user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{user.initials}</span>
        )}
      </div>
      {showName && (
        <span className="text-sm font-medium text-slate-700 truncate">{user.name}</span>
      )}
    </div>
  );
};
