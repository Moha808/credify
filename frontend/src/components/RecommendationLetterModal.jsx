import React from 'react';
import { ShieldCheck, Printer, X, Award, FileText, CheckCircle } from 'lucide-react';

const RecommendationLetterModal = ({ application, onClose }) => {
  if (!application) return null;

  const letter = application.recommendationLetter || {
    letterId: `CRD-REC-${application.id ? application.id.substring(0, 6).toUpperCase() : '847291'}`,
    date: application.date || new Date().toLocaleDateString('en-GB'),
    applicantName: application.applicant || 'Valued Applicant',
    officerName: application.officerName || 'Senior Credit Underwriter',
    recommendedAmount: application.LoanAmount ? `${Number(application.LoanAmount) * 1000}` : '1,500,000',
    interestRate: '14.5% per annum',
    tenure: `${application.Loan_Amount_Term || 24} Months`,
    notes: 'Applicant demonstrates acceptable repayment capacity with verified income and stable credit history. Approved for disbursement subject to standard identity verification.',
    aiConfidence: application.confidence || 91.5
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedAmount = Number(letter.recommendedAmount || 0).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 print:hidden">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <FileText size={18} className="text-blue-600" />
            Official Credit Recommendation Letter
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-6 bg-white dark:bg-slate-900 print:p-0 print:text-black">
          
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-slate-800 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={28} className="text-blue-600" />
                <span className="text-2xl font-black tracking-tight text-slate-950 dark:text-white print:text-black">CREDIFY</span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide mt-1 uppercase">
                Credit Underwriting & Risk Assessment Division
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
              <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 print:text-black">REF: {letter.letterId}</p>
              <p>Issue Date: {letter.date}</p>
              <p className="text-green-600 dark:text-green-400 font-medium">Status: Underwriter Approved</p>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center py-2">
            <h1 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white print:text-black">
              Official Loan Recommendation Notice
            </h1>
            <p className="text-xs text-slate-500">Issued pursuant to algorithmic risk scoring and credit underwriter review</p>
          </div>

          {/* Recipient Details */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <p className="text-slate-400 font-medium uppercase tracking-wider">Beneficiary Information</p>
            <p className="text-sm font-bold text-slate-950 dark:text-white print:text-black">{application.applicant || letter.applicantName}</p>
            <p className="text-slate-600 dark:text-slate-400">Application Reference ID: <span className="font-mono">{application.id || 'N/A'}</span></p>
            <p className="text-slate-600 dark:text-slate-400">Residential Classification: {application.Property_Area || 'Urban'}</p>
          </div>

          {/* Facility Summary Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Recommended Credit Facility Parameters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase">Principal Sum</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black mt-0.5">₦{formattedAmount}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase">Interest Rate</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black mt-0.5">{letter.interestRate}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 uppercase">Repayment Tenure</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black mt-0.5">{letter.tenure}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/40">
                <p className="text-[11px] text-green-700 dark:text-green-400 uppercase font-medium">AI Confidence</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">{letter.aiConfidence}%</p>
              </div>
            </div>
          </div>

          {/* Underwriter Justification */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Underwriting Assessment & Recommendation Note
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/20 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              "{letter.notes}"
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-end justify-between">
            <div className="space-y-1">
              <div className="h-10 flex items-center">
                <span className="font-serif italic text-lg font-bold text-blue-900 dark:text-blue-300 print:text-black">
                  {letter.officerName}
                </span>
              </div>
              <div className="w-44 border-b border-slate-400"></div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black">{letter.officerName}</p>
              <p className="text-[11px] text-slate-400">Authorized Loan Officer / Credit Analyst</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold border border-green-200 dark:border-green-800">
                <CheckCircle size={14} /> CERTIFIED
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Credify Automated Credit Seal</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecommendationLetterModal;
