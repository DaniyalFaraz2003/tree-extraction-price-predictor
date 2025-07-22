import { useState } from 'react';
import "./index.css";
import treeRemovalData from './treeRemovalData.js';

export default function App() {
  // State management for all form fields
  const [obstacles, setObstacles] = useState([]);
  const [treeType, setTreeType] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [circumference, setCircumference] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Available options
  const obstacleOptions = ['house', 'shed', 'fence', 'powerlines', 'garden'];
  const treeTypeOptions = ['leafy', 'pokey'];
  const serviceTypeOptions = ['tree trim', 'remove stump', 'both'];

  // Handle obstacle selection (multiple choice)
  const handleObstacleChange = (obstacle) => {
    setObstacles(prev =>
      prev.includes(obstacle)
        ? prev.filter(item => item !== obstacle)
        : [...prev, obstacle]
    );
  };

  // Real price calculation using treeRemovalData
  const calculatePrice = (formData) => {
    const circumference = parseFloat(formData.circumference);
    if (isNaN(circumference)) return 0;

    // Find the correct data object for the circumference
    const dataObj = treeRemovalData.find(obj => {
      const [min, max] = obj.size.split('-').map(Number);
      return circumference >= min && circumference <= max;
    });
    if (!dataObj) return 0;

    let total = 0;

    // Add tree type price
    if (formData.treeType && dataObj[formData.treeType]) {
      total += dataObj[formData.treeType];
    }

    // Add obstacles prices
    if (Array.isArray(formData.obstacles)) {
      formData.obstacles.forEach(obstacle => {
        // Map UI obstacle names to data keys
        let key = obstacle;
        if (key === 'house' || key === 'shed') key = 'houseShed';
        if (dataObj[key]) {
          total += dataObj[key];
        }
      });
    }

    // Add service type price
    if (formData.serviceType) {
      if (formData.serviceType === 'remove stump' && dataObj.stumpRemoval) {
        total += dataObj.stumpRemoval;
      }
      // If both, add stumpRemoval and tree type again (if not already added)
      if (formData.serviceType === 'both') {
        if (dataObj.stumpRemoval) total += dataObj.stumpRemoval;
        // Optionally, you can decide if tree type should be added again or not
      }
      // If 'tree trim', do nothing extra (already added tree type)
    }

    return Math.round(total);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!treeType || !serviceType || !circumference) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCalculating(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const formData = {
      obstacles,
      treeType,
      serviceType,
      circumference: parseFloat(circumference)
    };

    const price = calculatePrice(formData);
    setPriceEstimate(price);
    setShowModal(true);
    setIsCalculating(false);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setPriceEstimate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header with Logo */}
      <header className="w-full bg-white border-b border-gray-100 flex flex-col items-center justify-center pt-8 pb-10">
        <div className="flex flex-col items-center">
          <img 
            src="/3D Logo.jpg" 
            alt="Company Logo" 
            className="h-56 w-auto rounded-2xl shadow-2xl object-contain mb-6"
          />
          <div className="flex flex-row items-center justify-center gap-12">
            <img 
              src="/ICA-400.png" 
              alt="ICA Certification" 
              className="h-32 w-auto opacity-95 drop-shadow-lg object-contain rounded-xl bg-white p-2"
            />
            <img 
              src="/Asset 1.png" 
              alt="Company Asset" 
              className="h-32 w-auto opacity-95 drop-shadow-lg object-contain rounded-xl bg-white p-2"
            />
          </div>
        </div>
        {/* Optional: Add a title/subtitle below the logos */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center mt-8 mb-2">Your Canopy Calculator</h1>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">Get a ballpark estimate for your tree services. Fill out the form below to receive a detailed quote.</p>
      </header>

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Header */}
          {/* <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Your Canopy Calculator
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a ballpark estimate for your tree services. Fill out the form below to receive a detailed quote.
            </p>
          </div> */}

          {/* Main Content - Side by Side Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main Form Card - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Obstacles Section */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        ⚠️
                      </span>
                      Obstacles Near Tree
                    </h2>
                    <p className="text-gray-600">Select all obstacles that are near the tree:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {obstacleOptions.map((obstacle) => (
                        <label key={obstacle} className="relative">
                          <input
                            type="checkbox"
                            checked={obstacles.includes(obstacle)}
                            onChange={() => handleObstacleChange(obstacle)}
                            className="sr-only"
                          />
                          <div className={`
                          cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center
                          ${obstacles.includes(obstacle)
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                            }
                        `}>
                            <div className="font-medium capitalize">{obstacle}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tree Type Section */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        🌳
                      </span>
                      Tree Type
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {treeTypeOptions.map((type) => (
                        <label key={type} className="relative">
                          <input
                            type="radio"
                            name="treeType"
                            value={type}
                            checked={treeType === type}
                            onChange={(e) => setTreeType(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`
                          cursor-pointer p-6 rounded-xl border-2 transition-all duration-200
                          ${treeType === type
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                            }
                        `}>
                            <div className="text-center">
                              <div className="text-3xl mb-2">
                                {type === 'leafy' ? '🍃' : '🌲'}
                              </div>
                              <div className="font-semibold text-lg capitalize">{type}</div>
                              <div className="text-sm mt-1">
                                {type === 'leafy' ? 'Broad-leaved trees' : 'Coniferous trees'}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Service Type Section */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        🔧
                      </span>
                      Removal
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {serviceTypeOptions.map((service) => (
                        <label key={service} className="relative">
                          <input
                            type="radio"
                            name="serviceType"
                            value={service}
                            checked={serviceType === service}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`
                          cursor-pointer p-6 rounded-xl border-2 transition-all duration-200
                          ${serviceType === service
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                            }
                        `}>
                            <div className="text-center">
                              <div className="text-3xl mb-2">
                                {service === 'tree trim' ? '🌳' : service === 'remove stump' ? '🪓' : '🌳🪓'}
                              </div>
                              <div className="font-semibold text-lg capitalize">{service}</div>
                              <div className="text-sm mt-1">
                                {service === 'tree trim' ? 'Tree trimming only' : service === 'remove stump' ? 'Stump removal only' : 'Tree trimming & stump removal'}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Circumference Section */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        📏
                      </span>
                      Tree Circumference
                    </h2>
                    <div className="max-w-md">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Circumference (inches)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={circumference}
                          onChange={(e) => setCircumference(e.target.value)}
                          placeholder="Enter tree circumference"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg"
                          min="0"
                          step="0.1"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          inches
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Measure around the trunk at chest height
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isCalculating}
                      className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isCalculating ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Calculating Price...
                        </div>
                      ) : (
                        'Calculate Price Estimate'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Summary Section - Takes 1/3 of the space */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    📋
                  </span>
                  Project Summary
                </h3>

                {(!obstacles.length && !treeType && !serviceType && !circumference) ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📝</div>
                    <p className="text-gray-500">Fill out the form to see your project summary here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Obstacles Summary */}
                    {obstacles.length > 0 && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                          <span className="mr-2">⚠️</span>
                          Obstacles
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {obstacles.map((obstacle) => (
                            <span key={obstacle} className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm capitalize">
                              {obstacle}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tree Type Summary */}
                    {treeType && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                          <span className="mr-2">🌳</span>
                          Tree Type
                        </h4>
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">
                            {treeType === 'leafy' ? '🍃' : '🌲'}
                          </span>
                          <span className="capitalize font-medium">{treeType}</span>
                        </div>
                      </div>
                    )}

                    {/* Service Type Summary */}
                    {serviceType && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <span className="mr-2">🔧</span>
                          Service
                        </h4>
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">
                            {serviceType === 'tree trim' ? '🌳' : serviceType === 'remove stump' ? '🪓' : '🌳🪓'}
                          </span>
                          <span className="capitalize font-medium">{serviceType}</span>
                        </div>
                      </div>
                    )}

                    {/* Circumference Summary */}
                    {circumference && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                          <span className="mr-2">📏</span>
                          Circumference
                        </h4>
                        <div className="text-2xl font-bold text-purple-700">
                          {circumference} <span className="text-sm font-normal text-purple-600">inches</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Quick Stats</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Obstacles:</span>
                          <span className="font-medium">{obstacles.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tree Type:</span>
                          <span className="font-medium capitalize">{treeType || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium capitalize">{serviceType || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Circumference:</span>
                          <span className="font-medium">{circumference ? `${circumference}"` : 'Not entered'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src="/3D Logo.jpg"
                      alt="Company Logo"
                      className="h-16 w-auto rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800">Your Canopy Calculator</h3>
                      <p className="text-sm text-gray-600">Professional Tree Services</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Providing professional tree trimming, stump removal, and arborist services with accurate pricing and exceptional customer service.
                  </p>
                  <div className="flex items-center space-x-4">
                    <img
                      src="/ICA-400.png"
                      alt="ICA Certification"
                      className="h-12 w-auto opacity-90"
                    />
                    <img
                      src="/Asset 1.png"
                      alt="Company Asset"
                      className="h-12 w-auto opacity-90"
                    />
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Our Services</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Tree Trimming</li>
                    <li>Stump Removal</li>
                    <li>Emergency Services</li>
                    <li>Arborist Consultation</li>
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Contact Info</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>📞 (555) 123-4567</p>
                    <p>📧 info@canopycalculator.com</p>
                    <p>📍 Serving Local Area</p>
                    <p>🕒 24/7 Emergency Service</p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer */}
              <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  © 2024 Your Canopy Calculator. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className="text-sm text-gray-500">Licensed & Insured</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">ISA Certified Arborists</span>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Price Estimate Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] transform transition-all duration-300 scale-100 flex flex-col">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-t-2xl flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/3D Logo.jpg"
                      alt="Company Logo"
                      className="h-14 w-auto rounded-lg"
                    />
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="mr-2">💰</span>
                      Price Estimate
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 flex-1 overflow-y-auto">
                {/* Price Display */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    ${priceEstimate?.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Estimated Total Cost</p>
                </div>

                {/* Project Details - Compact */}
                <div className="space-y-2 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Project Details:</h3>

                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-gray-600">Tree Type:</span>
                    <span className="font-medium capitalize">{treeType}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium capitalize">{serviceType}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-gray-600">Circumference:</span>
                    <span className="font-medium">{circumference} inches</span>
                  </div>

                  <div className="flex justify-between items-center py-1 text-sm">
                    <span className="text-gray-600">Obstacles:</span>
                    <span className="font-medium">{obstacles.length} selected</span>
                  </div>
                </div>

                {/* What's Included - Compact */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">What's Included:</h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Professional tree removal service
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Debris cleanup and disposal
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Safety equipment and insurance
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Site restoration
                    </li>
                  </ul>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 text-center mb-4">
                  * This is an estimate. Final price may vary based on site conditions and additional requirements.
                </p>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <div className="space-y-2">
                  <button
                    onClick={closeModal}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm"
                  >
                    Get This Quote
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm"
                  >
                    Modify Estimate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}