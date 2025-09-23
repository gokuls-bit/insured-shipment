import React, { useState } from 'react';
import { Search, Globe, Plus, Shield, Truck, Ship, Plane, Train } from 'lucide-react';

// All data is now self-contained in this file to prevent import errors.
// I have merged the realistic company data with the larger placeholder dataset.
const insuranceData = {
  "countries": {
    "India": [
      { id: 1, name: 'Tata AIG Cargo Insurance', website: 'https://www.tataaig.com', contact: '+91-22-6742-8000', shipmentTypes: ['Road', 'Rail', 'Ship', 'Air'] },
      { id: 2, name: 'ICICI Lombard Cargo Cover', website: 'https://www.icicilombard.com', contact: '+91-22-6823-4444', shipmentTypes: ['Ship', 'Air'] },
      { id: 3, name: 'Bajaj Allianz Marine Insurance', website: 'https://www.bajajallianz.com', contact: '+91-20-7116-6666', shipmentTypes: ['Ship', 'Road'] },
      { id: 4, name: 'Oriental Insurance Cargo', website: 'https://www.orientalinsurance.org.in', contact: '+91-11-2335-1200', shipmentTypes: ['Road', 'Rail', 'Air'] },
      { id: 5, name: 'New India Assurance Marine', website: 'https://www.newindia.co.in', contact: '+91-22-2204-1861', shipmentTypes: ['Ship', 'Road'] },
      { id: 6, name: 'United India Marine Insurance', website: 'https://www.uiic.co.in', contact: '+91-44-2829-4556', shipmentTypes: ['Ship', 'Air', 'Rail'] },
      { id: 7, name: 'National Insurance Cargo Shield', website: 'https://www.nationalinsurance.nic.co.in', contact: '+91-33-2230-5082', shipmentTypes: ['Road', 'Rail', 'Ship', 'Air'] },
      { "id": "IND-001", "name": "India Cargo Insurance 1", "website": "https://indiainsurance1.com", "contact": "+000-1000", "shipmentTypes": ["Ship"] }
    ],
    "USA": [
      { id: 8, name: 'AIG Cargo Insurance', website: 'https://www.aig.com', contact: '+1-877-244-0504', shipmentTypes: ['Ship', 'Air', 'Road'] },
      { id: 9, name: 'Chubb Marine Insurance', website: 'https://www.chubb.com', contact: '+1-908-903-2000', shipmentTypes: ['Ship', 'Air'] },
      { id: 10, name: 'Liberty Mutual Cargo', website: 'https://www.libertymutual.com', contact: '+1-617-357-9500', shipmentTypes: ['Road', 'Rail'] },
      { id: 11, name: 'Travelers Cargo Coverage', website: 'https://www.travelers.com', contact: '+1-860-277-0111', shipmentTypes: ['Road', 'Air'] },
      { id: 12, name: 'Zurich Marine Insurance', website: 'https://www.zurich.com', contact: '+1-847-413-6000', shipmentTypes: ['Ship', 'Air', 'Rail'] },
      { id: 13, name: 'Allianz Global Cargo', website: 'https://www.allianz.com', contact: '+1-212-974-0100', shipmentTypes: ['Ship', 'Road', 'Air'] },
      { id: 14, name: 'Hartford Marine Insurance', website: 'https://www.thehartford.com', contact: '+1-860-547-5000', shipmentTypes: ['Ship', 'Rail'] },
      { "id": "USA-001", "name": "USA Cargo Insurance 1", "website": "https://usainsurance1.com", "contact": "+000-1000", "shipmentTypes": ["Ship"] }
    ],
    "UK": [
      { id: 15, name: "Lloyd's of London Cargo", website: 'https://www.lloyds.com', contact: '+44-20-7327-1000', shipmentTypes: ['Ship', 'Air', 'Road', 'Rail'] },
      { id: 16, name: 'Aviva CargoSure', website: 'https://www.aviva.co.uk', contact: '+44-1603-622200', shipmentTypes: ['Road', 'Ship'] },
      { id: 17, name: 'RSA Group Marine', website: 'https://www.rsagroup.com', contact: '+44-20-7280-8500', shipmentTypes: ['Ship', 'Air'] }
    ],
    "Germany": [
      { id: 18, name: 'Allianz Global Corporate & Specialty', website: 'https://www.agcs.allianz.com', contact: '+49-89-3800-0', shipmentTypes: ['Ship', 'Air', 'Road', 'Rail'] },
      { id: 19, name: 'Munich Re Cargo', website: 'https://www.munichre.com', contact: '+49-89-3891-0', shipmentTypes: ['Ship', 'Air'] },
      { id: 20, name: 'Talanx Marine (HDI Global)', website: 'https://www.hdi.global', contact: '+49-511-628-0', shipmentTypes: ['Road', 'Rail', 'Ship'] }
    ],
    "China": [
      { id: 21, name: 'Ping An Cargo Insurance', website: 'https://www.pingan.com', contact: '+86-755-2262-2262', shipmentTypes: ['Ship', 'Road', 'Rail'] },
      { id: 22, name: 'China Pacific Insurance (CPIC)', website: 'https://www.cpic.com.cn', contact: '+86-21-3396-6666', shipmentTypes: ['Ship', 'Air'] },
      { id: 23, name: "People's Insurance Company of China (PICC)", website: 'https://www.picc.com', contact: '+86-10-6315-6688', shipmentTypes: ['Road', 'Rail', 'Ship', 'Air'] }
    ],
    "Japan": [
      { id: 24, name: 'Tokio Marine & Nichido Fire Insurance', website: 'https://www.tokiomarine-nichido.co.jp', contact: '+81-3-3212-6211', shipmentTypes: ['Ship', 'Air'] },
      { id: 25, name: 'MS&AD Insurance Group', website: 'https://www.ms-ad-hd.com', contact: '+81-3-5117-0300', shipmentTypes: ['Ship', 'Road', 'Air'] },
      { id: 26, name: 'Sompo Japan Nipponkoa', website: 'https://www.sjnk.co.jp', contact: '+81-3-3349-3111', shipmentTypes: ['Road', 'Rail', 'Ship'] }
    ],
    "Australia": [
      { id: 27, name: 'QBE Insurance Cargo', website: 'https://www.qbe.com/au', contact: '+61-2-9375-4444', shipmentTypes: ['Ship', 'Air', 'Road'] },
      { id: 28, name: 'Suncorp Marine Cover', website: 'https://www.suncorp.com.au', contact: '+61-7-3362-1222', shipmentTypes: ['Road', 'Ship'] },
      { id: 29, name: 'IAG Cargo Protection (CGU)', website: 'https://www.cgu.com.au', contact: '+61-3-9601-8888', shipmentTypes: ['Road', 'Air', 'Rail'] }
    ],
    "Canada": [
      { id: 30, name: 'Intact Cargo Insurance', website: 'https://www.intact.ca', contact: '+1-877-341-1464', shipmentTypes: ['Road', 'Rail', 'Air'] },
      { id: 31, name: 'Aviva Canada Marine', website: 'https://www.aviva.ca', contact: '+1-800-387-4518', shipmentTypes: ['Ship', 'Road'] },
      { id: 32, name: 'The Co-operators Cargo Guard', website: 'https://www.cooperators.ca', contact: '+1-888-287-2265', shipmentTypes: ['Road', 'Rail', 'Ship'] }
    ],
  },
  "routes": {
    "Asia-Europe": [
      { "id": "AS-EU-001", "name": "Asia-Europe Insurance 1", "website": "https://asia-europeins1.com", "contact": "+999-2000", "shipmentTypes": ["Ship", "Air", "Rail"] }
    ],
    "Asia-Americas": [
       { "id": "AS-AM-001", "name": "Asia-Americas Insurance 1", "website": "https://asia-americasins1.com", "contact": "+999-2000", "shipmentTypes": ["Ship", "Air"] }
    ],
    "Europe-Americas": [
       { "id": "EU-AM-001", "name": "Europe-Americas Insurance 1", "website": "https://europe-americasins1.com", "contact": "+999-2000", "shipmentTypes": ["Ship", "Air"] }
    ],
     "MiddleEast-Africa": [
       { "id": "ME-AF-001", "name": "MiddleEast-Africa Insurance 1", "website": "https://middleeast-africains1.com", "contact": "+999-2000", "shipmentTypes": ["Ship", "Air", "Road"] }
    ],
    "Global": [
       { "id": "GL-001", "name": "Global Cargo Insurance 1", "website": "https://globalinsurance1.com", "contact": "+888-3000", "shipmentTypes": ["Ship", "Air", "Road", "Rail"] }
    ]
  }
};

// Combine countries and routes for filtering, and create a list of locations for selection
const mockCompanies = { ...insuranceData.countries, ...insuranceData.routes };
const locations = Object.keys(mockCompanies);
const countries = Object.keys(insuranceData.countries); // For the "Add Company" modal

const shipmentTypes = ['All', 'Road', 'Rail', 'Ship', 'Air'];

const CompanyCard = ({ company, onCompanyClick }) => {
  const getShipmentIcon = (type) => {
    switch (type) {
      case 'Road': return <Truck className="w-4 h-4" />;
      case 'Rail': return <Train className="w-4 h-4" />;
      case 'Ship': return <Ship className="w-4 h-4" />;
      case 'Air': return <Plane className="w-4 h-4" />;
      default: return null;
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 p-6 cursor-pointer transform hover:-translate-y-1"
         onClick={() => onCompanyClick(company)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.contact}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Shipment Types:</p>
        <div className="flex flex-wrap gap-2">
          {company.shipmentTypes.map((type, index) => (
            <div key={index} className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {getShipmentIcon(type)}
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
          View Details
        </button>
        <div className="text-xs text-gray-500">
          Click to visit website
        </div>
      </div>
    </div>
  );
};

const AddCompanyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    website: '',
    contact: '',
    shipmentTypes: []
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', country: '', website: '', contact: '', shipmentTypes: [] });
  };

  const toggleShipmentType = (type) => {
    setFormData(prev => ({
      ...prev,
      shipmentTypes: prev.shipmentTypes.includes(type)
        ? prev.shipmentTypes.filter(t => t !== type)
        : [...prev.shipmentTypes, type]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Your Insurance Company</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.contact}
                onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shipment Types</label>
              <div className="grid grid-cols-2 gap-2">
                {['Road', 'Rail', 'Ship', 'Air'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleShipmentType(type)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                      formData.shipmentTypes.includes(type)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Submit & Pay ₹15,000
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const CountryModal = ({ isOpen, onClose, onSelectCountry, currentCountry }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Location</h2>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
          {locations.map(loc => (
            <button
              key={loc}
              onClick={() => onSelectCountry(loc)}
              className={`text-left p-3 rounded-lg transition-colors ${
                currentCountry === loc
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const SurakshitSafar = () => {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedShipmentType, setSelectedShipmentType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleCompanyClick = (company) => {
    console.log('Company clicked:', company.name);
    window.open(company.website, '_blank');
  };

  const handleAddCompany = (companyData) => {
    console.log('New company submission:', companyData);
    // This is a placeholder for a real payment integration.
    // In a real app, you wouldn't use window.confirm.
    const confirmation = window.confirm('Company submission received! This is a placeholder for payment integration. Click OK to proceed.');
    if (confirmation) {
        console.log('Payment confirmed.');
    }
    setIsAddCompanyModalOpen(false);
  };

  const getFilteredCompanies = () => {
    const companies = mockCompanies[selectedCountry] || [];
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesShipmentType = selectedShipmentType === 'All' || 
         company.shipmentTypes.includes(selectedShipmentType);
      return matchesSearch && matchesShipmentType;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">SurakshitSafar</h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                 onClick={() => setCurrentPage('home')}
                className={`font-medium transition-colors ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Home
              </button>
              <button 
                 onClick={() => setCurrentPage('search')}
                className={`font-medium transition-colors ${currentPage === 'search' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                Search Insurance
              </button>
              <button 
                 onClick={() => setIsAddCompanyModalOpen(true)}
                className="font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                List Your Company
              </button>
              <button className="font-medium text-gray-400 cursor-not-allowed">
                Compare (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Secure Your Cargo with Confidence</h2>
          <p className="text-lg lg:text-xl mb-8">Find the best insurance companies for your shipping needs worldwide</p>
          
          {/* Search Section */}
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search insurance companies..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setIsCountryModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Globe className="w-5 h-5" />
                <span>{selectedCountry}</span>
              </button>
              
              <button
                onClick={() => setIsAddCompanyModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Company</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
          <div>
            <h3 className="text-3xl font-bold text-gray-800">
              Insurance Providers in {selectedCountry}
            </h3>
            <p className="text-gray-600 mt-1">
              {getFilteredCompanies().length} results found
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
            {shipmentTypes.map(type => (
              <button 
                key={type} 
                onClick={() => setSelectedShipmentType(type)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${selectedShipmentType === type ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {getFilteredCompanies().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredCompanies().map(company => (
                <CompanyCard
                key={company.id}
                company={company}
                onCompanyClick={handleCompanyClick}
                />
            ))}
            </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block bg-gray-200 p-6 rounded-full mb-4">
                <Search className="text-gray-400 text-6xl" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Companies Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <CountryModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        onSelectCountry={(country) => {
          setSelectedCountry(country);
          setIsCountryModalOpen(false);
        }}
        currentCountry={selectedCountry}
      />
      <AddCompanyModal
        isOpen={isAddCompanyModalOpen}
        onClose={() => setIsAddCompanyModalOpen(false)}
        onSubmit={handleAddCompany}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h4 className="text-lg font-bold">SurakshitSafar</h4>
              </div>
              <p className="text-gray-400">Your trusted partner for cargo insurance worldwide.</p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Cargo Insurance</li>
                <li>Marine Insurance</li>
                <li>Air Cargo Cover</li>
                <li>Road Transport Insurance</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Contact</h5>
              <div className="text-gray-400 space-y-2">
                <p>Email: support@surakshitsafar.com</p>
                <p>Phone: +91-22-1234-5678</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SurakshitSafar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SurakshitSafar;

