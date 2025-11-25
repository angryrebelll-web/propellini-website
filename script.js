class CarWrappingCalculator {
  constructor() {
    this.selectedClass = null; // Класс выбирается после бренда
    this.selectedBrand = null;
    this.selectedModel = null;
    this.selectedZones = new Set();
    // Сначала создаем расширенную базу данных в новом формате
    this.expandedCarDatabase = this.initializeExpandedCarDatabase();
    // Затем преобразуем её в старый формат для обратной совместимости
    this.carDatabase = this.convertToLegacyFormat(this.expandedCarDatabase);
    this.zonesDatabase = this.initializeZonesDatabase();
    this.allBrands = this.getAllBrands(); // Все бренды из всех классов
    this.cache();
    this.init();
    
    // Обработчик сообщений для сброса калькулятора
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'resetCalculator') {
        this.reset();
      }
    });
  }
  
  // Новая расширенная база данных в формате: { brand: "BMW", models: [{ name: "X5", class: "suv-lux" }] }
  initializeExpandedCarDatabase() {
    return [
      {
        brand: "Audi",
        models: [
          { name: "A1", class: "small" },
          { name: "A3", class: "small" },
          { name: "A4", class: "small" },
          { name: "A5", class: "small" },
          { name: "A6", class: "small" },
          { name: "A7", class: "business" },
          { name: "A8", class: "business" },
          { name: "Q2", class: "business" },
          { name: "Q3", class: "business" },
          { name: "Q5", class: "business" },
          { name: "Q7", class: "suv-lux" },
          { name: "Q8", class: "suv-lux" },
          { name: "R8", class: "suv-lux" },
          { name: "TT", class: "small" },
          { name: "e-tron", class: "suv-lux" },
          { name: "e-tron GT", class: "business" }
        ]
      },
      {
        brand: "BMW",
        models: [
          { name: "1 Series", class: "small" },
          { name: "2 Series", class: "small" },
          { name: "3 Series", class: "small" },
          { name: "4 Series", class: "small" },
          { name: "5 Series", class: "small" },
          { name: "6 Series", class: "business" },
          { name: "6 GT", class: "business" },
          { name: "7 Series", class: "business" },
          { name: "8 Series", class: "suv-lux" },
          { name: "X1", class: "business" },
          { name: "X2", class: "business" },
          { name: "X3", class: "business" },
          { name: "X4", class: "business" },
          { name: "X5", class: "suv-lux" },
          { name: "X6", class: "suv-lux" },
          { name: "X7", class: "bus" },
          { name: "X18", class: "business" },
          { name: "Z4", class: "small" },
          { name: "i3", class: "small" },
          { name: "i4", class: "small" },
          { name: "iX", class: "suv-lux" },
          { name: "M3", class: "small" },
          { name: "M4", class: "small" },
          { name: "M5", class: "business" },
          { name: "M8", class: "suv-lux" }
        ]
      },
      {
        brand: "Mercedes-Benz",
        models: [
          { name: "A-Class", class: "small" },
          { name: "B-Class", class: "small" },
          { name: "C-Class", class: "small" },
          { name: "CLK", class: "small" },
          { name: "CLS", class: "business" },
          { name: "E-Class", class: "small" },
          { name: "S-Class", class: "business" },
          { name: "S-Coupe", class: "business" },
          { name: "SL", class: "small" },
          { name: "SLK", class: "small" },
          { name: "SLS", class: "suv-lux" },
          { name: "AMG GT", class: "suv-lux" },
          { name: "GLA", class: "business" },
          { name: "GLB", class: "business" },
          { name: "GLC", class: "business" },
          { name: "GLE", class: "suv-lux" },
          { name: "GLK", class: "business" },
          { name: "GLS", class: "bus" },
          { name: "G-Class", class: "bus" },
          { name: "R-Class", class: "suv-lux" },
          { name: "Viano", class: "bus" },
          { name: "Vito", class: "bus" },
          { name: "V-Class", class: "bus" },
          { name: "Maybach S-Class", class: "suv-lux" }
        ]
      },
      {
        brand: "Toyota",
        models: [
          { name: "Camry", class: "small" },
          { name: "Corolla", class: "small" },
          { name: "Prius", class: "small" },
          { name: "Auris", class: "small" },
          { name: "Avensis", class: "small" },
          { name: "GT86", class: "small" },
          { name: "GT", class: "small" },
          { name: "RAV4", class: "business" },
          { name: "Highlander", class: "suv-lux" },
          { name: "Land Cruiser", class: "suv-lux" },
          { name: "Land Cruiser Prado", class: "suv-lux" },
          { name: "Prado", class: "suv-lux" },
          { name: "Hilux", class: "pickup" },
          { name: "Tundra", class: "pickup" },
          { name: "Sequoia", class: "bus" },
          { name: "Alphard", class: "bus" },
          { name: "Vellfire", class: "bus" },
          { name: "Hiace", class: "bus" }
        ]
      },
      {
        brand: "Lexus",
        models: [
          { name: "IS", class: "small" },
          { name: "ES", class: "small" },
          { name: "GS", class: "small" },
          { name: "LS", class: "business" },
          { name: "LC", class: "business" },
          { name: "RC", class: "small" },
          { name: "NX", class: "business" },
          { name: "RX", class: "suv-lux" },
          { name: "GX", class: "suv-lux" },
          { name: "LX", class: "bus" },
          { name: "UX", class: "business" }
        ]
      },
      {
        brand: "Porsche",
        models: [
          { name: "718 Boxster", class: "small" },
          { name: "718 Cayman", class: "small" },
          { name: "Boxter", class: "small" },
          { name: "Cayman", class: "small" },
          { name: "911", class: "business" },
          { name: "Panamera", class: "business" },
          { name: "Macan", class: "business" },
          { name: "Cayenne", class: "suv-lux" },
          { name: "Taycan", class: "business" },
          { name: "918", class: "small" }
        ]
      },
      {
        brand: "Volkswagen",
        models: [
          { name: "Polo", class: "small" },
          { name: "Jetta", class: "small" },
          { name: "Passat", class: "small" },
          { name: "CC", class: "small" },
          { name: "Arteon", class: "business" },
          { name: "Caddy", class: "small" },
          { name: "Touareg", class: "suv-lux" },
          { name: "Tiguan", class: "business" },
          { name: "T-Cross", class: "business" },
          { name: "T-Roc", class: "business" },
          { name: "Multivan", class: "bus" },
          { name: "Caravelle", class: "bus" },
          { name: "ID.3", class: "small" },
          { name: "ID.4", class: "business" }
        ]
      },
      {
        brand: "Ford",
        models: [
          { name: "Focus", class: "small" },
          { name: "Mondeo", class: "small" },
          { name: "Mustang", class: "small" },
          { name: "Fiesta", class: "small" },
          { name: "Fusion", class: "small" },
          { name: "Kuga", class: "business" },
          { name: "Edge", class: "business" },
          { name: "Explorer", class: "suv-lux" },
          { name: "Expedition", class: "bus" },
          { name: "Galaxy", class: "suv-lux" },
          { name: "S-max", class: "suv-lux" },
          { name: "F-150", class: "pickup" },
          { name: "Ranger", class: "pickup" },
          { name: "Bronco", class: "suv-lux" },
          { name: "Escape", class: "business" }
        ]
      },
      {
        brand: "Hyundai",
        models: [
          { name: "Elantra", class: "small" },
          { name: "Sonata", class: "small" },
          { name: "NF", class: "small" },
          { name: "140", class: "small" },
          { name: "Genesis", class: "small" },
          { name: "Accent", class: "small" },
          { name: "i30", class: "small" },
          { name: "i40", class: "small" },
          { name: "Tucson", class: "business" },
          { name: "Santa Fe", class: "business" },
          { name: "IX 35", class: "business" },
          { name: "Santa Fe Grand", class: "suv-lux" },
          { name: "Equus", class: "suv-lux" },
          { name: "Palisade", class: "bus" },
          { name: "Kona", class: "business" },
          { name: "Venue", class: "business" },
          { name: "Ioniq", class: "small" },
          { name: "Nexo", class: "suv-lux" }
        ]
      },
      {
        brand: "Kia",
        models: [
          { name: "Rio", class: "small" },
          { name: "Cerato", class: "small" },
          { name: "Optima", class: "small" },
          { name: "Stinger", class: "small" },
          { name: "K5", class: "small" },
          { name: "Sportage", class: "business" },
          { name: "Sorento", class: "suv-lux" },
          { name: "Mohave", class: "suv-lux" },
          { name: "Quoris", class: "suv-lux" },
          { name: "Soul", class: "small" },
          { name: "Picanto", class: "small" },
          { name: "Telluride", class: "bus" },
          { name: "Seltos", class: "business" },
          { name: "EV6", class: "business" }
        ]
      },
      {
        brand: "Nissan",
        models: [
          { name: "Almera", class: "small" },
          { name: "Sentra", class: "small" },
          { name: "Altima", class: "small" },
          { name: "Teana", class: "small" },
          { name: "Maxima", class: "small" },
          { name: "GTR", class: "small" },
          { name: "370Z", class: "small" },
          { name: "Juke", class: "business" },
          { name: "Qashqai", class: "business" },
          { name: "X-trail", class: "business" },
          { name: "Rogue", class: "business" },
          { name: "Murano", class: "suv-lux" },
          { name: "Pathfinder", class: "suv-lux" },
          { name: "Patrol", class: "suv-lux" },
          { name: "Armada", class: "bus" },
          { name: "Navara", class: "pickup" },
          { name: "Titan", class: "pickup" },
          { name: "Frontier", class: "pickup" },
          { name: "Leaf", class: "small" },
          { name: "Ariya", class: "business" }
        ]
      },
      {
        brand: "Honda",
        models: [
          { name: "Civic", class: "small" },
          { name: "Accord", class: "small" },
          { name: "Insight", class: "small" },
          { name: "CR-V", class: "business" },
          { name: "HR-V", class: "business" },
          { name: "Pilot", class: "suv-lux" },
          { name: "Passport", class: "suv-lux" },
          { name: "Ridgeline", class: "pickup" },
          { name: "Odyssey", class: "bus" },
          { name: "Fit", class: "small" },
          { name: "Prelude", class: "small" }
        ]
      },
      {
        brand: "Mazda",
        models: [
          { name: "Mazda3", class: "small" },
          { name: "Mazda6", class: "small" },
          { name: "CX-3", class: "business" },
          { name: "CX-5", class: "business" },
          { name: "CX-7", class: "suv-lux" },
          { name: "CX-9", class: "suv-lux" },
          { name: "CX-30", class: "business" },
          { name: "CX-50", class: "business" },
          { name: "CX-60", class: "suv-lux" },
          { name: "MX-5", class: "small" }
        ]
      },
      {
        brand: "Subaru",
        models: [
          { name: "Impreza", class: "small" },
          { name: "Legacy", class: "small" },
          { name: "WRX", class: "small" },
          { name: "BRZ", class: "small" },
          { name: "Forester", class: "business" },
          { name: "Outback", class: "business" },
          { name: "Crosstrek", class: "business" },
          { name: "Ascent", class: "suv-lux" }
        ]
      },
      {
        brand: "Mitsubishi",
        models: [
          { name: "Lancer", class: "small" },
          { name: "Mirage", class: "small" },
          { name: "ASX", class: "business" },
          { name: "Outlander", class: "business" },
          { name: "XL", class: "business" },
          { name: "Pajero", class: "suv-lux" },
          { name: "Pajero Sport", class: "suv-lux" },
          { name: "Montero", class: "suv-lux" },
          { name: "Eclipse Cross", class: "business" }
        ]
      },
      {
        brand: "Volvo",
        models: [
          { name: "S40", class: "small" },
          { name: "V40", class: "small" },
          { name: "S60", class: "small" },
          { name: "V60", class: "business" },
          { name: "S90", class: "business" },
          { name: "XC40", class: "business" },
          { name: "XC60", class: "business" },
          { name: "XC70", class: "business" },
          { name: "XC90", class: "suv-lux" },
          { name: "C30", class: "small" },
          { name: "C70", class: "small" }
        ]
      },
      {
        brand: "Skoda",
        models: [
          { name: "Fabia", class: "small" },
          { name: "Rapid", class: "small" },
          { name: "Octavia", class: "small" },
          { name: "Superb", class: "small" },
          { name: "Roomster", class: "small" },
          { name: "Kamiq", class: "business" },
          { name: "Karoq", class: "business" },
          { name: "Kodiaq", class: "suv-lux" },
          { name: "Yeti", class: "business" },
          { name: "Enyaq", class: "business" }
        ]
      },
      {
        brand: "Peugeot",
        models: [
          { name: "208", class: "small" },
          { name: "308", class: "small" },
          { name: "408", class: "small" },
          { name: "508", class: "small" },
          { name: "2008", class: "business" },
          { name: "3008", class: "business" },
          { name: "4008", class: "business" },
          { name: "5008", class: "suv-lux" },
          { name: "Partner", class: "small" }
        ]
      },
      {
        brand: "Renault",
        models: [
          { name: "Clio", class: "small" },
          { name: "Megane", class: "small" },
          { name: "Laguna", class: "small" },
          { name: "Talisman", class: "small" },
          { name: "Duster", class: "small" },
          { name: "Kadjar", class: "business" },
          { name: "Koleos", class: "business" },
          { name: "Arkana", class: "business" },
          { name: "Captur", class: "business" },
          { name: "Kangoo", class: "bus" },
          { name: "Master", class: "bus" }
        ]
      },
      {
        brand: "Jeep",
        models: [
          { name: "Renegade", class: "business" },
          { name: "Compass", class: "business" },
          { name: "Cherokee", class: "business" },
          { name: "Grand Cherokee", class: "suv-lux" },
          { name: "Wrangler", class: "suv-lux" },
          { name: "Gladiator", class: "pickup" },
          { name: "Wagoneer", class: "bus" },
          { name: "Grand Wagoneer", class: "bus" }
        ]
      },
      {
        brand: "Land Rover",
        models: [
          { name: "Discovery Sport", class: "business" },
          { name: "Evoque", class: "business" },
          { name: "Freelander", class: "business" },
          { name: "Discovery", class: "suv-lux" },
          { name: "Defender", class: "suv-lux" },
          { name: "Range Rover Evoque", class: "business" },
          { name: "Range Rover Sport", class: "suv-lux" },
          { name: "Range Rover Velar", class: "suv-lux" },
          { name: "Range Rover", class: "bus" }
        ]
      },
      {
        brand: "Range Rover",
        models: [
          { name: "Evoque", class: "business" },
          { name: "Sport", class: "suv-lux" },
          { name: "Velar", class: "suv-lux" },
          { name: "Range Rover", class: "bus" }
        ]
      },
      {
        brand: "Infiniti",
        models: [
          { name: "Q30", class: "small" },
          { name: "Q50", class: "small" },
          { name: "Q60", class: "small" },
          { name: "Q70", class: "small" },
          { name: "QX30", class: "business" },
          { name: "QX50", class: "business" },
          { name: "QX60", class: "suv-lux" },
          { name: "QX70", class: "suv-lux" },
          { name: "QX80", class: "bus" }
        ]
      },
      {
        brand: "Jaguar",
        models: [
          { name: "XE", class: "suv-lux" },
          { name: "XF", class: "small" },
          { name: "XJ", class: "suv-lux" },
          { name: "XK", class: "suv-lux" },
          { name: "E-type", class: "small" },
          { name: "F-type", class: "small" },
          { name: "S-type", class: "small" },
          { name: "F-Pace", class: "suv-lux" },
          { name: "E-Pace", class: "business" },
          { name: "I-Pace", class: "suv-lux" }
        ]
      },
      {
        brand: "Cadillac",
        models: [
          { name: "ATS", class: "small" },
          { name: "CTS", class: "small" },
          { name: "STS", class: "small" },
          { name: "CT4", class: "small" },
          { name: "CT5", class: "small" },
          { name: "CT6", class: "suv-lux" },
          { name: "XT4", class: "business" },
          { name: "XT5", class: "business" },
          { name: "XT6", class: "suv-lux" },
          { name: "SRX", class: "suv-lux" },
          { name: "Escalade", class: "bus" },
          { name: "Lyriq", class: "suv-lux" }
        ]
      },
      {
        brand: "Chevrolet",
        models: [
          { name: "Cruze", class: "small" },
          { name: "Malibu", class: "small" },
          { name: "Camaro", class: "small" },
          { name: "Corvette", class: "small" },
          { name: "Impala", class: "small" },
          { name: "Equinox", class: "business" },
          { name: "Blazer", class: "business" },
          { name: "Traverse", class: "suv-lux" },
          { name: "Tahoe", class: "bus" },
          { name: "Suburban", class: "bus" },
          { name: "Silverado", class: "pickup" },
          { name: "Colorado", class: "pickup" },
          { name: "Bolt", class: "small" }
        ]
      },
      {
        brand: "Dodge",
        models: [
          { name: "Challenger", class: "small" },
          { name: "Charger", class: "small" },
          { name: "Durango", class: "suv-lux" },
          { name: "Journey", class: "business" },
          { name: "Ram 1500", class: "pickup" },
          { name: "Ram 2500", class: "pickup" },
          { name: "Viper", class: "small" }
        ]
      },
      {
        brand: "RAM",
        models: [
          { name: "1500", class: "pickup" },
          { name: "2500", class: "pickup" },
          { name: "3500", class: "pickup" },
          { name: "ProMaster", class: "bus" }
        ]
      },
      {
        brand: "Maserati",
        models: [
          { name: "Ghibli", class: "suv-lux" },
          { name: "Quattroporte", class: "suv-lux" },
          { name: "Levante", class: "suv-lux" },
          { name: "GranTurismo", class: "suv-lux" },
          { name: "Granturismo", class: "suv-lux" },
          { name: "MC20", class: "suv-lux" }
        ]
      },
      {
        brand: "Maybach",
        models: [
          { name: "Maybach", class: "bus" },
          { name: "S-Class", class: "suv-lux" },
          { name: "GLS", class: "bus" }
        ]
      },
      {
        brand: "Rolls-Royce",
        models: [
          { name: "Rolls-Royce", class: "suv-lux" },
          { name: "Ghost", class: "suv-lux" },
          { name: "Wraith", class: "suv-lux" },
          { name: "Dawn", class: "suv-lux" },
          { name: "Phantom", class: "suv-lux" },
          { name: "Cullinan", class: "bus" }
        ]
      },
      {
        brand: "Hummer",
        models: [
          { name: "H1", class: "bus" },
          { name: "H2", class: "bus" },
          { name: "H3", class: "suv-lux" },
          { name: "EV", class: "suv-lux" }
        ]
      },
      {
        brand: "Mini",
        models: [
          { name: "Cooper", class: "small" },
          { name: "Countryman", class: "business" },
          { name: "Clubman", class: "business" },
          { name: "Paceman", class: "business" },
          { name: "Convertible", class: "small" }
        ]
      },
      {
        brand: "Suzuki",
        models: [
          { name: "Swift", class: "small" },
          { name: "SX4", class: "small" },
          { name: "Grand Vitara", class: "business" },
          { name: "Vitara", class: "business" },
          { name: "Jimny", class: "business" },
          { name: "XL7", class: "suv-lux" }
        ]
      },
      {
        brand: "Opel",
        models: [
          { name: "Corsa", class: "small" },
          { name: "Astra", class: "small" },
          { name: "Insignia", class: "small" },
          { name: "Mokka", class: "business" },
          { name: "Crossland", class: "business" },
          { name: "Grandland", class: "business" }
        ]
      },
      {
        brand: "Tesla",
        models: [
          { name: "Model S", class: "business" },
          { name: "Model 3", class: "small" },
          { name: "Model X", class: "suv-lux" },
          { name: "Model Y", class: "business" },
          { name: "Cybertruck", class: "pickup" }
        ]
      },
      {
        brand: "Genesis",
        models: [
          { name: "G70", class: "small" },
          { name: "G80", class: "business" },
          { name: "G90", class: "business" },
          { name: "GV70", class: "business" },
          { name: "GV80", class: "suv-lux" }
        ]
      },
      {
        brand: "Acura",
        models: [
          { name: "ILX", class: "small" },
          { name: "TLX", class: "small" },
          { name: "RLX", class: "business" },
          { name: "RDX", class: "business" },
          { name: "MDX", class: "suv-lux" },
          { name: "NSX", class: "small" }
        ]
      },
      {
        brand: "Lamborghini",
        models: [
          { name: "Huracan", class: "suv-lux" },
          { name: "Aventador", class: "suv-lux" },
          { name: "Urus", class: "suv-lux" },
          { name: "Gallardo", class: "suv-lux" }
        ]
      },
      {
        brand: "Ferrari",
        models: [
          { name: "488", class: "suv-lux" },
          { name: "F8", class: "suv-lux" },
          { name: "SF90", class: "suv-lux" },
          { name: "Portofino", class: "suv-lux" },
          { name: "Roma", class: "suv-lux" },
          { name: "GTC4Lusso", class: "suv-lux" }
        ]
      },
      {
        brand: "Bentley",
        models: [
          { name: "Continental", class: "suv-lux" },
          { name: "Flying Spur", class: "suv-lux" },
          { name: "Bentayga", class: "suv-lux" },
          { name: "Mulsanne", class: "suv-lux" }
        ]
      },
      {
        brand: "Aston Martin",
        models: [
          { name: "DB11", class: "suv-lux" },
          { name: "DB12", class: "suv-lux" },
          { name: "Vantage", class: "suv-lux" },
          { name: "DBS", class: "suv-lux" },
          { name: "Rapide", class: "suv-lux" }
        ]
      },
      {
        brand: "McLaren",
        models: [
          { name: "720S", class: "suv-lux" },
          { name: "570S", class: "suv-lux" },
          { name: "GT", class: "suv-lux" },
          { name: "Artura", class: "suv-lux" },
          { name: "P1", class: "suv-lux" }
        ]
      },
      {
        brand: "Alfa Romeo",
        models: [
          { name: "Giulia", class: "small" },
          { name: "Stelvio", class: "business" },
          { name: "4C", class: "small" },
          { name: "Tonale", class: "business" }
        ]
      },
      {
        brand: "Chrysler",
        models: [
          { name: "300", class: "small" },
          { name: "Pacifica", class: "bus" },
          { name: "Voyager", class: "bus" }
        ]
      },
      {
        brand: "Lincoln",
        models: [
          { name: "MKZ", class: "small" },
          { name: "Continental", class: "business" },
          { name: "Corsair", class: "business" },
          { name: "Nautilus", class: "business" },
          { name: "Aviator", class: "suv-lux" },
          { name: "Navigator", class: "bus" }
        ]
      },
      {
        brand: "Buick",
        models: [
          { name: "Regal", class: "small" },
          { name: "Encore", class: "business" },
          { name: "Envision", class: "business" },
          { name: "Enclave", class: "suv-lux" }
        ]
      },
      {
        brand: "GMC",
        models: [
          { name: "Terrain", class: "business" },
          { name: "Acadia", class: "suv-lux" },
          { name: "Yukon", class: "bus" },
          { name: "Sierra", class: "pickup" },
          { name: "Canyon", class: "pickup" }
        ]
      }
    ];
  }
  
  // Преобразование новой структуры в старый формат для обратной совместимости
  convertToLegacyFormat(expandedDatabase) {
    const legacyFormat = {
      'small': { name: '1 класс', brands: {} },
      'business': { name: '2 класс', brands: {} },
      'suv-lux': { name: '3 класс', brands: {} },
      'pickup': { name: 'Большие пикапы', brands: {} },
      'bus': { name: '4 класс', brands: {} }
    };
    
    expandedDatabase.forEach(brandData => {
      brandData.models.forEach(model => {
        const carClass = model.class;
        if (!legacyFormat[carClass].brands[brandData.brand]) {
          legacyFormat[carClass].brands[brandData.brand] = [];
        }
        if (!legacyFormat[carClass].brands[brandData.brand].includes(model.name)) {
          legacyFormat[carClass].brands[brandData.brand].push(model.name);
        }
      });
    });
    
    // Сортируем модели для каждого бренда
    Object.keys(legacyFormat).forEach(carClass => {
      Object.keys(legacyFormat[carClass].brands).forEach(brand => {
        legacyFormat[carClass].brands[brand].sort();
      });
    });
    
    return legacyFormat;
  }
  
  reset() {
    this.selectedClass = null;
    this.selectedBrand = null;
    this.selectedModel = null;
    this.selectedZones.clear();
    this.selectedPackage = null;
    this.isManualZones = false;
    
    if (this.isMobile) {
      this.currentStep = 1;
      this.updateMobileStep(1);
      this.updateMobilePrice();
    } else {
      this.clearModel();
      this.renderBrandChips();
      this.renderZones();
      this.updateCarZonesVisual();
      this.updateTotal();
    }
  }
  
  // Собираем все бренды из всех классов в один список
  getAllBrands() {
    const brandsSet = new Set();
    Object.values(this.carDatabase).forEach(classData => {
      Object.keys(classData.brands).forEach(brand => {
        brandsSet.add(brand);
      });
    });
    return Array.from(brandsSet).sort();
  }
  
  // Получить популярные модели для бренда (ТОП-30 из всех классов)
  getPopularModelsForBrand(brand) {
    const models = [];
    Object.entries(this.carDatabase).forEach(([classKey, classData]) => {
      if (classData.brands[brand]) {
        classData.brands[brand].forEach(model => {
          if (!models.includes(model)) {
            models.push(model);
          }
        });
      }
    });
    // Возвращаем первые 30 моделей
    return models.slice(0, 30);
  }
  
  // Автоматически определить класс по бренду и модели
  getCarClassByBrandAndModel(brand, model) {
    // Сначала ищем в новой структуре данных
    const brandData = this.expandedCarDatabase.find(b => b.brand === brand);
    if (brandData) {
      const modelData = brandData.models.find(m => m.name === model);
      if (modelData) {
        return modelData.class;
      }
    }
    // Fallback на старую структуру
    for (const [classKey, classData] of Object.entries(this.carDatabase)) {
      if (classData.brands[brand] && classData.brands[brand].includes(model)) {
        return classKey;
      }
    }
    // Если не найдено, возвращаем 'small' по умолчанию
    return 'small';
  }
  
  // Получить все модели для бренда из всех классов
  getAllModelsForBrand(brand) {
    const models = [];
    
    // Сначала ищем в новой структуре данных
    const brandData = this.expandedCarDatabase.find(b => b.brand === brand);
    if (brandData) {
      brandData.models.forEach(model => {
        if (!models.includes(model.name)) {
          models.push(model.name);
        }
      });
    }
    
    // Fallback на старую структуру для обратной совместимости
    Object.entries(this.carDatabase).forEach(([classKey, classData]) => {
      if (classData.brands[brand]) {
        classData.brands[brand].forEach(model => {
          if (!models.includes(model)) {
            models.push(model);
          }
        });
      }
    });
    
    return models.sort();
  }

  cache() {
    this.modelSearch = document.getElementById('modelSearch');
    this.modelDropdown = document.getElementById('modelDropdown');
    this.selectedModelInfo = document.getElementById('selectedModelInfo');
    this.modelNameEl = document.getElementById('modelName');
    this.modelClassEl = document.getElementById('modelClass');
    this.totalAmountEl = document.getElementById('totalAmount');
    this.totalZonesEl = document.getElementById('totalZones');
    this.carClassInfoEl = document.getElementById('carClassInfo');
    this.zonesContainer = document.getElementById('zonesSelection');
    this.interactiveZonesGroup = document.getElementById('interactive-zones');
    this.car3dContainer = document.getElementById('car3dCanvas');
    this.orderBtn = document.getElementById('orderBtn') || document.querySelector('.order-btn');
    
    // Проверка наличия элементов (без console.warn для оптимизации)
    // Элементы проверяются при использовании
  }

  // Удаляем старый метод initializeCarDatabase, теперь используем convertToLegacyFormat

  initializeZonesDatabase() {
    // Данные из прайс-листа Propellini с разделением на классы
    // 1 класс: small (200к глянец, 210к мат, 25к зоны риска)
    // 2 класс: business (200к глянец, 210к мат, 25к зоны риска)
    // 3 класс: suv-lux, pickup (210к глянец, 225к мат, 25к зоны риска)
    // 4 класс: bus (220к глянец, 235к мат, 25к зоны риска)
    return {
      'small': {
        'Пакеты услуг': [
          { id: 'package-basic', name: 'Базовый набор (Зоны риска)', price: 25000, type: 'package' },
          { id: 'package-premium', name: 'Премиум (Зоны риска + Полная оклейка глянцевая)', price: 225000, type: 'package' },
          { id: 'package-lux', name: 'Люкс (Зоны риска + Полная оклейка матовая)', price: 235000, type: 'package' },
        ],
        'Полная оклейка': [
          { id: 'full-glossy', name: 'Полная оклейка кузова глянцевой пленкой', price: 200000 },
          { id: 'full-matte', name: 'Полная оклейка кузова матовой пленкой', price: 210000 },
          { id: 'full-vinyl', name: 'Оклейка цветной виниловой пленкой целиком', price: 180000 },
        ],
        'Зоны оклейки': [
          { id: 'zone-hood', name: 'Оклейка капота', price: 8000 },
          { id: 'zone-front-bumper', name: 'Оклейка переднего бампера', price: 12000 },
          { id: 'zone-front-fenders', name: 'Оклейка передних крыльев', price: 10000 },
          { id: 'zone-doors', name: 'Оклейка дверей', price: 15000 },
          { id: 'zone-rear-fenders', name: 'Оклейка задних крыльев', price: 10000 },
          { id: 'zone-rear-bumper', name: 'Оклейка заднего бампера', price: 10000 },
          { id: 'zone-roof', name: 'Оклейка крыши', price: 12000 },
          { id: 'zone-mirrors', name: 'Оклейка зеркал', price: 5000 },
          { id: 'headlights', name: 'Оклейка фар', price: 8000 },
          { id: 'display', name: 'Оклейка дисплеев автомобиля', price: 15000 },
          { id: 'interior-glossy', name: 'Оклейка глянцевых элементов салона', price: 5000 },
          { id: 'interior-matte', name: 'Оклейка матовых элементов салона', price: 6000 },
        ]
      },
      'business': {
        'Пакеты услуг': [
          { id: 'package-basic', name: 'Базовый набор (Зоны риска)', price: 25000, type: 'package' },
          { id: 'package-premium', name: 'Премиум (Зоны риска + Полная оклейка глянцевая)', price: 225000, type: 'package' },
          { id: 'package-lux', name: 'Люкс (Зоны риска + Полная оклейка матовая)', price: 235000, type: 'package' },
        ],
        'Полная оклейка': [
          { id: 'full-glossy', name: 'Полная оклейка кузова глянцевой пленкой', price: 200000 },
          { id: 'full-matte', name: 'Полная оклейка кузова матовой пленкой', price: 210000 },
          { id: 'full-vinyl', name: 'Оклейка цветной виниловой пленкой целиком', price: 180000 },
        ],
        'Зоны оклейки': [
          { id: 'zone-hood', name: 'Оклейка капота', price: 10000 },
          { id: 'zone-front-bumper', name: 'Оклейка переднего бампера', price: 15000 },
          { id: 'zone-front-fenders', name: 'Оклейка передних крыльев', price: 12000 },
          { id: 'zone-doors', name: 'Оклейка дверей', price: 18000 },
          { id: 'zone-rear-fenders', name: 'Оклейка задних крыльев', price: 12000 },
          { id: 'zone-rear-bumper', name: 'Оклейка заднего бампера', price: 12000 },
          { id: 'zone-roof', name: 'Оклейка крыши', price: 15000 },
          { id: 'zone-mirrors', name: 'Оклейка зеркал', price: 6000 },
          { id: 'headlights', name: 'Оклейка фар', price: 10000 },
          { id: 'display', name: 'Оклейка дисплеев автомобиля', price: 15000 },
          { id: 'interior-glossy', name: 'Оклейка глянцевых элементов салона', price: 5000 },
          { id: 'interior-matte', name: 'Оклейка матовых элементов салона', price: 6000 },
        ]
      },
      'suv-lux': {
        'Пакеты услуг': [
          { id: 'package-basic', name: 'Базовый набор (Зоны риска)', price: 25000, type: 'package' },
          { id: 'package-premium', name: 'Премиум (Зоны риска + Полная оклейка глянцевая)', price: 235000, type: 'package' },
          { id: 'package-lux', name: 'Люкс (Зоны риска + Полная оклейка матовая)', price: 250000, type: 'package' },
        ],
        'Полная оклейка': [
          { id: 'full-glossy', name: 'Полная оклейка кузова глянцевой пленкой', price: 210000 },
          { id: 'full-matte', name: 'Полная оклейка кузова матовой пленкой', price: 225000 },
          { id: 'full-vinyl', name: 'Оклейка цветной виниловой пленкой целиком', price: 190000 },
        ],
        'Зоны оклейки': [
          { id: 'zone-hood', name: 'Оклейка капота', price: 12000 },
          { id: 'zone-front-bumper', name: 'Оклейка переднего бампера', price: 18000 },
          { id: 'zone-front-fenders', name: 'Оклейка передних крыльев', price: 15000 },
          { id: 'zone-doors', name: 'Оклейка дверей', price: 22000 },
          { id: 'zone-rear-fenders', name: 'Оклейка задних крыльев', price: 15000 },
          { id: 'zone-rear-bumper', name: 'Оклейка заднего бампера', price: 15000 },
          { id: 'zone-roof', name: 'Оклейка крыши', price: 18000 },
          { id: 'zone-mirrors', name: 'Оклейка зеркал', price: 7000 },
          { id: 'headlights', name: 'Оклейка фар', price: 12000 },
          { id: 'display', name: 'Оклейка дисплеев автомобиля', price: 15000 },
          { id: 'interior-glossy', name: 'Оклейка глянцевых элементов салона', price: 5000 },
          { id: 'interior-matte', name: 'Оклейка матовых элементов салона', price: 6000 },
        ]
      },
      'pickup': {
        'Пакеты услуг': [
          { id: 'package-basic', name: 'Базовый набор (Зоны риска)', price: 25000, type: 'package' },
          { id: 'package-premium', name: 'Премиум (Зоны риска + Полная оклейка глянцевая)', price: 235000, type: 'package' },
          { id: 'package-lux', name: 'Люкс (Зоны риска + Полная оклейка матовая)', price: 250000, type: 'package' },
        ],
        'Полная оклейка': [
          { id: 'full-glossy', name: 'Полная оклейка кузова глянцевой пленкой', price: 210000 },
          { id: 'full-matte', name: 'Полная оклейка кузова матовой пленкой', price: 225000 },
          { id: 'full-vinyl', name: 'Оклейка цветной виниловой пленкой целиком', price: 190000 },
        ],
        'Зоны оклейки': [
          { id: 'zone-hood', name: 'Оклейка капота', price: 12000 },
          { id: 'zone-front-bumper', name: 'Оклейка переднего бампера', price: 18000 },
          { id: 'zone-front-fenders', name: 'Оклейка передних крыльев', price: 15000 },
          { id: 'zone-doors', name: 'Оклейка дверей', price: 22000 },
          { id: 'zone-rear-fenders', name: 'Оклейка задних крыльев', price: 15000 },
          { id: 'zone-rear-bumper', name: 'Оклейка заднего бампера', price: 15000 },
          { id: 'zone-roof', name: 'Оклейка крыши', price: 18000 },
          { id: 'zone-mirrors', name: 'Оклейка зеркал', price: 7000 },
          { id: 'headlights', name: 'Оклейка фар', price: 12000 },
          { id: 'display', name: 'Оклейка дисплеев автомобиля', price: 15000 },
        ]
      },
      'bus': {
        'Пакеты услуг': [
          { id: 'package-basic', name: 'Базовый набор (Зоны риска)', price: 25000, type: 'package' },
          { id: 'package-premium', name: 'Премиум (Зоны риска + Полная оклейка глянцевая)', price: 245000, type: 'package' },
          { id: 'package-lux', name: 'Люкс (Зоны риска + Полная оклейка матовая)', price: 260000, type: 'package' },
        ],
        'Полная оклейка': [
          { id: 'full-glossy', name: 'Полная оклейка кузова глянцевой пленкой', price: 220000 },
          { id: 'full-matte', name: 'Полная оклейка кузова матовой пленкой', price: 235000 },
          { id: 'full-vinyl', name: 'Оклейка цветной виниловой пленкой целиком', price: 200000 },
        ],
        'Зоны оклейки': [
          { name: 'Оклейка капота', id: 'zone-hood', price: 15000 },
          { id: 'zone-front-bumper', name: 'Оклейка переднего бампера', price: 20000 },
          { id: 'zone-front-fenders', name: 'Оклейка передних крыльев', price: 18000 },
          { id: 'zone-doors', name: 'Оклейка дверей', price: 25000 },
          { id: 'zone-rear-fenders', name: 'Оклейка задних крыльев', price: 18000 },
          { id: 'zone-rear-bumper', name: 'Оклейка заднего бампера', price: 18000 },
          { id: 'zone-roof', name: 'Оклейка крыши', price: 22000 },
          { id: 'zone-mirrors', name: 'Оклейка зеркал', price: 8000 },
          { id: 'headlights', name: 'Оклейка фар', price: 15000 },
          { id: 'display', name: 'Оклейка дисплеев автомобиля', price: 15000 },
        ]
      }
    };
  }

  init() {
    this.isMobile = window.innerWidth <= 900;
    this.cache();
    
    // Инициализируем выбранный класс по умолчанию (первый активный класс)
    const activeClassBtn = document.querySelector('.class-option.active');
    if (activeClassBtn) {
      this.selectedClass = activeClassBtn.dataset.class;
    } else {
      // Если нет активного класса, устанавливаем 'small' по умолчанию
      this.selectedClass = 'small';
      const smallBtn = document.querySelector('.class-option[data-class="small"]');
      if (smallBtn) {
        smallBtn.classList.add('active');
      }
    }
    
    // Инициализируем кнопку "Записаться" в верхней панели для всех версий
    this.bindOrderButton();
    
    // Всегда инициализируем десктопную версию калькулятора (она используется и на мобильных)
    this.bindClassSelection();
    this.bindSearch();
      this.bindQuickButtons();
    this.renderZones();
    this.initCarZones();
    
    // Убеждаемся что brand chips отображаются после загрузки DOM
    setTimeout(() => {
      this.renderBrandChips();
      this.updateTotal();
      // Переинициализируем кнопку заказа после загрузки DOM
      this.bindOrderButton();
    }, 50);
    
    // Дополнительно инициализируем мобильный визард если нужно
    if (this.isMobile) {
      this.initMobileWizard();
  }
      
    // Обновляем итоговую стоимость после инициализации
    setTimeout(() => {
      this.updateTotal();
    }, 100);

    // Обработчик изменения размера окна
    window.addEventListener('resize', () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 900;
      if (wasMobile !== this.isMobile) {
        location.reload(); // Перезагружаем при переключении режима
      }
    });
  }
  
  // Выбор модели
  selectModel(brand, model) {
    this.selectedBrand = brand;
    this.selectedModel = model;
    this.selectedClass = this.getCarClassByBrandAndModel(brand, model);
    this.renderModelChips();
    this.renderZones();
      this.updateCarZonesVisual();
      this.updateTotal();
      // Принудительно обновляем цену через небольшую задержку
      setTimeout(() => {
        this.updateTotal();
      }, 100);
    this.showSelectedModel();
  }

  // Очистка выбранной модели
  clearModel() {
        this.selectedModel = null;
    this.selectedBrand = null;
        this.selectedClass = null;
    if (this.modelSearch) this.modelSearch.value = '';
    if (this.modelDropdown) this.modelDropdown.style.display = 'none';
    if (this.selectedModelInfo) this.selectedModelInfo.style.display = 'none';
    this.renderModelChips();
  }

  // Показать выбранную модель
  showSelectedModel() {
    if (!this.selectedBrand || !this.selectedModel) return;
    if (this.modelNameEl) {
      this.modelNameEl.textContent = `${this.selectedBrand} ${this.selectedModel}`;
    }
    if (this.modelClassEl && this.selectedClass) {
      const className = this.carDatabase[this.selectedClass]?.name || '';
      this.modelClassEl.textContent = className;
    }
    if (this.selectedModelInfo) {
      this.selectedModelInfo.style.display = 'flex';
    }
  }

  // Рендер зон оклейки
  renderZones() {
    if (!this.zonesContainer) return;
    const classToUse = this.selectedClass || 'small';
    const zonesData = this.zonesDatabase[classToUse];
    if (!zonesData) return;

    let html = '';
    Object.entries(zonesData).forEach(([category, items]) => {
      const isPackage = category === 'Пакеты услуг';
      html += `<div class="zone-category ${isPackage ? 'package-category' : ''}">
        <h3>${category}</h3>
        <div class="zone-items ${isPackage ? 'package-items' : ''}">`;
      
      items.forEach(item => {
        const isChecked = this.selectedZones.has(item.id);
        const inputType = isPackage ? 'radio' : 'checkbox';
        const nameAttr = isPackage ? 'package' : 'zone';
        
        html += `
          <label class="zone-item ${item.type === 'package' ? 'package-item' : ''}" data-zone="${item.id}" data-type="${item.type || ''}">
            <input type="${inputType}" name="${nameAttr}" id="zone-${item.id}" ${isChecked ? 'checked' : ''}>
            <span>${item.name}</span>
            <span class="zone-price" data-price="${item.price}">${item.price.toLocaleString('ru-RU')} ₽</span>
          </label>`;
      });
      
      html += '</div></div>';
    });

    this.zonesContainer.innerHTML = html;
    
    // Добавляем обработчики событий для input
    this.zonesContainer.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => {
      input.addEventListener('change', (e) => this.toggleZone(e.target));
      
      // Добавляем touchstart для мобильных
      input.addEventListener('touchstart', (e) => {
        e.stopPropagation();
      }, { passive: false });
    });
    
    // Добавляем обработчики для клика по label (zone-item)
    this.zonesContainer.querySelectorAll('.zone-item').forEach(item => {
      // Удаляем старые обработчики через клонирование
      const newItem = item.cloneNode(true);
      item.parentNode.replaceChild(newItem, item);
      const zoneItem = newItem;
      
      const handleItemClick = (e) => {
        e.stopPropagation();
        
        const input = zoneItem.querySelector('input[type="checkbox"], input[type="radio"]');
        if (!input) return;
        
        // Если клик не по самому input, переключаем его
        if (e.target !== input && e.target.tagName !== 'INPUT') {
          e.preventDefault();
          
          if (input.type === 'checkbox') {
            input.checked = !input.checked;
          } else if (input.type === 'radio') {
            input.checked = true;
          }
          
          // Вызываем событие change
          const changeEvent = new Event('change', { bubbles: true, cancelable: true });
          input.dispatchEvent(changeEvent);
          // Принудительно вызываем toggleZone для обновления цены
          if (window.calculator && window.calculator.toggleZone) {
            setTimeout(() => {
              window.calculator.toggleZone(input);
            }, 10);
          }
        }
      };
      
      zoneItem.addEventListener('click', handleItemClick, true);
      zoneItem.addEventListener('touchstart', handleItemClick, { passive: false });
      
      // Также добавляем обработчик на сам input
      const input = zoneItem.querySelector('input[type="checkbox"], input[type="radio"]');
      if (input) {
        input.addEventListener('click', (e) => {
          e.stopPropagation();
        }, true);
      }
    });
  }

  // Переключение зоны
  toggleZone(checkbox) {
    const zoneItem = checkbox.closest('.zone-item');
    const zoneId = zoneItem.dataset.zone;
    const isPackage = zoneItem.dataset.type === 'package';
    
    if (isPackage && checkbox.checked) {
      // Очищаем все выбранные зоны и пакеты
      const zonesToRemove = Array.from(this.selectedZones);
      zonesToRemove.forEach(id => {
        this.selectedZones.delete(id);
        const cb = document.querySelector(`#zone-${id}`);
        if (cb) cb.checked = false;
      });
      
      // Снимаем все radio buttons пакетов
      document.querySelectorAll('input[name="package"]').forEach(radio => {
        if (radio.id !== `zone-${zoneId}`) {
          radio.checked = false;
        }
      });
      
      // Снимаем все checkboxes обычных зон
      document.querySelectorAll('input[name="zone"]').forEach(cb => {
        cb.checked = false;
      });
      
      // Добавляем пакет и его зоны
      this.selectedZones.add(zoneId);
      const packageZones = this.getPackageZones(zoneId);
      packageZones.forEach(pid => {
        this.selectedZones.add(pid);
        // Ищем чекбокс и отмечаем его
        const cb = document.querySelector(`#zone-${pid}`);
        if (cb) {
          cb.checked = true;
          // Обновляем визуальное состояние элемента
          const zoneItem = cb.closest('.zone-item');
          if (zoneItem) {
            zoneItem.classList.add('selected');
          }
        } else {
          // Если чекбокс ещё не отрендерен, попробуем через небольшую задержку
          setTimeout(() => {
            const delayedCb = document.querySelector(`#zone-${pid}`);
            if (delayedCb) {
              delayedCb.checked = true;
              const zoneItem = delayedCb.closest('.zone-item');
              if (zoneItem) {
                zoneItem.classList.add('selected');
              }
            }
          }, 100);
        }
      });
      // Обновляем визуализацию и цену сразу после выбора пакета
      this.updateCarZonesVisual();
      this.updateTotal();
      // Принудительно обновляем цену через небольшую задержку для надежности
      setTimeout(() => {
        this.updateTotal();
      }, 100);
    } else if (isPackage && !checkbox.checked) {
      // Удаляем пакет и его зоны
      this.selectedZones.delete(zoneId);
      const packageZones = this.getPackageZones(zoneId);
      packageZones.forEach(pid => {
        this.selectedZones.delete(pid);
        const cb = document.querySelector(`#zone-${pid}`);
        if (cb) cb.checked = false;
      });
      // Обновляем визуализацию и цену
      this.updateCarZonesVisual();
      this.updateTotal();
      setTimeout(() => {
        this.updateTotal();
      }, 50);
    } else {
      // Проверяем, является ли это элементом "Полная оклейка"
      const isFullWrap = zoneId === 'full-glossy' || zoneId === 'full-matte' || zoneId === 'full-vinyl';
      
      if (checkbox.checked) {
        // Снимаем все пакеты
        document.querySelectorAll('input[name="package"]').forEach(radio => {
          radio.checked = false;
          const packageItem = radio.closest('.zone-item');
          if (packageItem) {
            const packageId = packageItem.dataset.zone;
            this.selectedZones.delete(packageId);
            const packageZones = this.getPackageZones(packageId);
            packageZones.forEach(pid => {
              this.selectedZones.delete(pid);
              const cb = document.querySelector(`#zone-${pid}`);
              if (cb) cb.checked = false;
            });
          }
        });
        
        // Если это "Полная оклейка", снимаем все остальные зоны и другие варианты полной оклейки
        if (isFullWrap) {
          // Сначала снимаем все варианты полной оклейки (кроме текущей)
          ['full-glossy', 'full-matte', 'full-vinyl'].forEach(fullId => {
            if (fullId !== zoneId) {
              this.selectedZones.delete(fullId);
              const cb = document.querySelector(`#zone-${fullId}`);
              if (cb) cb.checked = false;
            }
          });
          
          // Снимаем все обычные зоны (не полную оклейку)
          document.querySelectorAll('input[name="zone"]').forEach(cb => {
            const item = cb.closest('.zone-item');
            if (item) {
              const itemId = item.dataset.zone;
              // Пропускаем варианты полной оклейки, но снимаем остальные
              if (itemId !== 'full-glossy' && itemId !== 'full-matte' && itemId !== 'full-vinyl') {
                cb.checked = false;
                this.selectedZones.delete(itemId);
              }
            }
          });
          
          // Добавляем выбранную полную оклейку и ставим галочку
          this.selectedZones.add(zoneId);
          checkbox.checked = true;
          
        // Обновляем сразу
        this.updateCarZonesVisual();
        this.updateTotal();
        // Принудительно обновляем цену
        setTimeout(() => {
          this.updateTotal();
        }, 50);
        } else {
          // Если выбираем обычную зону, снимаем все варианты полной оклейки
          ['full-glossy', 'full-matte', 'full-vinyl'].forEach(fullId => {
            this.selectedZones.delete(fullId);
            const cb = document.querySelector(`#zone-${fullId}`);
            if (cb) cb.checked = false;
          });
          
          // Добавляем выбранную зону
          this.selectedZones.add(zoneId);
          
          // Обновляем сразу
          this.updateCarZonesVisual();
          this.updateTotal();
          // Принудительно обновляем цену
          setTimeout(() => {
            this.updateTotal();
          }, 50);
        }
      } else {
        this.selectedZones.delete(zoneId);
        
        // Обновляем сразу
        this.updateCarZonesVisual();
        this.updateTotal();
        // Принудительно обновляем цену
        setTimeout(() => {
          this.updateTotal();
        }, 50);
      }
    }
  }

  // Получить зоны из пакета
  getPackageZones(packageId) {
    const classToUse = this.selectedClass || 'small';
    const zonesData = this.zonesDatabase[classToUse];
    if (!zonesData || !zonesData['Пакеты услуг']) return [];

    const packageData = zonesData['Пакеты услуг'].find(p => p.id === packageId);
    if (!packageData) return [];

    // Зоны риска для базового пакета
    if (packageId === 'package-basic') {
      return this.getRiskZonesForClass(classToUse);
    }
    // Для премиум и люкс добавляем полную оклейку
    if (packageId === 'package-premium' || packageId === 'package-lux') {
      const riskZones = this.getRiskZonesForClass(classToUse);
      return riskZones;
    }
    
    return [];
  }

  // Получить зоны риска для класса
  getRiskZonesForClass(carClass) {
    const riskZonesMap = {
      'small': ['zone-hood', 'zone-front-bumper', 'zone-front-fenders', 'zone-mirrors'],
      'business': ['zone-hood', 'zone-front-bumper', 'zone-front-fenders', 'zone-mirrors'],
      'suv-lux': ['zone-hood', 'zone-front-bumper', 'zone-front-fenders', 'zone-mirrors', 'zone-doors'],
      'pickup': ['zone-hood', 'zone-front-bumper', 'zone-front-fenders', 'zone-mirrors'],
      'bus': ['zone-front-bumper', 'zone-mirrors']
    };
    return riskZonesMap[carClass] || ['zone-hood', 'zone-front-bumper', 'zone-front-fenders', 'zone-mirrors'];
  }

  // Получить данные зон автомобиля для визуализации
  getCarZones() {
    return [
      { zoneId: 'zone-hood', name: 'Капот', path: 'M80,60 L320,60 L310,140 L90,140 Z' },
      { zoneId: 'zone-front-bumper', name: 'Передний бампер', path: 'M60,150 Q55,160 70,180 Q90,185 150,180 Q200,182 250,180 Q310,185 330,180 Q345,160 340,150 L60,150 Z' },
      { zoneId: 'zone-front-fenders', name: 'Передние крылья', path: 'M70,140 L95,140 L110,280 Q100,290 80,285 L70,140 Z' },
      { zoneId: 'zone-doors', name: 'Двери', path: 'M130,180 L270,180 L265,320 L135,320 Z' },
      { zoneId: 'zone-rear-fenders', name: 'Задние крылья', path: 'M290,140 L310,140 L330,280 Q340,290 320,285 L290,140 Z' },
      { zoneId: 'zone-rear-bumper', name: 'Задний бампер', path: 'M60,350 Q55,340 70,320 Q90,315 150,320 Q200,318 250,320 Q310,315 330,320 Q345,340 340,350 L60,350 Z' },
      { zoneId: 'zone-roof', name: 'Крыша', path: 'M100,60 L300,60 L290,140 L110,140 Z' },
      { zoneId: 'zone-mirrors', name: 'Зеркала', path: 'M50,140 Q45,150 55,160 Q60,155 65,150 Q60,145 50,140 Z M350,140 Q355,150 345,160 Q340,155 335,150 Q340,145 350,140 Z' }
    ];
  }

  // Обновить визуализацию зон автомобиля
  updateCarZonesVisual() {
    // Обновляем 3D модель если она есть
    if (this.car3dZones && this.car3dZones.size > 0) {
      this.car3dZones.forEach((zoneData, zoneId) => {
        const isSelected = this.selectedZones.has(zoneId);
        const highlight = zoneData.highlight;
        
        if (highlight) {
          if (isSelected) {
            highlight.visible = true;
            highlight.material.opacity = 0.6;
            highlight.material.emissiveIntensity = 0.8;
          } else {
            highlight.visible = false;
            highlight.material.opacity = 0;
          }
        }
        
        // Подсветка основного меша
        if (isSelected) {
          zoneData.mesh.material.emissive = new THREE.Color(0x168491);
          zoneData.mesh.material.emissiveIntensity = 0.3;
        } else {
          zoneData.mesh.material.emissive = new THREE.Color(0x000000);
          zoneData.mesh.material.emissiveIntensity = 0;
        }
      });
    }
    
    // Обновляем SVG fallback если используется
    if (this.interactiveZonesGroup) {
      const paths = this.interactiveZonesGroup.querySelectorAll('.car-zone-path');
      paths.forEach(path => {
        const zoneId = path.getAttribute('data-zone-id');
        const isSelected = this.selectedZones.has(zoneId);
        this.updateZonePathStyle(path, isSelected);
        if (isSelected) {
          path.classList.add('active');
        } else {
          path.classList.remove('active');
        }
      });
    }
  }

  // Обновить стиль пути зоны с премиум эффектами
  updateZonePathStyle(path, isSelected) {
    if (isSelected) {
      path.style.fill = 'rgba(22, 132, 145, 0.45)';
      path.style.stroke = '#168491';
      path.style.strokeWidth = '4';
      path.style.filter = 'drop-shadow(0 0 15px rgba(22, 132, 145, 0.9)) drop-shadow(0 0 30px rgba(22, 132, 145, 0.5))';
      path.setAttribute('data-selected', 'true');
      path.classList.add('active');
    } else {
      path.style.fill = 'transparent';
      path.style.stroke = 'transparent';
      path.style.strokeWidth = '3';
      path.style.filter = 'none';
      path.setAttribute('data-selected', 'false');
      path.classList.remove('active');
    }
  }

  // Инициализация зон автомобиля (3D модель)
  initCarZones() {
    // Проверяем доступность Three.js и контейнера
    if (typeof THREE === 'undefined') {
      // Ждем загрузки Three.js
      setTimeout(() => {
        if (typeof THREE !== 'undefined') {
          if (this.car3dContainer) {
            this.initCar3D();
          } else if (this.interactiveZonesGroup) {
            this.initCarZonesSVG();
          }
        } else {
          console.warn('Three.js не загружен, используем SVG fallback');
          this.initCarZonesSVG();
        }
      }, 100);
      return;
    }
    
    if (this.car3dContainer) {
      this.initCar3D();
    } else if (this.interactiveZonesGroup) {
      this.initCarZonesSVG();
    }
  }

  // Инициализация 3D модели автомобиля
  initCar3D() {
    if (!this.car3dContainer) return;
    
    // Размеры контейнера
    const width = this.car3dContainer.clientWidth || 500;
    const height = this.car3dContainer.clientHeight || 400;
    
    // Сцена
    this.scene3d = new THREE.Scene();
    this.scene3d.background = new THREE.Color(0x0a0a0a);
    
    // Камера
    this.camera3d = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera3d.position.set(0, 5, 12);
    this.camera3d.lookAt(0, 0, 0);
    
    // Рендерер
    this.renderer3d = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer3d.setSize(width, height);
    this.renderer3d.shadowMap.enabled = true;
    this.renderer3d.shadowMap.type = THREE.PCFSoftShadowMap;
    this.car3dContainer.innerHTML = '';
    this.car3dContainer.appendChild(this.renderer3d.domElement);
    
    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene3d.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0x168491, 0.8);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    this.scene3d.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    this.scene3d.add(directionalLight2);
    
    // Контроллер камеры (вращение) - используем простой контроллер без OrbitControls
    this.isDragging3d = false;
    this.previousMousePosition3d = { x: 0, y: 0 };
    
    this.renderer3d.domElement.addEventListener('mousedown', (e) => {
      this.isDragging3d = true;
      this.previousMousePosition3d = { x: e.clientX, y: e.clientY };
      this.renderer3d.domElement.style.cursor = 'grabbing';
    });
    
    this.renderer3d.domElement.addEventListener('mousemove', (e) => {
      if (this.isDragging3d && this.car3dModel) {
        const deltaX = e.clientX - this.previousMousePosition3d.x;
        const deltaY = e.clientY - this.previousMousePosition3d.y;
        this.car3dModel.rotation.y += deltaX * 0.01;
        this.car3dModel.rotation.x += deltaY * 0.01;
        this.previousMousePosition3d = { x: e.clientX, y: e.clientY };
      }
    });
    
    this.renderer3d.domElement.addEventListener('mouseup', () => {
      this.isDragging3d = false;
      this.renderer3d.domElement.style.cursor = 'grab';
    });
    
    this.renderer3d.domElement.addEventListener('mouseleave', () => {
      this.isDragging3d = false;
      this.renderer3d.domElement.style.cursor = 'grab';
    });
    
    // Зум колесом мыши
    this.renderer3d.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.camera3d) {
        const delta = e.deltaY * 0.01;
        this.camera3d.position.z = Math.max(8, Math.min(20, this.camera3d.position.z + delta));
      }
    }, { passive: false });
    
    // Хранилище зон
    this.car3dZones = new Map();
    
    // Создаем 3D модель автомобиля
    this.createCar3DModel();
    
    // Рейкастинг для кликов
    this.raycaster3d = new THREE.Raycaster();
    this.mouse3d = new THREE.Vector2();
    
    // Обработчики событий
    this.renderer3d.domElement.addEventListener('click', (e) => this.onCar3DClick(e));
    this.renderer3d.domElement.addEventListener('mousemove', (e) => this.onCar3DMouseMove(e));
    
    // Анимация
    this.animate3D();
    
    // Обработка изменения размера
    window.addEventListener('resize', () => this.onCar3DResize());
    
    this.updateCarZonesVisual();
  }
  
  // Создание 3D модели автомобиля
  createCar3DModel() {
    const carGroup = new THREE.Group();
    
    // Основной корпус автомобиля
    const bodyGeometry = new THREE.BoxGeometry(4, 1.2, 2);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a1a, 
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);
    
    // Капот
    const hoodGeometry = new THREE.BoxGeometry(1.5, 0.3, 2);
    const hoodMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a2a });
    const hood = new THREE.Mesh(hoodGeometry, hoodMaterial);
    hood.position.set(1.25, 0.75, 0);
    hood.castShadow = true;
    this.createZone3D('zone-hood', hood, 'Капот');
    carGroup.add(hood);
    
    // Передний бампер
    const frontBumperGeometry = new THREE.BoxGeometry(0.3, 0.4, 2);
    const frontBumper = new THREE.Mesh(frontBumperGeometry, hoodMaterial);
    frontBumper.position.set(2, 0.3, 0);
    this.createZone3D('zone-front-bumper', frontBumper, 'Передний бампер');
    carGroup.add(frontBumper);
    
    // Передние крылья
    const frontFenderGeometry = new THREE.BoxGeometry(1, 0.8, 0.6);
    const frontFenderL = new THREE.Mesh(frontFenderGeometry, hoodMaterial);
    frontFenderL.position.set(0.5, 0.6, -1.1);
    this.createZone3D('zone-front-fenders', frontFenderL, 'Передние крылья');
    carGroup.add(frontFenderL);
    
    const frontFenderR = new THREE.Mesh(frontFenderGeometry, hoodMaterial);
    frontFenderR.position.set(0.5, 0.6, 1.1);
    carGroup.add(frontFenderR);
    
    // Двери
    const doorGeometry = new THREE.BoxGeometry(1.5, 0.9, 0.1);
    const doorL = new THREE.Mesh(doorGeometry, hoodMaterial);
    doorL.position.set(0, 0.6, -1.05);
    this.createZone3D('zone-doors', doorL, 'Двери');
    carGroup.add(doorL);
    
    const doorR = new THREE.Mesh(doorGeometry, hoodMaterial);
    doorR.position.set(0, 0.6, 1.05);
    carGroup.add(doorR);
    
    // Задние крылья
    const rearFenderGeometry = new THREE.BoxGeometry(1, 0.8, 0.6);
    const rearFenderL = new THREE.Mesh(rearFenderGeometry, hoodMaterial);
    rearFenderL.position.set(-1.5, 0.6, -1.1);
    this.createZone3D('zone-rear-fenders', rearFenderL, 'Задние крылья');
    carGroup.add(rearFenderL);
    
    const rearFenderR = new THREE.Mesh(rearFenderGeometry, hoodMaterial);
    rearFenderR.position.set(-1.5, 0.6, 1.1);
    carGroup.add(rearFenderR);
    
    // Задний бампер
    const rearBumperGeometry = new THREE.BoxGeometry(0.3, 0.4, 2);
    const rearBumper = new THREE.Mesh(rearBumperGeometry, hoodMaterial);
    rearBumper.position.set(-2, 0.3, 0);
    this.createZone3D('zone-rear-bumper', rearBumper, 'Задний бампер');
    carGroup.add(rearBumper);
    
    // Крыша
    const roofGeometry = new THREE.BoxGeometry(2, 0.2, 1.8);
    const roof = new THREE.Mesh(roofGeometry, hoodMaterial);
    roof.position.set(0, 1.2, 0);
    this.createZone3D('zone-roof', roof, 'Крыша');
    carGroup.add(roof);
    
    // Зеркала
    const mirrorGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.3);
    const mirrorL = new THREE.Mesh(mirrorGeometry, hoodMaterial);
    mirrorL.position.set(0.8, 0.9, -1.2);
    this.createZone3D('zone-mirrors', mirrorL, 'Зеркала');
    carGroup.add(mirrorL);
    
    const mirrorR = new THREE.Mesh(mirrorGeometry, hoodMaterial);
    mirrorR.position.set(0.8, 0.9, 1.2);
    carGroup.add(mirrorR);
    
    // Округление корпуса (декоративные элементы)
    const roundGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const roundMaterial = new THREE.MeshPhongMaterial({ color: 0x168491, emissive: 0x168491, emissiveIntensity: 0.2 });
    
    // Добавляем округления по углам
    for (let x = -1.8; x <= 1.8; x += 3.6) {
      for (let z = -0.9; z <= 0.9; z += 1.8) {
        const round = new THREE.Mesh(roundGeometry, roundMaterial);
        round.position.set(x, 0.1, z);
        carGroup.add(round);
      }
    }
    
    // Пол
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.3
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    carGroup.add(floor);
    
    this.car3dModel = carGroup;
    this.scene3d.add(carGroup);
    
    // Мягкая анимация вращения
    this.carRotationSpeed = 0.005;
  }
  
  // Создание зоны для 3D модели
  createZone3D(zoneId, mesh, zoneName) {
    
    // Клонируем геометрию для подсветки
    const highlightGeometry = mesh.geometry.clone();
    const highlightMaterial = new THREE.MeshPhongMaterial({
      color: 0x168491,
      emissive: 0x168491,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    highlight.position.copy(mesh.position);
    highlight.scale.multiplyScalar(1.05);
    highlight.visible = false;
    
    this.car3dZones.set(zoneId, {
      mesh: mesh,
      highlight: highlight,
      name: zoneName,
      zoneId: zoneId
    });
    
    mesh.userData.zoneId = zoneId;
    this.scene3d.add(highlight);
  }
  
  // Обработка клика по 3D модели
  onCar3DClick(event) {
    if (!this.raycaster3d || !this.renderer3d || !this.camera3d) return;
    
    const rect = this.renderer3d.domElement.getBoundingClientRect();
    this.mouse3d.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse3d.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster3d.setFromCamera(this.mouse3d, this.camera3d);
    
    const intersects = this.raycaster3d.intersectObject(this.car3dModel, true);
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const zoneId = intersectedObject.userData.zoneId;
      
      if (zoneId) {
        const checkbox = document.querySelector(`#zone-${zoneId}`);
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          this.toggleZone(checkbox);
        }
      }
    }
  }
  
  // Обработка движения мыши по 3D модели
  onCar3DMouseMove(event) {
    if (!this.raycaster3d || !this.renderer3d || !this.camera3d) return;
    
    const rect = this.renderer3d.domElement.getBoundingClientRect();
    this.mouse3d.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse3d.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.raycaster3d.setFromCamera(this.mouse3d, this.camera3d);
    
    const intersects = this.raycaster3d.intersectObject(this.car3dModel, true);
    
    if (this.renderer3d.domElement) {
      if (intersects.length > 0 && intersects[0].object.userData.zoneId) {
        this.renderer3d.domElement.style.cursor = 'pointer';
      } else {
        this.renderer3d.domElement.style.cursor = 'grab';
      }
    }
  }
  
  
  // Анимация 3D сцены
  animate3D() {
    if (!this.scene3d || !this.camera3d || !this.renderer3d) return;
    
    requestAnimationFrame(() => this.animate3D());
    
    // Мягкое автоматическое вращение автомобиля (очень медленно)
    if (this.car3dModel && !this.isDragging3d) {
      this.car3dModel.rotation.y += (this.carRotationSpeed || 0.002) * 0.5;
    }
    
    this.renderer3d.render(this.scene3d, this.camera3d);
  }
  
  // Обработка изменения размера окна
  onCar3DResize() {
    if (!this.car3dContainer || !this.camera3d || !this.renderer3d) return;
    
    const width = this.car3dContainer.clientWidth || 500;
    const height = this.car3dContainer.clientHeight || 400;
    
    this.camera3d.aspect = width / height;
    this.camera3d.updateProjectionMatrix();
    this.renderer3d.setSize(width, height);
  }

  // Инициализация SVG (fallback)
  initCarZonesSVG() {
    if (!this.interactiveZonesGroup) return;
    
    const zones = this.getCarZones();
    this.interactiveZonesGroup.innerHTML = '';
    
    // Добавляем базовый контур автомобиля для визуализации
    const carOutline = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    carOutline.setAttribute('class', 'car-outline');
    
    // Контур автомобиля (базовая форма)
    const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    outlinePath.setAttribute('d', 'M50,150 Q45,80 80,50 Q180,20 320,50 Q355,80 350,150 L350,380 Q340,400 300,400 Q280,400 250,380 Q220,400 180,400 Q140,400 120,380 Q90,400 50,380 L50,150 Z');
    outlinePath.setAttribute('fill', 'rgba(255,255,255,0.05)');
    outlinePath.setAttribute('stroke', 'rgba(22,132,145,0.3)');
    outlinePath.setAttribute('stroke-width', '2');
    outlinePath.setAttribute('stroke-dasharray', '5,5');
    carOutline.appendChild(outlinePath);
    
    this.interactiveZonesGroup.appendChild(carOutline);
    
    zones.forEach(zone => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', zone.path);
      path.setAttribute('data-zone-id', zone.zoneId);
      path.setAttribute('data-zone-name', zone.name);
      path.setAttribute('class', 'car-zone-path');
      path.style.fill = 'transparent';
      path.style.stroke = 'transparent';
      path.style.strokeWidth = '3';
      path.style.cursor = 'pointer';
      path.style.transition = 'all 0.3s ease';
      
      const isSelected = this.selectedZones.has(zone.zoneId);
      this.updateZonePathStyle(path, isSelected);
      
      path.addEventListener('click', () => {
        const checkbox = document.querySelector(`#zone-${zone.zoneId}`);
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          this.toggleZone(checkbox);
        }
      });
      
      path.addEventListener('mouseenter', () => {
        if (!this.selectedZones.has(zone.zoneId)) {
          path.style.fill = 'rgba(22, 132, 145, 0.35)';
          path.style.stroke = 'rgba(22, 132, 145, 0.9)';
          path.style.strokeWidth = '3';
          path.style.filter = 'drop-shadow(0 0 10px rgba(22, 132, 145, 0.7))';
        }
      });
      
      path.addEventListener('mouseleave', () => {
        if (!this.selectedZones.has(zone.zoneId)) {
          this.updateZonePathStyle(path, false);
        }
      });
      
      this.interactiveZonesGroup.appendChild(path);
    });
    
    this.updateCarZonesVisual();
  }

  // Привязка кнопки заказа
  bindOrderButton() {
    // Ищем кнопку заново
    let orderBtn = document.getElementById('orderBtn') || document.querySelector('.order-btn');
    
    if (!orderBtn) {
      console.warn('Кнопка orderBtn не найдена, повторная попытка через 100ms...');
      setTimeout(() => {
        this.bindOrderButton();
      }, 100);
      return;
    }
    
    // Сохраняем ссылку
    this.orderBtn = orderBtn;
    
    // Удаляем все существующие обработчики через клонирование
    const newBtn = orderBtn.cloneNode(true);
    orderBtn.parentNode.replaceChild(newBtn, orderBtn);
    orderBtn = newBtn;
    this.orderBtn = orderBtn;
    
    const handleOrderClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Кнопка заказа нажата, открываем форму', {
        selectedBrand: this.selectedBrand,
        selectedModel: this.selectedModel,
        selectedZones: Array.from(this.selectedZones || [])
      });
      
      // Открываем форму внутри калькулятора
      this.openCalculatorApplicationForm();
    };
    
    // Удаляем старые обработчики
    orderBtn.removeEventListener('click', handleOrderClick, true);
    orderBtn.removeEventListener('touchstart', handleOrderClick);
    
    // Добавляем обработчики
    orderBtn.addEventListener('click', handleOrderClick, true);
    orderBtn.addEventListener('touchstart', handleOrderClick, { passive: false });
    
    // Также добавляем через onclick для надежности
    orderBtn.onclick = handleOrderClick;
    
    console.log('Кнопка orderBtn привязана');
  }
  
  // Открытие формы заявки внутри калькулятора
  openCalculatorApplicationForm() {
    const form = document.getElementById('calculatorApplicationForm');
    if (!form) {
      console.warn('Форма калькулятора не найдена');
      return;
    }
    
    console.log('Открываем форму калькулятора');
    
    // Обновляем цену перед открытием формы
    this.updateTotal();
    
    // Заполняем панель summary для десктопной версии
    const desktopSummaryBrand = document.getElementById('desktopSummaryBrand');
    const desktopSummaryModel = document.getElementById('desktopSummaryModel');
    const desktopSummaryClass = document.getElementById('desktopSummaryClass');
    const desktopSummaryService = document.getElementById('desktopSummaryService');
    const desktopSummaryTotal = document.getElementById('desktopSummaryTotal');
    
    if (desktopSummaryBrand) {
      desktopSummaryBrand.textContent = this.selectedBrand || '—';
    }
    if (desktopSummaryModel) {
      desktopSummaryModel.textContent = this.selectedModel || '—';
    }
    if (desktopSummaryClass && this.selectedClass) {
      const classNames = {
        'small': 'Малый класс',
        'business': 'Бизнес класс / Кроссоверы',
        'suv-lux': 'Внедорожники / Люкс',
        'pickup': 'Большие пикапы',
        'bus': 'Автобусы / Минивэны'
      };
      desktopSummaryClass.textContent = classNames[this.selectedClass] || this.selectedClass;
    } else if (desktopSummaryClass) {
      desktopSummaryClass.textContent = '—';
    }
    
    // Определяем выбранную услугу
    if (desktopSummaryService && this.selectedClass) {
      const zonesData = this.zonesDatabase[this.selectedClass];
      let serviceText = '—';
      
      if (zonesData && zonesData['Пакеты услуг']) {
        const selectedPackage = zonesData['Пакеты услуг'].find(pkg => 
          this.selectedZones.has(pkg.id)
        );
        if (selectedPackage) {
          serviceText = selectedPackage.name;
        } else {
          const allZones = Object.values(zonesData).flat();
          const selectedZonesNames = Array.from(this.selectedZones)
            .map(zoneId => {
              const zone = allZones.find(z => z.id === zoneId);
              return zone ? zone.name : null;
            })
            .filter(Boolean);
          serviceText = selectedZonesNames.length > 0 
            ? selectedZonesNames.join(', ') 
            : '—';
        }
      }
      desktopSummaryService.textContent = serviceText;
    } else if (desktopSummaryService) {
      desktopSummaryService.textContent = '—';
    }
    
    // Итоговая стоимость
    if (desktopSummaryTotal) {
      const total = this.calculateTotal();
      desktopSummaryTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    }
    
    // Заполняем данные в форму (десктопная форма)
    const carInput = document.getElementById('calcOrderCar');
    const servicesInput = document.getElementById('calcOrderServices');
    const totalInput = document.getElementById('calcOrderTotal');
    
    // Также заполняем мобильную форму, если она есть
    const mobileCarInput = document.getElementById('mobileOrderCar');
    const mobileServicesInput = document.getElementById('mobileOrderServices');
    const mobileTotalInput = document.getElementById('mobileOrderTotal');
    
    // Автомобиль
    if (carInput) {
      if (this.selectedBrand && this.selectedModel) {
        let carText = `${this.selectedBrand} ${this.selectedModel}`.trim();
        // Добавляем класс автомобиля, если есть
        if (this.selectedClass) {
          const className = this.carDatabase[this.selectedClass]?.name || '';
          if (className) {
            carText += ` (${className})`;
          }
        }
        carInput.value = carText;
      } else {
        carInput.value = 'Не выбран';
      }
      console.log('Заполнено поле автомобиля:', carInput.value);
    }
    
    // Услуги (пакеты и отдельные зоны)
    if (servicesInput) {
      if (this.selectedZones && this.selectedZones.size > 0 && this.selectedClass) {
        const zonesData = this.zonesDatabase[this.selectedClass];
        if (zonesData) {
          const allZones = Object.values(zonesData).flat();
          const selectedItems = [];
          
          // Сначала собираем пакеты
          const packages = zonesData['Пакеты услуг'] || [];
          const selectedPackages = Array.from(this.selectedZones)
            .filter(id => packages.some(p => p.id === id))
            .map(packageId => {
              const pkg = packages.find(p => p.id === packageId);
              return pkg ? pkg.name : null;
            })
            .filter(Boolean);
          
          selectedItems.push(...selectedPackages);
          
          // Затем собираем отдельные зоны/услуги (не входящие в выбранные пакеты)
          const packageZoneIds = new Set();
          packages.forEach(pkg => {
            const pkgZones = this.getPackageZones(pkg.id);
            pkgZones.forEach(zid => packageZoneIds.add(zid));
          });
          
          const selectedZonesNames = Array.from(this.selectedZones)
            .map(zoneId => {
              // Пропускаем пакеты - они уже добавлены
              if (packages.some(p => p.id === zoneId)) return null;
              // Пропускаем зоны, которые входят в выбранные пакеты
              if (packageZoneIds.has(zoneId)) return null;
              const zone = allZones.find(z => z.id === zoneId);
              return zone ? zone.name : null;
            })
            .filter(Boolean);
          
          selectedItems.push(...selectedZonesNames);
          
          servicesInput.value = selectedItems.length > 0 
            ? selectedItems.join('\n') 
            : 'Не выбраны';
          console.log('Заполнено поле услуг:', servicesInput.value);
        } else {
          servicesInput.value = 'Не выбраны';
        }
      } else {
        servicesInput.value = 'Не выбраны';
        console.log('Услуги не выбраны');
      }
    }
    
    // Стоимость (десктопная форма)
    if (totalInput) {
      const total = this.calculateTotal();
      totalInput.value = `${total.toLocaleString('ru-RU')} ₽`;
    }
    
    // Заполняем мобильную форму теми же данными
    if (mobileCarInput) {
      if (this.selectedBrand && this.selectedModel) {
        let carText = `${this.selectedBrand} ${this.selectedModel}`.trim();
        if (this.selectedClass) {
          const className = this.carDatabase[this.selectedClass]?.name || '';
          if (className) {
            carText += ` (${className})`;
          }
        }
        mobileCarInput.value = carText;
      } else {
        mobileCarInput.value = 'Не выбран';
      }
    }
    
    if (mobileServicesInput) {
      if (this.selectedZones && this.selectedZones.size > 0 && this.selectedClass) {
        const zonesData = this.zonesDatabase[this.selectedClass];
        if (zonesData) {
          const allZones = Object.values(zonesData).flat();
          const selectedItems = [];
          
          const packages = zonesData['Пакеты услуг'] || [];
          const selectedPackages = Array.from(this.selectedZones)
            .filter(id => packages.some(p => p.id === id))
            .map(packageId => {
              const pkg = packages.find(p => p.id === packageId);
              return pkg ? pkg.name : null;
            })
            .filter(Boolean);
          
          selectedItems.push(...selectedPackages);
          
          const packageZoneIds = new Set();
          packages.forEach(pkg => {
            const pkgZones = this.getPackageZones(pkg.id);
            pkgZones.forEach(zid => packageZoneIds.add(zid));
          });
          
          const selectedZonesNames = Array.from(this.selectedZones)
            .map(zoneId => {
              if (packages.some(p => p.id === zoneId)) return null;
              if (packageZoneIds.has(zoneId)) return null;
              const zone = allZones.find(z => z.id === zoneId);
              return zone ? zone.name : null;
            })
            .filter(Boolean);
          
          selectedItems.push(...selectedZonesNames);
          
          mobileServicesInput.value = selectedItems.length > 0 
            ? selectedItems.join('\n') 
            : 'Не выбраны';
        } else {
          mobileServicesInput.value = 'Не выбраны';
        }
      } else {
        mobileServicesInput.value = 'Не выбраны';
      }
    }
    
    if (mobileTotalInput) {
      const total = this.calculateTotal();
      mobileTotalInput.value = `${total.toLocaleString('ru-RU')} ₽`;
    }
    
    // Перемещаем форму в body для корректного отображения поверх калькулятора
    if (form.parentElement !== document.body) {
      document.body.appendChild(form);
    }
    
    // Показываем форму как модальное окно поверх калькулятора
    form.classList.add('active');
    form.style.display = 'flex';
    form.style.position = 'fixed';
    form.style.top = '0';
    form.style.left = '0';
    form.style.right = '0';
    form.style.bottom = '0';
    form.style.width = '100%';
    form.style.height = '100%';
    form.style.zIndex = '99999';
    form.style.pointerEvents = 'auto';
    form.style.background = 'rgba(0, 0, 0, 0.85)';
    form.style.backdropFilter = 'blur(10px)';
    form.style.webkitBackdropFilter = 'blur(10px)';
    form.style.alignItems = 'center';
    form.style.justifyContent = 'center';
    form.style.padding = '20px';
    form.style.overflowY = 'auto';
    form.style.margin = '0';
    form.style.opacity = '1';
    form.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
    
    // Добавляем обработчик клика на overlay для закрытия
    const handleOverlayClick = (e) => {
      // Закрываем при клике на фон (саму форму, но не на содержимое)
      const formContent = form.querySelector('.calculator-order-form');
      if (e.target === form && formContent && !formContent.contains(e.target)) {
        this.closeCalculatorApplicationForm();
      }
    };
    
    // Удаляем старые обработчики и добавляем новый
    form.removeEventListener('click', handleOverlayClick);
    form.addEventListener('click', handleOverlayClick, true);
    
    // Закрытие по Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape' && form.classList.contains('active')) {
        e.preventDefault();
        e.stopPropagation();
        this.closeCalculatorApplicationForm();
      }
    };
    document.addEventListener('keydown', handleEscape);
    form.dataset.escapeHandler = 'true';
    
    // Привязка кнопки закрытия
    const closeBtn = document.getElementById('calculatorFormClose');
    if (closeBtn) {
      const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeCalculatorApplicationForm();
      };
      closeBtn.addEventListener('click', handleClose, true);
      closeBtn.addEventListener('touchstart', handleClose, { passive: false });
      closeBtn.onclick = handleClose;
    }
    
    console.log('Форма калькулятора открыта, z-index:', form.style.zIndex || '99999');
  }
  
  // Закрытие формы заявки внутри калькулятора
  closeCalculatorApplicationForm() {
    const form = document.getElementById('calculatorApplicationForm');
    if (form) {
      form.classList.remove('active');
      form.style.display = 'none';
      form.style.visibility = 'hidden';
      form.style.opacity = '0';
      form.style.zIndex = '';
      document.body.style.overflow = '';
    }
  }
  
  // Открытие модального окна записи
  openOrderModal() {
    const modal = document.getElementById('orderModal');
    const overlay = document.getElementById('orderModalOverlay');
    const closeBtn = document.getElementById('orderModalClose');
    const cancelBtn = document.getElementById('orderCancel');
    const form = document.getElementById('orderForm');
    
    if (!modal) return;
    
    // Заполняем данные в форму
    const carInput = document.getElementById('orderCar');
    const zonesInput = document.getElementById('orderZones');
    const totalInput = document.getElementById('orderTotal');
    
    // Автомобиль
    if (carInput) {
      if (this.selectedBrand && this.selectedModel) {
        carInput.value = `${this.selectedBrand} ${this.selectedModel}`;
        if (this.selectedClass) {
          const className = this.carDatabase[this.selectedClass]?.name || '';
          carInput.value += ` (${className})`;
        }
      } else {
        carInput.value = 'Не выбран';
      }
    }
    
    // Зоны
    if (zonesInput) {
      if (this.selectedZones.size > 0) {
        const classToUse = this.selectedClass || 'small';
        const zonesData = this.zonesDatabase[classToUse];
        const allZones = Object.values(zonesData).flat();
        
        const selectedZonesNames = Array.from(this.selectedZones).map(zoneId => {
          const zone = allZones.find(z => z.id === zoneId);
          return zone ? zone.name : zoneId;
        });
        
        zonesInput.value = selectedZonesNames.join(', ');
      } else {
        zonesInput.value = 'Не выбраны';
      }
    }
    
    // Стоимость
    if (totalInput && this.totalAmountEl) {
      totalInput.value = this.totalAmountEl.textContent || '0 ₽';
    }
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Обработчики закрытия
    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };
    
    if (overlay) {
      overlay.onclick = closeModal;
    }
    
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
    
    if (cancelBtn) {
      cancelBtn.onclick = closeModal;
    }
    
    // Обработчик отправки формы
    if (form) {
      const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = {
          name: document.getElementById('orderName')?.value || '',
          phone: document.getElementById('orderPhone')?.value || '',
          email: document.getElementById('orderEmail')?.value || '',
          car: carInput?.value || '',
          zones: zonesInput?.value || '',
          total: totalInput?.value || '',
          comment: document.getElementById('orderComment')?.value || ''
        };
        
        // Здесь можно отправить данные на сервер
        console.log('Отправка заявки:', formData);
        
        // Показываем сообщение об успехе
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        
        // Закрываем модальное окно
        closeModal();
        
        // Очищаем форму
        form.reset();
      };
      
      form.onsubmit = handleSubmit;
    }
    
    // Закрытие по Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    modal.dataset.escapeHandler = 'true';
  }

  // Привязка быстрых кнопок
  bindQuickButtons() {
    const riskBtn = document.getElementById('riskZonesBtn');
    if (riskBtn) {
      const handleRiskClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        riskBtn.style.opacity = '0.7';
        setTimeout(() => { riskBtn.style.opacity = ''; }, 150);
        
        requestAnimationFrame(() => {
          // Очищаем все выбранные зоны
          this.selectedZones.forEach(id => {
            const checkbox = document.querySelector(`#zone-${id}`);
            if (checkbox) checkbox.checked = false;
          });
          this.selectedZones.clear();
          
          // Снимаем все пакеты
          document.querySelectorAll('input[name="package"]').forEach(radio => {
            radio.checked = false;
          });
          
          // Снимаем все варианты полной оклейки
          ['full-glossy', 'full-matte', 'full-vinyl'].forEach(fullId => {
            const cb = document.querySelector(`#zone-${fullId}`);
            if (cb) cb.checked = false;
          });
          
          // Снимаем все обычные зоны
          document.querySelectorAll('input[name="zone"]').forEach(cb => {
            const item = cb.closest('.zone-item');
            if (item) {
              const itemId = item.dataset.zone;
              // Пропускаем варианты полной оклейки (они не в name="zone")
              if (itemId !== 'full-glossy' && itemId !== 'full-matte' && itemId !== 'full-vinyl') {
                cb.checked = false;
              }
            }
          });
          
          const classToUse = this.selectedClass || 'small';
          const riskZones = this.getRiskZonesForClass(classToUse);
          
          // Выбираем все зоны риска
          riskZones.forEach(zoneId => {
            this.selectedZones.add(zoneId);
            const checkbox = document.querySelector(`#zone-${zoneId}`);
            if (checkbox) {
              checkbox.checked = true;
              // Триггерим событие change для обновления состояния
              checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
              // Если чекбокс не найден, пытаемся найти через небольшую задержку
              setTimeout(() => {
                const cb = document.querySelector(`#zone-${zoneId}`);
                if (cb) {
                  cb.checked = true;
                  cb.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }, 100);
            }
          });
          
          // Обновляем визуализацию и итоговую стоимость
          setTimeout(() => {
            this.updateCarZonesVisual();
            this.updateTotal();
          }, 50);
        });
      };
      
      riskBtn.addEventListener('click', handleRiskClick);
      riskBtn.addEventListener('touchstart', handleRiskClick, { passive: false });
    }
    
    const fullWrapBtn = document.getElementById('fullWrapBtn');
    if (fullWrapBtn) {
      const handleFullWrapClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        fullWrapBtn.style.opacity = '0.7';
        setTimeout(() => { fullWrapBtn.style.opacity = ''; }, 150);
        
        requestAnimationFrame(() => {
        this.selectedZones.clear();
        this.selectedZones.add('full-glossy');
        const checkbox = document.querySelector(`#zone-full-glossy`);
        if (checkbox) checkbox.checked = true;
        this.updateCarZonesVisual();
        this.updateTotal();
      });
      };
      
      fullWrapBtn.addEventListener('click', handleFullWrapClick);
      fullWrapBtn.addEventListener('touchstart', handleFullWrapClick, { passive: false });
    }
    
    // Кнопка сброса зон
    const clearZonesBtn = document.getElementById('clearZonesBtn');
    if (clearZonesBtn) {
      const handleClearClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        clearZonesBtn.style.opacity = '0.7';
        setTimeout(() => { clearZonesBtn.style.opacity = ''; }, 150);
        
        requestAnimationFrame(() => {
          // Очищаем все выбранные зоны
          this.selectedZones.forEach(id => {
            const checkbox = document.querySelector(`#zone-${id}`);
            if (checkbox) checkbox.checked = false;
          });
          this.selectedZones.clear();
          
          // Сбрасываем все пакеты
          document.querySelectorAll('input[name="package"]').forEach(radio => {
            radio.checked = false;
          });
          
          this.updateCarZonesVisual();
          this.updateTotal();
        });
      };
      
      clearZonesBtn.addEventListener('click', handleClearClick);
      clearZonesBtn.addEventListener('touchstart', handleClearClick, { passive: false });
    }
  }

  // Debounce функция для оптимизации поиска
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Привязка поиска с debounce
  bindSearch() {
    if (!this.modelSearch || !this.modelDropdown) return;
    
    const performSearch = (q) => {
      if (!q) {
        this.modelDropdown.style.display = 'none';
        return;
      }
      
      // Используем requestAnimationFrame для оптимизации
      requestAnimationFrame(() => {
        const results = [];
        const classesToSearch = this.selectedClass 
          ? [this.selectedClass]
          : Object.keys(this.carDatabase);
        
        classesToSearch.forEach(classKey => {
          const brands = this.carDatabase[classKey].brands;
          Object.entries(brands).forEach(([brand, models]) => {
            const brandLower = brand.toLowerCase();
            if (brandLower.includes(q)) {
              models.forEach(model => {
                results.push({ brand, model, full: `${brand} ${model}`, class: classKey });
              });
            } else {
              models.forEach(model => {
                if (model.toLowerCase().includes(q)) {
                  results.push({ brand, model, full: `${brand} ${model}`, class: classKey });
                }
              });
            }
          });
        });
        
        // Ограничиваем до 20 результатов для производительности
        const limitedResults = results.slice(0, 20);
        
        if (limitedResults.length === 0) {
          this.modelDropdown.innerHTML = '<div class="dropdown-item no-results">Ничего не найдено</div>';
          this.modelDropdown.style.display = 'block';
          return;
        }
        
        this.modelDropdown.innerHTML = limitedResults.map(r => 
          `<div class="dropdown-item" data-brand="${r.brand}" data-model="${r.model}">
            <span class="dropdown-brand">${r.brand}</span>
            <span class="dropdown-model">${r.model}</span>
          </div>`
        ).join('');
        
        this.modelDropdown.style.display = 'block';
        
        // Очищаем старые обработчики перед добавлением новых
        const oldItems = this.modelDropdown.querySelectorAll('.dropdown-item');
        oldItems.forEach(item => {
          const newItem = item.cloneNode(true);
          item.parentNode.replaceChild(newItem, item);
        });
        
        this.modelDropdown.querySelectorAll('.dropdown-item').forEach(item => {
          const handleItemClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.selectModel(item.dataset.brand, item.dataset.model);
            this.modelSearch.value = '';
            this.modelDropdown.style.display = 'none';
          };
          
          item.addEventListener('click', handleItemClick);
          item.addEventListener('touchstart', handleItemClick, { passive: false });
        });
      });
    };
    
    // Debounce поиск на 300ms для оптимизации
    const debouncedSearch = this.debounce((e) => {
      const q = e.target.value.trim().toLowerCase();
      performSearch(q);
    }, 300);
    
    this.modelSearch.addEventListener('input', debouncedSearch);
    
    // Закрытие dropdown при клике вне
    if (!this.searchClickHandler) {
      this.searchClickHandler = (e) => {
        if (!this.modelSearch.contains(e.target) && !this.modelDropdown.contains(e.target)) {
          this.modelDropdown.style.display = 'none';
        }
      };
      document.addEventListener('click', this.searchClickHandler);
    }
  }

  // Привязка выбора класса
  bindClassSelection() {
    document.querySelectorAll('.class-option').forEach((btn) => {
      const handleClassClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        btn.style.opacity = '0.7';
        setTimeout(() => { btn.style.opacity = ''; }, 100);
        
        requestAnimationFrame(() => {
          document.querySelectorAll('.class-option').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Сохраняем выбранный класс
          this.selectedClass = btn.dataset.class;
          
          // Очищаем выбранные марку и модель
          this.selectedBrand = null;
          this.selectedModel = null;
          
          // Очищаем выбранные зоны
          this.selectedZones.clear();
          
          // Очищаем UI модели, но НЕ сбрасываем selectedClass
          if (this.modelSearch) this.modelSearch.value = '';
          if (this.modelDropdown) this.modelDropdown.style.display = 'none';
          if (this.selectedModelInfo) this.selectedModelInfo.style.display = 'none';
          
          // Обновляем марки для выбранного класса
          this.renderBrandChips();
          
          // Очищаем модели
          const modelsContainer = document.getElementById('modelChips');
          if (modelsContainer) {
            modelsContainer.innerHTML = '<div class="models-hint">Выберите марку автомобиля</div>';
          }
          
          // Обновляем зоны для выбранного класса
          this.renderZones();
          this.updateCarZonesVisual();
          
          // Обновляем цену сразу и после небольшой задержки
          this.updateTotal();
          setTimeout(() => {
            this.updateTotal();
          }, 50);
        });
      };
      
      btn.addEventListener('click', handleClassClick);
      btn.addEventListener('touchstart', handleClassClick, { passive: false });
    });
  }

  // Рендер чипов брендов
  renderBrandChips() {
    const brandsContainer = document.getElementById('brandChips');
    if (!brandsContainer) return;
    
    // Проверяем инициализацию базы данных
    if (!this.carDatabase || Object.keys(this.carDatabase).length === 0) {
      console.warn('База данных автомобилей не инициализирована');
      return;
    }
    
    let brands = [];
    
    if (this.selectedClass && this.carDatabase[this.selectedClass]) {
      // Если выбран класс, показываем только бренды этого класса
      brands = Object.keys(this.carDatabase[this.selectedClass].brands).sort();
    } else {
      // Если класс не выбран, показываем все бренды
      brands = this.getAllBrands();
    }
    
    if (brands.length === 0) {
      brandsContainer.innerHTML = '<div class="models-hint">Марки не найдены</div>';
      return;
    }
    
    brandsContainer.innerHTML = brands.map(brand => 
      `<div class="brand-chip ${this.selectedBrand === brand ? 'active' : ''}" data-brand="${brand}">
        ${brand}
      </div>`
    ).join('');
    
    brandsContainer.querySelectorAll('.brand-chip').forEach(chip => {
      const handleChipClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        chip.style.opacity = '0.7';
        setTimeout(() => { chip.style.opacity = ''; }, 100);
        
        requestAnimationFrame(() => {
        this.selectedBrand = chip.dataset.brand;
        brandsContainer.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.renderModelChips();
        this.selectedModel = null;
          if (this.modelSearch) this.modelSearch.value = '';
          if (this.selectedModelInfo) this.selectedModelInfo.style.display = 'none';
          // Обновляем цену при выборе марки
          this.updateTotal();
          setTimeout(() => {
            this.updateTotal();
          }, 100);
      });
      };
      
      chip.addEventListener('click', handleChipClick);
      chip.addEventListener('touchstart', handleChipClick, { passive: false });
    });
    
    this.renderModelChips();
  }

  // Рендер чипов моделей
  renderModelChips() {
    const modelsContainer = document.getElementById('modelChips');
    if (!modelsContainer) return;
    
    modelsContainer.innerHTML = '';
    if (!this.selectedBrand) {
      modelsContainer.innerHTML = '<div class="models-hint">Выберите марку автомобиля</div>';
      return;
    }
    
    // Проверяем инициализацию базы данных
    if (!this.carDatabase || Object.keys(this.carDatabase).length === 0) {
      modelsContainer.innerHTML = '<div class="models-hint">База данных не загружена</div>';
      return;
    }
    
    let models = [];
    
    if (this.selectedClass && this.carDatabase[this.selectedClass] && this.carDatabase[this.selectedClass].brands[this.selectedBrand]) {
      // Если выбран класс, показываем только модели этого класса для выбранной марки
      models = this.carDatabase[this.selectedClass].brands[this.selectedBrand] || [];
    } else {
      // Если класс не выбран, показываем все модели для выбранной марки
      models = this.getAllModelsForBrand(this.selectedBrand);
    }
    
    if (models.length === 0) {
      modelsContainer.innerHTML = '<div class="models-hint">Модели не найдены для выбранной марки</div>';
      return;
    }
    
    modelsContainer.innerHTML = models.map(model => 
      `<div class="model-chip ${this.selectedModel === model ? 'active' : ''}" data-model="${model}">
        ${model}
      </div>`
    ).join('');
    
    // Удаляем старые обработчики
    const oldChips = modelsContainer.querySelectorAll('.model-chip');
    oldChips.forEach(chip => {
      const newChip = chip.cloneNode(true);
      chip.parentNode.replaceChild(newChip, chip);
    });
    
    modelsContainer.querySelectorAll('.model-chip').forEach(chip => {
      const handleModelClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        chip.style.opacity = '0.7';
        setTimeout(() => { chip.style.opacity = ''; }, 100);
        
        requestAnimationFrame(() => {
        this.selectModel(this.selectedBrand, chip.dataset.model);
        modelsContainer.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        // Обновляем цену после выбора модели
        setTimeout(() => {
          this.updateTotal();
        }, 100);
      });
      };
      
      chip.addEventListener('click', handleModelClick);
      chip.addEventListener('touchstart', handleModelClick, { passive: false });
      chip.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
    });
  }

  // Вычисление общей стоимости (возвращает число)
  calculateTotal() {
    let total = 0;
    let hasPackage = false;
    const packageZones = new Set();
    
    const classToUse = this.selectedClass || 'small';
    
    if (!this.zonesDatabase || !this.zonesDatabase[classToUse]) {
      return 0;
    }
    
    const zonesData = this.zonesDatabase[classToUse];
    const allZones = Object.values(zonesData).flat();
    
    this.selectedZones.forEach((id) => {
      const zoneItem = document.querySelector(`.zone-item[data-zone="${id}"]`);
      if (zoneItem && zoneItem.dataset.type === 'package') {
        hasPackage = true;
        const zones = this.getPackageZones(id);
        zones.forEach(zoneId => packageZones.add(zoneId));
      }
    });
    
    this.selectedZones.forEach((id) => {
      const zoneData = allZones.find(z => z.id === id);
      
      if (zoneData) {
        if (zoneData.type === 'package') {
          total += zoneData.price;
          hasPackage = true;
        } else if (!packageZones.has(id)) {
          total += zoneData.price;
        }
      } else {
        const zoneItem = document.querySelector(`.zone-item[data-zone="${id}"]`);
        if (zoneItem) {
          const priceEl = zoneItem.querySelector('.zone-price');
          if (priceEl && priceEl.dataset.price && !packageZones.has(id)) {
            const price = parseInt(priceEl.dataset.price, 10);
            if (!isNaN(price)) {
              total += price;
            }
          }
        }
      }
    });
    
    return total;
  }

  // Обновление итоговой стоимости
  updateTotal() {
    // Кешируем элементы если они не закешированы
    if (!this.totalAmountEl) {
      this.totalAmountEl = document.getElementById('totalAmount');
    }
    if (!this.totalZonesEl) {
      this.totalZonesEl = document.getElementById('totalZones');
    }
    if (!this.carClassInfoEl) {
      this.carClassInfoEl = document.getElementById('carClassInfo');
    }
    
    // Если элемент не найден, пытаемся найти его заново
    if (!this.totalAmountEl) {
      this.totalAmountEl = document.getElementById('totalAmount');
    }
    
    if (!this.totalAmountEl) {
      console.warn('Элемент totalAmount не найден');
      return;
    }
    
    const total = this.calculateTotal();
    let hasPackage = false;
    const packageZones = new Set();
    
    const classToUse = this.selectedClass || 'small';
    
    if (!this.zonesDatabase || !this.zonesDatabase[classToUse]) {
      console.warn('База данных зон не найдена для класса:', classToUse);
      if (this.totalAmountEl) {
        this.totalAmountEl.textContent = '0 ₽';
      }
      return;
    }
    
    const zonesData = this.zonesDatabase[classToUse];
    const allZones = Object.values(zonesData).flat();
    const packages = zonesData['Пакеты услуг'] || [];
    
    // Проверяем наличие пакета
    this.selectedZones.forEach((id) => {
      if (packages.some(p => p.id === id)) {
        hasPackage = true;
      }
    });
    
    // Обновляем итоговую стоимость сразу
    if (this.totalAmountEl) {
      try {
        const formattedTotal = `${total.toLocaleString('ru-RU')} ₽`;
        // Обновляем сразу
        this.totalAmountEl.textContent = formattedTotal;
        this.totalAmountEl.innerText = formattedTotal;
        // Принудительно обновляем отображение
        this.totalAmountEl.style.display = '';
        this.totalAmountEl.style.visibility = 'visible';
        this.totalAmountEl.offsetHeight; // Принудительный reflow
        // Также обновляем через requestAnimationFrame для надежности
        requestAnimationFrame(() => {
          if (this.totalAmountEl) {
            this.totalAmountEl.textContent = formattedTotal;
            this.totalAmountEl.innerText = formattedTotal;
          }
        });
        // Дополнительное обновление через небольшую задержку
        setTimeout(() => {
          if (this.totalAmountEl) {
            this.totalAmountEl.textContent = formattedTotal;
            this.totalAmountEl.innerText = formattedTotal;
          }
        }, 100);
      } catch (e) {
        console.error('Ошибка обновления цены:', e);
        // Пытаемся найти элемент заново
        const totalEl = document.getElementById('totalAmount');
        if (totalEl) {
          this.totalAmountEl = totalEl;
          totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
        }
      }
    } else {
      // Пытаемся найти элемент заново
      const totalEl = document.getElementById('totalAmount');
      if (totalEl) {
        this.totalAmountEl = totalEl;
        totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
      } else {
        console.warn('Элемент totalAmount не найден в DOM');
      }
    }
    
    if (this.totalZonesEl) {
      try {
        const zonesCount = this.selectedZones.size;
        if (hasPackage) {
          this.totalZonesEl.textContent = 'Пакет услуг';
        } else if (zonesCount === 0) {
          this.totalZonesEl.textContent = '0 зон';
        } else {
          this.totalZonesEl.textContent = `${zonesCount} ${zonesCount === 1 ? 'услуга' : zonesCount < 5 ? 'услуги' : 'услуг'}`;
        }
      } catch (e) {
        // Тихая обработка ошибок
      }
    }
    
    if (this.carClassInfoEl) {
      try {
        const className = this.carDatabase[classToUse]?.name;
        this.carClassInfoEl.textContent = className || 'Класс не выбран';
      } catch (e) {
        // Тихая обработка ошибок
      }
    }
    
    if (this.isMobile && this.updateMobilePrice) {
      this.updateMobilePrice();
    }
  }

  // ========== МОБИЛЬНАЯ ВЕРСИЯ (НОВЫЙ ВИЗАРД) ==========
  initMobileWizard() {
    this.currentStep = 1;
    this.selectedPackage = null;
    this.isManualZones = false;
    this.wizardBrandSearchQuery = '';
    this.wizardModelSearchQuery = '';
    
    // Показываем мобильный визард
    const mobileWizard = document.getElementById('mobileWizard');
    const desktopCalculator = document.getElementById('desktopCalculator');
    if (mobileWizard && this.isMobile) {
      mobileWizard.style.display = 'block';
      if (desktopCalculator) desktopCalculator.style.display = 'none';
    }
    
    // Инициализируем все шаги
    this.initWizardStep1();
    this.initWizardStep2();
    this.initWizardStep3();
    this.initWizardStep4();
    this.initWizardStep5();
    this.initWizardStep6();
    this.initWizardBottomBar();
    
    // Показываем первый шаг
    this.showWizardStep(1);
    this.updateWizardPrice();
  }
  
  // Инициализация шага 1: Выбор марки
  initWizardStep1() {
    this.renderWizardBrands();
    
    // Поиск по брендам с debounce
    const searchInput = document.getElementById('wizardBrandSearch');
    if (searchInput) {
      const debouncedSearch = this.debounce((e) => {
        this.wizardBrandSearchQuery = e.target.value.toLowerCase().trim();
        requestAnimationFrame(() => {
          this.renderWizardBrands();
        });
      }, 300);
      
      searchInput.addEventListener('input', debouncedSearch);
    }
  }
  
  // Рендер брендов для визарда
  renderWizardBrands() {
    const container = document.getElementById('wizardBrandsContainer');
    if (!container) return;
    
    let brands = this.getAllBrands();
    
    // Фильтрация по поиску
    if (this.wizardBrandSearchQuery) {
      brands = brands.filter(brand => 
        brand.toLowerCase().includes(this.wizardBrandSearchQuery)
      );
    }
    
    container.innerHTML = brands.map(brand => 
      `<div class="wizard-brand-chip ${this.selectedBrand === brand ? 'active' : ''}" 
            data-brand="${brand}" 
            onclick="window.calculator?.selectWizardBrand('${brand}')">
        ${brand}
      </div>`
    ).join('');
  }
  
  // Выбор бренда в визарде
  selectWizardBrand(brand) {
    this.selectedBrand = brand;
    this.selectedModel = null;
    this.selectedClass = null;
    this.renderWizardBrands();
    this.nextStep();
  }
  
  // Инициализация шага 2: Выбор модели
  initWizardStep2() {
    // Показываем выбранный бренд
    const selectedBrandEl = document.getElementById('wizardSelectedBrand');
    if (selectedBrandEl) {
      this.updateWizardSelectedBrand();
    }
    
    // Поиск по моделям с debounce
    const searchInput = document.getElementById('wizardModelSearch');
    if (searchInput) {
      const debouncedSearch = this.debounce((e) => {
        this.wizardModelSearchQuery = e.target.value.toLowerCase().trim();
        requestAnimationFrame(() => {
          this.renderWizardModels();
        });
      }, 300);
      
      searchInput.addEventListener('input', debouncedSearch);
    }
  }
  
  updateWizardSelectedBrand() {
    const selectedBrandEl = document.getElementById('wizardSelectedBrand');
    if (selectedBrandEl && this.selectedBrand) {
      selectedBrandEl.textContent = this.selectedBrand;
      selectedBrandEl.style.display = 'block';
    }
  }
  
  // Рендер моделей для визарда
  renderWizardModels() {
    const container = document.getElementById('wizardModelsContainer');
    if (!container || !this.selectedBrand) return;
    
    let models = this.getAllModelsForBrand(this.selectedBrand);
    
    // Фильтрация по поиску
    if (this.wizardModelSearchQuery) {
      models = models.filter(model => 
        model.toLowerCase().includes(this.wizardModelSearchQuery)
      );
    }
    
    container.innerHTML = models.map(model => 
      `<div class="wizard-model-chip ${this.selectedModel === model ? 'active' : ''}" 
            data-model="${model}" 
            onclick="window.calculator?.selectWizardModel('${model}')">
        ${model}
      </div>`
    ).join('');
  }
  
  // Выбор модели в визарде
  selectWizardModel(model) {
    this.selectModel(this.selectedBrand, model);
    this.renderWizardModels();
    this.nextStep();
  }
  
  // Инициализация шага 3: Определение класса
  initWizardStep3() {
    // Класс определяется автоматически при выборе модели
  }
  
  // Показать класс автомобиля
  renderWizardClass() {
    const carBrandModelEl = document.getElementById('wizardCarBrandModel');
    const classNameEl = document.getElementById('wizardClassName');
    const classDescEl = document.getElementById('wizardClassDesc');
    
    if (carBrandModelEl && this.selectedBrand && this.selectedModel) {
      carBrandModelEl.textContent = `${this.selectedBrand} ${this.selectedModel}`;
    }
    
    if (classNameEl && this.selectedClass) {
      const className = this.carDatabase[this.selectedClass]?.name || '';
      const classNames = {
        'small': 'Малый класс',
        'business': 'Бизнес класс / Кроссоверы',
        'suv-lux': 'Внедорожники / Люкс',
        'pickup': 'Большие пикапы',
        'bus': 'Автобусы / Минивэны'
      };
      
      classNameEl.textContent = classNames[this.selectedClass] || className;
      
      if (classDescEl) {
        const descriptions = {
          'small': 'Компактные и легковые автомобили',
          'business': 'Седаны бизнес-класса и кроссоверы',
          'suv-lux': 'Премиальные внедорожники и люксовые модели',
          'pickup': 'Полноразмерные пикапы',
          'bus': 'Минивэны и автобусы'
        };
        classDescEl.textContent = descriptions[this.selectedClass] || '';
      }
    }
  }
  
  // Инициализация шага 4: Выбор пакета
  initWizardStep4() {
    this.renderWizardPackages();
  }
  
  // Рендер пакетов для визарда
  renderWizardPackages() {
    const container = document.getElementById('wizardPackages');
    if (!container) return;
    
    const classToUse = this.selectedClass || 'small';
    const zonesData = this.zonesDatabase[classToUse];
    if (!zonesData || !zonesData['Пакеты услуг']) return;
    
    const packages = zonesData['Пакеты услуг'];
    
    container.innerHTML = packages.map(pkg => 
      `<div class="wizard-package-card ${this.selectedPackage === pkg.id ? 'active' : ''}" 
            data-package="${pkg.id}" 
            onclick="window.calculator?.selectWizardPackage('${pkg.id}')">
        <div class="wizard-package-title">${pkg.name}</div>
        <div class="wizard-package-desc">${this.getPackageDescription(pkg.id)}</div>
        <div class="wizard-package-price">${pkg.price.toLocaleString('ru-RU')} ₽</div>
      </div>`
    ).join('');
  }
  
  // Получить описание пакета
  getPackageDescription(packageId) {
    const descriptions = {
      'package-basic': 'Защита самых уязвимых зон кузова',
      'package-premium': 'Полная защита кузова глянцевой пленкой',
      'package-lux': 'Премиальная защита матовой пленкой'
    };
    return descriptions[packageId] || '';
  }
  
  // Выбор пакета в визарде
  selectWizardPackage(packageId) {
    this.selectedPackage = packageId;
    
    // Очищаем выбранные зоны
    this.selectedZones.clear();
    
    // Добавляем пакет и его зоны
    this.selectedZones.add(packageId);
          const packageZones = this.getPackageZones(packageId);
          packageZones.forEach(zoneId => {
      this.selectedZones.add(zoneId);
    });
    
    this.renderWizardPackages();
    this.updateWizardPrice();
    
    // Автоматически переходим к следующему шагу
    setTimeout(() => {
      this.nextStep();
    }, 300);
  }
  
  // Пропустить пакеты и перейти к зонам
  skipToZones() {
    this.selectedPackage = null;
    this.selectedZones.clear();
    this.showWizardStep(5);
  }
  
  // Инициализация шага 5: Выбор зон
  initWizardStep5() {
    this.renderWizardCarSvg();
    this.renderWizardZones();
  }
  
  // Рендер SVG автомобиля
  renderWizardCarSvg() {
    const container = document.getElementById('wizardCarSvgContainer');
    if (!container) return;
    
    // Простой SVG автомобиля (можно заменить на более детальный)
    container.innerHTML = `
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Кузов -->
        <rect x="50" y="80" width="300" height="80" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(22,132,145,0.2)" stroke-width="2" id="car-body"/>
        <!-- Капот -->
        <rect x="50" y="80" width="100" height="60" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-hood-svg" class="zone-svg"/>
        <!-- Передний бампер -->
        <rect x="50" y="130" width="100" height="20" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-front-bumper-svg" class="zone-svg"/>
        <!-- Передние крылья -->
        <rect x="50" y="70" width="80" height="30" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-front-fenders-svg" class="zone-svg"/>
        <!-- Двери -->
        <rect x="150" y="80" width="120" height="60" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-doors-svg" class="zone-svg"/>
        <!-- Задние крылья -->
        <rect x="270" y="70" width="80" height="30" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-rear-fenders-svg" class="zone-svg"/>
        <!-- Задний бампер -->
        <rect x="250" y="130" width="100" height="20" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-rear-bumper-svg" class="zone-svg"/>
        <!-- Крыша -->
        <rect x="80" y="50" width="240" height="40" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-roof-svg" class="zone-svg"/>
        <!-- Зеркала -->
        <circle cx="50" cy="90" r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="zone-mirrors-svg" class="zone-svg"/>
        <circle cx="350" cy="90" r="8" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1"/>
        <!-- Фары -->
        <ellipse cx="60" cy="100" rx="15" ry="10" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1" id="headlights-svg" class="zone-svg"/>
        <ellipse cx="140" cy="100" rx="15" ry="10" fill="rgba(255,255,255,0.05)" stroke="rgba(22,132,145,0.2)" stroke-width="1"/>
      </svg>
    `;
    
    // Подсветка выбранных зон
    this.updateWizardCarZonesVisual();
  }
  
  // Обновить визуальное отображение выбранных зон на SVG
  updateWizardCarZonesVisual() {
    this.selectedZones.forEach(zoneId => {
      const svgElement = document.getElementById(`${zoneId}-svg`);
      if (svgElement) {
        svgElement.style.fill = 'rgba(22, 132, 145, 0.3)';
        svgElement.style.stroke = '#168491';
        svgElement.style.strokeWidth = '3';
        svgElement.style.filter = 'drop-shadow(0 0 8px rgba(22, 132, 145, 0.6))';
      }
    });
  }
  
  // Рендер зон для визарда
  renderWizardZones() {
    const container = document.getElementById('wizardZonesList');
    if (!container) return;
    
    const classToUse = this.selectedClass || 'small';
    const zonesData = this.zonesDatabase[classToUse];
    if (!zonesData) return;
    
    // Получаем только зоны оклейки (не пакеты и не полную оклейку)
    const zones = zonesData['Зоны оклейки'] || [];
    
    container.innerHTML = zones.map(zone => 
      `<div class="wizard-zone-item ${this.selectedZones.has(zone.id) ? 'active' : ''}" 
            data-zone="${zone.id}" 
            onclick="window.calculator?.toggleWizardZone('${zone.id}')">
        <input type="checkbox" 
               class="wizard-zone-checkbox" 
               ${this.selectedZones.has(zone.id) ? 'checked' : ''} 
               id="wizard-zone-${zone.id}">
        <label class="wizard-zone-label" for="wizard-zone-${zone.id}">${zone.name}</label>
        <div class="wizard-zone-price">${zone.price.toLocaleString('ru-RU')} ₽</div>
      </div>`
    ).join('');
  }
  
  // Переключение зоны в визарде
  toggleWizardZone(zoneId) {
    if (this.selectedZones.has(zoneId)) {
      this.selectedZones.delete(zoneId);
        } else {
      this.selectedZones.add(zoneId);
    }
    
    // Снимаем выбор пакета при ручном выборе зон
    if (this.selectedZones.has(zoneId)) {
      ['package-basic', 'package-premium', 'package-lux'].forEach(pkgId => {
        this.selectedZones.delete(pkgId);
        const packageZones = this.getPackageZones(pkgId);
        packageZones.forEach(pZoneId => {
          this.selectedZones.delete(pZoneId);
        });
      });
      this.selectedPackage = null;
    }
    
    this.renderWizardZones();
    this.renderWizardCarSvg();
    this.updateWizardCarZonesVisual();
    this.updateWizardPrice();
  }
  
  // Инициализация шага 6: Итог
  initWizardStep6() {
    this.renderWizardSummary();
  }
  
  // Рендер итогового экрана
  renderWizardSummary() {
    const container = document.getElementById('wizardSummary');
    const priceAmountEl = document.getElementById('wizardFinalPriceAmount');
    
    if (!container) return;
    
    const total = this.calculateTotal();
    
    let summaryHTML = `
      <div class="wizard-summary-item">
        <div class="wizard-summary-label">Автомобиль</div>
        <div class="wizard-summary-value">${this.selectedBrand || '—'} ${this.selectedModel || '—'}</div>
      </div>
      <div class="wizard-summary-item">
        <div class="wizard-summary-label">Класс</div>
        <div class="wizard-summary-value">${this.carDatabase[this.selectedClass]?.name || '—'}</div>
      </div>
    `;
    
    if (this.selectedPackage) {
      const packageName = this.getPackageName(this.selectedPackage);
      summaryHTML += `
        <div class="wizard-summary-item">
          <div class="wizard-summary-label">Пакет</div>
          <div class="wizard-summary-value">${packageName}</div>
        </div>
      `;
    } else {
      const zonesCount = this.selectedZones.size;
      summaryHTML += `
        <div class="wizard-summary-item">
          <div class="wizard-summary-label">Выбранные зоны</div>
          <div class="wizard-summary-value">${zonesCount} ${zonesCount === 1 ? 'зона' : zonesCount < 5 ? 'зоны' : 'зон'}</div>
        </div>
      `;
    }
    
    container.innerHTML = summaryHTML;
    
    if (priceAmountEl) {
      priceAmountEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    }
  }
  
  // Получить название пакета
  getPackageName(packageId) {
    const classToUse = this.selectedClass || 'small';
    const zonesData = this.zonesDatabase[classToUse];
    if (!zonesData || !zonesData['Пакеты услуг']) return '';
    
    const pkg = zonesData['Пакеты услуг'].find(p => p.id === packageId);
    return pkg ? pkg.name : '';
  }
  
  // Инициализация нижней панели
  initWizardBottomBar() {
    const nextBtn = document.getElementById('wizardNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextStep();
      });
    }
  }
  
  // Показать шаг визарда
  showWizardStep(step) {
    // Скрываем все шаги
    document.querySelectorAll('.wizard-step').forEach(stepEl => {
      stepEl.classList.remove('active', 'slide-out', 'slide-in');
      stepEl.style.display = 'none';
    });
    
    // Показываем нужный шаг
    const stepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (stepEl) {
      stepEl.style.display = 'block';
    setTimeout(() => {
        stepEl.classList.add('active', 'slide-in');
    }, 10);
    }
    
    // Обновляем кнопку "Назад"
    const backBtns = document.querySelectorAll('.wizard-back-btn');
    backBtns.forEach(btn => {
      btn.style.display = step > 1 ? 'flex' : 'none';
    });
    
    // Обновляем кнопку "Далее"
    const nextBtn = document.getElementById('wizardNextBtn');
    if (nextBtn) {
      if (step === 6) {
        nextBtn.textContent = 'Записаться';
        nextBtn.classList.add('final');
        nextBtn.onclick = () => {
          // Переход на страницу записи или открытие модального окна
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'scrollToContacts' }, '*');
            window.parent.postMessage({ type: 'openModal' }, '*');
          } else {
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
          }
        };
      } else {
        nextBtn.textContent = 'Далее';
        nextBtn.classList.remove('final');
        nextBtn.onclick = () => this.nextStep();
      }
      
      // Блокируем кнопку если шаг не пройден
      nextBtn.disabled = !this.canProceedToNextStep(step);
    }
    
    // Обновляем прогресс-бар
    const progressBar = document.querySelector('.wizard-progress-bar');
    if (progressBar) {
      const width = (step / 6) * 100;
      progressBar.style.width = `${width}%`;
    }
    
    this.currentStep = step;
    
    // Загружаем контент шага если нужно
    if (step === 2 && this.selectedBrand) {
      this.updateWizardSelectedBrand();
      this.renderWizardModels();
    } else if (step === 3 && this.selectedModel) {
      this.renderWizardClass();
    } else if (step === 4 && this.selectedClass) {
      this.renderWizardPackages();
    } else if (step === 5 && this.selectedClass) {
      this.renderWizardCarSvg();
      this.renderWizardZones();
    } else if (step === 6) {
      this.renderWizardSummary();
    }
  }
  
  // Проверка возможности перехода к следующему шагу
  canProceedToNextStep(step) {
    switch(step) {
      case 1: return !!this.selectedBrand;
      case 2: return !!this.selectedModel;
      case 3: return !!this.selectedClass;
      case 4: return this.selectedPackage || true; // Можно пропустить пакеты
      case 5: return this.selectedZones.size > 0 || this.selectedPackage;
      case 6: return true;
      default: return false;
    }
  }
  
  // Следующий шаг
  nextStep() {
    if (this.currentStep < 6 && this.canProceedToNextStep(this.currentStep)) {
      this.showWizardStep(this.currentStep + 1);
      this.updateWizardPrice();
    }
  }
  
  // Предыдущий шаг
  prevStep() {
    if (this.currentStep > 1) {
      this.showWizardStep(this.currentStep - 1);
      this.updateWizardPrice();
    }
  }
  
  // Обновить цену в визарде
  updateWizardPrice() {
    const total = this.calculateTotal();
    const priceEl = document.getElementById('wizardBottomPrice');
    if (priceEl) {
      priceEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    }
  }
  
  // Старые методы мобильного визарда (для совместимости)
  updateMobileStep(step) {
    this.showWizardStep(step);
  }
  
  updateMobilePrice() {
    this.updateWizardPrice();
  }

  bindMobileStep1() {
    // Используем десктопную версию (она работает и на мобильных)
    // bindClassSelection уже вызывается в init(), но вызываем ещё раз для надёжности
    this.bindClassSelection();
    // Также вызываем мобильную версию (она использует те же элементы)
    this.bindMobileClassSelection();
    // Убеждаемся что brand chips отображаются
    setTimeout(() => {
      this.renderBrandChips();
    }, 50);
  }

  bindMobileStep2() {
    this.bindMobileBrandSelection();
    this.bindMobileBrandSearch();
    this.bindMobileManualModel();
  }

  bindMobileStep3() {
    this.bindMobileModelSelection();
    this.bindMobileRiskZones();
  }

  bindMobileStep4() {
    this.bindMobileZoneSelection();
  }

  bindMobileClassSelection() {
    // Используем те же кнопки что и в десктопной версии (они есть в HTML)
    const classOptions = document.querySelectorAll('.class-option');
    if (!classOptions.length) return;
    
    classOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        classOptions.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedClass = btn.dataset.class;
        this.updateMobileButtons();
      });
    });
  }
  
  bindMobileBrandSelection() {
    // Используем обычный renderBrandChips (он работает и на мобильных)
    this.renderBrandChips();
  }

  renderMobileBrandChips() {
    const container = document.getElementById('mobileBrandChips');
    if (!container) return;
    
    const brands = this.getAllBrands();
    
    container.innerHTML = brands.map(brand => 
      `<button class="chip ${this.selectedBrand === brand ? 'active' : ''}" data-brand="${brand}">${brand}</button>`
    ).join('');
    
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.selectedBrand = chip.dataset.brand;
        this.selectedModel = null;
        // Не сбрасываем selectedClass, иначе не будет работать фильтрация
        this.renderBrandChips(); // Используем обычный метод
        if (this.updateMobileButtons) this.updateMobileButtons();
      });
    });
  }
  
  bindMobileBrandSearch() {
    const searchInput = document.getElementById('mobileBrandSearch');
    const dropdown = document.getElementById('mobileBrandDropdown');
    
    if (!searchInput || !dropdown) return;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 1) {
        dropdown.style.display = 'none';
        return;
      }
      
      const results = this.allBrands.filter(brand => 
        brand.toLowerCase().includes(query)
      );
      
      this.showMobileBrandDropdown(results);
    });
  }
  
  showMobileBrandDropdown(results) {
    const dropdown = document.getElementById('mobileBrandDropdown');
    const searchInput = document.getElementById('mobileBrandSearch');
    if (!dropdown || !searchInput) return;
    
    dropdown.innerHTML = results.length
      ? results.map((brand) => 
          `<div class="dropdown-item" data-brand="${brand}">
            <span class="dropdown-brand">${brand}</span>
          </div>`
        ).join('')
      : '<div class="dropdown-item no-results">Ничего не найдено</div>';
    dropdown.style.display = 'block';
    
    dropdown.querySelectorAll('.dropdown-item:not(.no-results)').forEach((it) =>
      it.addEventListener('click', () => {
        this.selectedBrand = it.dataset.brand;
        this.selectedModel = null;
        this.selectedClass = null;
        if (searchInput) searchInput.value = '';
        dropdown.style.display = 'none';
        this.renderMobileBrandChips();
        this.updateMobileButtons();
      })
    );
  }

  bindMobileManualModel() {
    const manualBtn = document.getElementById('mobileManualModelBtn');
    const manualForm = document.getElementById('mobileManualModelForm');
    const manualInput = document.getElementById('mobileManualModelInput');
    const manualSubmit = document.getElementById('mobileManualModelSubmit');
    const manualCancel = document.getElementById('mobileManualModelCancel');
    
    if (!manualBtn || !manualForm) return;
    
    manualBtn.addEventListener('click', () => {
      manualForm.style.display = 'block';
      manualBtn.style.display = 'none';
      if (manualInput) manualInput.focus();
    });
    
    if (manualCancel) {
      manualCancel.addEventListener('click', () => {
        manualForm.style.display = 'none';
        manualBtn.style.display = 'block';
        if (manualInput) manualInput.value = '';
      });
    }
    
    if (manualSubmit && manualInput) {
      manualSubmit.addEventListener('click', () => {
        const modelName = manualInput.value.trim();
        if (modelName) {
          this.selectedModel = modelName;
          this.updateMobileModelDisplay();
          manualForm.style.display = 'none';
          manualBtn.style.display = 'block';
          if (manualInput) manualInput.value = '';
          this.updateMobileButtons();
        }
      });
      
      manualInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          manualSubmit.click();
        }
      });
    }
  }
  
  bindMobileModelSelection() {
    this.renderMobileModelChips();
    this.bindMobileSearch();
  }

  renderMobileModelChips() {
    const container = document.getElementById('mobileModelChips');
    if (!container || !this.selectedBrand) return;
    
    const popularModels = this.getPopularModelsForBrand(this.selectedBrand);
    
    if (popularModels.length === 0) {
      container.innerHTML = '<p style="color: var(--muted); font-size: 14px; text-align: center; padding: 20px;">Модели не найдены. Используйте ручной ввод.</p>';
      return;
    }
    
    container.innerHTML = popularModels.map(model => 
      `<button class="chip ${this.selectedModel === model ? 'active' : ''}" data-model="${model}">${model}</button>`
    ).join('');
    
    container.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.selectedModel = chip.dataset.model;
        this.updateMobileModelDisplay();
        this.updateMobileButtons();
        container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });
    
    if (this.selectedModel) {
      this.updateMobileModelDisplay();
    }
  }
  
  bindMobileSearch() {
    const searchInput = document.getElementById('mobileModelSearch');
    const dropdown = document.getElementById('mobileModelDropdown');
    
    if (!searchInput || !dropdown) return;
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 1) {
        dropdown.style.display = 'none';
        return;
      }
      
      if (!this.selectedBrand) return;
      
      const models = this.getAllModelsForBrand(this.selectedBrand);
      const results = models.filter(model => 
        model.toLowerCase().includes(query)
      ).slice(0, 20);
      
      this.showMobileModelDropdown(results);
    });
  }

  showMobileModelDropdown(results) {
    const dropdown = document.getElementById('mobileModelDropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = results.length
      ? results.map((model) => 
          `<div class="dropdown-item" data-model="${model}">
            <span class="dropdown-model">${model}</span>
          </div>`
        ).join('')
      : '<div class="dropdown-item no-results">Ничего не найдено</div>';
    dropdown.style.display = 'block';
    
    dropdown.querySelectorAll('.dropdown-item:not(.no-results)').forEach((it) =>
      it.addEventListener('click', () => {
        this.selectedModel = it.dataset.model;
        const searchInput = document.getElementById('mobileModelSearch');
        if (searchInput) searchInput.value = '';
        dropdown.style.display = 'none';
        this.updateMobileModelDisplay();
        this.updateMobileButtons();
      })
    );
  }
  
  bindMobileRiskZones() {
    const riskBtn = document.getElementById('mobileRiskZonesBtn');
    if (!riskBtn) return;
    
    riskBtn.addEventListener('click', () => {
      if (!this.selectedClass) {
        alert('Сначала выберите класс автомобиля');
      return;
    }
    
        const riskZones = this.getRiskZonesForClass(this.selectedClass);
      this.selectedZones.clear();
      
        riskZones.forEach(zoneId => {
          this.selectedZones.add(zoneId);
        const checkbox = document.querySelector(`#mobile-zone-${zoneId}`);
        if (checkbox) checkbox.checked = true;
        });
        
        this.updateMobileCarZonesVisual();
      this.updateMobileTotal();
    });
  }

  bindMobileZoneSelection() {
    this.renderMobileZones();
  }
  
  renderMobileZones() {
    const container = document.getElementById('mobileZonesSelection');
    if (!container || !this.selectedClass) return;
    
    const zonesData = this.zonesDatabase[this.selectedClass];
    let html = '';
    Object.entries(zonesData).forEach(([cat, arr]) => {
      const isPackageCategory = cat === 'Пакеты услуг';
      html += `<div class="zone-category ${isPackageCategory ? 'package-category' : ''}"><h3>${cat}</h3><div class="zone-items ${isPackageCategory ? 'package-items' : ''}">`;
      html += arr
        .map(
          (z) => `
            <label class="zone-item ${z.type === 'package' ? 'package-item' : ''}" data-zone="${z.id}" data-type="${z.type || ''}">
              <input type="${isPackageCategory ? 'radio' : 'checkbox'}" name="${isPackageCategory ? 'package' : 'zone'}" id="mobile-zone-${z.id}" ${this.selectedZones.has(z.id) ? 'checked' : ''}>
              <span>${z.name}</span>
              <span class="zone-price" data-price="${z.price}">${z.price.toLocaleString('ru-RU')} ₽</span>
            </label>`
        )
        .join('');
      html += '</div></div>';
    });
    container.innerHTML = html;
    
    container.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((cb) =>
      cb.addEventListener('change', (e) => this.toggleMobileZone(e.target))
    );
    
    this.updateMobileTotal();
  }
  
  toggleMobileZone(checkbox) {
    const zoneItem = checkbox.closest('.zone-item');
    const zone = zoneItem.dataset.zone;
    const isPackage = zoneItem.dataset.type === 'package';
    
    if (isPackage && checkbox.checked) {
      const zonesToRemove = Array.from(this.selectedZones);
      zonesToRemove.forEach(id => {
        if (id !== zone) {
          this.selectedZones.delete(id);
          const zoneCheckbox = document.querySelector(`#mobile-zone-${id}`);
          if (zoneCheckbox) zoneCheckbox.checked = false;
        }
      });
      
      this.selectedZones.forEach(id => {
        const otherItem = document.querySelector(`.zone-item[data-zone="${id}"]`);
        if (otherItem && otherItem.dataset.type === 'package' && id !== zone) {
          this.selectedZones.delete(id);
          const otherCheckbox = document.querySelector(`#mobile-zone-${id}`);
          if (otherCheckbox) otherCheckbox.checked = false;
          const prevPackageZones = this.getPackageZones(id);
          prevPackageZones.forEach(zoneId => {
            this.selectedZones.delete(zoneId);
            const zoneCheckbox = document.querySelector(`#mobile-zone-${zoneId}`);
            if (zoneCheckbox) zoneCheckbox.checked = false;
          });
        }
      });
      
      this.selectedZones.add(zone);
      const packageZones = this.getPackageZones(zone);
      packageZones.forEach(zoneId => {
        this.selectedZones.add(zoneId);
        const zoneCheckbox = document.querySelector(`#mobile-zone-${zoneId}`);
        if (zoneCheckbox) zoneCheckbox.checked = true;
      });
    }
    
    if (isPackage && !checkbox.checked) {
      this.selectedZones.delete(zone);
      const packageZones = this.getPackageZones(zone);
      packageZones.forEach(zoneId => {
        this.selectedZones.delete(zoneId);
        const zoneCheckbox = document.querySelector(`#mobile-zone-${zoneId}`);
        if (zoneCheckbox) zoneCheckbox.checked = false;
      });
    }
    
    if (!isPackage) {
      if (checkbox.checked) {
        this.selectedZones.add(zone);
      } else {
        this.selectedZones.delete(zone);
      }
    }
    
    this.updateMobileTotal();
  }
  
  updateMobileTotal() {
    this.updateMobilePrice();
  }
  
  updateMobilePrice() {
    const priceEl = document.getElementById('mobilePriceValue');
    if (priceEl) {
      const total = this.calculateMobileTotal();
      if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
          if (priceEl) {
            priceEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
          }
        });
      } else {
        priceEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
      }
    }
  }
  
  calculateMobileTotal() {
    let total = 0;
    const classToUse = this.selectedClass || 'small';
    
    if (this.selectedPackage && classToUse) {
      const packageId = `package-${this.selectedPackage}`;
      const zonesData = this.zonesDatabase[classToUse];
      if (zonesData && zonesData['Пакеты услуг']) {
        const packageData = zonesData['Пакеты услуг'].find(pkg => pkg.id === packageId);
        if (packageData) {
          total = packageData.price;
          return total;
        }
      }
    }
    
    if (this.selectedZones.size > 0 && classToUse) {
      const zonesData = this.zonesDatabase[classToUse];
      if (zonesData) {
        const packageZones = new Set();
        const allZones = Object.values(zonesData).flat();
        
        this.selectedZones.forEach(id => {
          const zoneItem = allZones.find(z => z.id === id);
          if (zoneItem && zoneItem.type === 'package') {
            const zones = this.getPackageZones(id);
            zones.forEach(zoneId => packageZones.add(zoneId));
          }
        });
        
        this.selectedZones.forEach(zoneId => {
          const zoneItem = allZones.find(z => z.id === zoneId);
          
          if (zoneItem) {
            if (zoneItem.type === 'package') {
              total += zoneItem.price;
            } else if (!packageZones.has(zoneId)) {
              total += zoneItem.price;
            }
          }
        });
      }
    }
    
    return total;
  }
}

// Инициализация калькулятора
document.addEventListener('DOMContentLoaded', () => {
  window.calculator = new CarWrappingCalculator();
  
  // Управление автовоспроизведением фонового видео
  initHeroVideo();
});

// Инициализация фонового видео из YouTube Shorts
function initHeroVideo() {
  const desktopVideo = document.getElementById('heroVideoDesktop');
  const mobileVideo = document.getElementById('heroVideoMobile');
  
  // Принудительно устанавливаем НОВОЕ видео для десктопа - полностью заменяем старое
  if (desktopVideo && window.innerWidth > 768) {
    const newDesktopVideoSrc = 'https://www.youtube.com/embed/CqoG-pyVSFM?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=CqoG-pyVSFM&start=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&enablejsapi=1&si=r3ngGX13BomWWGXK&origin=https://angryrebelll-web.github.io';
    
    // ВСЕГДА полностью заменяем видео для десктопа
    desktopVideo.removeAttribute('src');
    desktopVideo.src = '';
    
    // Принудительно устанавливаем новое видео
    setTimeout(() => {
      desktopVideo.setAttribute('src', newDesktopVideoSrc);
      desktopVideo.src = newDesktopVideoSrc;
      desktopVideo.load(); // Принудительно перезагружаем iframe
    }, 100);
  }
  
  // Функция для обеспечения видимости и автовоспроизведения YouTube видео
  const ensureVideoPlayback = (iframe, isDesktop = false) => {
    if (!iframe) return;
    
    // Для десктопного видео проверяем правильность видео
    if (isDesktop) {
      const newVideoSrc = 'https://www.youtube.com/embed/CqoG-pyVSFM?autoplay=1&loop=1&mute=1&controls=0&showinfo=0&rel=0&playsinline=1&playlist=CqoG-pyVSFM&start=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&enablejsapi=1&si=r3ngGX13BomWWGXK&origin=https://angryrebelll-web.github.io';
      const currentSrc = iframe.src || '';
      
      // ВСЕГДА заменяем на новое видео для десктопа
      if (!currentSrc.includes('CqoG-pyVSFM') || !currentSrc.includes('si=r3ngGX13BomWWGXK')) {
        iframe.removeAttribute('src');
        iframe.src = '';
        setTimeout(() => {
          iframe.setAttribute('src', newVideoSrc);
          iframe.src = newVideoSrc;
        }, 150);
      }
    }
    
    // Принудительно показываем iframe
    iframe.style.opacity = '1';
    iframe.style.visibility = 'visible';
    iframe.style.display = 'block';
    
    iframe.addEventListener('load', () => {
      // Видео загружено, делаем его видимым
      iframe.style.opacity = '1';
      
      // Попытка запустить воспроизведение через YouTube API
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }
      } catch (e) {
        console.log('YouTube video autoplay:', e);
      }
    });
    
    // Принудительное отображение через небольшую задержку
    setTimeout(() => {
      iframe.style.display = 'block';
      iframe.style.visibility = 'visible';
      iframe.style.opacity = '1';
    }, 500);
  };
  
  if (desktopVideo && window.innerWidth > 768) {
    ensureVideoPlayback(desktopVideo, true);
  }
  
  if (mobileVideo && window.innerWidth <= 768) {
    ensureVideoPlayback(mobileVideo, false);
  }
  
  // Обработка видимости страницы для возобновления воспроизведения
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // Возобновить воспроизведение при возврате на страницу
      if (desktopVideo && window.innerWidth > 768) {
        try {
          desktopVideo.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch (e) {}
      }
      if (mobileVideo && window.innerWidth <= 768) {
        try {
          mobileVideo.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch (e) {}
      }
    }
  });
  
  // Обработка сообщений от YouTube iframe
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://www.youtube.com') return;
    
    try {
      const data = JSON.parse(event.data);
      if (data.event === 'onStateChange' && data.info === 0) {
        // Видео закончилось, перезапускаем для зацикливания
        if (desktopVideo && window.innerWidth > 768) {
          desktopVideo.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
        }
        if (mobileVideo && window.innerWidth <= 768) {
          mobileVideo.contentWindow.postMessage('{"event":"command","func":"seekTo","args":[0, true]}', '*');
        }
      }
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
  });
}