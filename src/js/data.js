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

export const classPrices = {
  small: {
    name: "Малый класс",
    base: 15000
  },
  business: {
    name: "Бизнес класс / Кроссоверы",
    base: 20000
  },
  suv: {
    name: "Внедорожники / Люкс",
    base: 25000
  },
  luxury: {
    name: "Люкс",
    base: 30000
  },
  pickup: {
    name: "Большие пикапы",
    base: 35000
  },
  bus: {
    name: "Автобусы / Минивэны",
    base: 40000
  }
};

export const packages = {
  base: {
    name: "Базовый",
    description: "Зоны риска",
    price: 25000
  },
  premium: {
    name: "Премиум",
    description: "Полная оклейка",
    price: 180000
  },
  luxe: {
    name: "Люкс",
    description: "Премиум пакет",
    price: 250000
  },
  risk: {
    name: "Зоны риска",
    description: "Защита наиболее уязвимых элементов",
    price: 25000
  }
};

export const zones = {
  "Капот": 15000,
  "Передний бампер": 20000,
  "Задний бампер": 20000,
  "Зеркала": 5000,
  "Пороги": 10000,
  "Двери": 25000,
  "Крылья": 15000,
  "Фары": 5000,
  "Полная оклейка": 180000
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

