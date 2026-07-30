import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Users, DollarSign, CheckCircle,
  XCircle, Loader2, FileText, Clock, ArrowRight, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, bgColor, trend, trendValue }) => (
  <div className="glass-card p-5 md:p-6 group hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-2xl md:text-3xl font-bold mt-1 ${color}`}>{value}</p>
        {trendValue && (
          <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trendValue}
          </div>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  </div>
);

// ─── Applicant View ────────────────────────────────────────────────────────
const ApplicantDashboard = ({ currentUser, applications, loading }) => {
  const myApps = applications.filter(a => a.userId === currentUser.uid);
  const myApproved = myApps.filter(a => a.status === 'Approved').length;
  const myRejected = myApps.filter(a => a.status === 'Rejected').length;
  const myRate = myApps.length > 0 ? ((myApproved / myApps.length) * 100).toFixed(0) : '0';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium mb-1">Good day 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold">{currentUser?.name?.split(' ')[0]}</h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base">Ready to apply for a loan? Get an instant AI-powered decision.</p>
          <Link to="/dashboard/apply"
            className="mt-4 inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
            Apply Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* My Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="My Applications" value={myApps.length} icon={FileText} color="text-blue-500" bgColor="bg-blue-100 dark:bg-blue-900/30" />
        <StatCard title="Approved" value={myApproved} icon={CheckCircle} color="text-green-500" bgColor="bg-green-100 dark:bg-green-900/30" trend="up" trendValue={`${myRate}% success`} />
        <StatCard title="Rejected" value={myRejected} icon={XCircle} color="text-red-500" bgColor="bg-red-100 dark:bg-red-900/30" />
        <StatCard title="Success Rate" value={`${myRate}%`} icon={TrendingUp} color="text-indigo-500" bgColor="bg-indigo-100 dark:bg-indigo-900/30" />
      </div>

      {/* Recent Applications */}
      <div className="glass-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">My Recent Applications</h3>
          <Link to="/dashboard/history" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {myApps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-blue-400" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-white mb-1">No applications yet</p>
            <p className="text-slate-400 text-sm mb-4">Submit your first loan application and get an instant AI decision.</p>
            <Link to="/dashboard/apply" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              <Zap size={16} /> Apply Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myApps.slice(0, 5).map(app => (
              <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div>
                  <p className="font-medium text-slate-800 dark:text-white text-sm">${app.LoanAmount || 'N/A'}K loan</p>
                  <p className="text-xs text-slate-400 mt-0.5">{app.date} · {app.Property_Area || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-3">
                  {app.confidence && (
                    <span className="text-xs text-slate-400 hidden sm:block">{app.confidence}% confidence</span>
                  )}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                    ${app.status === 'Approved'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {app.status === 'Approved' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="glass-card p-5 md:p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">💡 Tips to Improve Approval Chances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📊', title: 'Good Credit History', desc: 'Having a good credit track record significantly boosts approval odds.' },
            { icon: '💰', title: 'Higher Income', desc: 'A higher applicant income relative to the loan amount improves your score.' },
            { icon: '🏡', title: 'Semiurban Properties', desc: 'Semiurban property areas historically have higher approval rates.' },
          ].map(tip => (
            <div key={tip.title} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <span className="text-2xl">{tip.icon}</span>
              <p className="font-semibold text-slate-800 dark:text-white text-sm mt-2">{tip.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Officer / Admin View ──────────────────────────────────────────────────
const StaffDashboard = ({ currentUser, applications, loading }) => {
  const approved = applications.filter(a => a.status === 'Approved').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const totalApps = applications.length;
  const approvalRate = totalApps > 0 ? ((approved / totalApps) * 100).toFixed(1) : '0.0';
  const recentApps = applications.slice(0, 5);

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

  const buildAreaDistribution = () => {
    const areas = {};
    const colors = { Urban: '#3B82F6', Semiurban: '#8B5CF6', Rural: '#22C55E' };
    applications.forEach(app => {
      const area = app.Property_Area || 'Unknown';
      if (!areas[area]) areas[area] = { name: area, value: 0, fill: colors[area] || '#94A3B8' };
      areas[area].value++;
    });
    return Object.values(areas);
  };

  const monthlyTrends = buildMonthlyTrends();
  const areaDistribution = buildAreaDistribution();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Welcome, {currentUser?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base capitalize">
          {currentUser?.role === 'admin' ? '🔐 Admin Panel' : '📋 Loan Officer Dashboard'} · Live overview of all applications
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Applications" value={totalApps} icon={Users} color="text-blue-500" bgColor="bg-blue-100 dark:bg-blue-900/30" trend="up" trendValue="live data" />
        <StatCard title="Approved" value={approved} icon={CheckCircle} color="text-green-500" bgColor="bg-green-100 dark:bg-green-900/30" trend="up" trendValue={`${approvalRate}% rate`} />
        <StatCard title="Rejected" value={rejected} icon={XCircle} color="text-red-500" bgColor="bg-red-100 dark:bg-red-900/30" />
        <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={DollarSign} color="text-indigo-500" bgColor="bg-indigo-100 dark:bg-indigo-900/30" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5 md:p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-5">Approval Trends (Monthly)</h3>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyTrends} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
                <Bar dataKey="approved" fill="#22C55E" radius={[6, 6, 0, 0]} name="Approved" />
                <Bar dataKey="rejected" fill="#EF4444" radius={[6, 6, 0, 0]} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No data yet. Submit some applications to see trends!" height={260} />
          )}
        </div>

        <div className="glass-card p-5 md:p-6">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-5">By Property Area</h3>
          {areaDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={areaDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={5} dataKey="value">
                    {areaDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2 flex-wrap">
                {areaDistribution.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-slate-500 dark:text-slate-400">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyChart message="No data yet." height={210} />
          )}
        </div>
      </div>

      {/* Area Chart */}
      <div className="glass-card p-5 md:p-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-5">Application Volume Over Time</h3>
        {monthlyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="approved" stroke="#3B82F6" fill="url(#colorApproved)" strokeWidth={2} name="Approved" />
              <Area type="monotone" dataKey="rejected" stroke="#EF4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Rejected" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="No data yet." height={220} />
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="glass-card p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white">Recent Applications</h3>
          <Link to="/dashboard/history" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Applicant</th>
                <th className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Loan</th>
                <th className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Area</th>
                <th className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Date</th>
                <th className="text-left py-3 px-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-400">No applications yet.</td>
                </tr>
              ) : (
                recentApps.map(app => (
                  <tr key={app.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-white">{app.applicant || 'Unknown'}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">${app.LoanAmount || 'N/A'}K</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{app.Property_Area || 'N/A'}</td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{app.date}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${app.status === 'Approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {app.status === 'Approved' ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── Shared helpers ────────────────────────────────────────────────────────
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Loader2 className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
      <p className="text-slate-500 text-sm">Loading dashboard...</p>
    </div>
  </div>
);

const EmptyChart = ({ message, height }) => (
  <div className={`flex items-center justify-center text-slate-400 text-sm`} style={{ height }}>
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

  return <StaffDashboard currentUser={currentUser} applications={applications} loading={loading} />;
};

export default Dashboard;
