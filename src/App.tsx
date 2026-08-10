import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedCollections } from './components/FeaturedCollections';
import { PropertyListingPage } from './components/PropertyListingPage';
import { PropertyDetailPage } from './components/PropertyDetailPage';
import { PostPropertyPortal } from './components/PostPropertyPortal';
import { UserDashboard } from './components/UserDashboard';
import { LeadModal } from './components/LeadModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { ToastContainer } from './components/Toast';
import { Property } from './types';
import { Building2, Phone, Mail, MapPin, Heart, ShieldCheck, Sparkles, ChevronRight, Calculator, PlusCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, selectedProperty, setActiveView, setFilters } = useApp();
  const [modalProperty, setModalProperty] = useState<Property | null>(null);

  const handleContactClick = (property: Property) => {
    setModalProperty(property);
  };

  const handleFooterCityClick = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
    setActiveView('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <FeaturedCollections onContactClick={handleContactClick} />
          </>
        )}

        {activeView === 'listings' && (
          <PropertyListingPage onContactClick={handleContactClick} />
        )}

        {activeView === 'detail' && selectedProperty && (
          <PropertyDetailPage property={selectedProperty} onContactClick={handleContactClick} />
        )}

        {activeView === 'post-property' && (
          <PostPropertyPortal />
        )}

        {(activeView === 'dashboard' || activeView === 'valuation') && (
          <UserDashboard />
        )}
      </main>

      {/* Contact Owner Lead Modal */}
      <LeadModal
        property={modalProperty}
        onClose={() => setModalProperty(null)}
      />

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer />

      {/* Global Toast Messages */}
      <ToastContainer />

      {/* Footer (Dark Vibrant Theme #1F2937 / Slate-900) */}
      <footer className="bg-slate-900 text-gray-300 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
            
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 text-white font-extrabold text-xl tracking-tight px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Building2 className="w-6 h-6" />
                  <span>magicbricks</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
                  AI Edition
                </span>
              </div>

              <p className="text-gray-400 leading-relaxed max-w-sm">
                India's premier real estate marketplace powered by Gemini AI Studio. Explore verified owner properties, zero brokerage listings, AI property valuations, and instant site visit bookings.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('post-property')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Property FREE</span>
                </button>
                <button
                  onClick={() => setActiveView('valuation')}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>AI Valuation</span>
                </button>
              </div>
            </div>

            {/* Col 2: Top Metropolitan Cities */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Top Cities</h4>
              <ul className="space-y-2">
                {['Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'].map(city => (
                  <li key={city}>
                    <button
                      onClick={() => handleFooterCityClick(city)}
                      className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      Flats in {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Popular Search Categories */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Popular Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => { setFilters(prev => ({ ...prev, postedBy: ['Owner'] })); setActiveView('listings'); }} className="text-gray-400 hover:text-red-400 transition-colors">
                    Zero Brokerage Owner Flats
                  </button>
                </li>
                <li>
                  <button onClick={() => { setFilters(prev => ({ ...prev, maxPrice: 15000000 })); setActiveView('listings'); }} className="text-gray-400 hover:text-red-400 transition-colors">
                    Budget Homes Under ₹1.5 Cr
                  </button>
                </li>
                <li>
                  <button onClick={() => { setFilters(prev => ({ ...prev, listingType: 'New Projects' })); setActiveView('listings'); }} className="text-gray-400 hover:text-red-400 transition-colors">
                    New Builder Project Launches
                  </button>
                </li>
                <li>
                  <button onClick={() => { setFilters(prev => ({ ...prev, propertyTypes: ['Villa'] })); setActiveView('listings'); }} className="text-gray-400 hover:text-red-400 transition-colors">
                    Independent Luxury Villas
                  </button>
                </li>
                <li>
                  <button onClick={() => { setFilters(prev => ({ ...prev, listingType: 'Commercial' })); setActiveView('listings'); }} className="text-gray-400 hover:text-red-400 transition-colors">
                    Commercial Workspaces & Shops
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: AI Tools & Contact */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">AI Real Estate Hub</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gemini AI Price Engine</span>
                </li>
                <li className="text-gray-400">Locality ROI Reports</li>
                <li className="text-gray-400">Automated Description Generator</li>
                <li className="text-gray-400">Direct Buyer Inquiries Tracker</li>
                <li className="text-gray-400">Verified Owner Checks</li>
              </ul>
            </div>

          </div>

          {/* Copyright Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} MagicBricks Real Estate Platform. Inspired by MagicBricks & Powered by Gemini AI.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-gray-400 cursor-pointer">Sitemap</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
