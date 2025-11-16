import React from 'react';
import { WifiIcon, ArrowRightOnRectangleIcon } from './ui/Icons';

interface HeaderProps {
    title: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout }) => {
  return (
    <header className="bg-primary text-primary-content shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
            <WifiIcon className="h-6 w-6 mr-3" />
            <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <button 
            onClick={onLogout} 
            className="text-primary-content hover:bg-primary-focus p-2 rounded-full"
            aria-label="Sair do aplicativo"
            title="Sair"
        >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
    </header>
  );
};

export default Header;