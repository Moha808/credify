import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { TrendingUp, TrendingDown, Users, DollarSign, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
  <div className="glass-card p-6 group hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        {trendValue && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue} from last month
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}>
        <Icon size={22} className={color} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'applications'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      appsData.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      setApplications(appsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalApps = applications.length;
  const approved = applications.filter(a => a.status === 'Approved').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const approvalRate = totalApps > 0 ? ((approved / totalApps) * 100).toFixed(1) : '0.0';
  const recentApps = applications.slice(0, 5);

  // Build monthly trends from real data
  const buildMonthlyTrends = () => {
    const months = {};
    applications.forEach(app => {
      if (app.date) {
        const monthStr = app.date.substring(0, 7); // "YYYY-MM"
        if (!months[monthStr]) months[monthStr] = { month: monthStr, approved: 0, rejected: 0 };
        if (app.status === 'Approved') months[monthStr].approved++;
        else months[monthStr].rejected++;
      }
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  };

  // Build area distribution from real data
  const buildAreaDistribution = () => {
    const areas = {};
    const colors = { Urban: '#3B82F6', Semiurban: '#8B5CF6', Rural: '#22C55E' };
    applications.forEach(app => {
      const area = app.Property_Area || app.propertyArea || 'Unknown';
      if (!areas[area]) areas[area] = { name: area, value: 0, fill: colors[area] || '#94A3B8' };
      areas[area].value++;
    });
    return Object.values(areas);
  };

  const monthlyTrends = buildMonthlyTrends();
  const areaDistribution = buildAreaDistribution();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
          <p className="text-slate-500">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Welcome back, {currentUser?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">Here's an overview of loan application activity.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applications" value={totalApps} icon={Users} color="text-blue-500" trend="up" trendValue={`${totalApps} total`} />
        <StatCard title="Approved Loans" value={approved} icon={CheckCircle} color="text-green-500" trend="up" trendValue={`${approvalRate}% rate`} />
        <StatCard title="Rejected Loans" value={rejected} icon={XCircle} color="text-red-500" />
        <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={DollarSign} color="text-indigo-500" trend="up" trendValue="live data" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approval Trends */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Approval Trends (Monthly)</h3>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="approved" fill="#22C55E" radius={[6, 6, 0, 0]} name="Approved" />
                <Bar dataKey="rejected" fill="#EF4444" radius={[6, 6, 0, 0]} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-400">
              <p>No data yet. Submit some loan applications to see trends!</p>
            </div>
          )}
        </div>

        {/* Property Area Distribution */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">By Property Area</h3>
          {areaDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={areaDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {areaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {areaDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-slate-400">
              <p>No data yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Income Trends Area Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Application Volume Over Time</h3>
        {monthlyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="approved" stroke="#3B82F6" fill="url(#colorApproved)" strokeWidth={2} name="Approved" />
              <Area type="monotone" dataKey="rejected" stroke="#EF4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Rejected" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-slate-400">
            <p>No data yet.</p>
          </div>
        )}
      </div>

      {/* Recent Applications Table */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Recent Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">ID</th>
                <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Applicant</th>
                <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Loan ($K)</th>
                <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Area</th>
                <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-400">No applications yet. Be the first to apply!</td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">{app.id.substring(0, 8)}...</td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-white">{app.applicant}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">${app.LoanAmount || app.loanAmount || 'N/A'}K</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{app.Property_Area || app.area || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{app.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${app.status === 'Approved' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {app.status === 'Approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
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

export default Dashboard;
