import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TermsOfService = () => {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-12">Last updated: June 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Credify, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. These terms apply to all users, including applicants, loan officers, and administrators.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
            <p>Credify provides AI-powered loan approval predictions based on applicant-provided data. Our predictions are advisory in nature and should not be considered as a guarantee of loan approval or rejection by any financial institution.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information when creating your account and submitting loan applications.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Limitation of Liability</h2>
            <p>Credify is provided "as is" without warranties of any kind. We are not liable for any decisions made based on our predictions. Our machine learning model provides probability-based assessments, not definitive outcomes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the revised terms.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
