import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white font-semibold text-sm transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
      <span className="text-xl">{toast.type === 'success' ? '✅' : '❌'}</span>
      <span>{toast.message}</span>
    </div>
  );
};

const STATUS_CONFIG = {
  'New':         { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   dot: 'bg-blue-500'   },
  'In Progress': { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300',  dot: 'bg-amber-500'  },
  'Resolved':    { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  dot: 'bg-green-500'  },
};

const CATEGORY_ICONS = {
  'Roads & Potholes':'🛣️','Water Supply':'💧','Waste & Sanitation':'♻️',
  'Street Lighting':'💡','Public Safety':'🛡️','Parks & Recreation':'🌳','Other':'📋',
};

// ── CSV Export helper ────────────────────────────────────────────────────────
const exportCSV = (complaints) => {
  const header = ['ID','Category','Address','City','State','Status','Citizen Email','Date'];
  const rows = complaints.map(c => [
    c._id, c.category||'Other', `"${c.address}"`, c.city, c.state, c.status,
    c.user?.email||'', new Date(c.createdAt).toLocaleDateString()
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a'); a.href = url; a.download = 'urban-eye-portfolio.csv'; a.click();
  URL.revokeObjectURL(url);
};

// ── Portfolio impact card ─────────────────────────────────────────────────────
const PortfolioCard = ({ c }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100 flex flex-col group">
    <div className="relative h-40 bg-slate-100 overflow-hidden flex-shrink-0">
      {c.imageUrl
        ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        : <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
      }
      <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">✓ Resolved</div>
      <div className="absolute top-2 right-2 bg-white/90 text-xs font-medium px-2 py-0.5 rounded-full text-slate-600">
        {CATEGORY_ICONS[c.category]||'📋'} {c.category||'Other'}
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mb-1">{c.address}</h3>
      <p className="text-xs text-slate-500">📍 {c.city}, {c.state}</p>
      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400 mt-3">
        <span className="font-medium text-slate-600">{c.user?.email||'Citizen'}</span>
        <span>{new Date(c.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</span>
      </div>
    </div>
  </div>
);

// ── Main AdminDashboard ───────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [complaints, setComplaints]   = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState(null);
  const [updating, setUpdating]       = useState(null);
  const [filter, setFilter]           = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mainTab, setMainTab]         = useState('complaints'); // 'complaints' | 'portfolio'
  const [portSearch, setPortSearch]   = useState('');

  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3500); };

  const fetchComplaints = useCallback(async () => {
    try {
      const response = await fetch('/api/complaint', { headers: { token } });
      const data = await response.json();
      if (response.ok) setComplaints(data);
      else showToast(data.message || 'Failed to load.', 'error');
    } catch { showToast('Network error.', 'error'); }
    finally { setLoading(false); }
  }, [token]);

  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch('/api/complaint/stats');
      const d = await r.json();
      if (r.ok) setStats(d);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (token) { fetchComplaints(); fetchStats(); } }, [token, fetchComplaints, fetchStats]);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/complaint/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', token },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
        showToast(newStatus === 'Resolved' ? '✅ Marked Resolved. Citizen notified!' : `Status → "${newStatus}"`, 'success');
        if (newStatus === 'Resolved') fetchStats();
      } else showToast(data.message || 'Failed.', 'error');
    } catch { showToast('Network error.', 'error'); }
    finally { setUpdating(null); }
  };

  const filtered = complaints.filter(c => {
    const matchFilter = filter === 'All' || c.status === filter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.address?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.state?.toLowerCase().includes(q) || c.user?.email?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const resolved = complaints.filter(c => c.status === 'Resolved');
  const portFiltered = resolved.filter(c => {
    const q = portSearch.toLowerCase();
    return !q || c.address?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || c.user?.email?.toLowerCase().includes(q);
  });

  const counts = { All: complaints.length, New: complaints.filter(c=>c.status==='New').length, 'In Progress': complaints.filter(c=>c.status==='In Progress').length, Resolved: resolved.length };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Toast toast={toast} />
      <div className="bg-slate-900 pb-24">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                {user?.role === 'Officer' ? '👮 Officer Dashboard' : '🛡️ Admin Dashboard'}
              </h1>
              <p className="text-slate-400 mt-1">Welcome back, <span className="text-white font-semibold">{user?.fullName}</span>
                <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${user?.role === 'Officer' ? 'bg-blue-500/20 text-blue-300' : 'bg-violet-500/20 text-violet-300'}`}>
                  {user?.role}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Tab switcher */}
              <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
                <button onClick={() => setMainTab('complaints')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mainTab==='complaints'?'bg-white text-slate-900 shadow':'text-slate-400 hover:text-white'}`}>
                  📋 Complaints
                </button>
                <button onClick={() => setMainTab('portfolio')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${mainTab==='portfolio'?'bg-emerald-500 text-white shadow':'text-slate-400 hover:text-white'}`}>
                  🏆 Portfolio {resolved.length > 0 && <span className="ml-1 opacity-70">({resolved.length})</span>}
                </button>
              </div>
              <button onClick={fetchComplaints} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {['All','New','In Progress','Resolved'].map(s => (
              <button key={s} onClick={() => { setFilter(s); setMainTab('complaints'); }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${filter===s&&mainTab==='complaints'?'bg-white border-blue-500 shadow-lg':'bg-slate-800 border-transparent hover:bg-slate-700'}`}>
                <div className={`text-3xl font-extrabold ${filter===s&&mainTab==='complaints'?'text-slate-900':'text-white'}`}>{counts[s]}</div>
                <div className={`text-sm font-medium mt-1 ${filter===s&&mainTab==='complaints'?'text-slate-500':'text-slate-400'}`}>{s}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">

        {/* ══ COMPLAINTS TAB ══ */}
        {mainTab === 'complaints' && (
          <>
            <div className="mb-6 bg-white rounded-xl shadow-md p-4">
              <input type="text" placeholder="🔍 Search by address, city, state, or citizen email..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            {loading ? (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"/>
                <p className="text-gray-500">Loading complaints...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                <p className="font-semibold text-gray-500">No complaints found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map(c => {
                  const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG['New'];
                  const isUpdating = updating === c._id;
                  return (
                    <div key={c._id} className={`bg-white rounded-xl shadow-md border-l-4 overflow-hidden ${c.status==='Resolved'?'border-green-500':c.status==='In Progress'?'border-amber-500':'border-blue-500'}`}>
                      <div className="flex flex-col md:flex-row">
                        {c.imageUrl
                          ? <div className="md:w-36 h-36 flex-shrink-0"><img src={c.imageUrl} alt="" className="w-full h-full object-cover"/></div>
                          : <div className="md:w-36 h-36 flex-shrink-0 bg-slate-100 flex items-center justify-center text-slate-300">
                              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </div>
                        }
                        <div className="flex-1 p-5 flex flex-col md:flex-row gap-4 md:items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>{c.status}
                              </span>
                              <span className="text-xs text-slate-400">{CATEGORY_ICONS[c.category]||'📋'} {c.category||'Other'}</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">{c.address}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">📍 {c.city}, {c.state}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              <span className="font-medium text-slate-600">{c.user?.email||'Unknown'}</span> &bull; {new Date(c.createdAt).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
                            </p>
                          </div>
                          <div className="flex-shrink-0 w-full md:w-48">
                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wide">Update Status</label>
                            <div className="relative">
                              <select value={c.status} disabled={isUpdating} onChange={e => updateStatus(c._id, e.target.value)}
                                className={`w-full pl-3 pr-8 py-2.5 text-sm font-bold rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 appearance-none cursor-pointer disabled:opacity-60 transition-colors ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                <option value="New">🔵 New</option>
                                <option value="In Progress">🟡 In Progress</option>
                                <option value="Resolved">🟢 Resolved</option>
                              </select>
                              {isUpdating && <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg"><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/></div>}
                            </div>
                            {c.status !== 'Resolved' && (
                              <button
                                onClick={() => updateStatus(c._id, 'Resolved')}
                                disabled={isUpdating}
                                className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs font-bold py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                <span>🟢</span> This Issue is Resolved
                              </button>
                            )}
                            {c.status === 'Resolved' && <p className="text-xs text-green-600 font-extrabold mt-2 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md border border-green-200 justify-center">✅ Issue Fixed & Notified</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══ PORTFOLIO TAB ══ */}
        {mainTab === 'portfolio' && (
          <div>
            {/* Impact Stats Bar */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Resolved',    value: stats.resolved,       icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Cities Covered',    value: stats.citiesCount,    icon: '🏙️', color: 'text-blue-600',    bg: 'bg-blue-50'    },
                  { label: 'Citizens Helped',   value: stats.citizensHelped, icon: '👥', color: 'text-violet-600',  bg: 'bg-violet-50'  },
                  { label: 'Success Rate',      value: `${stats.successRate}%`, icon: '📈', color: 'text-amber-600', bg: 'bg-amber-50' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center border border-white shadow-sm`}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                    <div className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Top Cities Chart */}
            {stats?.topCities?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">🏆 Top Cities by Resolved Complaints</h3>
                <div className="space-y-3">
                  {stats.topCities.map((city, i) => {
                    const max = stats.topCities[0].count;
                    const pct = Math.round((city.count / max) * 100);
                    const colors = ['bg-emerald-500','bg-blue-500','bg-violet-500','bg-amber-500','bg-pink-500','bg-cyan-500','bg-rose-500','bg-indigo-500'];
                    return (
                      <div key={city.city} className="flex items-center gap-3 text-sm">
                        <span className="text-slate-400 font-bold w-5 text-right flex-shrink-0">#{i+1}</span>
                        <span className="text-slate-700 font-semibold w-28 flex-shrink-0 truncate">{city.city}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className={`h-full rounded-full ${colors[i%colors.length]}`} style={{width:`${pct}%`}}/>
                        </div>
                        <span className="text-slate-500 font-bold w-8 text-right flex-shrink-0">{city.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category breakdown */}
            {stats?.categoryBreakdown?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
                <h3 className="text-base font-bold text-slate-800 mb-4">📊 Resolved by Category</h3>
                <div className="flex flex-wrap gap-3">
                  {stats.categoryBreakdown.map(cat => (
                    <div key={cat.category} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                      <span>{CATEGORY_ICONS[cat.category]||'📋'}</span>
                      <span className="text-sm font-medium text-slate-700">{cat.category}</span>
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search + Export */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input type="text" placeholder="🔍 Search resolved complaints..." value={portSearch}
                onChange={e => setPortSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/>
              <button onClick={() => exportCSV(portFiltered)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Export CSV ({portFiltered.length})
              </button>
            </div>

            {/* Portfolio grid */}
            {loading ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"/>
                <p className="text-slate-400">Loading portfolio...</p>
              </div>
            ) : portFiltered.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-14 text-center border border-slate-100">
                <div className="text-5xl mb-3">🏙️</div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No resolved complaints yet</h3>
                <p className="text-slate-500 text-sm">Mark complaints as Resolved to build your impact portfolio.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-500 mb-4">Showing <span className="font-semibold text-slate-700">{portFiltered.length}</span> resolved issue{portFiltered.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {portFiltered.map(c => <PortfolioCard key={c._id} c={c} />)}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
