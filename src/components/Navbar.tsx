import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, MapPin, Heart, PlusCircle, Sparkles, UserCheck, ChevronDown, Search, Menu, X, Calculator } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    selectedCity, 
    setSelectedCity, 
    activeView, 
    setActiveView, 
    wishlistIds, 
    setIsAiDrawerOpen,
    setFilters
  } = useApp();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CITIES = ['Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'];

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setFilters(prev => ({ ...prev, city }));
    setIsCityDropdownOpen(false);
  };

  const handleNavClick = (view: 'home' | 'listings' | 'post-property' | 'dashboard' | 'valuation', listingType?: string) => {
    if (listingType) {
      setFilters(prev => ({ ...prev, listingType: listingType as any }));
    }
    setActiveView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-gray-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              India's #1 Real Estate Portal & AI Property Advisor
            </span>
            <span className="hidden md:inline text-gray-500">|</span>
            <span className="hidden md:inline text-gray-400">Zero Brokerage Verified Owner Properties Available</span>
          </div>

          <div className="flex items-center gap-4 text-gray-300">
            <button 
              onClick={() => handleNavClick('valuation')} 
              className="hover:text-white flex items-center gap-1 text-red-400 font-medium transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              AI Price Estimator
            </button>
            <button 
              onClick={() => setIsAiDrawerOpen(true)}
              className="hover:text-amber-300 flex items-center gap-1 font-medium text-amber-400 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Property Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Selector */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="bg-red-600 text-white font-extrabold text-xl tracking-tight px-3 py-1 rounded-lg shadow-sm group-hover:bg-red-700 transition-colors flex items-center gap-1.5">
                <Building2 className="w-6 h-6" />
                <span>magicbricks</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-red-600 uppercase bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                AI Powered
              </span>
            </button>

            {/* City Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-red-600 bg-gray-50 hover:bg-red-50/50 border border-gray-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Select Top Metropolitan City
                  </div>
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-between ${
                        selectedCity === city ? 'text-red-600 bg-red-50/60 font-bold' : 'text-gray-700'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <span className="w-2 h-2 rounded-full bg-red-600"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('listings', 'Buy')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeView === 'listings' ? 'text-red-600 bg-red-50 font-semibold' : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handleNavClick('listings', 'Rent')}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Rent
            </button>
            <button
              onClick={() => handleNavClick('listings', 'Commercial')}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              Commercial
            </button>
            <button
              onClick={() => handleNavClick('listings', 'New Projects')}
              className="px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>New Projects</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">New</span>
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Wishlist Icon */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* User Dashboard */}
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                activeView === 'dashboard'
                  ? 'border-red-600 bg-red-50 text-red-600'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-gray-500" />
              <span>My Dashboard</span>
            </button>

            {/* Post Property FREE Banner CTA */}
            <button
              onClick={() => handleNavClick('post-property')}
              className="relative bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Post Property</span>
              <span className="bg-amber-400 text-slate-900 text-[10px] uppercase font-black px-1.5 py-0.5 rounded shadow-xs ml-0.5">
                FREE
              </span>
            </button>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 lg:hidden rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left py-2 px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('listings', 'Buy')}
              className="text-left py-2 px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Buy Properties
            </button>
            <button
              onClick={() => handleNavClick('listings', 'Rent')}
              className="text-left py-2 px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Rent Flat & Villas
            </button>
            <button
              onClick={() => handleNavClick('listings', 'Commercial')}
              className="text-left py-2 px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              Commercial Workspaces
            </button>
            <button
              onClick={() => handleNavClick('valuation')}
              className="text-left py-2 px-3 text-sm font-semibold text-red-600 bg-red-50 rounded-lg flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              AI Valuation & Price Estimator
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className="text-left py-2 px-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
            >
              My Dashboard & Inquiries ({wishlistIds.length} Saved)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
