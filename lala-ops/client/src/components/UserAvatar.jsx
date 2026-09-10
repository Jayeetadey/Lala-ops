import React from 'react';

export default function UserAvatar({ name, className = "h-8 w-8" }) {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium ${className}`}>
      <span className="text-xs">{getInitials(name)}</span>
    </div>
  );
}
