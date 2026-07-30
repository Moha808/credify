import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: June 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide when using our loan prediction services. This includes your name, email address, income details, loan amount, credit history status, and property area classification. We also automatically collect usage data such as IP addresses, browser type, and interaction patterns.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>Your information is used to provide loan approval predictions, improve our machine learning models, maintain your account, communicate service updates, and ensure the security of our platform. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage & Security</h2>
            <p>All data is stored securely using Firebase with 256-bit encryption. We implement industry-standard security measures including HTTPS encryption, secure authentication tokens, and regular security audits to protect your information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. You may also request a copy of all data we hold about you. To exercise these rights, please contact us at privacy@credify.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Contact</h2>
            <p>For questions about this Privacy Policy, contact us at <span className="text-blue-400">privacy@credify.com</span>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
