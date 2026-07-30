import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronDown, Loader2 } from 'lucide-react';

const History = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    let q;
    const appsRef = collection(db, 'applications');
    
    // Filter data: Applicants only see their own, Officers/Admins see all
    if (currentUser.role === 'applicant') {
      q = query(appsRef, where('userId', '==', currentUser.uid));
    } else {
      q = query(appsRef);
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date client-side (newest first)
      appsData.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setApplications(appsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Build filtered list
  let filteredApps = [...applications];

  // Apply search filter
  if (searchTerm) {
    filteredApps = filteredApps.filter(a =>
      (a.applicant && a.applicant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (a.id && a.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Apply status filter
  if (statusFilter !== 'All') {
    filteredApps = filteredApps.filter(a => a.status === statusFilter);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          {currentUser?.role === 'applicant' ? 'My Application History' : 'All Applications'}
        </h1>
        <p className="text-slate-500 mt-1">
          {currentUser?.role === 'applicant'
            ? 'Track the status of your previous loan applications.'
            : 'Review and manage all loan applications in the system.'}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Applications Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Applicant</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Income</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Loan ($K)</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Area</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    <p>Loading applications...</p>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <p className="text-lg font-medium">No applications found</p>
                    <p className="text-sm mt-1">Submit a loan application to see it here.</p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs text-slate-600 dark:text-slate-300">{app.id.substring(0, 8)}...</td>
                    <td className="py-3.5 px-5 font-medium text-slate-800 dark:text-white">{app.applicant || 'N/A'}</td>
                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">${Number(app.ApplicantIncome || app.income || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">${app.LoanAmount || app.loanAmount || 'N/A'}K</td>
                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">{app.Property_Area || app.area || 'N/A'}</td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">{app.date || 'N/A'}</td>
                    <td className="py-3.5 px-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${app.status === 'Approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {app.status === 'Approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Application Details</h2>
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium
                ${selectedApp.status === 'Approved'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {selectedApp.status === 'Approved' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {selectedApp.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Application ID</p>
                  <p className="font-mono font-medium text-slate-800 dark:text-white text-sm">{selectedApp.id.substring(0, 12)}...</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Applicant</p>
                  <p className="font-medium text-slate-800 dark:text-white">{selectedApp.applicant || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Gender</p>
                  <p className="font-medium text-slate-800 dark:text-white">{selectedApp.Gender || selectedApp.gender || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Married</p>
                  <p className="font-medium text-slate-800 dark:text-white">{selectedApp.Married || selectedApp.married || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Income</p>
                  <p className="font-medium text-slate-800 dark:text-white">${Number(selectedApp.ApplicantIncome || selectedApp.income || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Loan Amount</p>
                  <p className="font-medium text-slate-800 dark:text-white">${selectedApp.LoanAmount || selectedApp.loanAmount || 'N/A'}K</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Property Area</p>
                  <p className="font-medium text-slate-800 dark:text-white">{selectedApp.Property_Area || selectedApp.area || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                  <p className="text-xs text-slate-500 dark:text-slate-400">AI Confidence</p>
                  <p className="font-medium text-blue-500">{selectedApp.confidence || 'N/A'}%</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedApp(null)}
              className="w-full mt-6 px-6 py-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
