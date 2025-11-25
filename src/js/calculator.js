/* ============================================
   CALCULATOR LOGIC - Логика и состояние
   ============================================ */

import { carDB, classPrices, packages, zones, getAllBrands, getModelsForBrand, getClassForModel } from "./data.js";
import { renderStep } from "./ui.js";

let step = 1;
let selectedBrand = null;
let selectedModel = null;
let selectedClass = null;
let selectedPackage = null;
let selectedZones = [];

// Геттеры
export function getStep() { return step; }
export function getSelectedBrand() { return selectedBrand; }
export function getSelectedModel() { return selectedModel; }
export function getSelectedClass() { return selectedClass; }
export function getSelectedPackage() { return selectedPackage; }
export function getSelectedZones() { return selectedZones; }

// Сеттеры
export function setBrand(brand) {
  selectedBrand = brand;
  selectedModel = null;
  selectedClass = null;
  selectedZones = [];
  selectedPackage = null;
}

export function setModel(model) {
  selectedModel = model;
  selectedClass = getClassForModel(selectedBrand, model);
  selectedZones = [];
  selectedPackage = null;
}

export function setPackage(pkg) {
  selectedPackage = pkg;
  selectedZones = [];
}

export function toggleZone(zone) {
  const index = selectedZones.indexOf(zone);
  if (index > -1) {
    selectedZones.splice(index, 1);
  } else {
    selectedZones.push(zone);
  }
  selectedPackage = null; // Снимаем пакет при ручном выборе зон
}

export function nextStep() {
  if (step < 4) {
    step++;
    renderStep();
  }
}

export function prevStep() {
  if (step > 1) {
    step--;
    renderStep();
  }
}

export function reset() {
  step = 1;
  selectedBrand = null;
  selectedModel = null;
  selectedClass = null;
  selectedPackage = null;
  selectedZones = [];
}

// Расчет итоговой стоимости
export function calculateTotal() {
  let total = 0;
  
  // Базовая цена класса
  if (selectedClass && classPrices[selectedClass]) {
    total += classPrices[selectedClass].base;
  }
  
  // Пакет или зоны
  if (selectedPackage && packages[selectedPackage]) {
    total += packages[selectedPackage].price;
  } else if (selectedZones.length > 0) {
    selectedZones.forEach(zone => {
      if (zones[zone]) {
        total += zones[zone];
      }
    });
  }
  
  return total;
}

// Проверка возможности перехода к следующему шагу
export function canGoNext() {
  switch(step) {
    case 1: return !!selectedBrand;
    case 2: return !!selectedModel;
    case 3: return selectedPackage || selectedZones.length > 0;
    case 4: return true;
    default: return false;
  }
}

// Получить данные для формы заявки
export function getRequestData() {
  return {
    brand: selectedBrand,
    model: selectedModel,
    class: selectedClass ? classPrices[selectedClass].name : null,
    package: selectedPackage ? packages[selectedPackage].name : null,
    zones: selectedZones,
    total: calculateTotal()
  };
}

