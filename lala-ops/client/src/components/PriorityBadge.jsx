import React from 'react';

const priorityConfig = {
  'Low': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'Medium': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
  'Critical': { bg: 'bg-red-100', text: 'text-red-800' },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig['Medium'];
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {priority}
    </span>
  );
}
