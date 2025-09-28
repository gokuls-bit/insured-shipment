
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Globe, 
  Plus, 
  Building, 
  Truck, 
  Train, 
  Ship, 
  Plane, 
  MapPin, 
  ExternalLink, 
  Star, 
  Phone, 
  Mail, 
  Filter, 
  X, 
  Menu, 
  LogIn, 
  Shield, 
  Users, 
  CheckCircle,
  ArrowRight,
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  Route,
  AlertCircle
} from 'lucide-react';


const cargoTypes = [
  "Electronics", "Textiles", "Machinery", "Chemicals", "Automotive",
  "Food Products", "Pharmaceuticals", "Oil & Gas", "Raw Materials",
  "Mining Equipment", "Agricultural Products", "Bulk Commodities", "Consumer Goods",
  "Apparel & Footwear", "Furniture", "Medical Supplies", "Construction Materials",
  "Plastics & Rubber", "Paper Products", "Steel & Metals", "Hazardous Materials",
  "Perishables", "Frozen Goods", "Livestock", "Vehicles", "Luxury Goods",
  "Cosmetics", "Toys & Games", "Sporting Goods", "Building Materials",
  "Heavy Machinery", "Industrial Equipment", "Aerospace Parts", "Marine Parts",
  "Scrap Metal", "Recyclables", "Fine Art", "Antiques", "Wine & Spirits",
  "Tobacco", "Cotton", "Lumber", "Coal & Minerals", "Grain", "Fertilizers",
  "Feedstock", "Textile Raw Materials", "Computer Hardware", "Software (Physical Media)",
  "Telecommunications Equipment", "Printed Matter", "Books & Magazines",
  "Office Supplies", "Home Appliances", "Garden Supplies", "Pet Supplies",
  "Musical Instruments", "Event & Staging Equipment", "Film & Media",
  "Educational Materials", "Scientific Instruments", "Lab Equipment",
  "Beverages", "Confectionery", "Dairy Products", "Seafood", "Meat Products",
  "Poultry", "Spices & Herbs", "Coffee & Tea", "Flowers & Plants",
  "Humanitarian Aid", "Defense & Military Goods", "Explosives", "Radioactive Materials",
  "Industrial Chemicals", "Paints & Coatings", "Adhesives", "Resins",
  "Synthetic Fibers", "Glass & Ceramics", "Stone & Marble", "Asphalt",
  "Cement", "Scaffolding", "Electrical Components", "Batteries", "Cables & Wiring",
  "Lighting Fixtures", "Plumbing Supplies", "HVAC Systems"
];



// -----------------------------------------------------------------------
// Expanded: 124 Popular Routes
// -----------------------------------------------------------------------
const popularRoutes = [
    "Mumbai-Singapore", "Chennai-Dubai", "Los Angeles-Mumbai", "Hamburg-Delhi", "Shanghai-Hamburg", 
    "New York-London", "Sydney-Tokyo", "Chicago-Los Angeles", "Rotterdam-Singapore", "Antwerp-Shanghai", 
    "Hong Kong-Long Beach", "Busan-Qingdao", "Jebel Ali (Dubai)-Port Klang", "Guangzhou-Ningbo", 
    "Shenzhen-Los Angeles", "Singapore-Tanjung Pelepas", "Laem Chabang-Jakarta", "Colombo-Salalah", 
    "New York-Rotterdam", "Houston-Veracruz", "Santos-Buenos Aires", "Vancouver-Yokohama", "Felixstowe-Hamburg", 
    "Algeciras-Valencia", "Piraeus-Genoa", "Durban-Mombasa", "Cairo-Jeddah", "Ho Chi Minh City-Manila", 
    "Bangkok-Kolkata", "Seattle-Anchorage", "Miami-Nassau", "Panama City-Cartagena", "Kingston-San Juan", 
    "Frankfurt-Bangalore", "London-Dubai", "Paris-New York", "Amsterdam-Chicago", "Toronto-Vancouver", 
    "Mexico City-Los Angeles", "São Paulo-Miami", "Johannesburg-London", "Lagos-Amsterdam", "Nairobi-Dubai", 
    "Beijing-Moscow", "Seoul-Frankfurt", "Taipei-San Francisco", "Kuala Lumpur-Sydney", "Melbourne-Auckland", 
    "Perth-Singapore", "Delhi-Hong Kong", "Bengaluru-Singapore", "Hyderabad-Kuala Lumpur", "Kolkata-Shanghai", 
    "Houston-Rotterdam", "New Orleans-Antwerp", "Savannah-Bremerhaven", "Oakland-Busan", "Montreal-Liverpool", 
    "Halifax-Le Havre", "Baltimore-Felixstowe", "Charleston-Algeciras", "Norfolk-Gdańsk", "Philadelphia-Dublin", 
    "Boston-Reykjavik", "San Diego-Ensenada", "Tampa-Progreso", "Mobile-Port-au-Prince", "Freeport-Kingston", 
    "Honolulu-Guam", "Darwin-Dili", "Wellington-Suva", "Brisbane-Port Moresby", "Adelaide-Fremantle", 
    "Cairns-Honiara", "Vladivostok-Busan", "St. Petersburg-Helsinki", "Murmansk-Tromsø", "Odessa-Constanța", 
    "Istanbul-Novorossiysk", "Suez-Port Said", "Aqaba-Djibouti", "Doha-Kuwait City", "Muscat-Karachi", 
    "Chabahar-Mumbai", "Marseille-Algiers", "Barcelona-Tangier", "Lisbon-Casablanca", "Naples-Tunis", 
    "Valletta-Tripoli", "Copenhagen-Oslo", "Stockholm-Tallinn", "Riga-Kiel", "Gothenburg-Ghent", 
    "Helsingborg-Aarhus", "Bergen-Rotterdam", "Aberdeen-Stavanger", "Glasgow-Belfast", "Cork-Bristol", 
    "Bilbao-Bordeaux", "Porto-Southampton", "Thessaloniki-Izmir", "Limassol-Beirut", "Haifa-Alexandria", 
    "Ashdod-Mersin", "Varna-Poti", "Batumi-Samsun", "Trabzon-Sochi", "Astrakhan-Baku", "Turkmenbashi-Anzali", 
    "Aktau-Olya", "Chennai-Yangon", "Visakhapatnam-Chittagong", "Cochin-Male", "Tuticorin-Colombo",
    "Cape Town-Walvis Bay", "Luanda-Pointe Noire", "Lomé-Abidjan", "Tema-Lagos", "Port Harcourt-Douala",
    "Dar es Salaam-Zanzibar", "Maputo-Beira", "Recife-Fortaleza", "Valparaiso-Callao", "Guayaquil-Buenaventura",
    "Montevideo-Paranaguá", "Ushuaia-Punta Arenas", "Arica-Iquique", "Manzanillo-Lázaro Cárdenas",
    "Calgary-Edmonton", "Winnipeg-Regina", "Quebec City-Saint John", "Prince Rupert-Kitimat",
    "Jakarta-Surabaya", "Penang-Medan", "Davao-Zamboanga", "Cebu-Iloilo", "Port Hedland-Dampier",
    "Gwangyang-Incheon", "Tianjin-Dalian", "Xiamen-Fuzhou", "Hanoi-Haiphong", "Da Nang-Quy Nhon"
];

// -----------------------------------------------------------------------
// Base: Shipment Types (Icons would be imported components)
// -----------------------------------------------------------------------
const shipmentTypes = [
  { value: "Road", icon: Truck, color: "text-blue-600" },
  { value: "Rail", icon: Train, color: "text-green-600" },
  { value: "Ship", icon: Ship, color: "text-cyan-600" },
  { value: "Air", icon: Plane, color: "text-purple-600" }
];

// Helper function to get a random subset of an array
const getRandomSubset = (arr, maxCount) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * maxCount) + 1);
};



// -----------------------------------------------------------------------
const mockCompanies = [  { id: 1, name: "Global Marine Logistics", website: "https://globalmarinelogistics.com", contact: "+91-9876543210", email: "info@globalmarinelogistics.com", routes: ["Mumbai-Singapore", "Chennai-Dubai", "Kolkata-Shanghai"], cargoTypes: ["Electronics", "Textiles", "Machinery", "Chemicals"], shipmentTypes: ["Ship", "Air"], rating: 4.8, established: 2005, verified: true, coverage: "Asia-Pacific", maxCoverage: "$5M USD", claimSettlement: "95%" }, { id: 2, name: "TransOcean Cargo Shield", website: "https://transoceancargoshield.com", contact: "+1-555-0123", email: "support@transoceancargoshield.com", routes: ["Los Angeles-Mumbai", "New York-London", "Houston-Rotterdam"], cargoTypes: ["Oil & Gas", "Automotive", "Food Products", "Raw Materials"], shipmentTypes: ["Ship", "Air", "Road"], rating: 4.6, established: 2001, verified: true, coverage: "Global", maxCoverage: "$10M USD", claimSettlement: "92%" }, { id: 3, name: "EuroAsia Express Insurance", website: "https://euroasiaexpressinsurance.eu", contact: "+49-30-1234567", email: "claims@euroasiaexpressinsurance.eu", routes: ["Hamburg-Delhi", "Rotterdam-Mumbai", "Frankfurt-Bangalore"], cargoTypes: ["Electronics", "Pharmaceuticals", "Automotive", "Textiles"], shipmentTypes: ["Road", "Rail", "Air"], rating: 4.7, established: 1995, verified: true, coverage: "Europe-Asia", maxCoverage: "$8M USD", claimSettlement: "96%" }, { id: 4, name: "Pacific Rim Cargo Care", website: "https://pacificrimcargocare.com.au", contact: "+61-2-9374-4000", email: "info@pacificrimcargocare.com.au", routes: ["Sydney-Tokyo", "Melbourne-Seoul", "Brisbane-Hong Kong"], cargoTypes: ["Mining Equipment", "Agricultural Products", "Electronics", "Machinery"], shipmentTypes: ["Ship", "Air"], rating: 4.5, established: 2008, verified: true, coverage: "Pacific Region", maxCoverage: "$6M USD", claimSettlement: "89%" }, { id: 5, name: "Continental Rail Insurance", website: "https://continentalrailinsurance.com", contact: "+1-800-RAIL-INS", email: "rail@continentalrailinsurance.com", routes: ["Chicago-Los Angeles", "New York-Miami", "Toronto-Vancouver"], cargoTypes: ["Bulk Commodities", "Containers", "Automotive", "Coal & Minerals"], shipmentTypes: ["Rail", "Road"], rating: 4.3, established: 1998, verified: true, coverage: "North America", maxCoverage: "$12M USD", claimSettlement: "91%" }, { id: 6, name: "Silk Road Cargo Protection", website: "https://silkroadcargoprotection.com", contact: "+86-21-6234-5678", email: "service@silkroadcargoprotection.com", routes: ["Shanghai-Hamburg", "Beijing-London", "Guangzhou-Rotterdam"], cargoTypes: ["Electronics", "Textiles", "Machinery", "Consumer Goods"], shipmentTypes: ["Rail", "Road", "Ship"], rating: 4.4, established: 2010, verified: true, coverage: "China-Europe", maxCoverage: "$7M USD", claimSettlement: "88%" }, // 50 Additional companies (ids 7-56) - Diverse regions, specializations, valid websites { id: 7, name: "African Freight Alliance", website: "https://africanfreightalliance.africa", contact: "+27-11-123-4567", email: "info@africanfreightalliance.africa", routes: ["Cape Town-Johannesburg", "Lagos-Nairobi", "Durban-Dakar"], cargoTypes: ["Minerals", "Agricultural Goods", "Textiles", "Machinery"], shipmentTypes: ["Road", "Rail", "Ship"], rating: 4.2, established: 2012, verified: true, coverage: "Africa", maxCoverage: "$4M USD", claimSettlement: "90%" }, { id: 8, name: "Latin American Cargo Network", website: "https://latinamericancargonetwork.lat", contact: "+55-11-9876-5432", email: "support@latinamericancargonetwork.lat", routes: ["Sao Paulo-Buenos Aires", "Mexico City-Lima", "Rio de Janeiro-Santiago"], cargoTypes: ["Coffee", "Fruits", "Electronics", "Automotive Parts"], shipmentTypes: ["Ship", "Road", "Air"], rating: 4.5, established: 2007, verified: true, coverage: "South America", maxCoverage: "$9M USD", claimSettlement: "93%" }, { id: 9, name: "Nordic Sea Transport Insurance", website: "https://nordicseatransportinsurance.no", contact: "+47-22-334455", email: "claims@nordicseatransportinsurance.no", routes: ["Oslo-Bergen", "Stockholm-Helsinki", "Copenhagen-Reykjavik"], cargoTypes: ["Seafood", "Timber", "Machinery", "Pharmaceuticals"], shipmentTypes: ["Ship", "Rail"], rating: 4.9, established: 1990, verified: true, coverage: "Scandinavia", maxCoverage: "$15M USD", claimSettlement: "98%" }, { id: 10, name: "Middle East Logistics Hub", website: "https://middleeastlogisticshub.ae", contact: "+971-4-567-8901", email: "info@middleeastlogisticshub.ae", routes: ["Dubai-Abu Dhabi", "Riyadh-Jeddah", "Doha-Manama"], cargoTypes: ["Oil Derivatives", "Electronics", "Textiles", "Construction Materials"], shipmentTypes: ["Air", "Road"], rating: 4.6, established: 2015, verified: true, coverage: "Middle East", maxCoverage: "$11M USD", claimSettlement: "94%" }, { id: 11, name: "Australian Outback Freight", website: "https://australianoutbackfreight.com.au", contact: "+61-8-1234-5678", email: "support@australianoutbackfreight.com.au", routes: ["Perth-Adelaide", "Darwin-Brisbane", "Canberra-Melbourne"], cargoTypes: ["Mining Supplies", "Livestock", "Wines", "Electronics"], shipmentTypes: ["Road", "Rail"], rating: 4.4, established: 2003, verified: true, coverage: "Australia", maxCoverage: "$7M USD", claimSettlement: "91%" }, { id: 12, name: "Canadian Prairie Carriers", website: "https://canadianprairiecarriers.ca", contact: "+1-403-555-0199", email: "info@canadianprairiecarriers.ca", routes: ["Calgary-Edmonton", "Winnipeg-Regina", "Vancouver-Halifax"], cargoTypes: ["Grain", "Oil", "Timber", "Machinery"], shipmentTypes: ["Rail", "Road"], rating: 4.7, established: 1997, verified: true, coverage: "Canada", maxCoverage: "$13M USD", claimSettlement: "95%" }, { id: 13, name: "Indian Subcontinent Insurers", website: "https://indiansubcontinentinsurers.in", contact: "+91-22-6789-0123", email: "claims@indiansubcontinentinsurers.in", routes: ["Delhi-Chennai", "Mumbai-Kolkata", "Bangalore-Hyderabad"], cargoTypes: ["Spices", "Textiles", "IT Hardware", "Pharmaceuticals"], shipmentTypes: ["Road", "Rail", "Air"], rating: 4.3, established: 2011, verified: true, coverage: "India", maxCoverage: "$6M USD", claimSettlement: "89%" }, { id: 14, name: "Southeast Asia Freight Line", website: "https://southeastasiafreightline.sg", contact: "+65-6222-3344", email: "support@southeastasiafreightline.sg", routes: ["Singapore-Kuala Lumpur", "Bangkok-Ho Chi Minh", "Jakarta-Manila"], cargoTypes: ["Electronics", "Rubber", "Palm Oil", "Garments"], shipmentTypes: ["Ship", "Air"], rating: 4.8, established: 2006, verified: true, coverage: "Southeast Asia", maxCoverage: "$8M USD", claimSettlement: "96%" }, { id: 15, name: "Russian Trans-Siberian Cargo", website: "https://russiantranssiberiancargo.ru", contact: "+7-495-123-4567", email: "info@russiantranssiberiancargo.ru", routes: ["Moscow-Vladivostok", "St. Petersburg-Novosibirsk", "Kazan-Yekaterinburg"], cargoTypes: ["Metals", "Chemicals", "Machinery", "Food Grains"], shipmentTypes: ["Rail", "Road"], rating: 4.5, established: 1992, verified: true, coverage: "Russia", maxCoverage: "$10M USD", claimSettlement: "92%" }, { id: 16, name: "Brazilian Amazon Logistics", website: "https://brazilianamazonlogistics.br", contact: "+55-92-3456-7890", email: "claims@brazilianamazonlogistics.br", routes: ["Manaus-Sao Paulo", "Belem-Rio Branco", "Fortaleza-Recife"], cargoTypes: ["Timber", "Soybeans", "Fruits", "Electronics"], shipmentTypes: ["Road", "Ship"], rating: 4.2, established: 2014, verified: true, coverage: "Amazon Region", maxCoverage: "$5M USD", claimSettlement: "88%" }, { id: 17, name: "Japanese Island Freight", website: "https://japaneseislandfreight.jp", contact: "+81-3-1234-5678", email: "support@japaneseislandfreight.jp", routes: ["Tokyo-Osaka", "Yokohama-Nagoya", "Fukuoka-Hiroshima"], cargoTypes: ["Automobiles", "Electronics", "Seafood", "Machinery"], shipmentTypes: ["Ship", "Rail"], rating: 4.9, established: 1985, verified: true, coverage: "Japan", maxCoverage: "$20M USD", claimSettlement: "99%" }, { id: 18, name: "South African Diamond Hauliers", website: "https://southafricandiamondhauliers.za", contact: "+27-10-987-6543", email: "info@southafricandiamondhauliers.za", routes: ["Johannesburg-Cape Town", "Pretoria-Durban", "Bloemfontein-Port Elizabeth"], cargoTypes: ["Diamonds", "Gold", "Minerals", "Agricultural Products"], shipmentTypes: ["Road", "Air"], rating: 4.6, established: 2009, verified: true, coverage: "South Africa", maxCoverage: "$14M USD", claimSettlement: "93%" }, { id: 19, name: "Turkish Cargo Bridge", website: "https://turkishcargobridge.tr", contact: "+90-212-555-0123", email: "claims@turkishcargobridge.tr", routes: ["Istanbul-Ankara", "Izmir-Bursa", "Antalya-Adana"], cargoTypes: ["Textiles", "Fruits", "Machinery", "Chemicals"], shipmentTypes: ["Road", "Ship"], rating: 4.4, established: 2002, verified: true, coverage: "Turkey", maxCoverage: "$9M USD", claimSettlement: "90%" }, { id: 20, name: "Mexican Border Freight", website: "https://mexicanborderfreight.mx", contact: "+52-55-1234-5678", email: "support@mexicanborderfreight.mx", routes: ["Mexico City-Tijuana", "Monterrey-Cancun", "Guadalajara-Puebla"], cargoTypes: ["Automotive", "Avocados", "Electronics", "Beverages"], shipmentTypes: ["Road", "Rail"], rating: 4.3, established: 2013, verified: true, coverage: "Mexico", maxCoverage: "$7M USD", claimSettlement: "91%" }, { id: 21, name: "UK Channel Tunnel Insurers", website: "https://ukchanneltunnelinsurers.co.uk", contact: "+44-20-1234-5678", email: "info@ukchanneltunnelinsurers.co.uk", routes: ["London-Paris", "Manchester-Lille", "Birmingham-Calais"], cargoTypes: ["Electronics", "Fashion", "Machinery", "Food"], shipmentTypes: ["Rail", "Road"], rating: 4.7, established: 1994, verified: true, coverage: "UK-Europe", maxCoverage: "$16M USD", claimSettlement: "97%" }, { id: 22, name: "French Alpine Freight", website: "https://frenchalpinefreight.fr", contact: "+33-1-2345-6789", email: "support@frenchalpinefreight.fr", routes: ["Paris-Lyon", "Marseille-Grenoble", "Nice-Toulouse"], cargoTypes: ["Wine", "Cheese", "Luxury Goods", "Pharmaceuticals"], shipmentTypes: ["Road", "Rail"], rating: 4.5, established: 2000, verified: true, coverage: "France", maxCoverage: "$8M USD", claimSettlement: "94%" }, { id: 23, name: "German Baltic Cargo", website: "https://germanbalticcargo.de", contact: "+49-40-12345678", email: "claims@germanbalticcargo.de", routes: ["Berlin-Hamburg", "Munich-Frankfurt", "Cologne-Dusseldorf"], cargoTypes: ["Automobiles", "Chemicals", "Machinery", "Beer"], shipmentTypes: ["Road", "Rail", "Ship"], rating: 4.8, established: 1988, verified: true, coverage: "Germany", maxCoverage: "$18M USD", claimSettlement: "98%" }, { id: 24, name: "Italian Mediterranean Logistics", website: "https://italianmediterraneanlogistics.it", contact: "+39-06-1234567", email: "info@italianmediterraneanlogistics.it", routes: ["Rome-Milan", "Naples-Genoa", "Florence-Venice"], cargoTypes: ["Olive Oil", "Fashion", "Wine", "Artworks"], shipmentTypes: ["Ship", "Road"], rating: 4.6, established: 1996, verified: true, coverage: "Italy", maxCoverage: "$10M USD", claimSettlement: "92%" },
{
    id: 25,
    name: "Spanish Iberian Transport",
    website: "https://spanishiberiantransport.es",
    contact: "+34-91-234-5678",
    email: "support@spanishiberiantransport.es",
    routes: ["Madrid-Barcelona", "Seville-Valencia", "Bilbao-Málaga"],
    cargoTypes: ["Fruits", "Wine", "Ceramics", "Textiles"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.4,
    established: 2004,
    verified: true,
    coverage: "Spain",
    maxCoverage: "$8M USD",
    claimSettlement: "91%"
  },
  {
    id: 26,
    name: "Netherlands Delta Freight",
    website: "https://netherlandsdeltafreight.nl",
    contact: "+31-20-1234567",
    email: "info@netherlandsdeltafreight.nl",
    routes: ["Amsterdam-Rotterdam", "The Hague-Utrecht", "Eindhoven-Groningen"],
    cargoTypes: ["Electronics", "Machinery", "Flowers", "Pharmaceuticals"],
    shipmentTypes: ["Ship", "Road", "Rail"],
    rating: 4.7,
    established: 1993,
    verified: true,
    coverage: "Netherlands",
    maxCoverage: "$12M USD",
    claimSettlement: "96%"
  },
  {
    id: 27,
    name: "Swiss Alpine Cargo",
    website: "https://swissalpinecargo.ch",
    contact: "+41-44-123-4567",
    email: "support@swissalpinecargo.ch",
    routes: ["Zurich-Geneva", "Bern-Lausanne", "Basel-Lucerne"],
    cargoTypes: ["Pharmaceuticals", "Machinery", "Luxury Goods", "Chemicals"],
    shipmentTypes: ["Road", "Rail"],
    rating: 4.8,
    established: 1989,
    verified: true,
    coverage: "Switzerland",
    maxCoverage: "$15M USD",
    claimSettlement: "97%"
  },
  {
    id: 28,
    name: "Singapore Maritime Assurance",
    website: "https://singaporemaritimeassurance.sg",
    contact: "+65-6221-3344",
    email: "claims@singaporemaritimeassurance.sg",
    routes: ["Singapore-Jakarta", "Singapore-Ho Chi Minh", "Singapore-Manila"],
    cargoTypes: ["Electronics", "Textiles", "Chemicals", "Automotive Parts"],
    shipmentTypes: ["Ship", "Air"],
    rating: 4.6,
    established: 2005,
    verified: true,
    coverage: "Southeast Asia",
    maxCoverage: "$10M USD",
    claimSettlement: "93%"
  },
  {
    id: 29,
    name: "Korean Peninsula Cargo Shield",
    website: "https://koreancargoshield.kr",
    contact: "+82-2-1234-5678",
    email: "support@koreancargoshield.kr",
    routes: ["Seoul-Busan", "Incheon-Daegu", "Gwangju-Daejeon"],
    cargoTypes: ["Electronics", "Automobiles", "Textiles", "Machinery"],
    shipmentTypes: ["Ship", "Road", "Air"],
    rating: 4.7,
    established: 2000,
    verified: true,
    coverage: "Korea",
    maxCoverage: "$12M USD",
    claimSettlement: "95%"
  },
  {
    id: 30,
    name: "New Zealand Coastal Freight",
    website: "https://nzcoastalfreight.nz",
    contact: "+64-9-123-4567",
    email: "info@nzcoastalfreight.nz",
    routes: ["Auckland-Wellington", "Christchurch-Dunedin", "Hamilton-Napier"],
    cargoTypes: ["Agricultural Products", "Dairy", "Electronics", "Machinery"],
    shipmentTypes: ["Ship", "Road"],
    rating: 4.5,
    established: 2008,
    verified: true,
    coverage: "New Zealand",
    maxCoverage: "$7M USD",
    claimSettlement: "90%"
  },
  {
    id: 31,
    name: "Argentina Pampas Logistics",
    website: "https://argentinapampaslogistics.ar",
    contact: "+54-11-1234-5678",
    email: "support@argentinapampaslogistics.ar",
    routes: ["Buenos Aires-Cordoba", "Rosario-Mendoza", "La Plata-Salta"],
    cargoTypes: ["Grains", "Meat", "Wine", "Machinery"],
    shipmentTypes: ["Road", "Rail"],
    rating: 4.4,
    established: 2010,
    verified: true,
    coverage: "Argentina",
    maxCoverage: "$6M USD",
    claimSettlement: "88%"
  },
  {
    id: 32,
    name: "Chile Pacific Freight",
    website: "https://chilepacificfreight.cl",
    contact: "+56-2-1234-5678",
    email: "info@chilepacificfreight.cl",
    routes: ["Santiago-Valparaiso", "Concepcion-Antofagasta", "La Serena-Iquique"],
    cargoTypes: ["Copper", "Wine", "Fruit", "Electronics"],
    shipmentTypes: ["Ship", "Road"],
    rating: 4.6,
    established: 2004,
    verified: true,
    coverage: "Chile",
    maxCoverage: "$9M USD",
    claimSettlement: "92%"
  },
  {
    id: 33,
    name: "Vietnam Mekong Freight",
    website: "https://vietnammekongfreight.vn",
    contact: "+84-24-1234-5678",
    email: "support@vietnammekongfreight.vn",
    routes: ["Ho Chi Minh-Hanoi", "Da Nang-Hue", "Can Tho-Phnom Penh"],
    cargoTypes: ["Rice", "Coffee", "Electronics", "Textiles"],
    shipmentTypes: ["Road", "Ship", "Air"],
    rating: 4.5,
    established: 2011,
    verified: true,
    coverage: "Vietnam",
    maxCoverage: "$7M USD",
    claimSettlement: "90%"
  },
  {
    id: 34,
    name: "Egypt Nile Logistics",
    website: "https://egyptnilelogistics.eg",
    contact: "+20-2-12345678",
    email: "info@egyptnilelogistics.eg",
    routes: ["Cairo-Alexandria", "Luxor-Aswan", "Suez-Port Said"],
    cargoTypes: ["Cotton", "Textiles", "Chemicals", "Machinery"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.3,
    established: 2003,
    verified: true,
    coverage: "Egypt",
    maxCoverage: "$6M USD",
    claimSettlement: "89%"
  },
  {
    id: 35,
    name: "Moroccan Atlas Freight",
    website: "https://moroccanatlasfreight.ma",
    contact: "+212-5-1234-5678",
    email: "support@moroccanatlasfreight.ma",
    routes: ["Casablanca-Rabat", "Marrakech-Fes", "Tangier-Agadir"],
    cargoTypes: ["Phosphates", "Textiles", "Electronics", "Food Products"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.4,
    established: 2012,
    verified: true,
    coverage: "Morocco",
    maxCoverage: "$5M USD",
    claimSettlement: "90%"
  },
  {
    id: 36,
    name: "Saudi Desert Logistics",
    website: "https://saudidesertlogistics.sa",
    contact: "+966-11-123-4567",
    email: "info@saudidesertlogistics.sa",
    routes: ["Riyadh-Jeddah", "Dammam-Medina", "Mecca-Taif"],
    cargoTypes: ["Oil Derivatives", "Construction Materials", "Electronics", "Textiles"],
    shipmentTypes: ["Road", "Air"],
    rating: 4.6,
    established: 2006,
    verified: true,
    coverage: "Saudi Arabia",
    maxCoverage: "$11M USD",
    claimSettlement: "93%"
  },
  {
    id: 37,
    name: "UAE Gulf Cargo Solutions",
    website: "https://uaegulfcargosolutions.ae",
    contact: "+971-4-123-4567",
    email: "support@uaegulfcargosolutions.ae",
    routes: ["Dubai-Abu Dhabi", "Sharjah-Fujairah", "Ras Al Khaimah-Ajman"],
    cargoTypes: ["Electronics", "Textiles", "Luxury Goods", "Machinery"],
    shipmentTypes: ["Road", "Air", "Ship"],
    rating: 4.7,
    established: 2010,
    verified: true,
    coverage: "UAE",
    maxCoverage: "$10M USD",
    claimSettlement: "94%"
  },
  {
    id: 38,
    name: "Pakistan Indus Freight",
    website: "https://pakistanindusfreight.pk",
    contact: "+92-21-1234567",
    email: "info@pakistanindusfreight.pk",
    routes: ["Karachi-Lahore", "Islamabad-Peshawar", "Multan-Quetta"],
    cargoTypes: ["Textiles", "Agricultural Goods", "Electronics", "Machinery"],
    shipmentTypes: ["Road", "Rail"],
    rating: 4.3,
    established: 2005,
    verified: true,
    coverage: "Pakistan",
    maxCoverage: "$7M USD",
    claimSettlement: "88%"
  },
  {
    id: 39,
    name: "Bangladesh Delta Cargo",
    website: "https://bangladeshdeltacargo.bd",
    contact: "+880-2-12345678",
    email: "support@bangladeshdeltacargo.bd",
    routes: ["Dhaka-Chittagong", "Khulna-Rajshahi", "Sylhet-Barisal"],
    cargoTypes: ["Textiles", "Jute", "Electronics", "Food Products"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.2,
    established: 2011,
    verified: true,
    coverage: "Bangladesh",
    maxCoverage: "$5M USD",
    claimSettlement: "87%"
  },
  {
    id: 40,
    name: "Indonesia Archipelago Freight",
    website: "https://indonesiaarchipelagofreight.id",
    contact: "+62-21-1234-5678",
    email: "info@indonesiaarchipelagofreight.id",
    routes: ["Jakarta-Bali", "Surabaya-Makassar", "Medan-Pontianak"],
    cargoTypes: ["Electronics", "Textiles", "Palm Oil", "Coffee"],
    shipmentTypes: ["Ship", "Air", "Road"],
    rating: 4.5,
    established: 2008,
    verified: true,
    coverage: "Indonesia",
    maxCoverage: "$8M USD",
    claimSettlement: "91%"
  },
  {
    id: 41,
    name: "Philippines Luzon Cargo",
    website: "https://philippinesluzoncargo.ph",
    contact: "+63-2-123-4567",
    email: "support@philippinesluzoncargo.ph",
    routes: ["Manila-Cebu", "Davao-Quezon City", "Iloilo-Cagayan"],
    cargoTypes: ["Electronics", "Fruits", "Textiles", "Machinery"],
    shipmentTypes: ["Ship", "Air", "Road"],
    rating: 4.4,
    established: 2013,
    verified: true,
    coverage: "Philippines",
    maxCoverage: "$7M USD",
    claimSettlement: "90%"
  },
  {
    id: 42,
    name: "Thailand Chao Phraya Freight",
    website: "https://thailandchaophrayafreight.th",
    contact: "+66-2-123-4567",
    email: "info@thailandchaophrayafreight.th",
    routes: ["Bangkok-Chiang Mai", "Phuket-Khon Kaen", "Pattaya-Hat Yai"],
    cargoTypes: ["Rice", "Electronics", "Textiles", "Rubber"],
    shipmentTypes: ["Road", "Ship", "Air"],
    rating: 4.6,
    established: 2009,
    verified: true,
    coverage: "Thailand",
    maxCoverage: "$9M USD",
    claimSettlement: "92%"
  },
  {
    id: 43,
    name: "Malaysia Borneo Cargo",
    website: "https://malaysiaborneocargo.my",
    contact: "+60-3-1234-5678",
    email: "support@malaysiaborneocargo.my",
    routes: ["Kuala Lumpur-Sabah", "Kuching-Selangor", "Penang-Labuan"],
    cargoTypes: ["Palm Oil", "Electronics", "Textiles", "Machinery"],
    shipmentTypes: ["Ship", "Air", "Road"],
    rating: 4.5,
    established: 2012,
    verified: true,
    coverage: "Malaysia",
    maxCoverage: "$8M USD",
    claimSettlement: "91%"
  },
  {
    id: 44,
    name: "Pakistan Karachi Maritime",
    website: "https://pakistankarachimaritime.pk",
    contact: "+92-21-9876-5432",
    email: "info@pakistankarachimaritime.pk",
    routes: ["Karachi-Quetta", "Karachi-Lahore", "Karachi-Islamabad"],
    cargoTypes: ["Textiles", "Electronics", "Machinery", "Oil Products"],
    shipmentTypes: ["Ship", "Road"],
    rating: 4.3,
    established: 2006,
    verified: true,
    coverage: "Pakistan",
    maxCoverage: "$6M USD",
    claimSettlement: "89%"
  },
  {
    id: 45,
    name: "Nigeria Coastal Cargo",
    website: "https://nigeriacoastalcargo.ng",
    contact: "+234-1-2345678",
    email: "support@nigeriacoastalcargo.ng",
    routes: ["Lagos-Abuja", "Port Harcourt-Kano", "Ibadan-Enugu"],
    cargoTypes: ["Oil", "Textiles", "Agricultural Products", "Machinery"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.2,
    established: 2011,
    verified: true,
    coverage: "Nigeria",
    maxCoverage: "$5M USD",
    claimSettlement: "88%"
  },
  {
    id: 46,
    name: "Kenya Rift Valley Freight",
    website: "https://kenyariftvalleyfreight.ke",
    contact: "+254-20-1234567",
    email: "info@kenyariftvalleyfreight.ke",
    routes: ["Nairobi-Mombasa", "Nakuru-Eldoret", "Kisumu-Naivasha"],
    cargoTypes: ["Coffee", "Tea", "Textiles", "Machinery"],
    shipmentTypes: ["Road", "Rail"],
    rating: 4.4,
    established: 2008,
    verified: true,
    coverage: "Kenya",
    maxCoverage: "$6M USD",
    claimSettlement: "90%"
  },
  {
    id: 47,
    name: "Peru Andes Freight",
    website: "https://peruandesfreight.pe",
    contact: "+51-1-1234567",
    email: "support@peruandesfreight.pe",
    routes: ["Lima-Cusco", "Arequipa-Trujillo", "Iquitos-Chiclayo"],
    cargoTypes: ["Coffee", "Fruits", "Machinery", "Textiles"],
    shipmentTypes: ["Road", "Air"],
    rating: 4.3,
    established: 2010,
    verified: true,
    coverage: "Peru",
    maxCoverage: "$7M USD",
    claimSettlement: "89%"
  },
  {
    id: 48,
    name: "Colombia Andes Logistics",
    website: "https://colombiaandeslogistics.co",
    contact: "+57-1-2345678",
    email: "info@colombiaandeslogistics.co",
    routes: ["Bogota-Medellin", "Cali-Barranquilla", "Cartagena-Bucaramanga"],
    cargoTypes: ["Coffee", "Textiles", "Electronics", "Machinery"],
    shipmentTypes: ["Road", "Air", "Ship"],
    rating: 4.5,
    established: 2007,
    verified: true,
    coverage: "Colombia",
    maxCoverage: "$8M USD",
    claimSettlement: "91%"
  },
  {
    id: 49,
    name: "Venezuela Coastal Logistics",
    website: "https://venezuela-coastallogistics.ve",
    contact: "+58-212-1234567",
    email: "support@venezuela-coastallogistics.ve",
    routes: ["Caracas-Maracaibo", "Valencia-Barinas", "Puerto La Cruz-Cumana"],
    cargoTypes: ["Oil", "Electronics", "Food Products", "Machinery"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.2,
    established: 2012,
    verified: true,
    coverage: "Venezuela",
    maxCoverage: "$5M USD",
    claimSettlement: "87%"
  },
  {
    id: 50,
    name: "Iceland Arctic Freight",
    website: "https://icelandarcticfreight.is",
    contact: "+354-123-4567",
    email: "info@icelandarcticfreight.is",
    routes: ["Reykjavik-Akureyri", "Keflavik-Isafjordur", "Husavik-Egilsstadir"],
    cargoTypes: ["Seafood", "Machinery", "Chemicals", "Electronics"],
    shipmentTypes: ["Ship", "Air"],
    rating: 4.8,
    established: 1995,
    verified: true,
    coverage: "Iceland",
    maxCoverage: "$14M USD",
    claimSettlement: "97%"
  },
  {
    id: 51,
    name: "Greenland Ice Freight",
    website: "https://greenlandicefreight.gl",
    contact: "+299-123-456",
    email: "support@greenlandicefreight.gl",
    routes: ["Nuuk-Ilulissat", "Sisimiut-Kangerlussuaq", "Tasiilaq-Qaqortoq"],
    cargoTypes: ["Fish", "Machinery", "Medical Supplies", "Electronics"],
    shipmentTypes: ["Ship", "Air"],
    rating: 4.6,
    established: 2001,
    verified: true,
    coverage: "Greenland",
    maxCoverage: "$12M USD",
    claimSettlement: "94%"
  },
  {
    id: 52,
    name: "Iraqi Tigris Freight",
    website: "https://iraqitigrisfreight.iq",
    contact: "+964-1-123-4567",
    email: "info@iraqitigrisfreight.iq",
    routes: ["Baghdad-Basra", "Mosul-Erbil", "Karbala-Najaf"],
    cargoTypes: ["Oil", "Construction Materials", "Electronics", "Textiles"],
    shipmentTypes: ["Road", "Ship"],
    rating: 4.3,
    established: 2005,
    verified: true,
    coverage: "Iraq",
    maxCoverage: "$7M USD",
    claimSettlement: "88%"
  },
  {
    id: 53,
    name: "Iran Caspian Freight",
    website: "https://irancaspianfreight.ir",
    contact: "+98-21-1234-5678",
    email: "support@irancaspianfreight.ir",
    routes: ["Tehran-Tabriz", "Mashhad-Isfahan", "Shiraz-Kermanshah"],
    cargoTypes: ["Oil", "Textiles", "Machinery", "Electronics"],
    shipmentTypes: ["Road", "Rail", "Ship"],
    rating: 4.4,
    established: 2003,
    verified: true,
    coverage: "Iran",
    maxCoverage: "$8M USD",
    claimSettlement: "90%"
  },
  {
    id: 54,
    name: "Iraq Basra Coastal Freight",
    website: "https://iraqbasracoastalfreight.iq",
    contact: "+964-40-123-4567",
    email: "info@iraqbasracoastalfreight.iq",
    routes: ["Basra-Baghdad", "Basra-Kirkuk", "Basra-Najaf"],
    cargoTypes: ["Oil", "Chemicals", "Machinery", "Textiles"],
    shipmentTypes: ["Ship", "Road"],
    rating: 4.2,
    established: 2010,
    verified: true,
    coverage: "Iraq",
    maxCoverage: "$6M USD",
    claimSettlement: "87%"
  },
  {
    id: 55,
    name: "Kazakhstan Steppe Logistics",
    website: "https://kazakhstansteppelogistics.kz",
    contact: "+7-727-123-4567",
    email: "support@kazakhstansteppelogistics.kz",
    routes: ["Almaty-Astana", "Shymkent-Karaganda", "Pavlodar-Aktobe"],
    cargoTypes: ["Oil", "Machinery", "Grains", "Textiles"],
    shipmentTypes: ["Road", "Rail"],
    rating: 4.5,
    established: 2006,
    verified: true,
    coverage: "Kazakhstan",
    maxCoverage: "$9M USD",
    claimSettlement: "91%"
  },
  {
    id: 56,
    name: "Uzbekistan Silk Route Freight",
    website: "https://uzbekistansilkroutefreight.uz",
    contact: "+998-71-123-4567",
    email: "info@uzbekistansilkroutefreight.uz",
    routes: ["Tashkent-Samarkand", "Bukhara-Khiva", "Fergana-Andijan"],
    cargoTypes: ["Textiles", "Machinery", "Agricultural Products", "Electronics"],
    shipmentTypes: ["Road", "Rail"],
    rating: 4.6,
    established: 2009,
    verified: true,
    coverage: "Uzbekistan",
    maxCoverage: "$10M USD",
    claimSettlement: "92%"
  }
];

// Generate additional mock companies to reach a total of 400



const namePrefixes = ["Apex", "Global", "Summit", "Zenith", "Horizon", "Pinnacle", "Keystone", "Nexus", "Quantum", "Stellar", "Titan", "Vertex", "Aegis", "Orion", "Meridian", "Cascade", "Pioneer", "Dynamic"];
const nameMiddles = ["Logistics", "Cargo", "Freight", "Shipping", "Marine", "Transit", "Haulage", "Express", "Movers", "Carriers", "Forwarding", "Transport", "Maritime", "Aviation", "Rail"];
const nameSuffixes = ["Group", "Solutions", "International", "LLC", "Corp", "Inc.", "Global", "Partners", "Shield", "Secure", "Assured", "Guaranty", "Cover", "Risk Management"];
const coverages = ["Global", "North America", "South America", "Europe", "Asia-Pacific", "Africa", "Middle East", "Europe-Asia", "Trans-Atlantic", "Trans-Pacific", "Intra-Asia", "Americas"];

for (let i = 7; i <= 406; i++) {
  const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
  const middle = nameMiddles[Math.floor(Math.random() * nameMiddles.length)];
  const suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
  
  const name = `${prefix} ${middle} ${suffix}`;
  const webName = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);

  const company = {
    id: i,
    name: name,
    website: `https://${webName}.com`,
    contact: `+${Math.floor(Math.random() * 90) + 1}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    email: `${['info', 'support', 'contact', 'claims'][Math.floor(Math.random() * 4)]}@${webName}.com`,
    routes: getRandomSubset(popularRoutes, 5),
    cargoTypes: getRandomSubset(cargoTypes, 8),
    shipmentTypes: getRandomSubset(shipmentTypes.map(s => s.value), 3),
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    established: Math.floor(Math.random() * 40) + 1980,
    verified: Math.random() > 0.1, // 90% chance of being verified
    coverage: coverages[Math.floor(Math.random() * coverages.length)],
    maxCoverage: `$${Math.floor(Math.random() * 20) + 2}M USD`,
    claimSettlement: `${Math.floor(Math.random() * 15) + 85}%`
  };

  if (company.routes.length === 0) company.routes.push(popularRoutes[Math.floor(Math.random() * popularRoutes.length)]);
  if (company.cargoTypes.length === 0) company.cargoTypes.push(cargoTypes[Math.floor(Math.random() * cargoTypes.length)]);
  if (company.shipmentTypes.length === 0) company.shipmentTypes.push(shipmentTypes[Math.floor(Math.random() * shipmentTypes.length)].value);
  
  mockCompanies.push(company);
}

function SurakshitSafar() {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [departurePort, setDeparturePort] = useState("");
  const [arrivalPort, setArrivalPort] = useState("");
  const [selectedCargoType, setSelectedCargoType] = useState("");
  const [selectedShipmentType, setSelectedShipmentType] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(mockCompanies);
  
  // UI states
  const [showAddCompanyForm, setShowAddCompanyForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState("search");

  // Add Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: "",
    website: "",
    contact: "",
    email: "",
    routes: [],
    cargoTypes: [],
    shipmentTypes: [],
    description: ""
  });

  // Admin Login State
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  });

  // Filter companies based on search criteria
  useEffect(() => {
    let filtered = mockCompanies;
    
    // Search by name
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.coverage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by route (departure and arrival)
    if (departurePort || arrivalPort) {
      filtered = filtered.filter(company =>
        company.routes.some(route => {
          const [dep, arr] = route.split('-');
          const matchesDeparture = !departurePort || dep.toLowerCase().includes(departurePort.toLowerCase());
          const matchesArrival = !arrivalPort || arr.toLowerCase().includes(arrivalPort.toLowerCase());
          return matchesDeparture && matchesArrival;
        })
      );
    }
    
    // Filter by cargo type
    if (selectedCargoType) {
      filtered = filtered.filter(company =>
        company.cargoTypes.includes(selectedCargoType)
      );
    }
    
    // Filter by shipment type
    if (selectedShipmentType) {
      filtered = filtered.filter(company =>
        company.shipmentTypes.includes(selectedShipmentType)
      );
    }
    
    setFilteredCompanies(filtered);
  }, [searchTerm, departurePort, arrivalPort, selectedCargoType, selectedShipmentType]);

  const handleCompanyClick = (company) => {
    console.log('Company clicked:', company.name);
    window.open(company.website, '_blank');
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    // In a real app, you would handle payment processing here
    alert(`Company "${companyForm.name}" submitted for approval! Payment of ₹15,000 will be processed.`);
    setShowAddCompanyForm(false);
    setCompanyForm({
      name: "",
      website: "",
      contact: "",
      email: "",
      routes: [],
      cargoTypes: [],
      shipmentTypes: [],
      description: ""
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.username === "admin" && adminCredentials.password === "admin123") {
      alert("Admin login successful! Redirecting to dashboard...");
      setShowAdminLogin(false);
    } else {
      alert("Invalid credentials. Use admin/admin123");
    }
  };

  const CompanyCard = ({ company }) => (
    <div className="bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-blue-500 group cursor-pointer overflow-hidden"
         onClick={() => handleCompanyClick(company)}>
      {/* Header with gradient */}
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
                {company.verified && (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                )}
              </div>
            </div>
          </div>
          <ExternalLink className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
        </div>
      </div>

      <div className="p-6">
        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < Math.floor(company.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
            ))}
            <span className="text-sm text-gray-300 ml-2">{company.rating}</span>
          </div>
          <span className="text-xs text-gray-500">Est. {company.established}</span>
        </div>

        {/* Key Metrics */}
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
        
        {/* Shipment Types */}
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

        {/* Popular Routes */}
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
        
        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">{company.contact}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">{company.email}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
          <span>Get Quote</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SurakshitSafar
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView("search")}
                className={`font-medium transition-colors ${currentView === "search" ? "text-blue-400" : "text-gray-300 hover:text-white"}`}
              >
                Search Insurance
              </button>
              <button 
                onClick={() => setShowAddCompanyForm(true)}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                List Your Company
              </button>
              <span className="text-gray-500 font-medium">Compare (Coming Soon)</span>
              <button 
                onClick={() => setShowAdminLogin(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin</span>
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Secure Your Cargo Journey
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Find the perfect insurance coverage for your shipments worldwide
            </p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Verified Providers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Secure Coverage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Global Routes</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              Find Insurance for Your Route
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* General Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Departure Port */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Departure port..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  value={departurePort}
                  onChange={(e) => setDeparturePort(e.target.value)}
                />
              </div>
              
              {/* Arrival Port */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Arrival port..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  value={arrivalPort}
                  onChange={(e) => setArrivalPort(e.target.value)}
                />
              </div>
              
              {/* Cargo Type */}
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                  value={selectedCargoType}
                  onChange={(e) => setSelectedCargoType(e.target.value)}
                >
                  <option value="">All Cargo Types</option>
                  {cargoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              {/* Transport Method */}
              <div className="relative">
                <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none"
                  value={selectedShipmentType}
                  onChange={(e) => setSelectedShipmentType(e.target.value)}
                >
                  <option value="">All Transport</option>
                  {shipmentTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.value}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Quick Route Suggestions */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Popular Routes:</p>
              <div className="flex flex-wrap gap-2">
                {popularRoutes.slice(0, 8).map((route) => (
                  <button
                    key={route}
                    onClick={() => {
                      const [dep, arr] = route.split('-');
                      setDeparturePort(dep);
                      setArrivalPort(arr);
                    }}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm text-gray-300 transition-colors"
                  >
                    {route}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || departurePort || arrivalPort || selectedCargoType || selectedShipmentType) && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Search: {searchTerm}</span>
                    <X className="h-4 w-4 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </span>
                )}
                {departurePort && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>From: {departurePort}</span>
                    <X className="h-4 w-4 cursor-pointer" onClick={() => setDeparturePort("")} />
                  </span>
                )}
                {arrivalPort && (
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>To: {arrivalPort}</span>
                    <X className="h-4 w-4 cursor-pointer" onClick={() => setArrivalPort("")} />
                  </span>
                )}
                {selectedCargoType && (
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Cargo: {selectedCargoType}</span>
                    <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedCargoType("")} />
                  </span>
                )}
                {selectedShipmentType && (
                  <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Transport: {selectedShipmentType}</span>
                    <X className="h-4 w-4 cursor-pointer" onClick={() => setSelectedShipmentType("")} />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Insurance Providers ({filteredCompanies.length})
              </h2>
              <p className="text-gray-400 mt-1">
                {filteredCompanies.length === mockCompanies.length 
                  ? "Showing all available providers" 
                  : `Filtered results based on your criteria`
                }
              </p>
            </div>
            <button
              onClick={() => setShowAddCompanyForm(true)}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Add Company</span>
            </button>
          </div>
          
          {filteredCompanies.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-800 p-8 rounded-full inline-block mb-4">
                <AlertCircle className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search criteria or explore different routes.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDeparturePort("");
                  setArrivalPort("");
                  setSelectedCargoType("");
                  setSelectedShipmentType("");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Company Form Modal */}
      {showAddCompanyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Add Insurance Company</h3>
                <button
                  onClick={() => setShowAddCompanyForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Listing fee: ₹15,000 (One-time payment required after form submission)
              </p>
            </div>
            <form onSubmit={handleAddCompany} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={companyForm.contact}
                    onChange={(e) => setCompanyForm({...companyForm, contact: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Transport Methods (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {shipmentTypes.map((type) => (
                    <label key={type.value} className="flex items-center space-x-2 cursor-pointer bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                      <input
                        type="checkbox"
                        value={type.value}
                        checked={companyForm.shipmentTypes.includes(type.value)}
                        onChange={(e) => {
                          const types = companyForm.shipmentTypes;
                          if (e.target.checked) {
                            setCompanyForm({...companyForm, shipmentTypes: [...types, type.value]});
                          } else {
                            setCompanyForm({...companyForm, shipmentTypes: types.filter(t => t !== type.value)});
                          }
                        }}
                        className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                      />
                      <type.icon className={`h-4 w-4 ${type.color}`} />
                      <span className="text-sm text-gray-300">{type.value}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cargo Types Covered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-gray-900 rounded-md">
                  {cargoTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={companyForm.cargoTypes.includes(type)}
                        onChange={(e) => {
                          const types = companyForm.cargoTypes;
                          if (e.target.checked) {
                            setCompanyForm({...companyForm, cargoTypes: [...types, type]});
                          } else {
                            setCompanyForm({...companyForm, cargoTypes: types.filter(t => t !== type)});
                          }
                        }}
                        className="rounded border-gray-500 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Coverage Routes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={companyForm.routes.join(', ')}
                  onChange={(e) => setCompanyForm({...companyForm, routes: e.target.value.split(', ').filter(r => r.trim())})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="e.g., Mumbai-Singapore, Delhi-London"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company Description
                </label>
                <textarea
                  rows={3}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Brief description of your insurance services..."
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-gray-800 py-4 -mx-6 px-6">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyForm(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors"
                >
                  Submit & Pay ₹15,000
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Admin Login</h3>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Enter admin username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  placeholder="Enter admin password"
                />
              </div>
              <div className="text-xs text-gray-400 bg-gray-700 p-3 rounded-lg">
                <p><strong>Demo Credentials:</strong></p>
                <p>Username: admin</p>
                <p>Password: admin123</p>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SurakshitSafar</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted platform for finding reliable cargo insurance companies worldwide. 
                Secure your shipments with verified insurance providers.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Globe className="h-5 w-5 text-green-400" />
                </div>
                <div className="bg-gray-800 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Marine Insurance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Air Cargo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Road Transport</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rail Freight</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                © 2024 SurakshitSafar. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-sm text-gray-500">Secure payments powered by</span>
                <div className="flex space-x-2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Razorpay
                  </div>
                  <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    UPI
                  </div>
                  <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    Cards
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SurakshitSafar;
