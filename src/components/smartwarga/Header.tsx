'use client';

import React from 'react';
import { Bell, User, Menu, ShieldCheck, LogIn } from 'lucide-react';
import { AdminUser } from '@/lib/types';

interface HeaderProps {
  user: AdminUser | null;
  onMenuClick: () => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick, onAdminClick }) => {
  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
      <div className="flex items-center space-x-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        {user ? (
          <>
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-2 md:space-x-3 md:pl-6 md:border-l md:border-slate-100">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                <User size={18} />
              </div>
            </div>
          </>
        ) : (
          <button 
            onClick={onAdminClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-xs font-bold shadow-lg shadow-blue-200"
          >
            <LogIn size={16} />
            <span>Login Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
