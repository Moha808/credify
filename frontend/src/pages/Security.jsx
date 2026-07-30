import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Server, Eye } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Credify
        </Link>
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> Back to Home
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">Security at Credify</h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">Your data security is our top priority. Here's how we protect your information at every level.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">256-bit Encryption</h3>
            <p className="text-slate-400 leading-relaxed">All data transmitted between your browser and our servers is protected with industry-standard AES-256 encryption, the same standard used by leading banks worldwide.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Firebase Authentication</h3>
            <p className="text-slate-400 leading-relaxed">We leverage Google's Firebase Authentication to provide secure user login with multi-factor authentication, secure session management, and protection against brute-force attacks.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <Server size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Infrastructure</h3>
            <p className="text-slate-400 leading-relaxed">Our backend is hosted on secure, SOC 2 compliant cloud infrastructure with automated backups, DDoS protection, and 24/7 monitoring to ensure maximum uptime.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-4">
              <Eye size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Data Transparency</h3>
            <p className="text-slate-400 leading-relaxed">You always have full visibility into what data we store. Request a data export or deletion at any time through your account settings or by contacting our team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
