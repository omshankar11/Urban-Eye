import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

// ─── Animated counter ──────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = '', duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const interval = setInterval(() => {
          current = Math.min(current + increment, target);
          setCount(Math.round(current));
          if (current >= target) clearInterval(interval);
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── Shimmer skeleton card ─────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
    <div className="h-52 bg-slate-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-5 bg-slate-200 rounded w-4/5" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="h-3 bg-slate-100 rounded w-2/3 mt-4" />
    </div>
  </div>
);

// ─── Category icon map ─────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  'Roads & Potholes':    '🛣️',
  'Water Supply':        '💧',
  'Waste & Sanitation':  '♻️',
  'Street Lighting':     '💡',
  'Public Safety':       '🛡️',
  'Parks & Recreation':  '🌳',
  'Other':               '📋',
};

const CATEGORIES = ['All', 'Roads & Potholes', 'Water Supply', 'Waste & Sanitation', 'Street Lighting', 'Public Safety', 'Parks & Recreation', 'Other'];

// ─── Individual complaint card ─────────────────────────────────────────────
const ImpactCard = ({ c }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col">
    <div className="relative h-52 bg-slate-100 overflow-hidden flex-shrink-0">
      {c.imageUrl ? (
        <img
          src={c.imageUrl}
          alt="Resolved issue"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
          <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium text-slate-400">No photo attached</span>
        </div>
      )}
      {/* Resolved badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
        Resolved
      </div>
      {/* Category badge */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow">
        {CATEGORY_ICONS[c.category] || '📋'} {c.category || 'Other'}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2">{c.address}</h3>
      <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
        <svg className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">{c.city}, {c.state}</span>
      </div>
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>
          👤 <span className="font-medium text-slate-600">{c.user?.fullName || 'Citizen'}</span>
        </span>
        <span>{new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────
const PortfolioPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [category, setCategory]     = useState('All');
  const [citySearch, setCitySearch] = useState('');
  const [inputCity, setInputCity]   = useState('');

  // Fetch stats — initial + poll every 30s
  useEffect(() => {
    const loadStats = () =>
      fetch('/api/complaint/stats')
        .then(r => r.json())
        .then(d => setStats(d))
        .catch(console.error)
        .finally(() => setStatsLoading(false));
    loadStats();
    const statsInterval = setInterval(loadStats, 30000);
    return () => clearInterval(statsInterval);
  }, []);

  // Fetch complaints (on filter/page change + poll every 45s for page=1)
  const fetchComplaints = async (pg = 1, replace = true, silent = false) => {
    if (replace && !silent) setLoading(true);
    else if (!replace) setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 9 });
      if (category !== 'All') params.set('category', category);
      if (citySearch) params.set('city', citySearch);
      const res = await fetch(`/api/complaint/public?${params}`);
      const data = await res.json();
      if (res.ok) {
        setComplaints(prev => replace ? data.complaints : [...prev, ...data.complaints]);
        setTotalPages(data.pages);
        setTotal(data.total);
        setPage(pg);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchComplaints(1, true, false);
    // Poll page 1 every 45s silently (no loading spinner)
    const pollInterval = setInterval(() => fetchComplaints(1, true, true), 45000);
    return () => clearInterval(pollInterval);
  }, [category, citySearch]);

  const handleCitySearch = (e) => {
    e.preventDefault();
    setCitySearch(inputCity.trim());
  };

  const handleLoadMore = () => fetchComplaints(page + 1, false);

  const statItems = stats ? [
    { label: 'Issues Resolved',   value: stats.resolved,       suffix: '+', color: 'text-emerald-400', icon: '✅' },
    { label: 'Cities Covered',    value: stats.citiesCount,    suffix: '',  color: 'text-blue-400',    icon: '🏙️' },
    { label: 'Citizens Helped',   value: stats.citizensHelped, suffix: '+', color: 'text-violet-400',  icon: '👥' },
    { label: 'Success Rate',      value: stats.successRate,    suffix: '%', color: 'text-amber-400',   icon: '📈' },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden pb-36">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            Live Impact Data
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Impact</span> Portfolio
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Real civic issues resolved by real citizens across India. Every card here represents a community made better.
          </p>
        </div>

        {/* Stats bar */}
        <div className="max-w-5xl mx-auto px-4 mt-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsLoading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse h-24" />
                ))
              : statItems.map(s => (
                  <div key={s.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className={`text-3xl font-extrabold ${s.color}`}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 flex flex-col md:flex-row gap-4 items-center">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat !== 'All' ? CATEGORY_ICONS[cat] : '🌐'} {cat}
              </button>
            ))}
          </div>
          {/* Live indicator */}
          <span className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live Updates
          </span>
          {/* City search */}
          <form onSubmit={handleCitySearch} className="flex gap-2 w-full md:w-64 flex-shrink-0">
            <input
              type="text"
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              placeholder="🔍 Filter by city..."
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            {citySearch && (
              <button
                type="button"
                onClick={() => { setCitySearch(''); setInputCity(''); }}
                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 text-sm font-bold"
                title="Clear"
              >✕</button>
            )}
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
            >Go</button>
          </form>
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        {!loading && (
          <p className="text-sm text-slate-500">
            {total > 0
              ? <>Showing <span className="font-semibold text-slate-700">{complaints.length}</span> of <span className="font-semibold text-slate-700">{total}</span> resolved issues</>
              : 'No results found for the selected filters.'}
            {(category !== 'All' || citySearch) && (
              <button
                onClick={() => { setCategory('All'); setCitySearch(''); setInputCity(''); }}
                className="ml-3 text-blue-600 hover:underline font-medium"
              >Clear filters</button>
            )}
          </p>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : complaints.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-16 text-center border border-slate-100">
            <div className="text-6xl mb-4">🏙️</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No resolved issues found</h3>
            <p className="text-slate-500">
              {category !== 'All' || citySearch
                ? 'Try clearing filters to see all resolved complaints.'
                : 'Be the first! Report a civic issue and help improve your city.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complaints.map(c => <ImpactCard key={c._id} c={c} />)}
            </div>

            {/* Load More */}
            {page < totalPages && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>Load More Stories <span className="opacity-70">({total - complaints.length} remaining)</span></>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Top Cities ── */}
      {stats && stats.topCities?.length > 0 && (
        <div className="bg-slate-900 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-white mb-2 text-center">🏆 Top Cities by Impact</h2>
            <p className="text-slate-400 text-sm text-center mb-10">Cities with the most resolved civic issues</p>
            <div className="space-y-4">
              {stats.topCities.map((city, i) => {
                const maxCount = stats.topCities[0].count;
                const pct = Math.round((city.count / maxCount) * 100);
                const colors = ['bg-emerald-500','bg-blue-500','bg-violet-500','bg-amber-500','bg-pink-500','bg-cyan-500','bg-rose-500','bg-indigo-500'];
                return (
                  <div key={city.city} className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm font-bold w-5 text-right flex-shrink-0">#{i + 1}</span>
                    <span className="text-white font-semibold text-sm w-32 flex-shrink-0 truncate">{city.city}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[i % colors.length]} transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-slate-300 font-bold text-sm w-12 text-right flex-shrink-0">{city.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Quick Navigation ── */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">🚀 Get Involved</h2>
            <p className="text-slate-400 text-lg">Jump to any part of Urban Eye</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href:'/', icon:'🏠', label:'Home', desc:'Learn about Urban Eye and how it works', color:'from-blue-600 to-blue-800', border:'border-blue-500/30', badge:'Landing Page' },
              { href:'/portfolio', icon:'🏆', label:'Impact Portfolio', desc:'Browse all resolved civic issues in your city', color:'from-emerald-600 to-teal-800', border:'border-emerald-500/30', badge:'You are here' },
              { href:'/dashboard', icon:'👤', label:'Citizen Dashboard', desc:'Report issues and track your complaints', color:'from-violet-600 to-purple-800', border:'border-violet-500/30', badge:'Login required' },
              { href:'/admin-dashboard', icon:'🛡️', label:'Admin / Officer', desc:'Manage complaints and resolve civic issues', color:'from-amber-600 to-orange-800', border:'border-amber-500/30', badge:'Staff only' },
            ].map(link => (
              <a key={link.href} href={link.href}
                className={`group relative bg-gradient-to-br ${link.color} border ${link.border} rounded-2xl p-6 flex flex-col gap-3 hover:scale-105 hover:shadow-2xl transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <span className="self-start text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 text-white/80 uppercase tracking-wide">{link.badge}</span>
                <div className="text-4xl">{link.icon}</div>
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-1">{link.label}</h3>
                  <p className="text-white/60 text-sm leading-snug">{link.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-white/70 text-sm font-semibold group-hover:gap-2 transition-all">
                  Go <span className="text-base">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
