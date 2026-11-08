import React, { useState } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { ShieldCheck, X, Loader2, CheckCircle, FileText, AlertCircle } from 'lucide-react';

const OfficerReviewModal = ({ application, officerName, onClose, onUpdated }) => {
  if (!application) return null;

  // Smart normalization: if applicant entered full Naira (e.g. 200,000 or 10,000,000), use as-is; if in thousands (e.g. 1500), multiply by 1000
  const rawLoan = Number(application.LoanAmount || application.loanAmount || 0);
  const normalizedLoan = rawLoan > 50000 ? rawLoan : (rawLoan > 0 ? rawLoan * 1000 : 1000000);

  const [recommendedAmount, setRecommendedAmount] = useState(normalizedLoan);
  const [interestRate, setInterestRate] = useState('14.5% per annum');
  const [tenure, setTenure] = useState(`${application.Loan_Amount_Term || 24} Months`);
  const [notes, setNotes] = useState(
    `Based on verified monthly income of ₦${Number(application.ApplicantIncome || 0).toLocaleString()} and strong credit track record, applicant qualifies for the requested loan. Recommended for immediate disbursement.`
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleIssueLetter = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!application.id) {
        throw new Error('Application ID is missing. Cannot update record.');
      }

      const letterData = {
        letterId: `CRD-REC-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-GB'),
        applicantName: String(application.applicant || 'Applicant'),
        officerName: String(officerName || 'Loan Officer'),
        recommendedAmount: Number(recommendedAmount) || 0,
        interestRate: String(interestRate || '14.5% per annum'),
        tenure: String(tenure || '24 Months'),
        notes: String(notes || 'Approved for loan facility disbursement based on verified risk profile.'),
        aiConfidence: Number(application.confidence) || 90.0,
        status: 'Recommended',
        issuedAt: new Date().toISOString()
      };

      const appRef = doc(db, 'applications', String(application.id));

      // Use setDoc with merge: true for maximum compatibility across Firestore rules and configurations
      await setDoc(appRef, {
        officerAction: 'Recommended',
        officerName: String(officerName || 'Loan Officer'),
        status: 'Approved',
        recommendationLetter: letterData
      }, { merge: true });

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating recommendation letter:', err);
      setError(err?.message || 'Failed to issue letter. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full my-8 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Underwrite & Issue Recommendation Letter
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Applicant Summary Banner */}
        <div className="px-6 py-4 bg-blue-50/60 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Applicant</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{application.applicant || 'N/A'}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Monthly Income</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                ₦{Number(application.ApplicantIncome || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Requested Principal</p>
              <p className="font-semibold text-slate-900 dark:text-white mt-0.5 font-mono">
                ₦{normalizedLoan.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">AI Confidence</p>
              <p className="font-semibold text-green-600 dark:text-green-400 mt-0.5">
                {application.confidence || 'N/A'}%
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Underwriter Form */}
        <form onSubmit={handleIssueLetter} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Recommended Amount (₦)
              </label>
              <input
                type="number"
                required
                min="1000"
                value={recommendedAmount}
                onChange={(e) => setRecommendedAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Proposed Interest Rate
              </label>
              <input
                type="text"
                required
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 14.5% per annum"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Repayment Tenure
              </label>
              <input
                type="text"
                required
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 24 Months"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Signing Loan Officer
              </label>
              <input
                type="text"
                disabled
                value={officerName || 'Loan Officer'}
                className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Underwriting Remarks & Recommendation Notes
            </label>
            <textarea
              rows="3"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs leading-relaxed text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="State justification for loan disbursement..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Issuing Letter...
                </>
              ) : (
                <>
                  <CheckCircle size={15} /> Issue Official Recommendation Letter
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OfficerReviewModal;
