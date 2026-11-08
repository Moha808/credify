import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronDown, Loader2, Award, FileText } from 'lucide-react';
import RecommendationLetterModal from '../components/RecommendationLetterModal';
import OfficerReviewModal from '../components/OfficerReviewModal';

const History = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedLetterApp, setSelectedLetterApp] = useState(null);
  const [selectedOfficerReviewApp, setSelectedOfficerReviewApp] = useState(null);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {currentUser?.role === 'applicant' ? 'My Application History' : 'All Loan Applications'}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {currentUser?.role === 'applicant'
            ? 'Track the underwriting status and review recommendation letters for your loan submissions.'
            : 'Master list of all applicant entries, AI scores, and credit underwriter decisions.'}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by applicant name or reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="text-left py-3.5 px-4">Ref ID</th>
                <th className="text-left py-3.5 px-4">Applicant</th>
                <th className="text-left py-3.5 px-4">Income (₦/mo)</th>
                <th className="text-left py-3.5 px-4">Loan (₦)</th>
                <th className="text-left py-3.5 px-4">AI Score</th>
                <th className="text-left py-3.5 px-4">Date</th>
                <th className="text-left py-3.5 px-4">Status</th>
                <th className="text-left py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={20} />
                    Loading applications...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-slate-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{app.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{app.applicant || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      ₦{Number(app.ApplicantIncome || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                      ₦{(Number(app.LoanAmount || 0) * 1000).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {app.confidence ? `${app.confidence}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{app.date || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                        ${app.status === 'Approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        }`}>
                        {app.status === 'Approved' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Full Profile Details"
                        >
                          <Eye size={15} />
                        </button>
                        
                        {/* Recommendation Letter Action */}
                        {app.recommendationLetter ? (
                          <button
                            onClick={() => setSelectedLetterApp(app)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-[11px] font-medium transition-colors"
                            title="View Official Recommendation Letter"
                          >
                            <Award size={12} /> Letter
                          </button>
                        ) : currentUser.role === 'officer' && app.status === 'Approved' ? (
                          <button
                            onClick={() => setSelectedOfficerReviewApp(app)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-100 rounded-lg text-[11px] font-medium transition-colors"
                            title="Generate Recommendation Letter"
                          >
                            <FileText size={12} /> Issue
                          </button>
                        ) : null}
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Application Record Details</h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                ${selectedApp.status === 'Approved'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}>
                {selectedApp.status === 'Approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                {selectedApp.status}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase">Application ID</p>
                  <p className="font-mono font-medium text-slate-900 dark:text-white mt-0.5">{selectedApp.id.substring(0, 12)}...</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase">Applicant Name</p>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedApp.applicant || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase">Monthly Income</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    ₦{Number(selectedApp.ApplicantIncome || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase">Requested Principal</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    ₦{(Number(selectedApp.LoanAmount || 0) * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase">Property Area</p>
                  <p className="font-medium text-slate-900 dark:text-white mt-0.5">{selectedApp.Property_Area || 'Urban'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase">AI Confidence Score</p>
                  <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedApp.confidence || 'N/A'}%</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {selectedApp.recommendationLetter && (
                <button
                  onClick={() => {
                    setSelectedLetterApp(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Award size={14} /> View Recommendation Letter
                </button>
              )}
              <button
                onClick={() => setSelectedApp(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Letter Modal */}
      {selectedLetterApp && (
        <RecommendationLetterModal
          application={selectedLetterApp}
          onClose={() => setSelectedLetterApp(null)}
        />
      )}

      {/* Officer Review Modal */}
      {selectedOfficerReviewApp && (
        <OfficerReviewModal
          application={selectedOfficerReviewApp}
          officerName={currentUser?.name || 'Loan Officer'}
          onClose={() => setSelectedOfficerReviewApp(null)}
        />
      )}
    </div>
  );
};

export default History;
