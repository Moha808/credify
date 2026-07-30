import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const CookiePolicy = () => {
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

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: June 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit our platform. They help us remember your preferences, keep you logged in, and understand how you interact with Credify.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Cookies We Use</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Essential Cookies:</strong> Required for authentication and security. These cannot be disabled.</li>
              <li><strong className="text-white">Functional Cookies:</strong> Remember your preferences like dark mode settings and dashboard layout.</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how users navigate our platform to improve the experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Managing Cookies</h2>
            <p>You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect the functionality of the platform, including authentication.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Contact</h2>
            <p>For questions about our cookie practices, contact us at <span className="text-blue-400">privacy@credify.com</span>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
