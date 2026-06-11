import { useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { EmployeeJourney } from './pages/EmployeeJourney';
import { PreBoardingJourney } from './pages/PreBoardingJourney';
import { TeamDashboard } from './pages/TeamDashboard';

const LayoutShell = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Routes>
    <Route element={<LayoutShell />}>
      <Route path="/" element={<TeamDashboard />} />
      <Route path="/employee/:id" element={<EmployeeJourney />} />
      <Route path="/incoming/:id" element={<PreBoardingJourney />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
