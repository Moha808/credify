import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Briefcase, MapPin, Clock } from 'lucide-react';

const openings = [
  { title: 'Senior ML Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Frontend Developer (React)', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Data Analyst', department: 'Data Science', location: 'Hybrid', type: 'Full-time' },
  { title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Contract' },
];

const Careers = () => {
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
        <h1 className="text-4xl font-bold mb-4">Careers at Credify</h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">Join us in building the future of AI-powered lending. We're looking for passionate people who want to make a real impact.</p>

        <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job, index) => (
            <div key={index} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{job.department}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <Briefcase size={32} className="mx-auto text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Don't see your role?</h3>
          <p className="text-slate-400 mb-4">We're always looking for talented people. Send your resume to <span className="text-blue-400">careers@credify.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
