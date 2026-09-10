import React from 'react';

export default function Pipeline({ requests }) {
  const steps = [
    { name: 'New Request', key: 'New Request', color: 'bg-amber-100 text-amber-800' },
    { name: 'Needs Clarification', key: 'Needs Clarification', color: 'bg-amber-100 text-amber-800' },
    { name: 'Ready to Assign', key: 'Ready to Assign', color: 'bg-indigo-100 text-indigo-800' },
    { name: 'In Progress', key: 'In Progress', color: 'bg-green-100 text-green-800' },
    { name: 'Waiting on Client', key: 'Waiting on Client', color: 'bg-blue-100 text-blue-800' },
    { name: 'Done', key: 'Done', color: 'bg-gray-100 text-gray-800' }
  ];

  const counts = requests.reduce((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-900 mb-6">Request Pipeline</h3>
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
          {/* This is just a decorative line behind the steps */}
          <div className="w-full bg-gray-200"></div>
        </div>
        
        <div className="flex justify-between w-full absolute top-[-6px]">
          {steps.map((step, index) => {
            const count = counts[step.key] || 0;
            return (
              <div key={step.name} className="flex flex-col items-center group relative">
                <div className={`w-4 h-4 rounded-full border-4 border-white ${count > 0 ? step.color.split(' ')[0].replace('100', '400') : 'bg-gray-200'}`}></div>
                <div className="mt-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{step.name}</p>
                  <p className="text-sm font-medium mt-1">{count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-16 text-xs text-gray-500 flex items-center justify-center space-x-2">
         <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
         <span>"Waiting on Client" pauses internal deadlines</span>
      </div>
    </div>
  );
}
