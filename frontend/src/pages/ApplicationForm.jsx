import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const ApplicationForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { currentUser } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null); // null, 'approved', 'rejected'
  const [showModal, setShowModal] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setResult(null);

    try {
      // 1. Call the Python Flask API to get the AI Prediction
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to reach ML API');
      }

      const responseData = await response.json();
      const status = responseData.status; // "Approved" or "Rejected"
      const confidence = responseData.confidence;
      
      setResult(status === 'Approved' ? 'approved' : 'rejected');
      setConfidenceScore(confidence);
      
      // 2. Save the application and the result to Firebase Firestore
      await addDoc(collection(db, 'applications'), {
        ...data,
        applicant: currentUser.name,
        userId: currentUser.uid,
        status: status,
        confidence: confidence,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        timestamp: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error connecting to ML backend or Firebase:', error);
      alert('Application failed. Please ensure the Python Flask backend is running on port 5000 and you are connected to the internet.');
    } finally {
      setIsSubmitting(false);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (result === 'approved') {
      reset(); // Clear form on success
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Apply for a Loan</h1>
        <p className="text-slate-500 mt-2 text-lg">Fill out the details below to get an instant prediction on your loan approval.</p>
      </div>
      
      <div className="glass-card p-8 border-t-4 border-t-blue-500">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Section 1: Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                <select {...register("Gender", { required: "Gender is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.Gender && <p className="text-red-500 text-sm mt-1">{errors.Gender.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Marital Status</label>
                <select {...register("Married", { required: "Marital status is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Status</option>
                  <option value="Yes">Married</option>
                  <option value="No">Single</option>
                </select>
                {errors.Married && <p className="text-red-500 text-sm mt-1">{errors.Married.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Dependents</label>
                <select {...register("Dependents", { required: "Dependents is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Number</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
                {errors.Dependents && <p className="text-red-500 text-sm mt-1">{errors.Dependents.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Education</label>
                <select {...register("Education", { required: "Education is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Education Level</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Not Graduate">Not Graduate</option>
                </select>
                {errors.Education && <p className="text-red-500 text-sm mt-1">{errors.Education.message}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800"></div>

          {/* Section 2: Financial Information */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center text-sm">2</span>
              Financial Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Employment Status</label>
                <select {...register("Self_Employed", { required: "Employment status is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Employment Status</option>
                  <option value="No">Employed (Full-Time)</option>
                  <option value="No">Employed (Part-Time)</option>
                  <option value="Yes">Self-Employed</option>
                  <option value="No">Government Employee</option>
                  <option value="No">Contract Worker</option>
                  <option value="Yes">Freelancer</option>
                  <option value="No">Retired</option>
                </select>
                {errors.Self_Employed && <p className="text-red-500 text-sm mt-1">{errors.Self_Employed.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Applicant Income ($/mo)</label>
                <input 
                  type="number" 
                  {...register("ApplicantIncome", { required: "Income is required", min: { value: 1, message: "Must be > 0" } })} 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                  placeholder="e.g. 5000" 
                />
                {errors.ApplicantIncome && <p className="text-red-500 text-sm mt-1">{errors.ApplicantIncome.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Co-applicant Income ($/mo)</label>
                <input 
                  type="number" 
                  {...register("CoapplicantIncome", { min: { value: 0, message: "Cannot be negative" } })} 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                  placeholder="e.g. 0" 
                />
                {errors.CoapplicantIncome && <p className="text-red-500 text-sm mt-1">{errors.CoapplicantIncome.message}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800"></div>

          {/* Section 3: Loan Details */}
          <div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm">3</span>
              Loan Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loan Amount Request (in thousands)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400">$</span>
                  <input 
                    type="number" 
                    {...register("LoanAmount", { required: "Loan Amount is required", min: { value: 1, message: "Must be > 0" } })} 
                    className="w-full pl-8 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                    placeholder="e.g. 150 (for $150,000)" 
                  />
                </div>
                {errors.LoanAmount && <p className="text-red-500 text-sm mt-1">{errors.LoanAmount.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Loan Term (Months)</label>
                <select {...register("Loan_Amount_Term", { required: "Term is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Term</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                  <option value="120">120 Months (10 Years)</option>
                  <option value="180">180 Months (15 Years)</option>
                  <option value="240">240 Months (20 Years)</option>
                  <option value="360">360 Months (30 Years)</option>
                </select>
                {errors.Loan_Amount_Term && <p className="text-red-500 text-sm mt-1">{errors.Loan_Amount_Term.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Credit History</label>
                <select {...register("Credit_History", { required: "Required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select</option>
                  <option value="1.0">Good (All debts paid on time)</option>
                  <option value="0.0">Bad (Past defaults/late payments)</option>
                </select>
                {errors.Credit_History && <p className="text-red-500 text-sm mt-1">{errors.Credit_History.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Property Area</label>
                <select {...register("Property_Area", { required: "Property Area is required" })} className="w-full px-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all">
                  <option value="">Select Area</option>
                  <option value="Urban">Urban</option>
                  <option value="Semiurban">Semiurban</option>
                  <option value="Rural">Rural</option>
                </select>
                {errors.Property_Area && <p className="text-red-500 text-sm mt-1">{errors.Property_Area.message}</p>}
              </div>
            </div>
          </div>
          
          <div className="pt-6 flex justify-end border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={() => reset()}
              className="px-6 py-3 mr-4 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Clear Form
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center min-w-[200px]
                ${isSubmitting 
                  ? 'bg-blue-500/50 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 transform hover:-translate-y-0.5'
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                'Predict Approval'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="text-center">
              {result === 'approved' ? (
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <ShieldCheck size={40} />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <XCircle size={40} />
                </div>
              )}
              
              <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                {result === 'approved' ? 'Approval Highly Likely!' : 'High Risk of Rejection'}
              </h2>
              
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {result === 'approved' 
                  ? 'Based on our AI analysis, your financial profile strongly matches our approval criteria. An officer will contact you shortly to finalize.' 
                  : 'Unfortunately, based on the provided data, our model predicts a high risk of rejection. Consider improving your credit history or lowering the requested loan amount.'}
              </p>

              {result === 'approved' && (
                <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">AI Confidence Score</span>
                  <span className="text-lg font-bold text-green-500">92.4%</span>
                </div>
              )}

              <button 
                onClick={closeModal}
                className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
              >
                Close Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
