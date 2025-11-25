/* ============================================
   MODAL - Управление модальными окнами
   ============================================ */

import { renderStep, reset as resetUI } from "./ui.js";
import { reset as resetCalc } from "./calculator.js";

// Калькулятор модал
const calcModal = document.getElementById("calcModal");
const openCalcBtn = document.getElementById("openCalcBtn");
const closeCalcBtn = document.getElementById("closeCalcBtn");
const calcOverlay = calcModal?.querySelector(".calc-overlay");

// Форма заявки модал
const requestModal = document.getElementById("requestModal");
const closeReqBtn = document.getElementById("closeReqBtn");
const reqOverlay = requestModal?.querySelector(".req-overlay");

// Открытие калькулятора
export function openCalculator() {
  if (!calcModal) return;
  
  calcModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  renderStep();
  updateTotal();
}

// Закрытие калькулятора
export function closeCalculator() {
  if (!calcModal) return;
  
  calcModal.classList.add("hidden");
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  resetCalc();
  resetUI();
}

// Открытие формы заявки
export function openRequestForm(data = null) {
  if (!requestModal) return;
  
  const summaryEl = document.getElementById("reqSummary");
  if (summaryEl && data) {
    let summaryHTML = "";
    if (data.brand) summaryHTML += `<p><strong>Марка:</strong> ${data.brand}</p>`;
    if (data.model) summaryHTML += `<p><strong>Модель:</strong> ${data.model}</p>`;
    if (data.class) summaryHTML += `<p><strong>Класс:</strong> ${data.class}</p>`;
    if (data.package) {
      summaryHTML += `<p><strong>Пакет:</strong> ${data.package}</p>`;
    } else if (data.zones && data.zones.length > 0) {
      summaryHTML += `<p><strong>Зоны:</strong> ${data.zones.join(", ")}</p>`;
    }
    if (data.total) {
      summaryHTML += `<p><strong>Итого:</strong> ${data.total.toLocaleString("ru-RU")} ₽</p>`;
    }
    summaryEl.innerHTML = summaryHTML;
  }
  
  requestModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
}

// Закрытие формы заявки
export function closeRequestForm() {
  if (!requestModal) return;
  
  requestModal.classList.add("hidden");
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
  
  // Сбрасываем форму
  const form = document.getElementById("requestForm");
  if (form) {
    form.reset();
  }
}

// Инициализация обработчиков
export function initModals() {
  // Калькулятор
  if (openCalcBtn) {
    openCalcBtn.addEventListener("click", openCalculator);
  }
  
  if (closeCalcBtn) {
    closeCalcBtn.addEventListener("click", closeCalculator);
  }
  
  if (calcOverlay) {
    calcOverlay.addEventListener("click", closeCalculator);
  }
  
  // Форма заявки
  if (closeReqBtn) {
    closeReqBtn.addEventListener("click", closeRequestForm);
  }
  
  if (reqOverlay) {
    reqOverlay.addEventListener("click", closeRequestForm);
  }
  
  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!calcModal.classList.contains("hidden")) {
        closeCalculator();
      }
      if (!requestModal.classList.contains("hidden")) {
        closeRequestForm();
      }
    }
  });
  
  // Все кнопки открытия калькулятора
  document.addEventListener("click", (e) => {
    if (e.target.matches(".calculator-open-btn, .open-calculator, #calculatorNavBtn") ||
        e.target.closest(".calculator-open-btn, .open-calculator, #calculatorNavBtn")) {
      e.preventDefault();
      openCalculator();
    }
  }, true);
}

// Инициализация при загрузке
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initModals);
} else {
  initModals();
}

