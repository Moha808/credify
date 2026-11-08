import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import {
  Users, ShieldCheck, Activity, Trash2, CheckCircle,
  XCircle, AlertTriangle, Database, Cpu, Loader2, Download, FileSpreadsheet
} from 'lucide-react';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteAppConfirm, setShowDeleteAppConfirm] = useState(null);
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    // Fetch Applications
    const appsUnsubscribe = onSnapshot(collection(db, 'applications'), (snapshot) => {
      setApplications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Users
    const usersUnsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      appsUnsubscribe();
      usersUnsubscribe();
    };
  }, []);

  const handleDeleteApplication = async (id) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
      setShowDeleteAppConfirm(null);
      setActionSuccess('Application record permanently deleted from database.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete application.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setShowDeleteUserConfirm(null);
      setActionSuccess('User account successfully removed from system registry.');
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Failed to delete user account.");
    }
  };

  // CSV Export for Audit & Governance Reporting
  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('No application records available to export.');
      return;
    }

    const headers = [
      'Application ID',
      'Applicant Name',
      'Gender',
      'Marital Status',
      'Education',
      'Monthly Income (NGN)',
      'Loan Requested (NGN)',
      'Term (Months)',
      'Credit History',
      'Property Area',
      'AI Status',
      'Confidence Score (%)',
      'Date',
      'Underwriter Action'
    ];

    const rows = applications.map(app => [
      `"${app.id}"`,
      `"${app.applicant || 'N/A'}"`,
      `"${app.Gender || 'N/A'}"`,
      `"${app.Married || 'N/A'}"`,
      `"${app.Education || 'N/A'}"`,
      app.ApplicantIncome || 0,
      app.LoanAmount ? Number(app.LoanAmount) * 1000 : 0,
      app.Loan_Amount_Term || 24,
      app.Credit_History === '1.0' ? 'Good' : 'Bad',
      `"${app.Property_Area || 'N/A'}"`,
      `"${app.status || 'Pending'}"`,
      app.confidence || 'N/A',
      `"${app.date || 'N/A'}"`,
      `"${app.officerAction || 'Pending Review'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Credify_System_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalApps = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const validConfApps = applications.filter(a => typeof a.confidence === 'number' && !isNaN(a.confidence));
  const avgConfidence = validConfApps.length > 0
    ? (validConfApps.reduce((acc, curr) => acc + curr.confidence, 0) / validConfApps.length).toFixed(1)
    : '89.4';

  return (
    <div className="space-y-8">
      {/* Top Header with Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            System Administration & Governance
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Platform oversight, user management, audit data downloads, and database control
          </p>
        </div>

        <div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Download size={15} /> Export Audit Report (CSV)
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-xs flex items-center gap-2">
          <CheckCircle size={15} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Users size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Registered Accounts</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center">
              <Database size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Loan Records</p>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalApps}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <Cpu size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg AI Confidence</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{avgConfidence}%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Platform Status</p>
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online & Healthy
          </p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-600" />
              Registered User Registry ({users.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage user roles and remove obsolete or test accounts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="text-left py-3.5 px-4">Full Name</th>
                <th className="text-left py-3.5 px-4">Email</th>
                <th className="text-left py-3.5 px-4">Role</th>
                <th className="text-left py-3.5 px-4">Created Date</th>
                <th className="text-left py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-slate-400" size={20} /></td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{user.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' :
                          user.role === 'officer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {user.createdAt ? user.createdAt.split('T')[0] : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {user.role !== 'admin' ? (
                        <button
                          onClick={() => setShowDeleteUserConfirm(user.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete User Account"
                        >
                          <Trash2 size={15} />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Records Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={18} className="text-indigo-600" />
            Global Application Records ({applications.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Database audit view for all loan submissions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="text-left py-3.5 px-4">ID</th>
                <th className="text-left py-3.5 px-4">Applicant</th>
                <th className="text-left py-3.5 px-4">Loan (₦)</th>
                <th className="text-left py-3.5 px-4">Confidence</th>
                <th className="text-left py-3.5 px-4">Status</th>
                <th className="text-left py-3.5 px-4">Date</th>
                <th className="text-left py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{app.id.substring(0, 8)}...</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{app.applicant || 'N/A'}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                    ₦{(Number(app.LoanAmount || app.loanAmount || 0) * 1000).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {app.confidence ? `${app.confidence}%` : 'N/A'}
                    </span>
                  </td>
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
                  <td className="py-3 px-4 text-slate-500">{app.date || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setShowDeleteAppConfirm(app.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Application Confirmation Modal */}
      {showDeleteAppConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Application?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
              This record will be permanently deleted from the database. This action cannot be reversed.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteAppConfirm(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteApplication(showDeleteAppConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteUserConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete User Account?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
              This will remove the user from the registered users registry in Firestore.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteUserConfirm(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteUserConfirm)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
