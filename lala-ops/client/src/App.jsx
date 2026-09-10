import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RequestIntake from './pages/RequestIntake';
import RequestDetails from './pages/RequestDetails';
import MyWork from './pages/MyWork';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/requests/new" element={<RequestIntake />} />
        <Route path="/requests/:id" element={<RequestDetails />} />
        <Route path="/my-work" element={<MyWork />} />
        
        <Route path="/requests" element={<ComingSoon title="All Requests" />} />
        <Route path="/employees" element={<ComingSoon title="Employees" />} />
        <Route path="/activity" element={<ComingSoon title="Activity Log" />} />
        <Route path="/settings" element={<ComingSoon title="Settings" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
