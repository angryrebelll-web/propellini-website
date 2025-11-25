/* ============================================
   CALCULATOR DATA - Единый источник данных
   ============================================ */

export const carDB = {
  "Audi": {
    "A1": "small",
    "A3": "small",
    "A4": "small",
    "A5": "small",
    "A6": "small",
    "A7": "business",
    "A8": "business",
    "Q2": "business",
    "Q3": "business",
    "Q5": "business",
    "Q7": "suv",
    "Q8": "suv",
    "R8": "suv",
    "TT": "small",
    "e-tron": "suv",
    "e-tron GT": "business"
  },
  "BMW": {
    "1 Series": "small",
    "2 Series": "small",
    "3 Series": "small",
    "4 Series": "small",
    "5 Series": "small",
    "6 Series": "business",
    "6 GT": "business",
    "7 Series": "business",
    "8 Series": "suv",
    "X1": "business",
    "X2": "business",
    "X3": "business",
    "X4": "business",
    "X5": "suv",
    "X6": "suv",
    "X7": "suv",
    "X18": "business",
    "Z4": "small",
    "i3": "small",
    "i4": "small",
    "iX": "suv",
    "M3": "small",
    "M4": "small",
    "M5": "business",
    "M8": "suv"
  },
  "Mercedes-Benz": {
    "A-Class": "small",
    "B-Class": "small",
    "C-Class": "small",
    "CLK": "small",
    "CLS": "business",
    "E-Class": "small",
    "S-Class": "business",
    "S-Coupe": "business",
    "SL": "small",
    "SLK": "small",
    "SLS": "suv",
    "AMG GT": "suv",
    "GLA": "business",
    "GLB": "business",
    "GLC": "business",
    "GLE": "suv",
    "GLK": "business",
    "GLS": "bus",
    "G-Class": "bus",
    "R-Class": "suv"
  },
  "Porsche": {
    "911": "suv",
    "718": "suv",
    "Panamera": "suv",
    "Cayenne": "suv",
    "Macan": "suv",
    "Taycan": "suv"
  },
  "Range Rover": {
    "Evoque": "suv",
    "Velar": "suv",
    "Sport": "suv",
    "Vogue": "suv"
  },
  "Lexus": {
    "IS": "business",
    "ES": "business",
    "GS": "business",
    "LS": "business",
    "NX": "business",
    "RX": "business",
    "GX": "business",
    "LX": "business"
  },
  "Toyota": {
    "Camry": "business",
    "RAV4": "business",
    "Highlander": "business",
    "Land Cruiser": "business",
    "Prado": "business"
  },
  "Volvo": {
    "S60": "business",
    "S90": "business",
    "XC40": "business",
    "XC60": "business",
    "XC90": "business"
  },
  "Tesla": {
    "Model 3": "business",
    "Model S": "business",
    "Model X": "suv",
    "Model Y": "business"
  }
};

export const autoClassMap = {
  "Малый класс": [
    "Polo", "Rio", "Solaris", "Fabia", "Mini Cooper"
  ],
  "Средний / C-класс": [
    "Mazda 3", "Corolla", "Octavia", "Civic", "Elantra"
  ],
  "Бизнес": [
    "E-Class", "5-Series", "A6", "ES", "Genesis G80"
  ],
  "Кроссоверы": [
    "Tiguan", "RAV4", "Sportage", "CX-5", "Qashqai"
  ],
  "Премиальные кроссоверы": [
    "X5", "GLE", "Q7", "Cayenne", "Velar"
  ],
  "Внедорожники / Люкс": [
    "Range Rover", "LX600", "GLS", "Urus", "Cullinan", "G63"
  ],
  "Купе / Спорт": [
    "911 Turbo S", "AMG GT", "RS7", "M8", "Huracan", "Ferrari Roma"
  ],
  "Пикапы": [
    "F-150", "Ram", "Tundra", "Hilux"
  ],
  "Минивэны": [
    "V-Class", "Carnival", "Sienna"
  ]
};

export const basePriceByClass = {
  "Малый класс": 20000,
  "Средний / C-класс": 25000,
  "Бизнес": 30000,
  "Кроссоверы": 35000,
  "Премиальные кроссоверы": 45000,
  "Внедорожники / Люкс": 60000,
  "Купе / Спорт": 70000,
  "Пикапы": 40000,
  "Минивэны": 45000
};

export const classPrices = {
  small: {
    name: "Малый класс",
    base: 20000
  },
  business: {
    name: "Бизнес",
    base: 30000
  },
  suv: {
    name: "Кроссоверы",
    base: 35000
  },
  luxury: {
    name: "Премиальные кроссоверы",
    base: 45000
  },
  pickup: {
    name: "Пикапы",
    base: 40000
  },
  bus: {
    name: "Минивэны",
    base: 45000
  },
  medium: {
    name: "Средний / C-класс",
    base: 25000
  },
  premium_suv: {
    name: "Премиальные кроссоверы",
    base: 45000
  },
  offroad_luxury: {
    name: "Внедорожники / Люкс",
    base: 60000
  },
  coupe_sport: {
    name: "Купе / Спорт",
    base: 70000
  }
};

export const packages = {
  base: {
    name: "Базовый",
    description: "Зоны риска + частичный капот",
    price: 35000,
    priceFrom: 35000
  },
  premium: {
    name: "Премиум",
    description: "Почти весь кузов, глянцевая пленка",
    price: 120000,
    priceFrom: 120000
  },
  luxe: {
    name: "Люкс",
    description: "Полная оклейка, мат/глянец, антихром",
    price: 200000,
    priceFrom: 200000
  },
  risk: {
    name: "Зоны риска",
    description: "Защита наиболее уязвимых элементов",
    price: 35000,
    priceFrom: 35000
  }
};

export const zones = {
  "Передний бампер": 12000,
  "Капот частично": 8000,
  "Капот полностью": 15000,
  "Передние крылья": 10000,
  "Задние крылья": 10000,
  "Двери": 15000,
  "Пороги": 6000,
  "Фары": 5000,
  "Зеркала": 5000,
  "Крыша": 12000,
  "Крышка багажника": 10000,
  "Капли под ручками": 3000,
  "Лобовое бронирование": 20000,
  "Капот": 15000,
  "Задний бампер": 20000,
  "Крылья": 15000,
  "Полная оклейка": 180000
};

export const addons = {
  "Керамика поверх пленки": 30000,
  "Полировка перед оклейкой": 15000,
  "Химчистка салона": 10000,
  "Антихром": 25000,
  "Тонировка": 12000,
  "Защита стекол": 8000
};

// Получить все бренды
export function getAllBrands() {
  return Object.keys(carDB);
}

// Получить модели для бренда
export function getModelsForBrand(brand) {
  return carDB[brand] ? Object.keys(carDB[brand]) : [];
}

// Получить класс для модели
export function getClassForModel(brand, model) {
  return carDB[brand]?.[model] || "small";
}


