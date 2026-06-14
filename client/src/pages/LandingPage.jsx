import React from 'react';
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/bakcground----.jpg')] bg-cover bg-center -z-20" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30 -z-10" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-start min-h-screen px-6 md:px-20">
        <div className="text-white max-w-3xl leading-none">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-md">
            Urban Eye
            <span className="block text-3xl md:text-4xl mt-3 font-medium opacity-90">
              Smart Civic Complaint Management
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mt-6 drop-shadow-sm">
            Empowering citizens and city officials with a seamless platform to report, track, and resolve civic issues — from potholes to public lighting — all in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

