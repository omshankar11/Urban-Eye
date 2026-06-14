import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        login(data.userData, data.token);
        if (data.userData.role === 'Admin' || data.userData.role === 'Officer') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setMessage(data.message || 'Invalid email or password.');
      }
    } catch {
      setMessage('Network error: Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-20 z-10 mix-blend-multiply"></div>
        <img
          src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1444&q=80"
          alt="City at night"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 max-w-lg px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-white">Urban <span className="text-blue-400">Eye</span></span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Every Issue Reported, Every City Improved.</h1>
          <p className="text-slate-300 text-lg">Log in to track your civic complaints and see real-time resolution updates from your city officials.</p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Sign in to your Urban Eye account.</p>
          </div>

          {message && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-50 transition-all mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-600">
            Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Get started free</Link>
          </div>

          {/* Guest divider */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => { loginAsGuest(); navigate('/dashboard'); }}
            className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 py-3 rounded-lg font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
          >
            <span className="text-lg">👁️</span>
            Continue as Guest <span className="text-slate-400 font-normal">(read-only preview)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;