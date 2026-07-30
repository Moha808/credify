import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
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
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">Have questions? We'd love to hear from you. Reach out using the form below or through our contact details.</p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                <textarea rows="5" className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="button" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-slate-400 text-sm">support@credify.com</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-slate-400 text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-slate-400 text-sm">123 Fintech Avenue, Innovation Hub<br/>San Francisco, CA 94107</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
