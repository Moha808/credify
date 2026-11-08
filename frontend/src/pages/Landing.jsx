import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, ChevronRight, Lock } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto left-0 right-0">
        <div className="text-2xl font-bold text-white flex items-center gap-2">
          <ShieldCheck size={28} className="text-blue-500" /> Credify
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors text-sm">
            Sign In
          </Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 uppercase tracking-wider">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              Automated Credit Intelligence
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Smarter Loans,<br/> 
              <span className="text-blue-400">Instant Underwriting Decisions.</span>
            </h1>
            <p className="text-base text-slate-400 mb-8 max-w-lg leading-relaxed">
              Experience modern credit scoring in Nigerian Naira. Our trained machine learning algorithms analyze risk profiles in seconds to predict eligibility with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                Apply for Loan <ChevronRight size={18} />
              </Link>
              <Link to="/login" className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center transition-all text-sm">
                Staff Portal
              </Link>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center justify-center">
            <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sample Evaluation</span>
                <span className="text-xs font-semibold text-green-400 bg-green-950/40 border border-green-800/40 px-2 py-0.5 rounded-full">
                  Underwriter Approved
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Facility Principal:</span>
                  <span className="font-mono font-semibold text-white">₦2,500,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Monthly Earnings:</span>
                  <span className="font-mono font-semibold text-white">₦450,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Credit Track Record:</span>
                  <span className="text-blue-400 font-semibold">Tier-1 Clean</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Algorithmic Confidence:</span>
                  <span className="font-mono font-bold text-green-400">92.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900 border-t border-slate-800 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Why Choose Credify?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Combining machine learning classification with end-to-end underwriter workflows to eliminate banking delays.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-950/60 border border-slate-800 p-7 rounded-2xl">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-5">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant ML Inference</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Eliminate 3-week waiting periods. Our Random Forest classification model evaluates applicant credit risk in milliseconds.
              </p>
            </div>
            
            <div className="bg-slate-950/60 border border-slate-800 p-7 rounded-2xl">
              <div className="w-10 h-10 bg-green-500/10 text-green-400 rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold mb-2">Underwriting Workflows</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Loan officers review predictive scores and generate official recommendation letters with customizable loan terms.
              </p>
            </div>
            
            <div className="bg-slate-950/60 border border-slate-800 p-7 rounded-2xl">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-lg font-bold mb-2">Audit & Governance</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Admins monitor user registers, export compliance reports, and audit system performance in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-white mb-3">Credify</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                AI-driven loan assessment and credit underwriting management system built for speed, transparency, and fairness.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Portals</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Applicant Login</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white transition-colors">Loan Officer Desk</Link></li>
                <li>
                  <Link to="/admin" className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1">
                    <Lock size={11} /> Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Legal & Compliance</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/security" className="text-slate-400 hover:text-white transition-colors">Security Architecture</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; {new Date().getFullYear()} Credify Credit Systems. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="hover:text-slate-300 flex items-center gap-1">
                <Lock size={12} /> System Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
