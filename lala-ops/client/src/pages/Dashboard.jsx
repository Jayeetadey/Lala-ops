import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MetricCard from '../components/MetricCard';
import Pipeline from '../components/Pipeline';
import RequestTable from '../components/RequestTable';
import AttentionPanel from '../components/AttentionPanel';
import { getDashboardStats, getRequests } from '../services/api';
import { HelpCircle, Clock, UserPlus, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ waitingForUs: 0, waitingForClient: 0, unassigned: 0, overdue: 0 });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, requestsData] = await Promise.all([
          getDashboardStats(),
          getRequests()
        ]);
        setStats(statsData);
        setRequests(requestsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Manager Dashboard" subtitle="Loading your workspace...">
        <div className="py-12 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Manager Dashboard" 
      subtitle="Monitor requests, workload and operational bottlenecks."
    >
      <div className="space-y-8">
        {/* SECTION 1 - Operational Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title="Waiting for us" 
            value={stats.waitingForUs} 
            description="Needs clarification or internal action" 
            icon={HelpCircle} 
            colorClass="bg-amber-100 text-amber-600" 
          />
          <MetricCard 
            title="Waiting for client" 
            value={stats.waitingForClient} 
            description="Blocked by client response" 
            icon={Clock} 
            colorClass="bg-blue-100 text-blue-600" 
          />
          <MetricCard 
            title="Unassigned" 
            value={stats.unassigned} 
            description="Ready to assign" 
            icon={UserPlus} 
            colorClass="bg-indigo-100 text-indigo-600" 
          />
          <MetricCard 
            title="Overdue" 
            value={stats.overdue} 
            description="Internal work past deadline" 
            icon={AlertCircle} 
            colorClass="bg-red-100 text-red-600" 
          />
        </div>

        {/* Two column layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* SECTION 2 - Pipeline */}
            <Pipeline requests={requests} />

            {/* SECTION 3 - Active Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Active Requests</h2>
              </div>
              <RequestTable requests={requests} />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            {/* SECTION 4 - Work Attention */}
            <AttentionPanel stats={stats} />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
