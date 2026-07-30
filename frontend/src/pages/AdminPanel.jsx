import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Users, ShieldCheck, Activity, Trash2, CheckCircle, XCircle, AlertTriangle, Database, Cpu, Loader2 } from 'lucide-react';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'applications', id));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete application.");
    }
  };

  const totalApps = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">System Administration</h1>
        <p className="text-slate-500 mt-1">Manage users, review applications, and monitor system health.</p>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
              <Users size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Registered Users</p>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{users.length}</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center">
              <Database size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Records</p>
          </div>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalApps}</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center">
              <Cpu size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Model Accuracy</p>
          </div>
          <p className="text-3xl font-bold text-green-500">98.5%</p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">System Status</p>
          </div>
          <p className="text-lg font-bold text-green-500 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            Operational
          </p>
        </div>
      </div>

      {/* User Management */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-500" />
            User Management
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-slate-400" /></td></tr>
              ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-800 dark:text-white">{user.name}</td>
                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        user.role === 'officer' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-green-500`}>
                      <span className={`w-2 h-2 rounded-full bg-green-500`}></span>
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">{user.createdAt ? user.createdAt.split('T')[0] : 'N/A'}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Management */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity size={20} className="text-indigo-500" />
            Application Records ({applications.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">ID</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Applicant</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Loan ($K)</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Confidence</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-5 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-mono text-xs text-slate-600 dark:text-slate-300">{app.id}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-800 dark:text-white">{app.applicant}</td>
                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">${app.loanAmount}K</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${app.confidence > 70 ? 'bg-green-500' : app.confidence > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${app.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{app.confidence}%</span>
                    </div>
                  </td>
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
                  <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">{app.date}</td>
                  <td className="py-3.5 px-5">
                    <button
                      onClick={() => setShowDeleteConfirm(app.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Record?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              This will permanently remove application <strong className="text-slate-700 dark:text-slate-200">{showDeleteConfirm}</strong> from the system. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
