import React from 'react';

export default function MetricCard({ title, value, description, icon: Icon, colorClass }) {
  return (
    <div className="bg-white overflow-hidden border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg ${colorClass}`}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate group-hover:text-gray-700 transition-colors">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900 mt-1">{value}</dd>
            </dl>
          </div>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
