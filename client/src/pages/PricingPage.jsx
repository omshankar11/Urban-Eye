import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-slate-900 pb-32">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Civic engagement should be accessible to everyone. Our platform is completely free for citizens, with powerful enterprise tools designed for city councils and state governments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Citizen Tier */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-slate-100">
            <div className="p-8 flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Citizen</h3>
              <p className="text-slate-500 mb-6 text-sm">For individuals reporting issues in their neighborhood.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Free</span>
                <span className="text-slate-500 font-medium"> / forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Unlimited complaints
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Photo evidence uploads
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Real-time status tracking
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Email notifications
                </li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
              <Link to="/signup" className="block w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-center font-bold rounded-lg transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          {/* City Council Tier */}
          <div className="bg-blue-600 rounded-2xl shadow-2xl flex flex-col overflow-hidden transform md:-translate-y-4 relative">
            <div className="absolute top-0 right-0 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              MOST POPULAR
            </div>
            <div className="p-8 flex-1">
              <h3 className="text-xl font-bold text-white mb-2">City Council</h3>
              <p className="text-blue-100 mb-6 text-sm">For municipalities managing and routing civic issues.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">$499</span>
                <span className="text-blue-200 font-medium"> / month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Everything in Citizen
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Admin resolution dashboard
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Automated routing rules
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Analytics & reporting
                </li>
                <li className="flex items-center text-white">
                  <svg className="w-5 h-5 text-blue-200 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Priority support
                </li>
              </ul>
            </div>
            <div className="p-6 bg-blue-700 mt-auto">
              <a href="mailto:sales@urbaneye.com" className="block w-full py-3 px-4 bg-white hover:bg-gray-50 text-blue-600 text-center font-bold rounded-lg transition-colors">
                Contact Sales
              </a>
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-slate-100">
            <div className="p-8 flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-2">State Enterprise</h3>
              <p className="text-slate-500 mb-6 text-sm">For state-wide deployment across multiple cities.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Everything in City Council
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Multi-city federation
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Custom API integrations
                </li>
                <li className="flex items-center text-slate-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Dedicated account manager
                </li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
              <a href="mailto:enterprise@urbaneye.com" className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold rounded-lg transition-colors border border-slate-300">
                Contact Enterprise
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
