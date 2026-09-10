import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import RequestIntake from './pages/RequestIntake';
import RequestDetails from './pages/RequestDetails';
import MyWork from './pages/MyWork';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/requests/new" element={<RequestIntake />} />
        <Route path="/requests/:id" element={<RequestDetails />} />
        <Route path="/my-work" element={<MyWork />} />
        {/* other mock routes can just point to Dashboard for now */}
        <Route path="/requests" element={<Dashboard />} />
        <Route path="/employees" element={<Dashboard />} />
        <Route path="/activity" element={<Dashboard />} />
        <Route path="/settings" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
