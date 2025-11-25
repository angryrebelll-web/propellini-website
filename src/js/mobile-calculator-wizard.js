/* Mobile Calculator Wizard - 4 шага с фиксированной панелью "Итого" */

(function() {
  'use strict';

  let currentStep = 1;
  const totalSteps = 4;

  function initMobileWizard() {
    const modal = document.getElementById('calculatorModal');
    if (!modal) return;

    // Создаем структуру wizard если её нет
    if (!modal.querySelector('.mobile-calculator-wizard')) {
      createWizardStructure(modal);
    }

    // Инициализируем шаг 1
    showStep(1);
    updateTotalPanel();
  }

  function createWizardStructure(modal) {
    const wizardHTML = `
      <div class="mobile-calculator-wizard">
        <div class="calculator-content">
          <!-- Шаг 1: Марка -->
          <div class="calculator-step active" data-step="1">
            <h2 class="step-title">Выберите марку автомобиля</h2>
            <div class="brand-chips" id="mobileBrandChips"></div>
          </div>

          <!-- Шаг 2: Модель -->
          <div class="calculator-step" data-step="2">
            <h2 class="step-title">Выберите модель</h2>
            <div class="model-class-badge" id="mobileModelClass"></div>
            <div class="model-chips" id="mobileModelChips"></div>
          </div>

          <!-- Шаг 3: Пакет или зоны -->
          <div class="calculator-step" data-step="3">
            <h2 class="step-title">Выберите услугу</h2>
            <div class="package-grid" id="mobilePackageGrid"></div>
            <div class="zones-toggle-wrapper">
              <button class="zones-toggle-btn" id="mobileZonesToggle">Или выберите зоны вручную</button>
            </div>
            <div class="zones-list" id="mobileZonesList" style="display: none;"></div>
          </div>

          <!-- Шаг 4: Итог -->
          <div class="calculator-step" data-step="4">
            <h2 class="step-title">Проверьте данные</h2>
            <div class="wizard-summary" id="mobileWizardSummary"></div>
          </div>

          <!-- Навигация -->
          <div class="calculator-nav">
            <button class="btn-back" id="mobileWizardBack" style="display: none;">Назад</button>
            <button class="btn-next" id="mobileWizardNext">Далее</button>
          </div>
        </div>

        <!-- Фиксированная панель "Итого" -->
        <div class="calculator-total-panel">
          <div class="total-label">Итого</div>
          <div class="total-price" id="mobileTotalPrice">0 ₽</div>
          <button class="btn-calculate-final" id="mobileWizardSubmit" style="display: none;">Записаться</button>
        </div>
      </div>
    `;

    const content = modal.querySelector('.calculator-content') || modal;
    content.innerHTML = wizardHTML;

    // Биндим события
    bindWizardEvents();
  }

  function bindWizardEvents() {
    const nextBtn = document.getElementById('mobileWizardNext');
    const backBtn = document.getElementById('mobileWizardBack');
    const submitBtn = document.getElementById('mobileWizardSubmit');
    const zonesToggle = document.getElementById('mobileZonesToggle');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (canGoNext()) {
          goToNextStep();
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener('click', () => {
        goToPreviousStep();
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        submitWizard();
      });
    }

    if (zonesToggle) {
      zonesToggle.addEventListener('click', () => {
        toggleZonesList();
      });
    }

    // Swipe навигация
    let touchStartX = 0;
    let touchEndX = 0;

    const content = document.querySelector('.calculator-content');
    if (content) {
      content.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      content.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && canGoNext()) {
          // Swipe влево - следующий шаг
          goToNextStep();
        } else if (diff < 0 && currentStep > 1) {
          // Swipe вправо - предыдущий шаг
          goToPreviousStep();
        }
      }
    }
  }

  function canGoNext() {
    if (currentStep === 1) {
      return window.calculator && window.calculator.selectedBrand;
    } else if (currentStep === 2) {
      return window.calculator && window.calculator.selectedModel;
    } else if (currentStep === 3) {
      return (window.calculator && window.calculator.selectedZones.size > 0) ||
             (window.calculator && window.calculator.selectedPackage);
    }
    return false;
  }

  function showStep(step) {
    currentStep = step;

    // Скрываем все шаги
    document.querySelectorAll('.calculator-step').forEach(s => {
      s.classList.remove('active');
    });

    // Показываем текущий шаг
    const currentStepEl = document.querySelector(`.calculator-step[data-step="${step}"]`);
    if (currentStepEl) {
      currentStepEl.classList.add('active');
    }

    // Обновляем кнопки навигации
    const backBtn = document.getElementById('mobileWizardBack');
    const nextBtn = document.getElementById('mobileWizardNext');
    const submitBtn = document.getElementById('mobileWizardSubmit');

    if (backBtn) {
      backBtn.style.display = step > 1 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = step < totalSteps ? 'block' : 'none';
    }

    if (submitBtn) {
      submitBtn.style.display = step === totalSteps ? 'block' : 'none';
    }

    // Загружаем данные для текущего шага
    loadStepData(step);
  }

  function loadStepData(step) {
    if (!window.calculator) return;

    if (step === 1) {
      renderBrands();
    } else if (step === 2) {
      renderModels();
    } else if (step === 3) {
      renderPackages();
      renderZones();
    } else if (step === 4) {
      renderSummary();
    }

    updateTotalPanel();
  }

  function renderBrands() {
    const container = document.getElementById('mobileBrandChips');
    if (!container || !window.calculator) return;

    const brands = window.calculator.allBrands || [];
    container.innerHTML = '';

    brands.forEach(brand => {
      const chip = document.createElement('button');
      chip.className = 'brand-chip';
      chip.textContent = brand;
      chip.addEventListener('click', () => {
        window.calculator.selectBrand(brand);
        document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        // Автоматически переходим к следующему шагу
        setTimeout(() => goToNextStep(), 300);
      });
      container.appendChild(chip);
    });
  }

  function renderModels() {
    const container = document.getElementById('mobileModelChips');
    const classBadge = document.getElementById('mobileModelClass');
    if (!container || !window.calculator) return;

    const brand = window.calculator.selectedBrand;
    if (!brand) return;

    const models = window.calculator.getModelsForBrand(brand) || [];
    container.innerHTML = '';

    // Показываем класс
    if (classBadge && models.length > 0) {
      const firstModel = models[0];
      const carClass = window.calculator.getModelClass(brand, firstModel.name);
      if (carClass) {
        classBadge.innerHTML = `<span class="class-badge">Класс: ${carClass}</span>`;
      }
    }

    models.forEach(model => {
      const chip = document.createElement('button');
      chip.className = 'model-chip';
      chip.textContent = model.name;
      chip.addEventListener('click', () => {
        window.calculator.selectModel(model.name);
        document.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        // Автоматически переходим к следующему шагу
        setTimeout(() => goToNextStep(), 300);
      });
      container.appendChild(chip);
    });
  }

  function renderPackages() {
    const container = document.getElementById('mobilePackageGrid');
    if (!container) return;

    const packages = [
      { id: 'basic', name: 'Basic', price: 'от 25 000 ₽' },
      { id: 'premium', name: 'Premium', price: 'от 50 000 ₽' },
      { id: 'lux', name: 'Lux', price: 'от 100 000 ₽' },
      { id: 'risk-zones', name: 'Зоны риска', price: 'от 25 000 ₽' }
    ];

    container.innerHTML = '';

    packages.forEach(pkg => {
      const card = document.createElement('div');
      card.className = 'package-card';
      card.innerHTML = `
        <div class="package-name">${pkg.name}</div>
        <div class="package-price">${pkg.price}</div>
      `;
      card.addEventListener('click', () => {
        document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        if (window.calculator) {
          window.calculator.selectedPackage = pkg.id;
          window.calculator.selectedZones.clear(); // Очищаем зоны при выборе пакета
        }
        updateTotalPanel();
      });
      container.appendChild(card);
    });
  }

  function renderZones() {
    const container = document.getElementById('mobileZonesList');
    if (!container || !window.calculator) return;

    const zones = window.calculator.zonesDatabase || [];
    container.innerHTML = '';

    zones.forEach(zone => {
      const item = document.createElement('label');
      item.className = 'zone-item';
      item.innerHTML = `
        <input type="checkbox" value="${zone.id}" data-zone="${zone.id}">
        <span>${zone.name}</span>
        <span class="zone-price">${zone.price} ₽</span>
      `;
      
      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          window.calculator.selectedZones.add(zone.id);
          // Снимаем пакет при выборе зон
          if (window.calculator) {
            window.calculator.selectedPackage = null;
            document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
          }
        } else {
          window.calculator.selectedZones.delete(zone.id);
        }
        updateTotalPanel();
      });
      
      container.appendChild(item);
    });
  }

  function toggleZonesList() {
    const list = document.getElementById('mobileZonesList');
    const toggle = document.getElementById('mobileZonesToggle');
    if (list && toggle) {
      const isVisible = list.style.display !== 'none';
      list.style.display = isVisible ? 'none' : 'block';
      toggle.textContent = isVisible ? 'Или выберите зоны вручную' : 'Скрыть зоны';
    }
  }

  function renderSummary() {
    const container = document.getElementById('mobileWizardSummary');
    if (!container || !window.calculator) return;

    const brand = window.calculator.selectedBrand || '—';
    const model = window.calculator.selectedModel || '—';
    const packageName = window.calculator.selectedPackage || '—';
    const zones = Array.from(window.calculator.selectedZones).map(id => {
      const zone = window.calculator.zonesDatabase.find(z => z.id === id);
      return zone ? zone.name : id;
    }).join(', ') || '—';

    container.innerHTML = `
      <div class="wizard-summary-item">
        <div class="wizard-summary-label">Марка</div>
        <div class="wizard-summary-value">${brand}</div>
      </div>
      <div class="wizard-summary-item">
        <div class="wizard-summary-label">Модель</div>
        <div class="wizard-summary-value">${model}</div>
      </div>
      <div class="wizard-summary-item">
        <div class="wizard-summary-label">Услуга</div>
        <div class="wizard-summary-value">${packageName !== '—' ? packageName : zones}</div>
      </div>
    `;
  }

  function updateTotalPanel() {
    const totalEl = document.getElementById('mobileTotalPrice');
    if (!totalEl || !window.calculator) return;

    const total = window.calculator.calculateTotal();
    totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
  }

  function goToNextStep() {
    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  }

  function goToPreviousStep() {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  }

  function submitWizard() {
    if (!window.calculator) return;

    // Открываем форму заказа с предзаполненными данными
    if (window.openOrderForm) {
      const data = {
        brand: window.calculator.selectedBrand,
        model: window.calculator.selectedModel,
        package: window.calculator.selectedPackage,
        zones: Array.from(window.calculator.selectedZones),
        total: window.calculator.calculateTotal()
      };
      window.openOrderForm(data);
    }

    // Закрываем калькулятор
    if (window.closeCalculatorModal) {
      window.closeCalculatorModal();
    }
  }

  // Экспорт функций
  window.initMobileWizard = initMobileWizard;
  window.showWizardStep = showStep;
  window.updateWizardTotal = updateTotalPanel;

  // Инициализация при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initMobileWizard, 500);
    });
  } else {
    setTimeout(initMobileWizard, 500);
  }
})();

