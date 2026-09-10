import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AttentionPanel({ stats }) {
  const items = [
    { label: 'Waiting for us', count: stats.waitingForUs, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Waiting for client', count: stats.waitingForClient, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Unassigned', count: stats.unassigned, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Overdue', count: stats.overdue, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-sm font-semibold text-gray-900">Needs Attention</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.label} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center justify-center h-8 w-8 rounded-lg font-bold text-sm ${item.bg} ${item.color}`}>
                {item.count}
              </span>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
