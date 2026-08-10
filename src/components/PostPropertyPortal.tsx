import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ListingType, PropertyType, FurnishingStatus, ConstructionStatus, PostedBy, Facing, Property } from '../types';
import { Building2, Plus, X, Upload, Sparkles, Check, ArrowRight, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';

export const PostPropertyPortal: React.FC = () => {
  const { addProperty, selectedCity, setActiveView, viewPropertyDetail, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Basic Info
  const [listingType, setListingType] = useState<ListingType>('Buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [city, setCity] = useState<string>(selectedCity || 'Mumbai');
  const [locality, setLocality] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // Step 2: Details
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [balconies, setBalconies] = useState<number>(2);
  const [areaSqFt, setAreaSqFt] = useState<number>(1250);
  const [price, setPrice] = useState<number>(15000000);
  const [priceDisplay, setPriceDisplay] = useState<string>('₹1.50 Cr');
  const [constructionStatus, setConstructionStatus] = useState<ConstructionStatus>('Ready to Move');
  const [possessionDate, setPossessionDate] = useState<string>('Ready');
  const [ageOfBuilding, setAgeOfBuilding] = useState<string>('1-3 Years');
  const [floor, setFloor] = useState<string>('8th');
  const [totalFloors, setTotalFloors] = useState<string>('20');
  const [facing, setFacing] = useState<Facing>('East');
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi-Furnished');
  const [parking, setParking] = useState<string>('1 Covered Slot');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Gymnasium', '24/7 Security', 'Power Backup', 'Clubhouse', 'Intercom'
  ]);

  // Step 3: Photos & AI Description
  const [description, setDescription] = useState<string>('');
  const [isGeneratingAiDesc, setIsGeneratingAiDesc] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // Step 4: Contact details
  const [postedBy, setPostedBy] = useState<PostedBy>('Owner');
  const [postedByName, setPostedByName] = useState<string>('');
  const [postedByPhone, setPostedByPhone] = useState<string>('');
  const [postedByEmail, setPostedByEmail] = useState<string>('');

  const ALL_AMENITIES = [
    'Gymnasium', 'Swimming Pool', '24/7 Security', 'Clubhouse', 'Power Backup',
    'EV Charging Station', 'Children Play Area', 'Intercom', 'Gated Community',
    'Private Pool', 'Landscaped Garden', 'Elevator', 'CCTV Security'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // AI Description Generator via Gemini API
  const handleGenerateAiDescription = async () => {
    if (!locality) {
      showToast('Please enter locality name in Step 1 first!', 'warning');
      return;
    }

    setIsGeneratingAiDesc(true);
    try {
      const res = await fetch('/api/gemini/ai-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          bhk: bedrooms,
          city,
          locality,
          areaSqFt,
          expectedPrice: priceDisplay || `₹${price.toLocaleString()}`,
          furnishing,
          amenities: selectedAmenities,
          keyHighlights: `${constructionStatus}, ${facing} facing, ${parking}`
        })
      });

      const data = await res.json();
      if (data.description) {
        setDescription(data.description);
        showToast('AI Description generated!', 'success');
      }
    } catch (err) {
      console.error("AI Description Error:", err);
      showToast('Generated sample description.', 'info');
      setDescription(`Stunning ${bedrooms} BHK ${propertyType} for sale in ${locality}, ${city}. Offering ${areaSqFt} sq.ft carpet area, ${furnishing} condition with premium fittings, ample natural light, and top amenities.`);
    } finally {
      setIsGeneratingAiDesc(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (!locality.trim() || !postedByName.trim() || !postedByPhone.trim()) {
      showToast('Please fill in required fields (Locality, Your Name, Phone)', 'warning');
      return;
    }

    const pricePerSqFt = areaSqFt > 0 ? Math.round(price / areaSqFt) : 0;
    const computedPriceDisplay = price >= 10000000
      ? `₹${(price / 10000000).toFixed(2)} Cr`
      : price >= 100000
      ? `₹${(price / 100000).toFixed(2)} Lac`
      : `₹${price.toLocaleString()}`;

    const newProp = addProperty({
      title: `${bedrooms > 0 ? `${bedrooms} BHK ` : ''}${propertyType} in ${locality}`,
      description: description || `Beautiful ${propertyType} located in prime locality of ${locality}, ${city}. Excellent layout with high grade construction and modern amenities.`,
      price,
      priceDisplay: computedPriceDisplay,
      pricePerSqFt,
      areaSqFt,
      bedrooms,
      bathrooms,
      balconies,
      propertyType,
      listingType,
      city,
      locality,
      address: address || `${locality}, ${city}`,
      constructionStatus,
      possessionDate,
      ageOfBuilding,
      floor,
      totalFloors,
      facing,
      furnishing,
      parking,
      postedBy,
      postedByName,
      postedByPhone,
      postedByEmail,
      isVerified: true,
      isExclusive: false,
      isFeatured: true,
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
      amenities: selectedAmenities
    });

    viewPropertyDetail(newProp);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl mb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
              FREE LISTING
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Post Your Property for FREE
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Get genuine buyer & tenant inquiries directly on your phone.
            </p>
          </div>

          {/* Step Indicator Badges */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  step === s
                    ? 'bg-red-600 text-white shadow-md'
                    : step > s
                    ? 'bg-emerald-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xl">
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Step 1: Basic Property Overview</h2>
                <p className="text-xs text-gray-500">Select what you want to list and property location.</p>
              </div>

              {/* Listing Purpose (Buy / Rent / Commercial) */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  I want to:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Buy', 'Rent', 'Commercial'] as ListingType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setListingType(type)}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        listingType === type
                          ? 'bg-red-600 border-red-600 text-white shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'Buy' ? 'Sell Property' : type === 'Rent' ? 'Rent Out' : 'Commercial'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Property Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(['Apartment', 'Villa', 'Plot', 'Penthouse', 'Commercial Office', 'Commercial Shop'] as PropertyType[]).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setPropertyType(pt)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                        propertyType === pt
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* City & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    City <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-red-500"
                  >
                    {['Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Locality / Sector <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Bandra West, Whitefield, DLF 5"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Full Building / Society Name & Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Godrej Prime, Tower B, Flat 802"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!locality.trim()) {
                      showToast('Please specify locality', 'warning');
                      return;
                    }
                    setStep(2);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Property Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SPECS & PRICING */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Step 2: Key Specs & Expected Price</h2>
                <p className="text-xs text-gray-500">Provide accurate details for higher buyer trust.</p>
              </div>

              {/* BHK & Baths */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    BHK Count
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Bathrooms
                  </label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Baths</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Balconies
                  </label>
                  <select
                    value={balconies}
                    onChange={(e) => setBalconies(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Balcony</option>)}
                  </select>
                </div>
              </div>

              {/* Area & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Carpet Area (Sq.Ft)
                  </label>
                  <input
                    type="number"
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Expected Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-red-600"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
                    Calculated Rate: ₹{areaSqFt > 0 ? Math.round(price / areaSqFt).toLocaleString() : 0}/sq.ft
                  </span>
                </div>
              </div>

              {/* Construction Status & Furnishing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Construction Status
                  </label>
                  <select
                    value={constructionStatus}
                    onChange={(e) => setConstructionStatus(e.target.value as any)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Furnishing
                  </label>
                  <select
                    value={furnishing}
                    onChange={(e) => setFurnishing(e.target.value as any)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    <option value="Furnished">Fully Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Select Key Amenities:
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map(a => {
                    const selected = selectedAmenities.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => handleAmenityToggle(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selected
                            ? 'bg-red-600 border-red-600 text-white shadow-xs'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}{a}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Photos & Description</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS & AI DESCRIPTION */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Step 3: Property Photos & AI Description</h2>
                <p className="text-xs text-gray-500">Listings with high-resolution photos get 5x higher inquiries.</p>
              </div>

              {/* Photos List */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Photo Gallery URLs:
                </label>

                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste Image URL..."
                    className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Add Photo
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-gray-200 group">
                      <img src={url} alt="Listing" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & AI Generator */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Property Description
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateAiDescription}
                    disabled={isGeneratingAiDesc}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-300"
                  >
                    {isGeneratingAiDesc ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    )}
                    <span>Write with Gemini AI</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property highlights, nearby metro, interior fittings..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 font-medium focus:bg-white focus:border-red-500"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Next: Contact Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & PUBLISH */}
          {step === 4 && (
            <form onSubmit={handlePublish} className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-lg font-bold text-gray-900">Step 4: Contact Details & Publish</h2>
                <p className="text-xs text-gray-500">How interested buyers/tenants can reach you.</p>
              </div>

              {/* Posted By Role */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  You are listing as:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Owner', 'Agent', 'Builder'] as PostedBy[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setPostedBy(role)}
                      className={`py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        postedBy === role
                          ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Your Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={postedByName}
                    onChange={(e) => setPostedByName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                    Mobile Phone <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={postedByPhone}
                    onChange={(e) => setPostedByPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={postedByEmail}
                  onChange={(e) => setPostedByEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-extrabold text-sm shadow-xl hover:shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Publish FREE Listing Now</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
