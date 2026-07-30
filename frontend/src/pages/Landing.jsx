import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto left-0 right-0">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Credify
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-6 py-2 rounded-full font-medium transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              AI-Powered Approval System
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Smarter Loans,<br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Faster Decisions.</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
              Experience the future of banking. Our advanced machine learning algorithms analyze your profile instantly to predict loan approvals with unmatched accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] transform hover:-translate-y-1">
                Apply Now <ChevronRight size={20} />
              </Link>
              <Link to="/login" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition-all">
                Officer Login
              </Link>
            </div>
          </div>
          
          <div className="relative z-10 lg:h-[600px] flex items-center justify-center">
            {/* Using the generated abstract background as a decorative element behind the mockup */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
            <img 
              src="/dashboard-mockup.png" 
              alt="Dashboard Preview" 
              className="relative z-20 w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop';
                e.target.alt = 'Fallback Dashboard image';
              }}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900 border-t border-slate-800 py-24 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Credify?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Our platform combines cutting-edge AI with bank-grade security to deliver a seamless borrowing experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Predictions</h3>
              <p className="text-slate-400 leading-relaxed">Stop waiting weeks for a decision. Our Random Forest model predicts your approval chances in milliseconds.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-slate-400 leading-relaxed">Backed by Firebase, your application data is encrypted and stored with enterprise-grade security protocols.</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Analytics</h3>
              <p className="text-slate-400 leading-relaxed">Loan officers get comprehensive dashboards to track approval rates, trends, and model performance over time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-slate-950 border-t border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">98.5%</p>
            <p className="text-slate-400 mt-2 text-sm font-medium">Prediction Accuracy</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">10K+</p>
            <p className="text-slate-400 mt-2 text-sm font-medium">Applications Processed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-success">5s</p>
            <p className="text-slate-400 mt-2 text-sm font-medium">Average Response Time</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">256-bit</p>
            <p className="text-slate-400 mt-2 text-sm font-medium">Data Encryption</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-slate-400 mb-8 text-lg">Join thousands of applicants who have already received instant loan decisions through our AI-powered platform.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] transform hover:-translate-y-1">
            Create Free Account <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">Credify</h3>
              <p className="text-slate-400 text-sm leading-relaxed">AI-powered loan approval predictions with bank-grade security and instant results.</p>
            </div>
            
            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Apply for Loan</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Analytics</Link></li>
                <li><Link to="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Predictions</Link></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-slate-400 hover:text-white text-sm transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="text-slate-400 hover:text-white text-sm transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
                <li><Link to="/security" className="text-slate-400 hover:text-white text-sm transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Credify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
