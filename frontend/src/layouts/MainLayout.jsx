import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, FileText, Clock, Settings, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null; // Protected route handles the redirect

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden md:flex relative z-20 shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Credify
          </Link>
        </div>
        
        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
          <p className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
            <User size={16} className="text-blue-500" />
            {currentUser.name}
          </p>
          <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-md font-medium capitalize">
            Role: {currentUser.role}
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Dashboard (All roles see this, but it changes content later) */}
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
            <Home size={20} /> Overview
          </Link>

          {/* Applicant Links */}
          {currentUser.role === 'applicant' && (
            <>
              <Link to="/dashboard/apply" className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                <FileText size={20} /> Apply for Loan
              </Link>
              <Link to="/dashboard/history" className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                <Clock size={20} /> My History
              </Link>
            </>
          )}

          {/* Loan Officer / Admin Links */}
          {(currentUser.role === 'officer' || currentUser.role === 'admin') && (
            <Link to="/dashboard/history" className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <FileText size={20} /> All Applications
            </Link>
          )}

          {/* Admin Only Links */}
          {currentUser.role === 'admin' && (
            <Link to="/dashboard/admin" className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              <Settings size={20} /> System Admin
            </Link>
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-danger rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-600 dark:text-slate-300">
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
