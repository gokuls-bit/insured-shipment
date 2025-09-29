import React, { useState, useEffect } from 'react';
import { 
  Search, Globe, Plus, Building, Truck, Train, Ship, Plane, MapPin, ExternalLink, 
  Star, Phone, Mail, Filter, X, Menu, LogIn, Shield, Users, CheckCircle, ArrowRight,
  Package, TrendingUp, DollarSign, Clock, Route, AlertCircle, Eye, Trash2, LogOut,
  BarChart3, Settings, ChevronDown, Download, RefreshCw, Bell, Home, FileText,
  CreditCard, Activity, PieChart, Calendar, Inbox, CheckSquare, XCircle, Edit,
  MoreVertical, Send, User, ShoppingCart, Zap, TrendingDown, ArrowUpRight
} from 'lucide-react';

// Real route and company data
const routesWithCompanies = [
  { route: "Mumbai-Singapore", companies: ["Maersk", "ONE", "CMA CGM", "Evergreen"] },
  { route: "Chennai-Dubai", companies: ["Hapag-Lloyd", "MSC", "X-Press Feeders"] },
  { route: "Los Angeles-Mumbai", companies: ["Maersk", "CMA CGM", "Hapag-Lloyd"] },
  { route: "Hamburg-Delhi", companies: ["DHL", "FedEx Express", "Lufthansa Cargo"] },
  { route: "Mundra-Jebel Ali", companies: ["DP World", "MSC", "Maersk"] },
  { route: "JNPT (Mumbai)-Rotterdam", companies: ["MSC", "Hapag-Lloyd", "CMA CGM"] },
  { route: "Chennai-Port Klang", companies: ["ZIM", "ONE", "Evergreen"] },
  { route: "Kolkata-Singapore", companies: ["Shipping Corporation of India (SCI)", "Maersk"] },
  { route: "Mundra-New York", companies: ["Hapag-Lloyd", "Maersk", "MSC"] },
  { route: "Cochin-Jeddah", companies: ["MSC", "Hapag-Lloyd"] },
  { route: "Shanghai-Los Angeles", companies: ["COSCO", "MSC", "Maersk", "ONE"] },
  { route: "Shenzhen-New York", companies: ["CMA CGM", "Evergreen", "ZIM"] },
  { route: "Ningbo-Long Beach", companies: ["Maersk", "COSCO", "OOCL"] },
  { route: "Hong Kong-Vancouver", companies: ["ONE", "Evergreen", "Yang Ming"] },
  { route: "Busan-Seattle", companies: ["HMM", "Maersk", "ONE"] },
  { route: "Shanghai-Hamburg", companies: ["COSCO", "MSC", "Evergreen"] },
  { route: "Shanghai-Rotterdam", companies: ["Maersk", "CMA CGM", "OOCL"] },
  { route: "Singapore-Felixstowe", companies: ["Hapag-Lloyd", "ONE", "Maersk"] },
  { route: "New York-Antwerp", companies: ["Hapag-Lloyd", "MSC", "Maersk"] },
  { route: "Singapore-Port Klang", companies: ["ONE", "Maersk", "Evergreen"] },
  { route: "Hong Kong-Shanghai", companies: ["OOCL", "COSCO", "Wan Hai Lines"] },
  { route: "Shanghai-Santos", companies: ["COSCO", "Maersk", "CMA CGM"] },
  { route: "Guangzhou-Durban", companies: ["COSCO", "Maersk", "MSC"] },
  { route: "Sydney-Tokyo", companies: ["ONE", "ANL (a CMA CGM Company)"] },
  { route: "Shanghai-Sydney", companies: ["COSCO", "Maersk", "MSC"] }
];

const cargoTypes = [
  "Electronics", "Textiles", "Machinery", "Chemicals", "Automotive",
  "Food Products", "Pharmaceuticals", "Oil & Gas", "Raw Materials",
  "Mining Equipment", "Agricultural Products", "Bulk Commodities"
];

const shipmentTypes = [
  { value: "Road", icon: Truck, color: "text-blue-600" },
  { value: "Rail", icon: Train, color: "text-green-600" },
  { value: "Ship", icon: Ship, color: "text-cyan-600" },
  { value: "Air", icon: Plane, color: "text-purple-600" }
];

// Generate companies from real data
const generateMockCompanies = () => {
  const companyProfiles = new Map();
  
  routesWithCompanies.forEach(item => {
    item.companies.forEach(companyName => {
      if (!companyProfiles.has(companyName)) {
        companyProfiles.set(companyName, {
          name: companyName,
          routes: new Set(),
        });
      }
      companyProfiles.get(companyName).routes.add(item.route);
    });
  });

  let idCounter = 1;
  const finalCompanies = Array.from(companyProfiles.values()).map(profile => {
    const name = profile.name;
    const isAirCargo = name.toLowerCase().includes('cargo') || name.toLowerCase().includes('express') || name.toLowerCase().includes('air');
    
    return {
      id: idCounter++,
      name,
      website: `https://www.${name.toLowerCase().replace(/\s/g, '').replace(/[()]/g, '')}.com`,
      contact: `+${Math.floor(Math.random() * 90) + 10}-555-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `contact@${name.toLowerCase().replace(/\s/g, '').replace(/[()]/g, '')}.com`,
      routes: Array.from(profile.routes),
      cargoTypes: cargoTypes.slice(0, Math.floor(Math.random() * 8) + 4),
      shipmentTypes: isAirCargo ? ["Air", "Road"] : ["Ship", "Rail", "Road"],
      rating: (Math.random() * 1.2 + 3.8).toFixed(1),
      established: Math.floor(Math.random() * 50) + 1970,
      verified: true,
      coverage: ["Global", "Asia-Pacific", "Europe", "Americas"][Math.floor(Math.random() * 4)],
      maxCoverage: `$${Math.floor(Math.random() * 45) + 5}M USD`,
      claimSettlement: `${Math.floor(Math.random() * 10) + 90}%`,
      status: ["approved", "pending", "rejected"][Math.floor(Math.random() * 3)],
      paymentStatus: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)],
      submittedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      clicks: Math.floor(Math.random() * 2500),
      views: Math.floor(Math.random() * 10000),
      quotes: Math.floor(Math.random() * 500),
      submittedBy: {
        name: `${name} Admin`,
        email: `admin@${name.toLowerCase().replace(/\s/g, '').replace(/[()]/g, '')}.com`,
        phone: `+${Math.floor(Math.random() * 90) + 10}-555-${Math.floor(Math.random() * 9000) + 1000}`,
        designation: "Operations Manager"
      }
    };
  });
  
  return finalCompanies;
};

const initialCompanyFormState = {
  name: "", website: "", contact: "", email: "", description: "",
  established: new Date().getFullYear(), routes: [], cargoTypes: [], shipmentTypes: [],
  coverage: "Global", maxCoverageAmount: "", maxCoverageCurrency: "USD",
  submitterName: "", submitterEmail: "", submitterPhone: "", submitterDesignation: ""
};

function SurakshitSafar() {
  const [currentView, setCurrentView] = useState("home");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [arrivalPort, setArrivalPort] = useState("");
  const [selectedCargoType, setSelectedCargoType] = useState("");
  const [selectedShipmentType, setSelectedShipmentType] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  
  const [adminTab, setAdminTab] = useState("dashboard");
  const [companies, setCompanies] = useState([]);
  const [adminFilters, setAdminFilters] = useState({
    status: "all",
    paymentStatus: "all",
    search: ""
  });

  // Load companies from database
  const loadCompaniesFromDB = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = token ? `${API_URL}/companies/all` : `${API_URL}/companies/approved`;
      const headers = token ? {
        'Authorization': `Bearer ${token}`
      } : {};

      const response = await fetch(endpoint, { headers });
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.map(c => ({
          ...c,
          id: c._id,
          clicks: c.analytics?.clicks || 0,
          views: c.analytics?.views || 0,
          quotes: c.analytics?.quotes || 0,
          maxCoverage: `${c.maxCoverage?.amount}M ${c.maxCoverage?.currency}`,
        })));
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies(generateMockCompanies());
    }
  };

  useEffect(() => {
    loadCompaniesFromDB();
  }, []);
  
  const [companyForm, setCompanyForm] = useState(initialCompanyFormState);
  const [currentRoute, setCurrentRoute] = useState("");
  const [adminCredentials, setAdminCredentials] = useState({ username: "", password: "" });

  useEffect(() => {
    let results = companies.filter(c => c.status === "approved" && c.paymentStatus === "completed");
    
    if (searchTerm) {
      results = results.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.coverage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (departurePort || arrivalPort) {
      results = results.filter(company =>
        company.routes.some(route => {
          const parts = route.split('-');
          if (parts.length < 2) return false;
          const [dep, arr] = parts;
          const matchesDeparture = !departurePort || (dep && dep.toLowerCase().includes(departurePort.toLowerCase()));
          const matchesArrival = !arrivalPort || (arr && arr.toLowerCase().includes(arrivalPort.toLowerCase()));
          return matchesDeparture && matchesArrival;
        })
      );
    }
    
    if (selectedCargoType) {
      results = results.filter(company => company.cargoTypes.includes(selectedCargoType));
    }
    
    if (selectedShipmentType) {
      results = results.filter(company => company.shipmentTypes.includes(selectedShipmentType));
    }
    
    setFilteredCompanies(results);
  }, [searchTerm, departurePort, arrivalPort, selectedCargoType, selectedShipmentType, companies]);

  const handleCompanyClick = async (company) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch(`${API_URL}/companies/${company.id}/analytics/click`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
    
    setCompanies(prev => prev.map(c => 
      c.id === company.id ? {...c, clicks: (c.clicks || 0) + 1} : c
    ));
    window.open(company.website, '_blank');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCargoTypeChange = (e) => {
    const { value, checked } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      cargoTypes: checked ? [...prev.cargoTypes, value] : prev.cargoTypes.filter(type => type !== value)
    }));
  };

  const handleShipmentTypeChange = (e) => {
    const { value, checked } = e.target;
    setCompanyForm(prev => ({
      ...prev,
      shipmentTypes: checked ? [...prev.shipmentTypes, value] : prev.shipmentTypes.filter(type => type !== value)
    }));
  };

  const handleAddRoute = () => {
    if (currentRoute && !companyForm.routes.includes(currentRoute)) {
      setCompanyForm(prev => ({ ...prev, routes: [...prev.routes, currentRoute] }));
      setCurrentRoute("");
    }
  };

  const handleRemoveRoute = (routeToRemove) => {
    setCompanyForm(prev => ({ ...prev, routes: prev.routes.filter(route => route !== routeToRemove) }));
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    
    try {
      const submissionData = {
        name: companyForm.name,
        email: companyForm.email,
        website: companyForm.website,
        contact: companyForm.contact,
        routes: companyForm.routes,
        cargoTypes: companyForm.cargoTypes,
        shipmentTypes: companyForm.shipmentTypes,
        coverage: companyForm.coverage,
        maxCoverage: {
          amount: parseFloat(companyForm.maxCoverageAmount),
          currency: companyForm.maxCoverageCurrency,
        },
        established: parseInt(companyForm.established, 10),
        description: companyForm.description,
        submittedBy: {
          name: companyForm.submitterName,
          email: companyForm.submitterEmail,
          phone: companyForm.submitterPhone,
          designation: companyForm.submitterDesignation
        }
      };

      const response = await fetch(`${API_URL}/companies/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Company "${companyForm.name}" submitted successfully! Please proceed to payment of ₹15,000.`);
        setShowAddCompanyForm(false);
        setCompanyForm(initialCompanyFormState);
        loadCompaniesFromDB();
      } else {
        alert(data.message || 'Failed to submit company');
      }
    } catch (error) {
      console.error('Error submitting company:', error);
      alert('Failed to connect to server');
    }
  };

  const API_URL = 'http://localhost:5000/api';

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCredentials)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAdminLoggedIn(true);
        setAdminUser(data.admin);
        setCurrentView("admin");
        setShowAdminLogin(false);
        setAdminCredentials({ username: "", password: "" });
        loadCompaniesFromDB();
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      alert("Failed to connect to server. Using demo mode.");
      // Fallback to demo login
      if (adminCredentials.username === "admin" && adminCredentials.password === "AdminPass123!") {
        setIsAdminLoggedIn(true);
        setAdminUser({ username: "admin", email: "admin@surakshitsafar.com", role: "super_admin" });
        setCurrentView("admin");
        setShowAdminLogin(false);
        setAdminCredentials({ username: "", password: "" });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setCurrentView("home");
  };

  const handleApproveCompany = async (companyId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/companies/${companyId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert("Company approved successfully!");
        loadCompaniesFromDB();
      } else {
        alert("Failed to approve company");
      }
    } catch (error) {
      console.error('Error approving company:', error);
      // Fallback to local state update
      setCompanies(prev => prev.map(c =>
        c.id === companyId ? {...c, status: "approved", verified: true} : c
      ));
      alert("Company approved successfully!");
    }
  };

  const handleRejectCompany = async (companyId, reason = "") => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/companies/${companyId}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason: reason })
      });

      if (response.ok) {
        alert("Company rejected!");
        loadCompaniesFromDB();
      } else {
        alert("Failed to reject company");
      }
    } catch (error) {
      console.error('Error rejecting company:', error);
      // Fallback to local state update
      setCompanies(prev => prev.map(c =>
        c.id === companyId ? {...c, status: "rejected"} : c
      ));
      alert("Company rejected!");
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Company deleted successfully!");
        loadCompaniesFromDB();
      } else {
        alert("Failed to delete company");
      }
    } catch (error) {
      console.error('Error deleting company:', error);
      // Fallback to local state update
      setCompanies(prev => prev.filter(c => c.id !== companyId));
      alert("Company deleted successfully!");
    }
  };

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

  const CompanyCard = ({ company }) => (
    <div className="bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-blue-500 group cursor-pointer overflow-hidden"
         onClick={() => handleCompanyClick(company)}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-blue-200 transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center space-x-2 text-blue-100">
                <span className="text-sm">{company.coverage}</span>
                {company.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
              </div>
            </div>
          </div>
          <ExternalLink className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(company.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
            ))}
            <span className="text-sm text-gray-300 ml-2">{company.rating}</span>
          </div>
          <span className="text-xs text-gray-500">Est. {company.established}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Max Coverage</span>
            </div>
            <p className="text-sm font-semibold text-white">{company.maxCoverage}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Claims Settled</span>
            </div>
            <p className="text-sm font-semibold text-white">{company.claimSettlement}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Transport Methods:</p>
          <div className="flex flex-wrap gap-2">
            {company.shipmentTypes.map((type) => {
              const TypeIcon = shipmentTypes.find(t => t.value === type)?.icon || Truck;
              const color = shipmentTypes.find(t => t.value === type)?.color || "text-gray-400";
              return (
                <div key={type} className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-full">
                  <TypeIcon className={`h-3 w-3 ${color}`} />
                  <span className="text-xs text-gray-300">{type}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Popular Routes:</p>
          <div className="space-y-1">
            {company.routes.slice(0, 2).map((route, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm">
                <Route className="h-3 w-3 text-blue-400" />
                <span className="text-gray-300">{route}</span>
              </div>
            ))}
            {company.routes.length > 2 && (
              <span className="text-xs text-gray-500">+{company.routes.length - 2} more routes</span>
            )}
          </div>
        </div>
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
          <span>Get Quote</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const AdminDashboard = () => {
    const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
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
      </div>
    );

    const getPendingCompanies = () => {
      let filtered = companies.filter(c => c.status === "pending" && c.paymentStatus === "completed");
      if (adminFilters.search) {
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(adminFilters.search.toLowerCase())
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
          c.name.toLowerCase().includes(adminFilters.search.toLowerCase())
        );
      }
      return filtered;
    };

    return (
      <div className="min-h-screen bg-gray-950">
        <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
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
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3 border-l border-gray-800 pl-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{adminUser?.username}</p>
                    <p className="text-xs text-gray-400">{adminUser?.role}</p>
                  </div>
                  <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "pending", label: "Pending Requests", icon: Clock, badge: dashboardStats.pendingCompanies },
                { id: "companies", label: "All Companies", icon: Building },
                { id: "analytics", label: "Analytics", icon: PieChart },
                { id: "settings", label: "Settings", icon: Settings }
              ].map(tab => (
                <button key={tab.id} onClick={() => setAdminTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    adminTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
                  }`}>
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{tab.badge}</span>}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {adminTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">Monitor your platform's performance and metrics</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Companies" value={dashboardStats.totalCompanies} change={12.5} trend="up" icon={Building} color="bg-blue-600" />
                <StatCard title="Pending Approvals" value={dashboardStats.pendingCompanies} icon={Clock} color="bg-yellow-600" />
                <StatCard title="Total Revenue" value={`₹${(dashboardStats.totalRevenue / 1000).toFixed(0)}K`} change={18.3} trend="up" icon={DollarSign} color="bg-green-600" />
                <StatCard title="Total Clicks" value={dashboardStats.totalClicks.toLocaleString()} change={7.8} trend="up" icon={Activity} color="bg-purple-600" />
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Submissions</h3>
                <div className="space-y-4">
                  {companies.slice(0, 5).map(company => (
                    <div key={company.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-700 rounded-lg"><Building className="h-5 w-5 text-blue-400" /></div>
                        <div>
                          <p className="font-medium text-white">{company.name}</p>
                          <p className="text-sm text-gray-400">{company.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          company.status === 'approved' ? 'bg-green-600 text-white' :
                          company.status === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                        }`}>{company.status}</span>
                        <span className="text-sm text-gray-400">{new Date(company.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === "pending" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">Pending Requests</h2>
                  <p className="text-gray-400">{getPendingCompanies().length} companies awaiting approval</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input type="text" placeholder="Search companies..." className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={adminFilters.search} onChange={(e) => setAdminFilters({...adminFilters, search: e.target.value})} />
                </div>
              </div>
              {getPendingCompanies().length === 0 ? (
                <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All Caught Up!</h3>
                  <p className="text-gray-400">No pending company requests at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {getPendingCompanies().map(company => (
                    <div key={company.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                          <p className="text-sm text-gray-400">{company.email}</p>
                        </div>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">Payment Complete</span>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Website:</span>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center space-x-1">
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
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Submitted:</span>
                          <span className="text-white">{new Date(company.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Shipment Types:</p>
                        <div className="flex flex-wrap gap-2">
                          {company.shipmentTypes.map(type => (<span key={type} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">{type}</span>))}
                        </div>
                      </div>
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium text-gray-300 mb-1">Submitted by:</p>
                        <div className="text-sm text-gray-400">
                          <p>{company.submittedBy?.name}</p>
                          <p>{company.submittedBy?.email}</p>
                          <p>{company.submittedBy?.phone}</p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button onClick={() => setSelectedCompany(company)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                        <button onClick={() => handleApproveCompany(company.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">Approve</button>
                        <button onClick={() => handleRejectCompany(company.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "companies" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">All Companies</h2>
                  <p className="text-gray-400">{getFilteredCompanies().length} companies total</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select value={adminFilters.status} onChange={(e) => setAdminFilters({...adminFilters, status: e.target.value})} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                  </select>
                  <select value={adminFilters.paymentStatus} onChange={(e) => setAdminFilters({...adminFilters, paymentStatus: e.target.value})} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Payments</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
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
                    {getFilteredCompanies().map(company => (
                      <tr key={company.id} className="hover:bg-gray-800 transition-colors">
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
                          }`}>{company.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            company.paymentStatus === 'completed' ? 'bg-green-600 text-white' :
                            company.paymentStatus === 'pending' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                          }`}>{company.paymentStatus}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            <div>👁️ {company.views} views</div>
                            <div>🖱️ {company.clicks} clicks</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleDeleteCompany(company.id)} className="text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
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
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Revenue</h3>
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">₹{(dashboardStats.totalRevenue / 1000).toFixed(1)}K</div>
                  <p className="text-gray-400 text-sm">From {companies.filter(c => c.paymentStatus === 'completed').length} payments</p>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Approval Rate</h3>
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{((dashboardStats.approvedCompanies / dashboardStats.totalCompanies) * 100).toFixed(1)}%</div>
                  <p className="text-gray-400 text-sm">{dashboardStats.approvedCompanies} of {dashboardStats.totalCompanies} companies</p>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performing Companies</h3>
                <div className="space-y-4">
                  {companies.filter(c => c.status === 'approved').sort((a, b) => b.clicks - a.clicks).slice(0, 5).map((company, idx) => (
                    <div key={company.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Pricing Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Company Listing Fee (₹)</label>
                      <input type="number" defaultValue="15000" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">Update Pricing</button>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">Admin Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                      <input type="text" value={adminUser?.username || ''} disabled className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input type="email" value={adminUser?.email || ''} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">Update Profile</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isAdminLoggedIn && currentView === "admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SurakshitSafar</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setCurrentView("home")} className={`font-medium transition-colors ${currentView === "home" ? "text-blue-400" : "text-gray-300 hover:text-white"}`}>Home</button>
              <button onClick={() => setCurrentView("search")} className={`font-medium transition-colors ${currentView === "search" ? "text-blue-400" : "text-gray-300 hover:text-white"}`}>Search Insurance</button>
              <button onClick={() => setShowAddCompanyForm(true)} className="text-gray-300 hover:text-white font-medium transition-colors">List Your Company</button>
              {isAdminLoggedIn ? (
                <button onClick={() => setCurrentView("admin")} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <button onClick={() => setShowAdminLogin(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">Secure Your Cargo Journey</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">Find the perfect insurance coverage for your shipments worldwide</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input type="text" placeholder="Search companies..." className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input type="text" placeholder="Departure port..." className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400" value={departurePort} onChange={(e) => setDeparturePort(e.target.value)} />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input type="text" placeholder="Arrival port..." className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400" value={arrivalPort} onChange={(e) => setArrivalPort(e.target.value)} />
              </div>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none" value={selectedCargoType} onChange={(e) => setSelectedCargoType(e.target.value)}>
                  <option value="">All Cargo Types</option>
                  {cargoTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none" value={selectedShipmentType} onChange={(e) => setSelectedShipmentType(e.target.value)}>
                  <option value="">All Transport</option>
                  {shipmentTypes.map(type => (<option key={type.value} value={type.value}>{type.value}</option>))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Insurance Providers ({filteredCompanies.length})</h2>
            <button onClick={() => setShowAddCompanyForm(true)} className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add Company</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (<CompanyCard key={company.id} company={company} />))}
          </div>
        </div>
      </section>

      {showAddCompanyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">List Your Insurance Company</h3>
                <button onClick={() => setShowAddCompanyForm(false)} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
              </div>
              <p className="text-sm text-gray-400 mt-2">Complete the form below. Listing fee: ₹15,000 (One-time payment).</p>
            </div>
            <form onSubmit={handleAddCompany} className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">Company Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" type="text" required placeholder="Company Name *" value={companyForm.name} onChange={handleFormChange} className="form-input" />
                  <input name="email" type="email" required placeholder="Official Email *" value={companyForm.email} onChange={handleFormChange} className="form-input" />
                  <input name="website" type="url" required placeholder="Website URL *" value={companyForm.website} onChange={handleFormChange} className="form-input" />
                  <input name="contact" type="tel" required placeholder="Contact Number *" value={companyForm.contact} onChange={handleFormChange} className="form-input" />
                  <input name="established" type="number" placeholder="Year Established" value={companyForm.established} onChange={handleFormChange} className="form-input" />
                  <select name="coverage" value={companyForm.coverage} onChange={handleFormChange} className="form-input">
                    <option>Global</option><option>Asia-Pacific</option><option>Europe</option><option>Americas</option><option>India-Specific</option>
                  </select>
                  <div className="flex gap-2">
                    <input name="maxCoverageAmount" type="number" placeholder="Max Coverage (in Millions)" value={companyForm.maxCoverageAmount} onChange={handleFormChange} className="form-input w-2/3" />
                    <select name="maxCoverageCurrency" value={companyForm.maxCoverageCurrency} onChange={handleFormChange} className="form-input w-1/3">
                      <option>USD</option><option>EUR</option><option>INR</option>
                    </select>
                  </div>
                </div>
                <textarea name="description" placeholder="Brief Company Description..." value={companyForm.description} onChange={handleFormChange} className="form-input mt-4 w-full" rows="3"></textarea>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">Services Offered</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cargo Types Covered</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-gray-900 rounded-md">
                      {cargoTypes.map(type => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" value={type} checked={companyForm.cargoTypes.includes(type)} onChange={handleCargoTypeChange} className="form-checkbox" />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Shipment Methods</label>
                    <div className="space-y-2">
                      {shipmentTypes.map(type => (
                        <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" value={type.value} checked={companyForm.shipmentTypes.includes(type.value)} onChange={handleShipmentTypeChange} className="form-checkbox" />
                          <type.icon className={`h-4 w-4 ${type.color}`} />
                          <span>{type.value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Popular Routes (e.g., Mumbai-Dubai)</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Add a route" value={currentRoute} onChange={(e) => setCurrentRoute(e.target.value)} className="form-input flex-grow" />
                      <button type="button" onClick={handleAddRoute} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Add</button>
                    </div>
                    <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                      {companyForm.routes.map(route => (
                        <div key={route} className="flex items-center justify-between bg-gray-700 px-2 py-1 rounded">
                          <span className="text-sm">{route}</span>
                          <button type="button" onClick={() => handleRemoveRoute(route)} className="text-red-400 hover:text-red-300"><XCircle className="h-4 w-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">Your Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="submitterName" type="text" required placeholder="Your Full Name *" value={companyForm.submitterName} onChange={handleFormChange} className="form-input" />
                  <input name="submitterEmail" type="email" required placeholder="Your Email *" value={companyForm.submitterEmail} onChange={handleFormChange} className="form-input" />
                  <input name="submitterPhone" type="tel" placeholder="Your Phone" value={companyForm.submitterPhone} onChange={handleFormChange} className="form-input" />
                  <input name="submitterDesignation" type="text" placeholder="Your Designation" value={companyForm.submitterDesignation} onChange={handleFormChange} className="form-input" />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setShowAddCompanyForm(false)} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors font-semibold">Submit & Proceed to Pay ₹15,000</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Admin Login</h3>
                <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              <input type="text" required placeholder="Username" value={adminCredentials.username} onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="password" required placeholder="Password" value={adminCredentials.password} onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="text-xs text-gray-400 bg-gray-700 p-3 rounded-lg">
                <p><strong>Default Credentials:</strong></p>
                <p>Username: admin | Password: AdminPass123!</p>
                <p>Username: moderator | Password: ModeratorPass123!</p>
                <p className="text-yellow-400 mt-2">⚠️ Change passwords in production!</p>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setShowAdminLogin(false)} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Company Details</h3>
                <button onClick={() => setSelectedCompany(null)} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
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
                  <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 break-all">{selectedCompany.website}</a>
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
                  {selectedCompany.shipmentTypes.map(type => (
                    <span key={type} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{type}</span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cargo Types</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.cargoTypes.map(type => (
                    <span key={type} className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">{type}</span>
                  ))}
                </div>
              </div>

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
                    <div className="flex justify-between">
                      <span className="text-gray-400">Designation:</span>
                      <span className="text-white">{selectedCompany.submittedBy.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Submitted on:</span>
                      <span className="text-white">{new Date(selectedCompany.submittedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-700 flex space-x-3">
              <button onClick={() => { handleApproveCompany(selectedCompany.id); setSelectedCompany(null); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">Approve Company</button>
              <button onClick={() => { handleRejectCompany(selectedCompany.id); setSelectedCompany(null); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition-colors">Reject Company</button>
              <button onClick={() => setSelectedCompany(null)} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .form-input {
          @apply px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500;
        }
        .form-checkbox {
          @apply h-4 w-4 bg-gray-700 border-gray-600 rounded text-blue-500 focus:ring-blue-500;
        }
      `}</style>
    </div>
  );
}

export default SurakshitSafar;