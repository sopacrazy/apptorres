import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import MaterialList from './components/MaterialList';
import Reports from './components/Reports';
import Login from './components/Login';
import type { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard'); // Reset to default page on logout
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'clients':
        return <ClientList />;
      case 'materials':
        return <MaterialList />;
      case 'reports':
        return <Reports />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans text-neutral">
      <Header title={getPageTitle(currentPage)} onLogout={handleLogout} />
      <main className="flex-grow overflow-y-auto bg-base-200 p-4 pb-20">
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

const getPageTitle = (page: Page): string => {
  switch (page) {
    case 'dashboard': return 'Dashboard';
    case 'clients': return 'Clientes';
    case 'materials': return 'Estoque';
    case 'reports': return 'Relatórios';
    default: return 'TorresApp';
  }
}

export default App;