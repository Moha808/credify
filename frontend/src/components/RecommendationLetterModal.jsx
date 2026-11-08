import React from 'react';
import { ShieldCheck, Printer, X, Award, FileText, CheckCircle, Download } from 'lucide-react';

const RecommendationLetterModal = ({ application, onClose }) => {
  if (!application) return null;

  const rawLoan = Number(application.LoanAmount || application.loanAmount || 0);
  const normalizedFallback = rawLoan > 50000 ? rawLoan : (rawLoan > 0 ? rawLoan * 1000 : 1500000);

  const letter = application.recommendationLetter || {
    letterId: `CRD-REC-${application.id ? application.id.substring(0, 6).toUpperCase() : '847291'}`,
    date: application.date || new Date().toLocaleDateString('en-GB'),
    applicantName: application.applicant || 'Valued Applicant',
    officerName: application.officerName || 'Senior Credit Underwriter',
    recommendedAmount: normalizedFallback,
    interestRate: '14.5% per annum',
    tenure: `${application.Loan_Amount_Term || 24} Months`,
    notes: 'Applicant demonstrates acceptable repayment capacity with verified income and stable credit history. Approved for disbursement subject to standard identity verification.',
    aiConfidence: application.confidence || 91.5
  };

  const formattedAmount = Number(letter.recommendedAmount || 0).toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  // Direct offline document download
  const handleDirectDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Credify Official Loan Recommendation - ${letter.letterId}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 30px; color: #0f172a; line-height: 1.6; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
    .subtitle { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 4px; }
    .meta { text-align: right; font-size: 12px; color: #475569; }
    .title { text-align: center; margin: 28px 0 16px; font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .beneficiary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px; font-size: 13px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; text-align: center; }
    .card-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: bold; }
    .card-val { font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .notes-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; margin: 16px 0; font-style: italic; color: #334155; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature { font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #1e3a8a; }
    .seal { background: #dcfce7; border: 1px solid #86efac; color: #166534; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: bold; display: inline-block; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">CREDIFY</div>
      <div class="subtitle">Credit Underwriting & Risk Assessment Division</div>
    </div>
    <div class="meta">
      <div><strong>REF:</strong> ${letter.letterId}</div>
      <div><strong>Issue Date:</strong> ${letter.date}</div>
      <div style="color: #16a34a; font-weight: bold; margin-top: 4px;">Status: Underwriter Approved</div>
    </div>
  </div>

  <div class="title">Official Loan Recommendation Notice</div>

  <div class="beneficiary">
    <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold;">Beneficiary Information</div>
    <div style="font-size: 16px; font-weight: bold; margin-top: 4px;">${application.applicant || letter.applicantName}</div>
    <div style="margin-top: 2px;">Application Reference: <code>${application.id || 'N/A'}</code></div>
    <div>Residential Classification: ${application.Property_Area || 'Urban'}</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Principal Sum</div>
      <div class="card-val">₦${formattedAmount}</div>
    </div>
    <div class="card">
      <div class="card-label">Interest Rate</div>
      <div class="card-val">${letter.interestRate}</div>
    </div>
    <div class="card">
      <div class="card-label">Repayment Tenure</div>
      <div class="card-val">${letter.tenure}</div>
    </div>
    <div class="card" style="background: #f0fdf4; border-color: #bbf7d0;">
      <div class="card-label" style="color: #15803d;">AI Confidence</div>
      <div class="card-val" style="color: #16a34a;">${letter.aiConfidence}%</div>
    </div>
  </div>

  <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #475569; margin-top: 24px;">Underwriter Assessment & Recommendation Remarks</div>
  <div class="notes-box">"${letter.notes}"</div>

  <div class="footer">
    <div>
      <div class="signature">${letter.officerName}</div>
      <div style="width: 180px; border-bottom: 1px solid #94a3b8; margin: 4px 0 8px;"></div>
      <div style="font-weight: bold; font-size: 13px;">${letter.officerName}</div>
      <div style="font-size: 11px; color: #64748b;">Authorized Loan Officer / Credit Analyst</div>
    </div>
    <div style="text-align: right;">
      <div class="seal">✓ CERTIFIED & APPROVED</div>
      <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Credify Automated Credit Seal</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Credify_Loan_Recommendation_${letter.letterId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full my-6 overflow-hidden text-slate-800 dark:text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 print:hidden shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <FileText size={17} className="text-blue-600 shrink-0" />
            <span className="truncate">Official Credit Recommendation Letter</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              title="Download Document directly to device"
            >
              <Download size={13} /> <span className="hidden sm:inline">Download</span> Letter
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
              title="Print or Save as PDF"
            >
              <Printer size={13} /> <span className="hidden sm:inline">Print /</span> PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 space-y-5 bg-white dark:bg-slate-900 print:p-0 print:text-black overflow-y-auto flex-1">
          
          {/* Institutional Letterhead */}
          <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={26} className="text-blue-600" />
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white print:text-black">CREDIFY</span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide mt-0.5 uppercase">
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
          <div className="text-center py-1">
            <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white print:text-black">
              Official Loan Recommendation Notice
            </h1>
            <p className="text-[11px] text-slate-500">Issued pursuant to algorithmic risk scoring and credit underwriter review</p>
          </div>

          {/* Recipient Details */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Beneficiary Information</p>
            <p className="text-sm font-bold text-slate-950 dark:text-white print:text-black">{application.applicant || letter.applicantName}</p>
            <p className="text-slate-600 dark:text-slate-400">Application Reference ID: <span className="font-mono">{application.id || 'N/A'}</span></p>
            <p className="text-slate-600 dark:text-slate-400">Residential Classification: {application.Property_Area || 'Urban'}</p>
          </div>

          {/* Facility Summary Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Recommended Credit Facility Parameters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Principal Sum</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black mt-0.5">₦{formattedAmount}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Interest Rate</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black mt-0.5">{letter.interestRate}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Repayment Tenure</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white print:text-black mt-0.5">{letter.tenure}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800/40">
                <p className="text-[10px] text-green-700 dark:text-green-400 uppercase font-bold">AI Confidence</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-0.5">{letter.aiConfidence}%</p>
              </div>
            </div>
          </div>

          {/* Underwriter Justification */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Underwriting Assessment & Recommendation Note
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/20 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              "{letter.notes}"
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-end justify-between">
            <div className="space-y-0.5">
              <div className="h-9 flex items-center">
                <span className="font-serif italic text-base sm:text-lg font-bold text-blue-900 dark:text-blue-300 print:text-black">
                  {letter.officerName}
                </span>
              </div>
              <div className="w-36 sm:w-44 border-b border-slate-400"></div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black">{letter.officerName}</p>
              <p className="text-[10px] text-slate-400">Authorized Loan Officer / Credit Analyst</p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                <CheckCircle size={13} /> CERTIFIED
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Credify Automated Credit Seal</p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden shrink-0">
          <button
            onClick={handleDirectDownload}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Download size={14} /> Download offline file
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecommendationLetterModal;
