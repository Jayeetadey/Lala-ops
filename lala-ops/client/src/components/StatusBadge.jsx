import React from 'react';

const statusConfig = {
  'New Request': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Needs Clarification': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Ready to Assign': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'In Progress': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Waiting on Client': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Done': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
}
