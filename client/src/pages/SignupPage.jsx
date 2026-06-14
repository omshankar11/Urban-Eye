import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    address: '',
    role: 'Citizen'
  });
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Signup successful! Redirecting to dashboard...');
        login(data.userData, data.token);
        
        setTimeout(() => {
          if (data.userData.role === 'Admin' || data.userData.role === 'Officer') {
            navigate('/admin-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setMessage('Error: ' + (data.message || 'Signup failed'));
      }
    } catch (error) {
      setMessage('Network error: Could not reach backend.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-20 z-10 mix-blend-multiply"></div>
        <img 
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
          alt="Cityscape" 
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
          <h1 className="text-4xl font-extrabold text-white mb-6">Build a Better City Together.</h1>
          <p className="text-xl text-slate-200">
            Join thousands of citizens taking action to improve infrastructure, sanitation, and safety in their neighborhoods.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create an Account</h2>
            <p className="text-slate-500">Start reporting civic issues in seconds.</p>
          </div>
          
          {message && (
            <div className={`p-4 mb-6 rounded-lg font-medium text-sm border ${message.includes('successful') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName} 
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>

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

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">City / Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium"
              >
                <option value="Citizen">👤 Citizen</option>
                <option value="Admin">🛡️ Admin</option>
                <option value="Officer">👮 Officer</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all mt-6"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center text-slate-600">
            Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
