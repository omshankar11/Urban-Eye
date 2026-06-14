import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CATEGORY_ICONS = {
  'Roads & Potholes':    '🛣️',
  'Water Supply':        '💧',
  'Waste & Sanitation':  '♻️',
  'Street Lighting':     '💡',
  'Public Safety':       '🛡️',
  'Parks & Recreation':  '🌳',
  'Other':               '📋',
};

const CATEGORIES = ['Roads & Potholes', 'Water Supply', 'Waste & Sanitation', 'Street Lighting', 'Public Safety', 'Parks & Recreation', 'Other'];

const STATUS_CONFIG = {
  'New':         { bg: 'bg-blue-100',  text: 'text-blue-800',  dot: 'bg-blue-500',  label: '🔵 New',         desc: 'Your complaint has been received.' },
  'In Progress': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', label: '🟡 In Progress', desc: 'Officials are working on it!' },
  'Resolved':    { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: '🟢 Resolved',    desc: 'This issue has been fixed. Thank you!' },
};

// ─── My Impact mini-card ───────────────────────────────────────────────────
const ImpactCard = ({ c }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-slate-100 flex flex-col group">
    <div className="relative h-44 bg-slate-100 overflow-hidden flex-shrink-0">
      {c.imageUrl ? (
        <img src={c.imageUrl} alt="Resolved" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-slate-400">No photo</span>
        </div>
      )}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" /> Resolved
      </div>
      <div className="absolute top-2.5 right-2.5 bg-white/90 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
        {CATEGORY_ICONS[c.category] || '📋'} {c.category || 'Other'}
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">{c.address}</h3>
      <p className="text-xs text-slate-500 mb-auto">📍 {c.city}, {c.state}</p>
      <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
        Resolved on {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  </div>
);

// ─── CitizenDashboard ─────────────────────────────────────────────────────
const CitizenDashboard = () => {
  const { user, token, isGuest } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData]     = useState({ city: '', state: '', address: '', image: '', category: 'Other' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]       = useState('');
  const [activeTab, setActiveTab]   = useState('All');
  const [mainTab, setMainTab]       = useState('complaints'); // 'complaints' | 'impact'

  const fetchComplaints = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const url = isGuest ? '/api/complaint/public' : '/api/complaint/my';
      const response = await fetch(url, { headers: { token } });
      const data = await response.json();
      if (response.ok) {
        setComplaints(isGuest ? data.complaints : data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [token, isGuest]);

  useEffect(() => { if (token) fetchComplaints(); }, [token, fetchComplaints]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('success');
        setFormData({ city: '', state: '', address: '', image: '', category: 'Other' });
        fetchComplaints();
      } else {
        setMessage('error:' + (data.message || 'Something went wrong.'));
      }
    } catch {
      setMessage('error:Network error. Please try again.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const filteredComplaints = activeTab === 'All'
    ? complaints
    : complaints.filter(c => c.status === activeTab);

  const resolved = complaints.filter(c => c.status === 'Resolved');

  const counts = {
    All:          complaints.length,
    New:          complaints.filter(c => c.status === 'New').length,
    'In Progress':complaints.filter(c => c.status === 'In Progress').length,
    Resolved:     resolved.length,
  };

  const successRate = complaints.length > 0
    ? Math.round((resolved.length / complaints.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900 pb-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-white">My Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back, <span className="text-white font-semibold">{user?.fullName}</span></p>
            </div>
            <div className="flex items-center gap-3">
              {/* Main tab switcher */}
              <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setMainTab('complaints')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mainTab === 'complaints' ? 'bg-white text-slate-900 shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  📋 My Complaints
                </button>
                <button
                  onClick={() => setMainTab('impact')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mainTab === 'impact' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🏆 My Impact {resolved.length > 0 && <span className="ml-1 bg-emerald-400/20 rounded-full px-1.5">{resolved.length}</span>}
                </button>
              </div>
              <button
                onClick={() => fetchComplaints(true)}
                disabled={refreshing}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">

        {/* ── MY IMPACT TAB ── */}
        {mainTab === 'impact' && (
          <div>
            {/* Personal stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Submitted',    value: complaints.length, icon: '📤', color: 'text-blue-600',    bg: 'bg-blue-50'    },
                { label: 'Resolved',     value: resolved.length,   icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Success Rate', value: `${successRate}%`, icon: '📈', color: 'text-violet-600',  bg: 'bg-violet-50'  },
              ].map(s => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center border border-white shadow-sm`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading your impact...</p>
              </div>
            ) : resolved.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-14 text-center border border-slate-100">
                <div className="text-5xl mb-3">🌱</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No resolved complaints yet</h3>
                <p className="text-slate-500 text-sm mb-5">Report civic issues to make an impact. Once resolved, they'll appear here.</p>
                <button
                  onClick={() => setMainTab('complaints')}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                  Report an Issue →
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800">🏆 Resolved by You</h2>
                  <span className="text-sm text-slate-500">{resolved.length} civic issue{resolved.length !== 1 ? 's' : ''} resolved</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {resolved.map(c => <ImpactCard key={c._id} c={c} />)}
                </div>
                <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-6 text-center">
                  <p className="text-slate-700 font-semibold">
                    🎉 You've helped resolve <span className="text-emerald-600 font-extrabold">{resolved.length}</span> civic issue{resolved.length !== 1 ? 's' : ''}!
                    Your reports appear on the public <a href="/portfolio" className="text-blue-600 underline hover:no-underline">Impact Portfolio</a>.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── COMPLAINTS TAB ── */}
        {mainTab === 'complaints' && (
          <div className="grid md:grid-cols-3 gap-8">

            {/* Submit Form or Guest Alert */}
            <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 h-fit border border-slate-100">
              {isGuest ? (
                <div className="text-center py-6">
                  <div className="text-5xl mb-4">🔓</div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Guest Preview Mode</h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    You are exploring as a guest. To submit complaints, track your personal resolutions, and build your own impact portfolio, please create an account.
                  </p>
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-lg shadow hover:shadow-lg transition-all text-sm mb-3"
                  >
                    Create Account
                  </a>
                  <p className="text-xs text-slate-400">
                    Explore all public complaints on the <a href="/portfolio" className="text-blue-600 hover:underline">Impact Portfolio</a>.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Report an Issue</h2>
                  <p className="text-sm text-slate-500 mb-5">Fill the details below and attach a photo of the issue.</p>

                  {message === 'success' && (
                    <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      Complaint submitted successfully!
                    </div>
                  )}
                  {message.startsWith('error:') && (
                    <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      {message.replace('error:', '')}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">City</label>
                      <input type="text" required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">State</label>
                      <input type="text" required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Maharashtra" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Exact Address / Landmark</label>
                      <textarea required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows="3" placeholder="Near Gandhi Chowk, Main Road..." />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Photo Evidence <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer" />
                      {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-lg border" />}
                    </div>
                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-60 transition-all text-sm">
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Submitting...
                        </span>
                      ) : 'Submit Complaint'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Complaints List */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">My Complaints</h2>
                <span className="text-sm text-slate-500">{complaints.length} total</span>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {['All', 'New', 'In Progress', 'Resolved'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${activeTab === tab ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                  >
                    {tab} <span className="ml-1 opacity-60">({counts[tab]})</span>
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="bg-white rounded-xl shadow p-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-gray-400 text-sm">Loading your complaints...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-12 text-center text-slate-400">
                  <svg className="mx-auto w-14 h-14 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <p className="font-semibold">No {activeTab !== 'All' ? activeTab : ''} complaints found.</p>
                  {activeTab === 'All' && <p className="text-sm mt-1">Use the form to report your first civic issue!</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComplaints.map(c => {
                    const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG['New'];
                    return (
                      <div key={c._id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 transition-all ${c.status === 'Resolved' ? 'border-green-500' : c.status === 'In Progress' ? 'border-amber-500' : 'border-blue-500'}`}>
                        <div className="flex flex-col sm:flex-row">
                          {c.imageUrl ? (
                            <div className="sm:w-36 h-36 flex-shrink-0">
                              <img src={c.imageUrl} alt="Complaint" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="sm:w-36 h-24 flex-shrink-0 bg-slate-100 flex items-center justify-center text-slate-300">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs text-slate-400 font-medium">
                                    {CATEGORY_ICONS[c.category] || '📋'} {c.category || 'Other'}
                                  </span>
                                </div>
                                <h3 className="font-bold text-slate-900 leading-snug">{c.address}</h3>
                                <p className="text-sm text-slate-500 mt-0.5">📍 {c.city}, {c.state}</p>
                              </div>
                              <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{c.status}
                              </span>
                            </div>
                            <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium ${cfg.bg} ${cfg.text}`}>{cfg.desc}</div>
                            <p className="text-xs text-slate-400 mt-3">
                              Submitted on {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
