import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../services/api';
import { Sparkles, ArrowRight } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';

export default function RequestIntake() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [messyText, setMessyText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  
  const [extractedData, setExtractedData] = useState({
    title: '',
    description: '',
    client: '',
    category: 'General',
    priority: 'Medium',
    deadline: ''
  });

  const handleExtract = () => {
    if (!messyText) return;
    setIsExtracting(true);
    
    // Mock AI Extraction
    setTimeout(() => {
      setExtractedData({
        title: 'Extracted: ' + messyText.substring(0, 20) + '...',
        description: messyText,
        client: 'Mock Client LLC',
        category: 'Support',
        priority: 'High',
        deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0] // 3 days from now
      });
      setIsExtracting(false);
      setStep(2);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReq = await createRequest(extractedData);
      navigate(`/requests/${newReq.id}`);
    } catch (error) {
      console.error('Failed to create request', error);
      alert('Failed to create request');
    }
  };

  return (
    <DashboardLayout title="New Client Request" subtitle="Intake unstructured client requests using AI.">
      <div className="max-w-3xl mx-auto space-y-6">
        {step === 1 && (
          <div className="bg-white shadow-sm border border-gray-200 sm:rounded-xl p-6">
            <label htmlFor="messy" className="block text-sm font-medium text-gray-700">
              Raw Request Text (Email, Slack message, etc.)
            </label>
            <div className="mt-2">
              <textarea
                id="messy"
                rows={6}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-lg p-3 border"
                placeholder="e.g. Hey guys, we need the new landing page live by Friday! It's super urgent. Also John from Acme here."
                value={messyText}
                onChange={(e) => setMessyText(e.target.value)}
              />
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleExtract}
                disabled={!messyText || isExtracting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {isExtracting ? 'Extracting...' : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> AI Extract Details
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white shadow-sm border border-gray-200 sm:rounded-xl p-6 border-t-4 border-t-blue-500">
            <div className="flex items-center mb-6 text-blue-600 border-b border-gray-100 pb-4">
              <Sparkles className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-medium">AI Extracted Information</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                    value={extractedData.title}
                    onChange={(e) => setExtractedData({...extractedData, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Client</label>
                  <input
                    type="text"
                    required
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                    value={extractedData.client}
                    onChange={(e) => setExtractedData({...extractedData, client: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg border bg-white"
                    value={extractedData.priority}
                    onChange={(e) => setExtractedData({...extractedData, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg p-2.5 border"
                    value={extractedData.deadline}
                    onChange={(e) => setExtractedData({...extractedData, deadline: e.target.value})}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description / Actions</label>
                  <textarea
                    rows={4}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg p-3 border"
                    value={extractedData.description}
                    onChange={(e) => setExtractedData({...extractedData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Approve & Create Request <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
