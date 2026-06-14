import React from 'react';
import Navbar from '../components/Navbar';

const ServicesPage = () => {
  const services = [
    {
      title: "Infrastructure & Roads",
      description: "Report potholes, broken sidewalks, damaged traffic lights, and structural hazards in your neighborhood.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      ),
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Sanitation & Waste",
      description: "Submit complaints regarding uncollected garbage, illegal dumping, public restrooms, and street cleaning.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      ),
      color: "from-green-500 to-emerald-400"
    },
    {
      title: "Utilities & Water",
      description: "Notify officials about pipe bursts, water logging, power outages, and exposed wiring.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      color: "from-amber-500 to-yellow-400"
    },
    {
      title: "Public Safety",
      description: "Flag issues with street lighting, stray animals, or broken public fencing and guardrails.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      ),
      color: "from-red-500 to-rose-400"
    },
    {
      title: "Parks & Recreation",
      description: "Report broken playground equipment, overgrown vegetation, or vandalism in public parks.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      ),
      color: "from-indigo-500 to-violet-400"
    },
    {
      title: "Transport & Transit",
      description: "File complaints regarding damaged bus shelters, missing signages, or erratic public transport schedules.",
      icon: (
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
        </svg>
      ),
      color: "from-fuchsia-500 to-pink-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-slate-900 pb-32">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Services We Handle</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Our platform bridges the gap between citizens and city officials. We categorize your complaints automatically to route them to the right department for lightning-fast resolutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-slate-100 transform hover:-translate-y-1">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
