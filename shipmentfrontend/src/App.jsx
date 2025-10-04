import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Globe, Plus, Building, Truck, Train, Ship, Plane, MapPin, ExternalLink,
  Star, Phone, Mail, Filter, X, Menu, LogIn, Shield, Users, CheckCircle, ArrowRight,
  Package, TrendingUp, DollarSign, Clock, Route, AlertCircle, Eye, Trash2, LogOut,
  BarChart3, Settings, ChevronDown, Download, RefreshCw, Bell, Home, FileText,
  CreditCard, Activity, PieChart, Calendar, Inbox, CheckSquare, XCircle, Edit,
  MoreVertical, Send, User, ShoppingCart, Zap, TrendingDown, ArrowUpRight, ArrowLeft
} from 'lucide-react';

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const API_URL = 'http://localhost:5000/api';

const countryPortData = {
  "India": ["Mumbai (JNPT)", "Chennai", "Kolkata", "Mundra", "Cochin", "Visakhapatnam", "Kandla", "Tuticorin", "Hazira", "Pipavav"],
  "Singapore": ["Singapore Port", "Jurong Port"],
  "UAE": ["Jebel Ali (Dubai)", "Port Khalifa (Abu Dhabi)", "Port Rashid"],
  "USA": ["Los Angeles", "New York", "Long Beach", "Houston", "Savannah", "Seattle", "Oakland", "Norfolk"],
  "Germany": ["Hamburg", "Bremerhaven", "Wilhelmshaven"],
  "China": ["Shanghai", "Shenzhen", "Ningbo", "Qingdao", "Hong Kong", "Guangzhou", "Tianjin", "Dalian"],
  "UK": ["Felixstowe", "Southampton", "Liverpool", "London Gateway"],
  "Netherlands": ["Rotterdam", "Amsterdam"],
  "Saudi Arabia": ["Jeddah", "Dammam", "Jubail"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Fremantle"],
  "Japan": ["Tokyo", "Yokohama", "Osaka", "Kobe"],
  "South Korea": ["Busan", "Incheon", "Ulsan"],
  "Malaysia": ["Port Klang", "Penang", "Johor"],
  "Thailand": ["Laem Chabang", "Bangkok"],
  "France": ["Le Havre", "Marseille"],
  "Spain": ["Valencia", "Barcelona", "Algeciras"],
  "Italy": ["Genoa", "Naples", "La Spezia"],
  "Brazil": ["Santos", "Rio de Janeiro"],
  "South Africa": ["Durban", "Cape Town"],
  "Canada": ["Vancouver", "Montreal", "Halifax"]
};

const cargoTypes = [
  "Electronics", "Textiles", "Machinery", "Chemicals", "Automotive",
  "Food Products", "Pharmaceuticals", "Oil & Gas", "Raw Materials",
  "Mining Equipment", "Agricultural Products", "Bulk Commodities",
  "Perishables", "Hazardous Materials", "Consumer Goods"
];

const shipmentTypes = [
  { value: "Road", icon: Truck, color: "text-blue-600" },
  { value: "Rail", icon: Train, color: "text-green-600" },
  { value: "Ship", icon: Ship, color: "text-cyan-600" },
  { value: "Air", icon: Plane, color: "text-purple-600" }
];

// ============================================================================
// MOCK DATA GENERATION
// ============================================================================

const generateMockCompaniesForRoute = (departure, arrival, cargoType, transportMode) => {
  const yourCompany = {
    id: "your-company-premium",
    name: "SecureCargo Insurance Ltd.",
    coverage: "Global Premium",
    rating: "4.9",
    maxCoverage: "$50M USD",
    claimSettlement: "98%",
    pricing: "₹2,50,000 - ₹5,00,000",
    serviceTier: "Premium Plus",
    highlight: true,
    verified: true,
    website: "https://www.securecargo.com",
    contact: "+91-555-1234",
    email: "contact@securecargo.com",
    shipmentTypes: [transportMode],
    cargoTypes: [cargoType],
    description: "Industry-leading comprehensive coverage with 24/7 claims support and instant quote generation",
    established: 1995,
    routes: [`${departure} - ${arrival}`]
  };

  const otherCompanies = [
    {
      id: `comp-${Date.now()}-1`,
      name: "Global Shield Maritime",
      coverage: "Worldwide",
      rating: "4.7",
      maxCoverage: "$35M USD",
      claimSettlement: "95%",
      pricing: "₹2,00,000 - ₹4,50,000",
      serviceTier: "Premium",
      highlight: false,
      verified: true,
      website: "https://www.globalshield.com",
      contact: "+91-555-2345",
      email: "info@globalshield.com",
      shipmentTypes: [transportMode],
      cargoTypes: [cargoType],
      description: "Trusted maritime insurance provider with extensive network coverage",
      established: 2001,
      routes: [`${departure} - ${arrival}`]
    },
    {
      id: `comp-${Date.now()}-2`,
      name: "TransitGuard Solutions",
      coverage: "Asia-Pacific",
      rating: "4.5",
      maxCoverage: "$25M USD",
      claimSettlement: "92%",
      pricing: "₹1,50,000 - ₹3,50,000",
      serviceTier: "Standard",
      highlight: false,
      verified: true,
      website: "https://www.transitguard.com",
      contact: "+91-555-3456",
      email: "support@transitguard.com",
      shipmentTypes: [transportMode],
      cargoTypes: [cargoType],
      description: "Regional specialist with competitive rates and fast claim processing",
      established: 2008,
      routes: [`${departure} - ${arrival}`]
    },
  ];

  return [yourCompany, ...otherCompanies];
};


// ============================================================================
// MAIN COMPONENT
// ============================================================================

function SurakshitSafar() {
  // ----------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ----------------------------------------------------------------------------
  
  // View & Auth State
  const [currentView, setCurrentView] = useState("home");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  // Search State
  const [departureCountry, setDepartureCountry] = useState("");
  const [arrivalCountry, setArrivalCountry] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [arrivalPort, setArrivalPort] = useState("");
  const [showDeparturePorts, setShowDeparturePorts] = useState(false);
  const [showArrivalPorts, setShowArrivalPorts] = useState(false);
  const [selectedCargoType, setSelectedCargoType] = useState("");
  const [selectedShipmentType, setSelectedShipmentType] = useState("");
  
  // Results State
  const [mockCompanies, setMockCompanies] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [companies, setCompanies] = useState([]);
  
  // Modal State
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Admin State
  const [adminTab, setAdminTab] = useState("dashboard");
  const [adminFilters, setAdminFilters] = useState({
    status: "all",
    paymentStatus: "all",
    search: ""
  });
  
  // Form State
  const initialFormState = {
    name: "", website: "", contact: "", email: "", description: "",
    established: "", routes: [], cargoTypes: [],
    shipmentTypes: [], coverage: "Global", maxCoverageAmount: "",
    maxCoverageCurrency: "USD", submitterName: "", submitterEmail: "",
    submitterPhone: "", submitterDesignation: ""
  };

  const [companyForm, setCompanyForm] = useState(initialFormState);
  const [currentRoute, setCurrentRoute] = useState("");
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });
  const [formStep, setFormStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  // ----------------------------------------------------------------------------
  // EFFECTS
  // ----------------------------------------------------------------------------
  
  useEffect(() => {
    // loadCompaniesFromDB(); // We won't load from a fake DB on start anymore
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (departureCountry) setShowDeparturePorts(true);
  }, [departureCountry]);

  useEffect(() => {
    if (arrivalCountry) setShowArrivalPorts(true);
  }, [arrivalCountry]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!showAddCompanyForm) {
      setCompanyForm(initialFormState);
      setFormStep(1);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [showAddCompanyForm]);

  // ----------------------------------------------------------------------------
  // API FUNCTIONS (Now Mocked or Safe-failing)
  // ----------------------------------------------------------------------------
  
  const checkAdminAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdminLoggedIn(true);
      setAdminUser({ username: "admin", email: "admin@surakshitsafar.com", role: "super_admin" });
    }
  };

  const loadCompaniesFromDB = async () => {
    // This function is kept for when you connect to a real backend.
    console.log("Skipping DB load in mock environment.");
  };

  const handleCompanyClick = (company) => {
    console.log("Tracked click for:", company.name);
    setCompanies(prev => prev.map(c => 
      c.id === company.id ? {...c, clicks: (c.clicks || 0) + 1} : c
    ));
  };

  // ----------------------------------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------------------------------
  
  const handleSearch = () => {
    if (departurePort && arrivalPort && selectedCargoType && selectedShipmentType) {
      const foundCompanies = generateMockCompaniesForRoute(
        departurePort,
        arrivalPort,
        selectedCargoType,
        selectedShipmentType
      );
      // Also include companies from our state that match the route
      const stateCompanies = companies.filter(c => c.routes.includes(`${departurePort} - ${arrivalPort}`));
      setMockCompanies([...foundCompanies, ...stateCompanies]);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Please select all fields: Departure Port, Arrival Port, Cargo Type, and Transport Mode");
    }
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setMockCompanies([]);
    setDepartureCountry("");
    setArrivalCountry("");
    setDeparturePort("");
    setArrivalPort("");
    setSelectedCargoType("");
    setSelectedShipmentType("");
    setShowDeparturePorts(false);
    setShowArrivalPorts(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleMultiSelectChange = (e, field) => {
    const { value, checked } = e.target;
    setCompanyForm(prev => {
        const currentValues = prev[field];
        const newValues = checked
            ? [...currentValues, value]
            : currentValues.filter(item => item !== value);
        return { ...prev, [field]: newValues };
    });
    if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddRoute = () => {
    if (currentRoute && !companyForm.routes.includes(currentRoute)) {
      setCompanyForm(prev => ({ ...prev, routes: [...prev.routes, currentRoute] }));
      setCurrentRoute("");
      if (formErrors.routes) {
        setFormErrors(prev => ({ ...prev, routes: null }));
      }
    }
  };

  const handleRemoveRoute = (routeToRemove) => {
    setCompanyForm(prev => ({ 
      ...prev, 
      routes: prev.routes.filter(route => route !== routeToRemove) 
    }));
  };
  
  const validateStep = (step) => {
    const errors = {};
    const { name, email, website, contact, maxCoverageAmount, routes, cargoTypes, shipmentTypes, submitterName, submitterEmail, submitterPhone } = companyForm;

    if (step === 1) {
        if (!name.trim()) errors.name = "Legal company name is required.";
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "A valid official email is required.";
        if (!website.trim() || !/^https?:\/\/.+/.test(website)) errors.website = "A valid website URL (starting with http/https) is required.";
        if (!contact.trim() || contact.length < 10) errors.contact = "A valid primary contact number is required.";
        if (!maxCoverageAmount) errors.maxCoverageAmount = "Max coverage amount is required.";
    }

    if (step === 2) {
        if (routes.length === 0) errors.routes = "Please add at least one popular route.";
        if (shipmentTypes.length === 0) errors.shipmentTypes = "Please select at least one shipment method.";
        if (cargoTypes.length === 0) errors.cargoTypes = "Please select at least one cargo type.";
    }
    
    if (step === 3) {
        if (!submitterName.trim()) errors.submitterName = "Submitter's name is required.";
        if (!submitterEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submitterEmail)) errors.submitterEmail = "A valid submitter email is required.";
        if (!submitterPhone.trim() || submitterPhone.length < 10) errors.submitterPhone = "A valid submitter phone number is required.";
    }

    return errors;
  };

  const handleNextStep = () => {
      const errors = validateStep(formStep);
      if (Object.keys(errors).length > 0) {
          setFormErrors(errors);
      } else {
          setFormErrors({});
          setFormStep(prev => prev + 1);
      }
  };

  const handlePrevStep = () => {
      setFormStep(prev => prev - 1);
  };

  // --- [UPDATED] MOCK SUBMISSION FUNCTION ---
  const handleAddCompany = async (e) => {
    e.preventDefault();
    const finalErrors = validateStep(3);
    if (Object.keys(finalErrors).length > 0) {
        setFormErrors(finalErrors);
        return;
    }
    
    setIsSubmitting(true);

    try {
      // --- MOCK API & PAYMENT LOGIC ---
      console.log("Submitting mock data:", { ...companyForm });
      await new Promise(resolve => setTimeout(resolve, 2000));
      // --- END OF MOCK LOGIC ---

      alert(`Company "${companyForm.name}" submitted successfully! (This is a mock response)`);

      // Create a new company object to add to the state
      const newCompany = {
        id: `new-${Date.now()}`,
        name: companyForm.name,
        email: companyForm.email,
        website: companyForm.website,
        contact: companyForm.contact,
        coverage: companyForm.coverage,
        maxCoverage: `${companyForm.maxCoverageAmount}M ${companyForm.maxCoverageCurrency}`,
        description: companyForm.description,
        established: companyForm.established,
        routes: companyForm.routes,
        cargoTypes: companyForm.cargoTypes,
        shipmentTypes: companyForm.shipmentTypes,
        submittedBy: {
          name: companyForm.submitterName,
          email: companyForm.submitterEmail,
          phone: companyForm.submitterPhone,
          designation: companyForm.submitterDesignation || "N/A"
        },
        status: 'pending',
        paymentStatus: 'completed',
        rating: 'N/A',
        claimSettlement: 'N/A',
        pricing: 'Pending Review',
        serviceTier: 'Standard',
        highlight: false,
        verified: false,
        clicks: 0,
        views: 0,
        quotes: 0,
        submittedAt: new Date().toISOString(),
      };

      // Add the new company to the top of the companies list in the state
      setCompanies(prevCompanies => [newCompany, ...prevCompanies]);

      setShowAddCompanyForm(false);

    } catch (error) {
      console.error('Error during mock submission:', error);
      alert(`An unexpected error occurred.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.username === "admin" && adminCredentials.password === "AdminPass123!") {
      localStorage.setItem('adminToken', 'demo-token');
      setIsAdminLoggedIn(true);
      setAdminUser({ username: "admin", email: "admin@surakshitsafar.com", role: "super_admin" });
      setCurrentView("admin");
      setShowAdminLogin(false);
      setAdminCredentials({ username: "", password: "" });
    } else {
      alert("Invalid credentials. Use admin / AdminPass123!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setCurrentView("home");
    setAdminTab("dashboard");
  };

  // --- [UPDATED] ADMIN FUNCTIONS TO USE STATE ---
  const handleApproveCompany = (companyId) => {
    alert(`Company approved successfully! (Mock Action)`);
    setCompanies(prev => prev.map(c =>
      c.id === companyId ? {...c, status: "approved", verified: true} : c
    ));
    setSelectedCompany(null);
  };

  const handleRejectCompany = (companyId) => {
    alert(`Company rejected! (Mock Action)`);
    setCompanies(prev => prev.map(c =>
      c.id === companyId ? {...c, status: "rejected"} : c
    ));
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    setCompanies(prev => prev.filter(c => c.id !== companyId));
    alert("Company deleted successfully! (Mock Action)");
  };

  // ----------------------------------------------------------------------------
  // COMPUTED VALUES
  // ----------------------------------------------------------------------------
  
  const dashboardStats = {
    totalCompanies: companies.length,
    approvedCompanies: companies.filter(c => c.status === "approved").length,
    pendingCompanies: companies.filter(c => c.status === "pending" && c.paymentStatus === "completed").length,
    rejectedCompanies: companies.filter(c => c.status === "rejected").length,
    totalRevenue: companies.filter(c => c.paymentStatus === "completed").length * 15000,
    totalClicks: companies.reduce((sum, c) => sum + (c.clicks || 0), 0),
    totalViews: companies.reduce((sum, c) => sum + (c.views || 0), 0),
    totalQuotes: companies.reduce((sum, c) => sum + (c.quotes || 0), 0)
  };

  const getPendingCompanies = () => {
    let filtered = companies.filter(c => c.status === "pending" && c.paymentStatus === "completed");
    if (adminFilters.search) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(adminFilters.search.toLowerCase())
      );
    }
    return filtered;
  };

  const getFilteredCompanies = () => {
    let filtered = companies;
    if (adminFilters.status !== "all") {
      filtered = filtered.filter(c => c.status === adminFilters.status);
    }
    if (adminFilters.paymentStatus !== "all") {
      filtered = filtered.filter(c => c.paymentStatus === adminFilters.paymentStatus);
    }
    if (adminFilters.search) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(adminFilters.search.toLowerCase())
      );
    }
    return filtered;
  };

  // ... The rest of the components (CompanyCard, PortSelector, StatCard, AdminDashboard) remain unchanged ...
  // ... They are included here for completeness ...

  // ============================================================================
  // COMPONENT DEFINITIONS
  // ============================================================================

  const CompanyCard = ({ company, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`rounded-xl shadow-2xl transition-all duration-300 border-2 overflow-hidden cursor-pointer ${
        company.highlight 
          ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-500 ring-2 ring-green-400 ring-offset-2 ring-offset-gray-950' 
          : 'bg-gray-900 border-gray-700 hover:border-blue-500'
      }`}
      onClick={() => handleCompanyClick(company)}
    >
      {company.highlight && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white text-center py-2 px-4 font-bold text-sm"
        >
          ⭐ YOUR COMPANY - PREMIUM LISTING ⭐
        </motion.div>
      )}
      
      <div className={`p-6 ${company.highlight ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="bg-white/20 p-3 rounded-lg backdrop-blur-sm"
            >
              <Shield className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-white">
                {company.name}
              </h3>
              <div className="flex items-center space-x-2 text-white/90">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{company.coverage}</span>
                {company.verified && (
                  <CheckCircle className="h-4 w-4 text-green-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${
                  i < Math.floor(parseFloat(company.rating)) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-600'
                }`} 
              />
            ))}
            <span className="text-sm text-gray-300 ml-2 font-semibold">
              {company.rating}/5.0
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            company.serviceTier === 'Premium Plus' ? 'bg-green-600 text-white' :
            company.serviceTier === 'Premium' ? 'bg-blue-600 text-white' :
            company.serviceTier === 'Standard' ? 'bg-gray-600 text-white' :
            'bg-gray-700 text-gray-300'
          }`}>
            {company.serviceTier}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Max Coverage</span>
            </div>
            <p className="text-sm font-bold text-white">{company.maxCoverage}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Claims Rate</span>
            </div>
            <p className="text-sm font-bold text-white">{company.claimSettlement}</p>
          </motion.div>
        </div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-400 font-medium">Pricing Range</span>
          </div>
          <p className="text-lg font-bold text-white">{company.pricing}</p>
          <p className="text-xs text-gray-400 mt-1">Per shipment (based on cargo value)</p>
        </motion.div>

        {company.description && (
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 leading-relaxed">{company.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(company.website, '_blank');
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Visit Site</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className={`py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
              company.highlight
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/50'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            }`}
          >
            <span>Get Quote</span>
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const PortSelector = ({ label, country, setCountry, selectedPort, setSelectedPort, showPorts, setShowPorts }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
      <select
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
          setSelectedPort("");
          setShowPorts(true);
        }}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium"
      >
        <option value="">Select Country</option>
        {Object.keys(countryPortData).sort().map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      <AnimatePresence>
        {country && showPorts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <p className="text-xs text-gray-400 mb-3 font-medium">Popular Ports in {country}:</p>
              <div className="flex flex-wrap gap-2">
                {countryPortData[country].map(port => (
                  <motion.button
                    key={port}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPort(port)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedPort === port
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {port}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div 
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{change}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );

  const AdminDashboard = () => (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-white">SurakshitSafar Admin</h1>
                <p className="text-xs text-gray-400">Control Panel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-400 hover:text-white transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </motion.button>
              <div className="flex items-center space-x-3 border-l border-gray-800 pl-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{adminUser?.username}</p>
                  <p className="text-xs text-gray-400">{adminUser?.role}</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout} 
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "pending", label: "Pending Requests", icon: Clock, badge: dashboardStats.pendingCompanies },
              { id: "companies", label: "All Companies", icon: Building },
              { id: "analytics", label: "Analytics", icon: PieChart },
              { id: "settings", label: "Settings", icon: Settings }
            ].map(tab => (
              <motion.button 
                key={tab.id} 
                onClick={() => setAdminTab(tab.id)}
                whileHover={{ y: -2 }}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  adminTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
                  >
                    {tab.badge}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {adminTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">Monitor your platform's performance and metrics</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                  title="Total Companies" 
                  value={dashboardStats.totalCompanies} 
                  icon={Building} 
                  color="bg-blue-600" 
                />
                <StatCard 
                  title="Pending Approvals" 
                  value={dashboardStats.pendingCompanies} 
                  icon={Clock} 
                  color="bg-yellow-600" 
                />
                <StatCard 
                  title="Total Revenue" 
                  value={`₹${(dashboardStats.totalRevenue / 1000).toFixed(0)}K`} 
                  icon={DollarSign} 
                  color="bg-green-600" 
                />
                <StatCard 
                  title="Total Clicks" 
                  value={dashboardStats.totalClicks.toLocaleString()} 
                  icon={Activity} 
                  color="bg-purple-600" 
                />
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>
                <div className="space-y-4">
                  {companies.slice(0, 5).map((company, index) => (
                    <motion.div 
                      key={company.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-700 rounded-lg">
                          <Building className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{company.name}</p>
                          <p className="text-sm text-gray-400">{company.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          company.status === 'approved' ? 'bg-green-600 text-white' :
                          company.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {company.status}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(company.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {adminTab === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Pending Requests</h2>
                  <p className="text-gray-400">{getPendingCompanies().length} companies awaiting approval</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input 
                    type="text" 
                    placeholder="Search companies..." 
                    className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminFilters.search} 
                    onChange={(e) => setAdminFilters({...adminFilters, search: e.target.value})} 
                  />
                </div>
              </div>
              
              {getPendingCompanies().length === 0 ? (
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                  <p className="text-gray-400">No pending company requests at the moment.</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getPendingCompanies().map((company, index) => (
                    <motion.div 
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                          <p className="text-sm text-gray-400">{company.email}</p>
                        </div>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Payment Complete
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Website:</span>
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          >
                            <span className="truncate max-w-xs">{company.website}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Contact:</span>
                          <span className="text-white">{company.contact}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Established:</span>
                          <span className="text-white">{company.established}</span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Shipment Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {company.shipmentTypes?.map(type => (
                            <span key={type} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedCompany(company)} 
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApproveCompany(company.id)} 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Approve
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectCompany(company.id)} 
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {adminTab === "companies" && (
            <motion.div
              key="companies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">All Companies</h2>
                  <p className="text-gray-400">{getFilteredCompanies().length} companies total</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select 
                    value={adminFilters.status} 
                    onChange={(e) => setAdminFilters({...adminFilters, status: e.target.value})} 
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select 
                    value={adminFilters.paymentStatus} 
                    onChange={(e) => setAdminFilters({...adminFilters, paymentStatus: e.target.value})} 
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stats</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {getFilteredCompanies().map((company, index) => (
                      <motion.tr 
                        key={company.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">{company.name}</div>
                            <div className="text-sm text-gray-400">{company.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            company.status === 'approved' ? 'bg-green-600 text-white' :
                            company.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            company.paymentStatus === 'completed' ? 'bg-green-600 text-white' :
                            company.paymentStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                          }`}>
                            {company.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            <div>{company.views} views</div>
                            <div>{company.clicks} clicks</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteCompany(company.id)} 
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {adminTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Total Engagement</h3>
                    <Activity className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views:</span>
                      <span className="text-white font-semibold">{dashboardStats.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Clicks:</span>
                      <span className="text-white font-semibold">{dashboardStats.totalClicks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quotes:</span>
                      <span className="text-white font-semibold">{dashboardStats.totalQuotes.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Revenue</h3>
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ₹{(dashboardStats.totalRevenue / 1000).toFixed(1)}K
                  </div>
                  <p className="text-gray-400 text-sm">
                    From {companies.filter(c => c.paymentStatus === 'completed').length} payments
                  </p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Approval Rate</h3>
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {((dashboardStats.approvedCompanies / dashboardStats.totalCompanies) * 100 || 0).toFixed(1)}%
                  </div>
                  <p className="text-gray-400 text-sm">
                    {dashboardStats.approvedCompanies} of {dashboardStats.totalCompanies} companies
                  </p>
                </motion.div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performing Companies</h3>
                <div className="space-y-4">
                  {companies
                    .filter(c => c.status === 'approved')
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 5)
                    .map((company, idx) => (
                      <motion.div 
                        key={company.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold text-gray-600">#{idx + 1}</div>
                          <div>
                            <p className="font-medium text-white">{company.name}</p>
                            <p className="text-sm text-gray-400">{company.coverage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">{company.clicks} clicks</p>
                          <p className="text-sm text-gray-400">{company.views} views</p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {adminTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Pricing Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Company Listing Fee (₹)
                      </label>
                      <input 
                        type="number" 
                        defaultValue="15000" 
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Update Pricing
                    </motion.button>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-800"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Admin Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                      <input 
                        type="text" 
                        value={adminUser?.username || ''} 
                        disabled 
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input 
                        type="email" 
                        value={adminUser?.email || ''} 
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                    >
                      Update Profile
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER - ADMIN VIEW
  // ============================================================================

  if (isAdminLoggedIn && currentView === "admin") {
    return <AdminDashboard />;
  }

  // ============================================================================
  // MAIN RENDER - PUBLIC VIEW
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNewSearch()}
            >
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SurakshitSafar
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNewSearch()}
                className={`font-medium transition-colors ${!showResults ? "text-blue-400" : "text-gray-300 hover:text-white"}`}
              >
                Home
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCompanyForm(true)}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                List Your Company
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => isAdminLoggedIn ? setCurrentView("admin") : setShowAdminLogin(true)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isAdminLoggedIn 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                }`}
                title={isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
              >
                <Star className={`h-5 w-5 ${isAdminLoggedIn ? 'fill-current' : ''}`} />
              </motion.button>
            </div>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-gray-800 border-t border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <button 
                  onClick={() => { handleNewSearch(); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-300 hover:text-white py-2"
                >
                  Home
                </button>
                <button 
                  onClick={() => { setShowAddCompanyForm(true); setMobileMenuOpen(false); }}
                  className="block w-full text-left text-gray-300 hover:text-white py-2"
                >
                  List Your Company
                </button>
                <button 
                  onClick={() => { 
                    if (isAdminLoggedIn) {
                      setCurrentView("admin");
                    } else {
                      setShowAdminLogin(true);
                    }
                    setMobileMenuOpen(false); 
                  }}
                  className={`flex items-center space-x-2 w-full text-left py-2 px-4 rounded-lg ${
                    isAdminLoggedIn ? 'bg-green-600 text-white' : 'bg-gray-700 text-yellow-400'
                  }`}
                >
                  <Star className={`h-4 w-4 ${isAdminLoggedIn ? 'fill-current' : ''}`} />
                  <span>{isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Login'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {!showResults && (
        <section className="bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Secure Your Cargo Journey
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Find premium insurance coverage for shipments worldwide
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/60 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <PortSelector
                  label="Departure Location"
                  country={departureCountry}
                  setCountry={setDepartureCountry}
                  selectedPort={departurePort}
                  setSelectedPort={setDeparturePort}
                  showPorts={showDeparturePorts}
                  setShowPorts={setShowDeparturePorts}
                />
                <PortSelector
                  label="Arrival Location"
                  country={arrivalCountry}
                  setCountry={setArrivalCountry}
                  selectedPort={arrivalPort}
                  setSelectedPort={setArrivalPort}
                  showPorts={showArrivalPorts}
                  setShowPorts={setShowArrivalPorts}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Cargo Type</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={selectedCargoType}
                      onChange={(e) => setSelectedCargoType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium"
                    >
                      <option value="">Select Cargo Type</option>
                      {cargoTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Transport Mode</label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={selectedShipmentType}
                      onChange={(e) => setSelectedShipmentType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium"
                    >
                      <option value="">Select Transport</option>
                      {shipmentTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg"
              >
                <Search className="h-5 w-5" />
                <span>Search Insurance Providers</span>
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {showResults && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Available Insurance Providers</h2>
                  <p className="text-gray-400">
                    Route: <span className="text-white font-semibold">{departurePort} → {arrivalPort}</span> | 
                    Cargo: <span className="text-white font-semibold">{selectedCargoType}</span> | 
                    Mode: <span className="text-white font-semibold">{selectedShipmentType}</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewSearch}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                  <span>New Search</span>
                </motion.button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {mockCompanies.map((company, index) => (
                <CompanyCard key={company.id} company={company} index={index} />
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-8 border border-green-700/50">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Don't see your company listed?
                </h3>
                <p className="text-gray-300 mb-6">
                  Join our platform and connect with thousands of cargo owners worldwide
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddCompanyForm(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 mx-auto shadow-lg shadow-green-500/30"
                >
                  <Plus className="h-6 w-6" />
                  <span>Add Your Company Now</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddCompanyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setShowAddCompanyForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[95vh] border border-gray-700 flex flex-col"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">List Your Insurance Company</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddCompanyForm(false)} 
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  One-time listing fee: ₹15,000. Complete all steps to get listed.
                </p>
              </div>

              <form onSubmit={handleAddCompany} className="flex-grow overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${formStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>1</div>
                          <div className={`h-1 w-16 transition-all ${formStep > 1 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${formStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>2</div>
                          <div className={`h-1 w-16 transition-all ${formStep > 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${formStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>3</div>
                      </div>
                      <span className="text-sm text-gray-400">Step {formStep} of 3</span>
                  </div>

                  <AnimatePresence mode="wait">
                      {formStep === 1 && (
                          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="flex items-center space-x-3 mb-6">
                                  <div className="p-2 bg-blue-600 rounded-lg"><Building className="h-5 w-5 text-white" /></div>
                                  <div>
                                      <h4 className="text-lg font-semibold text-white">Company Information</h4>
                                      <p className="text-sm text-gray-400">Basic details about your insurance company</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Legal Company Name <span className="text-red-400">*</span></label>
                                      <input name="name" type="text" placeholder="e.g., Global Shield Insurance Ltd." value={companyForm.name} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                      {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Official Email Address <span className="text-red-400">*</span></label>
                                      <input name="email" type="email" placeholder="contact@yourcompany.com" value={companyForm.email} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                                      {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Website <span className="text-red-400">*</span></label>
                                      <input name="website" type="url" placeholder="https://www.yourcompany.com" value={companyForm.website} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                                      {formErrors.website && <p className="text-red-400 text-xs mt-1">{formErrors.website}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Primary Contact Number <span className="text-red-400">*</span></label>
                                      <input name="contact" type="tel" placeholder="+91-XXX-XXXXXXX" value={companyForm.contact} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                                      {formErrors.contact && <p className="text-red-400 text-xs mt-1">{formErrors.contact}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Year Established</label>
                                      <input name="established" type="number" min="1900" max={new Date().getFullYear()} placeholder="YYYY" value={companyForm.established} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Geographic Coverage <span className="text-red-400">*</span></label>
                                      <select name="coverage" value={companyForm.coverage} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                                          <option value="Global">Global</option>
                                          <option value="Asia-Pacific">Asia-Pacific</option>
                                          <option value="Europe">Europe</option>
                                          <option value="Americas">Americas</option>
                                          <option value="India-Specific">India-Specific</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
                                  <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Coverage Limit <span className="text-red-400">*</span></label>
                                  <div className="flex gap-3">
                                      <input name="maxCoverageAmount" type="number" min="1" step="0.1" placeholder="e.g., 50" value={companyForm.maxCoverageAmount} onChange={handleFormChange} className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                      <select name="maxCoverageCurrency" value={companyForm.maxCoverageCurrency} onChange={handleFormChange} className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white w-32">
                                          <option value="USD">USD</option>
                                          <option value="EUR">EUR</option>
                                          <option value="INR">INR</option>
                                      </select>
                                  </div>
                                  {formErrors.maxCoverageAmount && <p className="text-red-400 text-xs mt-1">{formErrors.maxCoverageAmount}</p>}
                                  <p className="text-xs text-gray-500 mt-2">Enter amount in millions (e.g., 50 for $50M)</p>
                              </div>
                          </motion.div>
                      )}

                      {formStep === 2 && (
                          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                              <div className="flex items-center space-x-3 mb-6">
                                  <div className="p-2 bg-purple-600 rounded-lg"><Zap className="h-5 w-5 text-white" /></div>
                                  <div>
                                      <h4 className="text-lg font-semibold text-white">Service Details</h4>
                                      <p className="text-sm text-gray-400">Specify the services your company offers</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Cargo Types Covered <span className="text-red-400">*</span></label>
                                      <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-900 rounded-md border border-gray-700">
                                          {cargoTypes.map(type => (
                                              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                                  <input type="checkbox" value={type} checked={companyForm.cargoTypes.includes(type)} onChange={(e) => handleMultiSelectChange(e, 'cargoTypes')} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500" />
                                                  <span className="text-sm text-gray-300">{type}</span>
                                              </label>
                                          ))}
                                      </div>
                                      {formErrors.cargoTypes && <p className="text-red-400 text-xs mt-1">{formErrors.cargoTypes}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Shipment Methods <span className="text-red-400">*</span></label>
                                      <div className="space-y-2 p-3 bg-gray-900 rounded-md border border-gray-700">
                                          {shipmentTypes.map(type => (
                                              <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                                                  <input type="checkbox" value={type.value} checked={companyForm.shipmentTypes.includes(type.value)} onChange={(e) => handleMultiSelectChange(e, 'shipmentTypes')} className="h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500" />
                                                  <type.icon className={`h-4 w-4 ${type.color}`} />
                                                  <span className="text-sm text-gray-300">{type.value}</span>
                                              </label>
                                          ))}
                                      </div>
                                      {formErrors.shipmentTypes && <p className="text-red-400 text-xs mt-1">{formErrors.shipmentTypes}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Popular Routes <span className="text-red-400">*</span></label>
                                      <div className="flex gap-2">
                                          <input type="text" placeholder="e.g., Mumbai-Dubai" value={currentRoute} onChange={(e) => setCurrentRoute(e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg flex-grow" />
                                          <motion.button type="button" onClick={handleAddRoute} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Add</motion.button>
                                      </div>
                                      <div className="mt-2 space-y-1 max-h-36 overflow-y-auto p-2 bg-gray-900 rounded-md border border-gray-700">
                                          {companyForm.routes.map(route => (
                                              <div key={route} className="flex items-center justify-between bg-gray-700 px-3 py-1 rounded">
                                                  <span className="text-sm text-gray-300">{route}</span>
                                                  <motion.button type="button" onClick={() => handleRemoveRoute(route)} whileHover={{ scale: 1.1 }} className="text-red-400"><XCircle className="h-4 w-4" /></motion.button>
                                              </div>
                                          ))}
                                      </div>
                                      {formErrors.routes && <p className="text-red-400 text-xs mt-1">{formErrors.routes}</p>}
                                  </div>
                              </div>
                          </motion.div>
                      )}

                      {formStep === 3 && (
                          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                              <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-green-600 rounded-lg"><User className="h-5 w-5 text-white" /></div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white">Submitter Information</h4>
                                    <p className="text-sm text-gray-400">Contact person details for verification</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Your Full Name <span className="text-red-400">*</span></label>
                                      <input name="submitterName" type="text" placeholder="e.g., Jane Doe" value={companyForm.submitterName} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                      {formErrors.submitterName && <p className="text-red-400 text-xs mt-1">{formErrors.submitterName}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Your Email Address <span className="text-red-400">*</span></label>
                                      <input name="submitterEmail" type="email" placeholder="your.email@company.com" value={companyForm.submitterEmail} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                      {formErrors.submitterEmail && <p className="text-red-400 text-xs mt-1">{formErrors.submitterEmail}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Your Phone Number <span className="text-red-400">*</span></label>
                                      <input name="submitterPhone" type="tel" placeholder="+91-XXX-XXXXXXX" value={companyForm.submitterPhone} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                      {formErrors.submitterPhone && <p className="text-red-400 text-xs mt-1">{formErrors.submitterPhone}</p>}
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-300 mb-2">Your Designation</label>
                                      <input name="submitterDesignation" type="text" placeholder="e.g., Marketing Manager" value={companyForm.submitterDesignation} onChange={handleFormChange} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                                  </div>
                              </div>
                              <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-blue-500/50 text-center">
                                <h3 className="text-lg font-semibold text-white">Final Step</h3>
                                <p className="text-gray-400 mt-2">
                                    By clicking 'Submit & Pay', you agree to our terms and conditions and your company will be added to our list for review.
                                </p>
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
                </div>
                
                <div className="p-6 border-t border-gray-700 mt-auto bg-gray-800 rounded-b-xl">
                    <div className="flex justify-between items-center">
                        <div>
                            {formStep > 1 && (
                                <motion.button type="button" onClick={handlePrevStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold">
                                  <ArrowLeft className="h-5 w-5"/>
                                  <span>Back</span>
                                </motion.button>
                            )}
                        </div>
                        <div>
                            {formStep < 3 && (
                                <motion.button type="button" onClick={handleNextStep} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                                  <span>Next</span>
                                  <ArrowRight className="h-5 w-5"/>
                                </motion.button>
                            )}
                            {formStep === 3 && (
                                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Submitting...' : 'Submit & Pay ₹15,000'}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Admin Login</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAdminLogin(false)} 
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
              
              <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
                <input 
                  type="text" 
                  required 
                  placeholder="Username"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                  type="password" 
                  required 
                  placeholder="Password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                
                <div className="text-xs text-gray-400 bg-gray-700 p-3 rounded-lg">
                  <p><strong>Demo Credentials:</strong></p>
                  <p>Username: admin | Password: AdminPass123!</p>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <motion.button 
                    type="button" 
                    onClick={() => setShowAdminLogin(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Login
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedCompany(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 my-8"
            >
              <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Company Details</h3>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCompany(null)} 
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Company Name</label>
                    <p className="text-white font-semibold">{selectedCompany.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Coverage</label>
                    <p className="text-white">{selectedCompany.coverage}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Website</label>
                    <a 
                      href={selectedCompany.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {selectedCompany.website}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Contact</label>
                    <p className="text-white">{selectedCompany.contact}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white">{selectedCompany.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Established</label>
                    <p className="text-white">{selectedCompany.established}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Shipment Types</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.shipmentTypes?.map(type => (
                      <span key={type} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Cargo Types</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.cargoTypes?.map(type => (
                      <span key={type} className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCompany.routes && selectedCompany.routes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Available Routes</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedCompany.routes.map((route, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded">
                          <Route className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-300 text-sm">{route}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCompany.submittedBy && (
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Submission Details</h4>
                    <div className="bg-gray-700 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Submitted by:</span>
                        <span className="text-white font-medium">{selectedCompany.submittedBy.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedCompany.submittedBy.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedCompany.submittedBy.phone}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-700 flex space-x-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleApproveCompany(selectedCompany.id)} 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Approve Company
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRejectCompany(selectedCompany.id)} 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Reject Company
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCompany(null)} 
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold text-white">SurakshitSafar</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting cargo owners with trusted insurance providers worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNewSearch()} 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setShowAddCompanyForm(true)} 
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    List Company
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">support@surakshitsafar.com</p>
              <p className="text-gray-400 text-sm">+91 (0) 555-1234</p>
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="mt-4 text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Admin Access
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} SurakshitSafar. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}

export default SurakshitSafar;