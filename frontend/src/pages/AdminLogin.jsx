import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail, Lock, Eye, EyeOff, ShieldAlert, AlertCircle, ArrowLeft } from 'lucide-react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AdminLogin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/dashboard/admin');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch role from Firestore to strictly verify admin privileges
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() || docSnap.data().role !== 'admin') {
        // Not an administrator - immediately revoke session
        await signOut(auth);
        setError('Access Denied: This portal is strictly restricted to System Administrators. Applicants and Loan Officers must sign in through the standard login page.');
        setLoading(false);
        return;
      }

      // Verified Admin -> navigate to admin dashboard
      navigate('/dashboard/admin');
    } catch (err) {
      console.error('Admin auth error:', err);
      setError('Authentication failed. Please verify administrative email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white relative">
      <div className="w-full max-w-md p-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl relative z-10">
        
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <span className="inline-block px-3 py-1 bg-red-950/60 text-red-400 border border-red-800/50 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            Restricted Access
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white">System Administration</h2>
          <p className="text-slate-400 text-sm mt-1">Authorized personnel and IT governance only</p>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-950/40 border border-red-800/80 rounded-xl text-red-400 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all text-sm font-mono"
                placeholder="admin@credify.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">Security Key / Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4
              ${loading
                ? 'bg-red-800 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 active:scale-[0.99] shadow-red-900/30'
              }`}
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying Credentials...</> : 'Authenticate as Administrator'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Standard Login Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
