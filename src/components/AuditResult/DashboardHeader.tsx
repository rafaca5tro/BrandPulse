
import React from 'react';
import { Icons } from './icons';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <header className="bg-gray-900/95 border-b border-gray-800/50 py-6 px-8 shadow-lg sticky top-0 z-10 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold font-['Inter'] text-gray-100 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1 font-['Inter']">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-4">
            {actions}
            <button className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 border border-gray-700/30">
              <Icons.Settings size={20} className="text-purple-300" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
