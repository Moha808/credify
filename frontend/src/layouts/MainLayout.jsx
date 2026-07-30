import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Clock, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm
    ${location.pathname === path
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Credify
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
        <p className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
          <User size={16} className="text-blue-500" />
          {currentUser.name}
        </p>
        <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-md font-medium capitalize">
          Role: {currentUser.role}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link to="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileOpen(false)}>
          <Home size={20} /> Overview
        </Link>

        {/* Applicant Links */}
        {currentUser.role === 'applicant' && (
          <>
            <Link to="/dashboard/apply" className={navLinkClass('/dashboard/apply')} onClick={() => setMobileOpen(false)}>
              <FileText size={20} /> Apply for Loan
            </Link>
            <Link to="/dashboard/history" className={navLinkClass('/dashboard/history')} onClick={() => setMobileOpen(false)}>
              <Clock size={20} /> My History
            </Link>
          </>
        )}

        {/* Loan Officer / Admin Links */}
        {(currentUser.role === 'officer' || currentUser.role === 'admin') && (
          <Link to="/dashboard/history" className={navLinkClass('/dashboard/history')} onClick={() => setMobileOpen(false)}>
            <FileText size={20} /> All Applications
          </Link>
        )}

        {/* Admin Only Links */}
        {currentUser.role === 'admin' && (
          <Link to="/dashboard/admin" className={navLinkClass('/dashboard/admin')} onClick={() => setMobileOpen(false)}>
            <Settings size={20} /> System Admin
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col hidden md:flex relative z-20 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 md:h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">{currentUser.name}</span>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 text-sm">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
