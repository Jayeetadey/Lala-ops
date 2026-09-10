import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function ComingSoon({ title }) {
  return (
    <DashboardLayout title={title} subtitle="This feature is currently under development.">
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500">We are working hard to bring you this feature soon.</p>
      </div>
    </DashboardLayout>
  );
}
