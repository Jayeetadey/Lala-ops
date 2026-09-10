import React from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';

export default function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1">
        <TopHeader title={title} subtitle={subtitle} />
        <main className="flex-1 focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
