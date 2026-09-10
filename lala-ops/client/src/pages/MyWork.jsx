import React, { useEffect, useState } from 'react';
import { getRequests } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import RequestTable from '../components/RequestTable';

export default function MyWork() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, this would come from the auth context
  const currentUser = "Demo Manager";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const allRequests = await getRequests();
        // Filter tasks that are In Progress and assigned to the current user
        // For demo purposes, if the assignee matches exactly, show it.
        const myActiveTasks = allRequests.filter(
          r => r.status === 'In Progress' && r.assignee === currentUser
        );
        setTasks(myActiveTasks);
      } catch (error) {
        console.error("Failed to load tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Work" subtitle={`Active tasks for ${currentUser}`}>
        <div className="p-8 text-center text-gray-500">Loading your work...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="My Work" 
      subtitle={`Showing active 'In Progress' tasks assigned to ${currentUser}.`}
    >
      <div className="space-y-6 max-w-6xl">
        <RequestTable requests={tasks} />
      </div>
    </DashboardLayout>
  );
}
