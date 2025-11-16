
import React from 'react';
import type { Page } from '../types';
import { HomeIcon, UsersIcon, ArchiveBoxIcon, ChartBarIcon } from './ui/Icons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
    page: Page;
    label: string;
    icon: React.ReactNode;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}> = ({ page, label, icon, currentPage, setCurrentPage }) => {
    const isActive = currentPage === page;
    const activeClasses = 'text-primary';
    const inactiveClasses = 'text-gray-500';

    return (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
};

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-center shadow-lg z-10">
        <NavItem 
            page="dashboard" 
            label="Dashboard" 
            icon={<HomeIcon className="w-6 h-6" />} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <NavItem 
            page="clients" 
            label="Clientes" 
            icon={<UsersIcon className="w-6 h-6" />} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <NavItem 
            page="materials" 
            label="Estoque" 
            icon={<ArchiveBoxIcon className="w-6 h-6" />} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
        <NavItem 
            page="reports" 
            label="Relatórios" 
            icon={<ChartBarIcon className="w-6 h-6" />} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
        />
    </nav>
  );
};

export default BottomNav;
