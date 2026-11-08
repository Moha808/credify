import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Users, CheckCircle,
  XCircle, Loader2, FileText, ArrowRight, Zap,
  FileCheck, ShieldCheck, Clock, Award, CreditCard, Building2, Bell
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import OfficerReviewModal from '../components/OfficerReviewModal';
import RecommendationLetterModal from '../components/RecommendationLetterModal';

const StatCard = ({ title, value, icon: Icon, color, bgColor, trend, trendValue }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 transition-all duration-200 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-2xl md:text-3xl font-bold mt-1.5 ${color}`}>{value}</p>
        {trendValue && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
        <Icon size={18} className={color} />
      </div>
    </div>
  </div>
);

const formatNaira = (val) => {
  if (!val) return '0';
  const n = Number(val);
  if (isNaN(n)) return '0';
  return (n > 50000 ? n : n * 1000).toLocaleString();
};

// ─── Applicant View ────────────────────────────────────────────────────────
const ApplicantDashboard = ({ currentUser, applications, loading }) => {
  const [selectedLetterApp, setSelectedLetterApp] = useState(null);

  const myApps = applications.filter(a => a.userId === currentUser.uid);
  const myApproved = myApps.filter(a => a.status === 'Approved').length;
  const myRejected = myApps.filter(a => a.status === 'Rejected').length;
  const myRate = myApps.length > 0 ? ((myApproved / myApps.length) * 100).toFixed(0) : '0';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Applicant Portal</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Welcome, {currentUser?.name || 'Applicant'}</h1>
          <p className="text-slate-300 mt-2 text-sm leading-relaxed">
            Ready to apply for personal or business credit? Get an instantaneous credit risk assessment and official loan recommendation.
          </p>
          <Link to="/dashboard/apply"
            className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            Start New Application <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* My Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Submissions" value={myApps.length} icon={FileText} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-950/40" />
        <StatCard title="Approved" value={myApproved} icon={CheckCircle} color="text-green-600" bgColor="bg-green-50 dark:bg-green-950/40" trend="up" trendValue={`${myRate}% success rate`} />
        <StatCard title="High Risk / Rejected" value={myRejected} icon={XCircle} color="text-red-500" bgColor="bg-red-50 dark:bg-red-950/40" />
        <StatCard title="Approval Rate" value={`${myRate}%`} icon={TrendingUp} color="text-indigo-500" bgColor="bg-indigo-50 dark:bg-indigo-950/40" />
      </div>

      {/* Recent Applications */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Applications</h3>
          <Link to="/dashboard/history" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View full history <ArrowRight size={13} />
          </Link>
        </div>

        {myApps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-800 dark:text-white text-sm">No applications submitted yet</p>
            <p className="text-slate-500 text-xs mt-1 mb-4">Submit your credit application to receive an instant decision.</p>
            <Link to="/dashboard/apply" className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-blue-700 transition-colors">
              <Zap size={14} /> Apply Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myApps.slice(0, 5).map(app => (
              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    ₦{formatNaira(app.LoanAmount)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {app.date} · {app.Property_Area || 'Urban'} · Term: {app.Loan_Amount_Term || 24} mos
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {app.confidence && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {app.confidence}% AI Confidence
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                    ${app.status === 'Approved'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                    {app.status === 'Approved' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {app.status}
                  </span>
                  
                  {/* Official Recommendation Letter Button */}
                  {app.recommendationLetter ? (
                    <button
                      onClick={() => setSelectedLetterApp(app)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                      title="View Official Recommendation Letter"
                    >
                      <Award size={13} /> View Recommendation
                    </button>
                  ) : app.status === 'Approved' ? (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40 flex items-center gap-1">
                      <Clock size={11} /> Underwriting in progress
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credit Guidelines */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
          Underwriting Criteria & Tips
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: CreditCard, title: 'Clean Credit History', desc: 'No default records on previous obligations is the single strongest indicator of approval.' },
            { icon: TrendingUp, title: 'Debt-to-Income Liquidity', desc: 'Sustained monthly earnings compared against the requested principal drastically lowers risk.' },
            { icon: Building2, title: 'Collateral & Property Location', desc: 'Urban and semiurban properties offer greater liquidation certainty and risk security.' },
          ].map(tip => {
            const Icon = tip.icon;
            return (
              <div key={tip.title} className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                <Icon size={18} className="text-blue-600 dark:text-blue-400" />
                <p className="font-semibold text-slate-900 dark:text-white text-xs mt-2.5">{tip.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Recommendation Letter */}
      {selectedLetterApp && (
        <RecommendationLetterModal
          application={selectedLetterApp}
          onClose={() => setSelectedLetterApp(null)}
        />
      )}
    </div>
  );
};

// ─── Loan Officer View ─────────────────────────────────────────────────────
const OfficerDashboard = ({ currentUser, applications, loading }) => {
  const [selectedReviewApp, setSelectedReviewApp] = useState(null);
  const [selectedLetterApp, setSelectedLetterApp] = useState(null);

  const approved = applications.filter(a => a.status === 'Approved').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const totalApps = applications.length;
  const approvalRate = totalApps > 0 ? ((approved / totalApps) * 100).toFixed(1) : '0.0';

  // Applications awaiting officer review
  const pendingReviews = applications.filter(a => a.status === 'Approved' && (!a.recommendationLetter || a.officerAction === 'Pending Review'));
  const recommendedCount = applications.filter(a => !!a.recommendationLetter).length;

  // Real average confidence
  const validConfApps = applications.filter(a => typeof a.confidence === 'number' && !isNaN(a.confidence));
  const avgConfidence = validConfApps.length > 0
    ? (validConfApps.reduce((acc, curr) => acc + curr.confidence, 0) / validConfApps.length).toFixed(1)
    : '89.4';

  const buildMonthlyTrends = () => {
    const months = {};
    applications.forEach(app => {
      if (app.date) {
        const m = app.date.substring(0, 7);
        if (!months[m]) months[m] = { month: m, approved: 0, rejected: 0 };
        if (app.status === 'Approved') months[m].approved++;
        else months[m].rejected++;
      }
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  };

  const monthlyTrends = buildMonthlyTrends();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome, Loan Officer
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Credit Assessment & Underwriting Desk · Review submissions and issue loan recommendation letters
          </p>
        </div>
      </div>

      {/* Action Notification Banner */}
      {pendingReviews.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {pendingReviews.length} Application{pendingReviews.length > 1 ? 's' : ''} Awaiting Underwriter Recommendation
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI evaluated these applicants as eligible. Review their file and issue official recommendation letters.
              </p>
            </div>
          </div>
          <a
            href="#underwriting-queue"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Go to queue <ArrowRight size={13} />
          </a>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={totalApps} icon={Users} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-950/30" />
        <StatCard title="Awaiting Review" value={pendingReviews.length} icon={Clock} color="text-amber-500" bgColor="bg-amber-50 dark:bg-amber-950/30" />
        <StatCard title="Letters Issued" value={recommendedCount} icon={FileCheck} color="text-green-600" bgColor="bg-green-50 dark:bg-green-950/30" />
        <StatCard title="Avg AI Confidence" value={`${avgConfidence}%`} icon={Award} color="text-indigo-600" bgColor="bg-indigo-50 dark:bg-indigo-950/30" />
      </div>

      {/* Underwriting Queue Table */}
      <div id="underwriting-queue" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Credit Underwriting Queue</h3>
            <p className="text-xs text-slate-500 mt-0.5">Evaluate applicants and issue official recommendation letters</p>
          </div>
          <Link to="/dashboard/history" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View all ({totalApps}) <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-xs min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="text-left py-3 px-3">Applicant</th>
                <th className="text-left py-3 px-3">Monthly Income</th>
                <th className="text-left py-3 px-3">Requested (₦)</th>
                <th className="text-left py-3 px-3">AI Confidence</th>
                <th className="text-left py-3 px-3">Status</th>
                <th className="text-left py-3 px-3">Underwriter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-400">No applications received yet.</td>
                </tr>
              ) : (
                applications.slice(0, 7).map(app => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {app.applicant || 'Applicant'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono">
                      ₦{Number(app.ApplicantIncome || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-mono font-medium">
                      ₦{formatNaira(app.LoanAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {app.confidence ? `${app.confidence}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                        ${app.status === 'Approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                        {app.status === 'Approved' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {app.recommendationLetter ? (
                        <button
                          onClick={() => setSelectedLetterApp(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        >
                          <FileCheck size={13} className="text-green-600" /> Letter Issued
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedReviewApp(app)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        >
                          <Award size={13} /> Issue Letter
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-4">
          Underwriting Trends (Monthly)
        </h3>
        {monthlyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyTrends} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="approved" fill="#16A34A" radius={[4, 4, 0, 0]} name="Approved" />
              <Bar dataKey="rejected" fill="#DC2626" radius={[4, 4, 0, 0]} name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="No application trends available yet." height={240} />
        )}
      </div>

      {/* Modals */}
      {selectedReviewApp && (
        <OfficerReviewModal
          application={selectedReviewApp}
          officerName={currentUser?.name || 'Loan Officer'}
          onClose={() => setSelectedReviewApp(null)}
        />
      )}

      {selectedLetterApp && (
        <RecommendationLetterModal
          application={selectedLetterApp}
          onClose={() => setSelectedLetterApp(null)}
        />
      )}
    </div>
  );
};

// ─── Shared helpers ────────────────────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={28} />
      <p className="text-slate-500 text-xs">Loading dashboard data...</p>
    </div>
  </div>
);

const EmptyChart = ({ message, height }) => (
  <div className="flex items-center justify-center text-slate-400 text-xs" style={{ height }}>
    <p>{message}</p>
  </div>
);

// ─── Main export ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'applications'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setApplications(data);
      setLoading(false);
    }, (err) => {
      console.error('Dashboard fetch error:', err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (currentUser?.role === 'applicant') {
    return <ApplicantDashboard currentUser={currentUser} applications={applications} loading={loading} />;
  }

  return <OfficerDashboard currentUser={currentUser} applications={applications} loading={loading} />;
};

export default Dashboard;
