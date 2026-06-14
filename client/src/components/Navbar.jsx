import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="text-black w-full">
      {/* Top Offer Banner */}
      <div className="text-center font-semibold text-base md:text-lg py-2 bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-500 text-white">
        <p>
          Exclusive Price Drop! Hurry, <span className="underline underline-offset-2">Offer Ends Soon!</span>
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-transparent text-white transition-all shadow-none">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-md group-hover:bg-blue-400 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">Urban <span className="text-blue-400">Eye</span></span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center text-lg font-medium space-x-14 md:pl-28">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li><Link to="/services" className="hover:underline">Services</Link></li>
          <li><Link to="/portfolio" className="hover:underline">Portfolio</Link></li>
          <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
        </ul>

        {/* Desktop Button */}
        <Link to="/signup" className="hidden md:inline border border-white text-white hover:bg-white hover:text-black ml-24 px-12 py-3 text-lg rounded-full active:scale-95 transition-all text-center">
          Get started
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          aria-label="menu-btn"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-btn inline-block md:hidden active:scale-90 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="white">
            <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-black bg-opacity-90 shadow-sm p-6 md:hidden z-50">
            <ul className="flex flex-col space-y-5 text-lg font-medium">
              <li><Link to="/" onClick={() => setMenuOpen(false)} className="text-white">Home</Link></li>
              <li><Link to="/services" onClick={() => setMenuOpen(false)} className="text-white">Services</Link></li>
              <li><Link to="/portfolio" onClick={() => setMenuOpen(false)} className="text-white">Portfolio</Link></li>
              <li><Link to="/pricing" onClick={() => setMenuOpen(false)} className="text-white">Pricing</Link></li>
            </ul>

            <Link to="/signup" onClick={() => setMenuOpen(false)} className="inline-block border border-white text-white mt-6 text-lg font-medium hover:bg-white hover:text-black active:scale-95 transition-all w-44 py-3 rounded-full text-center">
              Get started
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
