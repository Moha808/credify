import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Target, Users, TrendingUp, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Credify
        </Link>
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> Back to Home
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">About Credify</h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">We are on a mission to make lending decisions faster, fairer, and smarter using the power of machine learning.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-slate-400 leading-relaxed">To democratize access to credit by providing transparent, AI-driven loan approval predictions that help both applicants and financial institutions make better decisions.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Team</h3>
            <p className="text-slate-400 leading-relaxed">A team of data scientists, engineers, and fintech specialists dedicated to building the most reliable loan prediction platform in the industry.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Technology</h3>
            <p className="text-slate-400 leading-relaxed">Powered by Random Forest classifiers and advanced feature engineering, our models are trained on thousands of real-world data points to deliver accurate predictions.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Our Values</h3>
            <p className="text-slate-400 leading-relaxed">Transparency, fairness, and security are at the core of everything we do. Every prediction comes with a clear confidence score and explanation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
