import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Clock, Settings, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import NotificationBell from '../components/NotificationBell';
import RecommendationLetterModal from '../components/RecommendationLetterModal';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedLetterApp, setSelectedLetterApp] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenLetterFromNotif = async (applicationId) => {
    try {
      const appSnap = await getDoc(doc(db, 'applications', applicationId));
      if (appSnap.exists()) {
        setSelectedLetterApp({ id: appSnap.id, ...appSnap.data() });
      } else {
        navigate('/dashboard/history');
      }
    } catch (err) {
      console.error('Error opening letter from notification:', err);
      navigate('/dashboard/history');
    }
  };

  if (!currentUser) return null;

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm
    ${location.pathname === path
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Link to="/" className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">C</span>
          Credify
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
        <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 text-sm truncate">
          <User size={15} className="text-blue-600 shrink-0" />
          <span className="truncate">{currentUser.name}</span>
        </p>
        <div className="mt-2 inline-block px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs rounded-full font-semibold capitalize border border-blue-200 dark:border-blue-800/40">
          {currentUser.role === 'officer' ? 'Loan Officer' : currentUser.role === 'admin' ? 'Administrator' : 'Applicant'}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <Link to="/dashboard" className={navLinkClass('/dashboard')} onClick={() => setMobileOpen(false)}>
          <Home size={18} /> Overview
        </Link>

        {/* Applicant Links */}
        {currentUser.role === 'applicant' && (
          <>
            <Link to="/dashboard/apply" className={navLinkClass('/dashboard/apply')} onClick={() => setMobileOpen(false)}>
              <FileText size={18} /> Apply for Loan
            </Link>
            <Link to="/dashboard/history" className={navLinkClass('/dashboard/history')} onClick={() => setMobileOpen(false)}>
              <Clock size={18} /> My History
            </Link>
          </>
        )}

        {/* Loan Officer / Admin Links */}
        {(currentUser.role === 'officer' || currentUser.role === 'admin') && (
          <Link to="/dashboard/history" className={navLinkClass('/dashboard/history')} onClick={() => setMobileOpen(false)}>
            <FileText size={18} /> All Applications
          </Link>
        )}

        {/* Admin Only Links */}
        {currentUser.role === 'admin' && (
          <Link to="/dashboard/admin" className={navLinkClass('/dashboard/admin')} onClick={() => setMobileOpen(false)}>
            <Settings size={18} /> System Admin
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors font-medium text-xs sm:text-sm"
        >
          <LogOut size={18} /> Sign Out
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close navigation"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-16 md:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight capitalize">
              {location.pathname.includes('/apply') ? 'New Loan Application' :
               location.pathname.includes('/history') ? 'Loan Records & History' :
               location.pathname.includes('/admin') ? 'Administration' : 'Portal Overview'}
            </h2>
          </div>

          {/* Right Action Icons: Notification Bell + User Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell
              currentUser={currentUser}
              onOpenLetter={handleOpenLetterFromNotif}
            />

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <span className="hidden lg:block text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                {currentUser.name}
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm text-xs">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Global Recommendation Letter Modal from Notification */}
      {selectedLetterApp && (
        <RecommendationLetterModal
          application={selectedLetterApp}
          onClose={() => setSelectedLetterApp(null)}
        />
      )}
    </div>
  );
};

export default MainLayout;
