/* ============================================
   UI - Анимации и рендеринг
   ============================================ */

import { 
  getAllBrands, 
  getModelsForBrand, 
  getClassForModel,
  classPrices,
  packages,
  zones
} from "./data.js";

import {
  getStep,
  getSelectedBrand,
  getSelectedModel,
  getSelectedClass,
  getSelectedPackage,
  getSelectedZones,
  setBrand,
  setModel,
  setPackage,
  toggleZone,
  nextStep,
  prevStep,
  calculateTotal,
  canGoNext,
  getRequestData
} from "./calculator.js";

import { openRequestForm } from "./modal.js";

const stepTitle = document.getElementById("calcStepTitle");
const stepContent = document.getElementById("calcStepContent");
const totalEl = document.getElementById("calcTotal");
const nextBtn = document.getElementById("nextStepBtn");
const prevBtn = document.getElementById("prevStepBtn");

// Обновление итоговой стоимости
export function updateTotal() {
  if (!totalEl) return;
  const total = calculateTotal();
  totalEl.textContent = total.toLocaleString("ru-RU") + " ₽";
}

// Рендеринг шага
export function renderStep() {
  const currentStep = getStep();
  
  if (!stepContent) return;
  
  // Обновляем заголовок
  if (stepTitle) {
    const titles = {
      1: "Выберите марку автомобиля",
      2: "Выберите модель",
      3: "Выберите услугу",
      4: "Проверьте данные"
    };
    stepTitle.textContent = titles[currentStep] || "";
  }
  
  // Рендерим контент шага
  stepContent.innerHTML = "";
  
  if (currentStep === 1) renderBrands();
  else if (currentStep === 2) renderModels();
  else if (currentStep === 3) renderServiceSelect();
  else if (currentStep === 4) renderSummary();
  
  // Обновляем кнопки
  updateButtons();
  updateTotal();
}

// Рендеринг брендов
function renderBrands() {
  const brands = getAllBrands();
  const selected = getSelectedBrand();
  
  const container = document.createElement("div");
  container.className = "brands-grid";
  
  brands.forEach(brand => {
    const chip = document.createElement("button");
    chip.className = `brand-chip ${selected === brand ? "active" : ""}`;
    chip.textContent = brand;
    chip.addEventListener("click", () => {
      setBrand(brand);
      renderStep();
    });
    container.appendChild(chip);
  });
  
  stepContent.appendChild(container);
}

// Рендеринг моделей
function renderModels() {
  const brand = getSelectedBrand();
  if (!brand) return;
  
  const models = getModelsForBrand(brand);
  const selected = getSelectedModel();
  
  const container = document.createElement("div");
  container.className = "models-grid";
  
  // Бейдж класса
  if (models.length > 0) {
    const firstModel = models[0];
    const carClass = getClassForModel(brand, firstModel);
    const classInfo = classPrices[carClass];
    
    const badge = document.createElement("div");
    badge.className = "class-badge";
    badge.textContent = `Класс: ${classInfo ? classInfo.name : carClass}`;
    stepContent.appendChild(badge);
  }
  
  models.forEach(model => {
    const chip = document.createElement("button");
    chip.className = `model-chip ${selected === model ? "active" : ""}`;
    chip.textContent = model;
    chip.addEventListener("click", () => {
      setModel(model);
      renderStep();
    });
    container.appendChild(chip);
  });
  
  stepContent.appendChild(container);
}

// Рендеринг выбора услуги
function renderServiceSelect() {
  const selectedPkg = getSelectedPackage();
  const selectedZonesList = getSelectedZones();
  
  // Пакеты услуг
  const packagesContainer = document.createElement("div");
  packagesContainer.className = "packages-grid";
  
  Object.keys(packages).forEach(pkgKey => {
    const pkg = packages[pkgKey];
    const card = document.createElement("div");
    card.className = `package-card ${selectedPkg === pkgKey ? "active" : ""}`;
    card.innerHTML = `
      <div class="package-name">${pkg.name}</div>
      <div class="package-desc">${pkg.description}</div>
      <div class="package-price">${pkg.price.toLocaleString("ru-RU")} ₽</div>
    `;
    card.addEventListener("click", () => {
      setPackage(pkgKey);
      renderStep();
    });
    packagesContainer.appendChild(card);
  });
  
  stepContent.appendChild(packagesContainer);
  
  // Кнопка ручного выбора зон
  const zonesToggle = document.createElement("button");
  zonesToggle.className = "zones-toggle-btn";
  zonesToggle.textContent = "Или выберите зоны вручную";
  stepContent.appendChild(zonesToggle);
  
  // Список зон (скрыт по умолчанию)
  const zonesList = document.createElement("div");
  zonesList.className = "zones-list";
  zonesList.style.display = "none";
  
  Object.keys(zones).forEach(zoneName => {
    const item = document.createElement("label");
    item.className = "zone-item";
    const isChecked = selectedZonesList.includes(zoneName);
    item.innerHTML = `
      <input type="checkbox" ${isChecked ? "checked" : ""} value="${zoneName}">
      <span>${zoneName}</span>
      <span class="zone-price">${zones[zoneName].toLocaleString("ru-RU")} ₽</span>
    `;
    const checkbox = item.querySelector("input");
    checkbox.addEventListener("change", () => {
      toggleZone(zoneName);
      renderStep();
    });
    zonesList.appendChild(item);
  });
  
  zonesToggle.addEventListener("click", () => {
    zonesList.style.display = zonesList.style.display === "none" ? "block" : "none";
    zonesToggle.textContent = zonesList.style.display === "none" 
      ? "Или выберите зоны вручную" 
      : "Скрыть зоны";
  });
  
  stepContent.appendChild(zonesList);
}

// Рендеринг итогового экрана
function renderSummary() {
  const brand = getSelectedBrand();
  const model = getSelectedModel();
  const carClass = getSelectedClass();
  const pkg = getSelectedPackage();
  const zonesList = getSelectedZones();
  const total = calculateTotal();
  
  const summary = document.createElement("div");
  summary.className = "summary-content";
  
  summary.innerHTML = `
    <div class="summary-item">
      <span class="summary-label">Марка:</span>
      <span class="summary-value">${brand || "—"}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Модель:</span>
      <span class="summary-value">${model || "—"}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Класс:</span>
      <span class="summary-value">${carClass ? classPrices[carClass].name : "—"}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Услуга:</span>
      <span class="summary-value">${pkg ? packages[pkg].name : (zonesList.length > 0 ? zonesList.join(", ") : "—")}</span>
    </div>
    <div class="summary-item summary-total">
      <span class="summary-label">Итого:</span>
      <span class="summary-value">${total.toLocaleString("ru-RU")} ₽</span>
    </div>
  `;
  
  stepContent.appendChild(summary);
}

// Обновление кнопок навигации
function updateButtons() {
  const currentStep = getStep();
  
  if (nextBtn) {
    nextBtn.disabled = !canGoNext();
    if (currentStep === 4) {
      nextBtn.textContent = "Записаться";
      nextBtn.onclick = () => {
        const data = getRequestData();
        openRequestForm(data);
      };
    } else {
      nextBtn.textContent = "Далее";
      nextBtn.onclick = nextStep;
    }
  }
  
  if (prevBtn) {
    prevBtn.style.display = currentStep > 1 ? "block" : "none";
    prevBtn.onclick = prevStep;
  }
}

// Сброс UI
export function reset() {
  if (stepContent) stepContent.innerHTML = "";
  updateTotal();
}

// Инициализация
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    updateButtons();
    updateTotal();
  });
} else {
  updateButtons();
  updateTotal();
}

