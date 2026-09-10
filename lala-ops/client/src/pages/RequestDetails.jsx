import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, updateRequestStatus, assignEmployee } from '../services/api';
import { User, Calendar, Tag, AlertCircle, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import UserAvatar from '../components/UserAvatar';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequest = async () => {
    try {
      const data = await getRequestById(id);
      setRequest(data);
      setActivity(data.activity || []);
    } catch (error) {
      console.error('Failed to load request', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    await updateRequestStatus(id, newStatus);
    fetchRequest();
  };

  const handleAssign = async () => {
    const employee = prompt("Enter employee name to assign (or leave blank to unassign):", request.assignee || "");
    if (employee !== null) {
      await assignEmployee(id, employee || null);
      fetchRequest();
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Request Details" subtitle="Loading request data...">
        <div className="p-8 text-center text-gray-500">Loading request details...</div>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout title="Request Not Found" subtitle="Error">
        <div className="p-8 text-center text-red-500">Request not found.</div>
      </DashboardLayout>
    );
  }

  const isWaitingOnClient = request.status === 'Waiting on Client';

  return (
    <DashboardLayout 
      title={`Request: ${request.title}`} 
      subtitle={`Client: ${request.client}`}
    >
      <div className="mb-6">
        <button 
          onClick={() => navigate('/requests')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Requests
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className={`bg-white shadow-sm border ${isWaitingOnClient ? 'border-yellow-300' : 'border-gray-200'} sm:rounded-xl overflow-hidden`}>
            <div className={`px-6 py-5 flex justify-between items-center ${isWaitingOnClient ? 'bg-yellow-50/50' : 'bg-gray-50/50'} border-b border-gray-100`}>
              <div>
                <h3 className="text-lg leading-6 font-semibold text-gray-900">{request.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{request.client}</p>
              </div>
              <div className="flex space-x-2">
                <StatusBadge status={request.status} />
              </div>
            </div>
            
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1.5"/> Priority</dt>
                  <dd className="mt-2 text-sm text-gray-900">
                    <PriorityBadge priority={request.priority} />
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><Calendar className="w-4 h-4 mr-1.5"/> Deadline</dt>
                  <dd className="mt-2 text-sm font-medium text-gray-900">{request.deadline ? new Date(request.deadline).toLocaleDateString() : 'None'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><User className="w-4 h-4 mr-1.5"/> Assignee</dt>
                  <dd className="mt-2 text-sm font-medium text-gray-900 flex items-center">
                    {request.assignee ? (
                      <>
                        <UserAvatar name={request.assignee} className="h-6 w-6 mr-2" />
                        {request.assignee}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center"><Tag className="w-4 h-4 mr-1.5"/> Category</dt>
                  <dd className="mt-2 text-sm font-medium text-gray-900 bg-gray-100 inline-flex px-2 py-1 rounded">{request.category}</dd>
                </div>
                <div className="sm:col-span-2 mt-2 pt-6 border-t border-gray-100">
                  <dt className="text-sm font-medium text-gray-500 mb-3">Description</dt>
                  <dd className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{request.description}</dd>
                </div>
              </dl>
            </div>
          </div>

          {isWaitingOnClient && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    This request is currently waiting on the client. It is excluded from internal overdue metrics.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm border border-gray-200 sm:rounded-xl px-4 py-5 sm:px-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Manager Actions</h4>
            <div className="flex flex-col space-y-3">
              <button onClick={() => handleStatusChange('Needs Clarification')} className="w-full text-left px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Mark: Needs Clarification
              </button>
              <button onClick={() => handleStatusChange('Ready to Assign')} className="w-full text-left px-4 py-2 border border-indigo-200 shadow-sm text-sm font-medium rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                Mark: Ready to Assign
              </button>
              <button onClick={handleAssign} className="w-full text-left px-4 py-2 border border-blue-200 shadow-sm text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                Assign Employee
              </button>
              <button onClick={() => handleStatusChange('In Progress')} className="w-full text-left px-4 py-2 border border-green-200 shadow-sm text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
                Start: In Progress
              </button>
              <button onClick={() => handleStatusChange('Waiting on Client')} className="w-full text-left px-4 py-2 border border-yellow-200 shadow-sm text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                Wait on Client
              </button>
              <button onClick={() => handleStatusChange('Done')} className="w-full text-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-black transition-colors mt-2">
                Mark Done
              </button>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 sm:rounded-xl">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
              <h4 className="text-sm font-semibold text-gray-900">Activity Timeline</h4>
            </div>
            <div className="px-4 py-5 sm:px-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {activity.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== activity.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {event.action} <span className="font-medium text-gray-900">by {event.actor}</span>
                              </p>
                              {event.details && <p className="mt-1 text-xs text-gray-500">{event.details}</p>}
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-400 font-medium">
                              {new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
