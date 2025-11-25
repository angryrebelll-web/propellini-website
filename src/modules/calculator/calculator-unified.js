/* ============================================
   PROPELLINI CALCULATOR - Unified Component
   Единый калькулятор для desktop и mobile
   ============================================ */

(function() {
  'use strict';

  // Единый источник данных
  const CALCULATOR_DATA = {
    brands: {
      "Audi": { models: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "R8", "TT", "e-tron", "e-tron GT"], defaultClass: "small" },
      "BMW": { models: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "6 GT", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "X18", "Z4", "i3", "i4", "iX", "M3", "M4", "M5", "M8"], defaultClass: "small" },
      "Mercedes-Benz": { models: ["A-Class", "B-Class", "C-Class", "CLK", "CLS", "E-Class", "S-Class", "S-Coupe", "SL", "SLK", "SLS", "AMG GT", "GLA", "GLB", "GLC", "GLE", "GLK", "GLS", "G-Class", "R-Class"], defaultClass: "small" },
      "Porsche": { models: ["911", "718", "Panamera", "Cayenne", "Macan", "Taycan"], defaultClass: "suv-lux" },
      "Range Rover": { models: ["Evoque", "Velar", "Sport", "Vogue"], defaultClass: "suv-lux" },
      "Lexus": { models: ["IS", "ES", "GS", "LS", "NX", "RX", "GX", "LX"], defaultClass: "business" },
      "Toyota": { models: ["Camry", "RAV4", "Highlander", "Land Cruiser", "Prado"], defaultClass: "business" },
      "Volvo": { models: ["S60", "S90", "XC40", "XC60", "XC90"], defaultClass: "business" },
      "Tesla": { models: ["Model 3", "Model S", "Model X", "Model Y"], defaultClass: "business" }
    },
    
    classes: {
      "small": { name: "Малый класс", multiplier: 1.0 },
      "business": { name: "Бизнес класс / Кроссоверы", multiplier: 1.3 },
      "suv-lux": { name: "Внедорожники / Люкс", multiplier: 1.6 },
      "pickup": { name: "Большие пикапы", multiplier: 1.8 },
      "bus": { name: "Автобусы / Минивэны", multiplier: 2.0 }
    },
    
    zones: {
      "small": [
        { id: "hood", name: "Капот", price: 15000 },
        { id: "bumpers", name: "Бамперы", price: 20000 },
        { id: "mirrors", name: "Зеркала", price: 5000 },
        { id: "doors", name: "Двери", price: 25000 },
        { id: "full", name: "Полная оклейка", price: 180000 }
      ],
      "business": [
        { id: "hood", name: "Капот", price: 20000 },
        { id: "bumpers", name: "Бамперы", price: 25000 },
        { id: "mirrors", name: "Зеркала", price: 7000 },
        { id: "doors", name: "Двери", price: 35000 },
        { id: "full", name: "Полная оклейка", price: 250000 }
      ],
      "suv-lux": [
        { id: "hood", name: "Капот", price: 25000 },
        { id: "bumpers", name: "Бамперы", price: 30000 },
        { id: "mirrors", name: "Зеркала", price: 10000 },
        { id: "doors", name: "Двери", price: 45000 },
        { id: "full", name: "Полная оклейка", price: 350000 }
      ]
    }
  };

  class PropelliniCalculator {
    constructor() {
      this.selectedBrand = null;
      this.selectedModel = null;
      this.selectedClass = null;
      this.selectedZones = new Set();
      this.selectedPackage = null;
      this.currentStep = 1;
      this.isMobile = window.innerWidth <= 900;
      
      this.init();
    }

    init() {
      // Ждем DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    setup() {
      this.bindEvents();
      this.renderDesktop();
      if (this.isMobile) {
        this.setupMobileWizard();
      }
    }

    bindEvents() {
      // Кнопки открытия калькулятора
      document.addEventListener('click', (e) => {
        if (e.target.matches('.calculator-open-btn, .open-calculator, #calculatorNavBtn') ||
            e.target.closest('.calculator-open-btn, .open-calculator, #calculatorNavBtn')) {
          e.preventDefault();
          this.openModal();
        }
      }, true);
    }

    // Получение класса автомобиля
    getModelClass(brand, model) {
      const brandData = CALCULATOR_DATA.brands[brand];
      if (!brandData) return 'small';
      
      // Простая логика определения класса
      if (model.includes('X') || model.includes('Q') || model.includes('GLE') || model.includes('GLS')) {
        return 'suv-lux';
      }
      if (model.includes('S-Class') || model.includes('7 Series') || model.includes('A8')) {
        return 'business';
      }
      return brandData.defaultClass || 'small';
    }

    // Получение зон для класса
    getZonesForClass(carClass) {
      if (!carClass) return CALCULATOR_DATA.zones.small;
      return CALCULATOR_DATA.zones[carClass] || CALCULATOR_DATA.zones.small;
    }
    
    // Получение моделей для марки (для совместимости)
    getModelsForBrand(brand) {
      if (!brand) return [];
      const brandData = CALCULATOR_DATA.brands[brand];
      if (!brandData) return [];
      return brandData.models.map(name => ({ name, class: this.getModelClass(brand, name) }));
    }

    // Выбор марки
    selectBrand(brand) {
      this.selectedBrand = brand;
      this.selectedModel = null;
      this.selectedClass = null;
      this.selectedZones.clear();
      this.updateUI();
    }

    // Выбор модели
    selectModel(model) {
      this.selectedModel = model;
      this.selectedClass = this.getModelClass(this.selectedBrand, model);
      this.updateUI();
    }

    // Выбор зоны
    toggleZone(zoneId) {
      if (this.selectedZones.has(zoneId)) {
        this.selectedZones.delete(zoneId);
      } else {
        this.selectedZones.add(zoneId);
      }
      this.updateTotal();
    }

    // Выбор пакета
    selectPackage(packageId) {
      this.selectedPackage = packageId;
      this.selectedZones.clear();
      this.updateTotal();
    }

    // Расчет итоговой стоимости
    calculateTotal() {
      if (!this.selectedClass) return 0;
      
      const zones = this.getZonesForClass(this.selectedClass);
      
      // Если выбран пакет "Полная оклейка"
      if (this.selectedPackage === 'full' || this.selectedZones.has('full')) {
        const fullZone = zones.find(z => z.id === 'full');
        return fullZone ? fullZone.price : 0;
      }
      
      // Считаем выбранные зоны
      let total = 0;
      this.selectedZones.forEach(zoneId => {
        const zone = zones.find(z => z.id === zoneId);
        if (zone) total += zone.price;
      });
      
      return total;
    }

    // Обновление UI
    updateUI() {
      if (this.isMobile) {
        this.updateMobileWizard();
      } else {
        this.updateDesktop();
      }
      this.updateTotal();
    }

    // Desktop рендеринг
    renderDesktop() {
      if (this.isMobile) return;
      
      const container = document.getElementById('calculatorDesktop');
      if (!container) return;

      // Рендерим бренды
      this.renderBrands(container);
    }

    renderBrands(container) {
      // Ищем контейнер для брендов в desktop калькуляторе
      const brandsContainer = container.querySelector('#brandChips') ||
                             container.querySelector('.chips-wrapper') ||
                             container.querySelector('.brands-container') || 
                             container;
      if (!brandsContainer) return;
      
      brandsContainer.innerHTML = '';
      
      Object.keys(CALCULATOR_DATA.brands).forEach(brand => {
        const chip = document.createElement('button');
        chip.className = 'brand-chip';
        chip.textContent = brand;
        chip.dataset.brand = brand;
        chip.addEventListener('click', () => {
          this.selectBrand(brand);
          document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        });
        brandsContainer.appendChild(chip);
      });
    }

    updateDesktop() {
      // Обновляем модели если выбрана марка
      if (this.selectedBrand) {
        this.renderModels();
      }
      // Обновляем зоны если выбран класс
      if (this.selectedClass) {
        this.renderZones();
      }
    }

    renderModels() {
      const container = document.getElementById('modelChips');
      if (!container) return;
      
      container.innerHTML = '';
      const models = CALCULATOR_DATA.brands[this.selectedBrand]?.models || [];
      
      models.forEach(model => {
        const chip = document.createElement('button');
        chip.className = 'model-chip';
        chip.textContent = model;
        chip.dataset.model = model;
        chip.addEventListener('click', () => {
          this.selectModel(model);
          document.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        });
        container.appendChild(chip);
      });
    }

    renderZones() {
      if (!this.selectedClass) return;
      
      const zones = this.getZonesForClass(this.selectedClass);
      // Ищем контейнер для зон в desktop калькуляторе
      const container = document.getElementById('zonesContainer') || 
                       document.querySelector('#zonesSelection .zones-list') ||
                       document.querySelector('.zones-list') ||
                       document.querySelector('#zonesSelection');
      if (!container) return;
      
      // Если контейнер - это сама секция, создаем список внутри
      let zonesList = container.querySelector('.zones-list');
      if (!zonesList && container.id === 'zonesSelection') {
        zonesList = document.createElement('div');
        zonesList.className = 'zones-list';
        container.appendChild(zonesList);
      }
      const targetContainer = zonesList || container;
      
      targetContainer.innerHTML = '';
      
      zones.forEach(zone => {
        const item = document.createElement('label');
        item.className = 'zone-item';
        const isChecked = this.selectedZones.has(zone.id);
        item.innerHTML = `
          <input type="checkbox" value="${zone.id}" data-zone="${zone.id}" ${isChecked ? 'checked' : ''}>
          <span>${zone.name}</span>
          <span class="zone-price">${zone.price.toLocaleString('ru-RU')} ₽</span>
        `;
        const checkbox = item.querySelector('input');
        checkbox.addEventListener('change', (e) => {
          if (e.target.checked) {
            this.selectedZones.add(zone.id);
          } else {
            this.selectedZones.delete(zone.id);
          }
          this.updateTotal();
        });
        targetContainer.appendChild(item);
      });
    }

    // Mobile Wizard
    setupMobileWizard() {
      // Инициализация при открытии модального окна
      const modal = document.getElementById('calculatorModal');
      if (modal) {
        const observer = new MutationObserver(() => {
          if (modal.classList.contains('active')) {
            this.initMobileWizard();
          }
        });
        observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
      }
    }

    initMobileWizard() {
      const modal = document.getElementById('calculatorModal');
      if (!modal) return;

      // Создаем структуру если её нет
      if (!modal.querySelector('.mobile-calculator-wizard')) {
        this.createMobileWizard(modal);
      }

      this.currentStep = 1;
      this.showMobileStep(1);
    }

    createMobileWizard(modal) {
      const wizardHTML = `
        <div class="mobile-calculator-wizard">
          <div class="calculator-content">
            <div class="calculator-step active" data-step="1">
              <h2 class="step-title">Выберите марку</h2>
              <div class="brand-chips" id="mobileBrandChips"></div>
            </div>
            <div class="calculator-step" data-step="2">
              <h2 class="step-title">Выберите модель</h2>
              <div class="model-class-badge" id="mobileModelClass"></div>
              <div class="model-chips" id="mobileModelChips"></div>
            </div>
            <div class="calculator-step" data-step="3">
              <h2 class="step-title">Выберите услугу</h2>
              <div class="package-grid" id="mobilePackageGrid"></div>
              <button class="zones-toggle-btn" id="mobileZonesToggle">Или выберите зоны вручную</button>
              <div class="zones-list" id="mobileZonesList" style="display: none;"></div>
            </div>
            <div class="calculator-step" data-step="4">
              <h2 class="step-title">Проверьте данные</h2>
              <div class="wizard-summary" id="mobileWizardSummary"></div>
            </div>
            <div class="calculator-nav">
              <button class="btn-back" id="mobileWizardBack" style="display: none;">Назад</button>
              <button class="btn-next" id="mobileWizardNext">Далее</button>
            </div>
          </div>
          <div class="calculator-total-panel">
            <div class="total-label">Итого</div>
            <div class="total-price" id="mobileTotalPrice">0 ₽</div>
            <button class="btn-calculate-final" id="mobileWizardSubmit" style="display: none;">Записаться</button>
          </div>
        </div>
      `;

      const content = modal.querySelector('.calculator-modal-content') || modal;
      content.innerHTML = wizardHTML;

      this.bindMobileEvents();
      this.renderMobileStep(1);
    }

    bindMobileEvents() {
      const nextBtn = document.getElementById('mobileWizardNext');
      const backBtn = document.getElementById('mobileWizardBack');
      const submitBtn = document.getElementById('mobileWizardSubmit');
      const zonesToggle = document.getElementById('mobileZonesToggle');

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.canGoNext()) {
            this.goToNextStep();
          }
        });
      }

      if (backBtn) {
        backBtn.addEventListener('click', () => this.goToPreviousStep());
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', () => this.submitWizard());
      }

      if (zonesToggle) {
        zonesToggle.addEventListener('click', () => {
          const list = document.getElementById('mobileZonesList');
          if (list) {
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
          }
        });
      }
    }

    renderMobileStep(step) {
      if (step === 1) this.renderMobileBrands();
      else if (step === 2) this.renderMobileModels();
      else if (step === 3) this.renderMobilePackages();
      else if (step === 4) this.renderMobileSummary();
    }

    renderMobileBrands() {
      const container = document.getElementById('mobileBrandChips');
      if (!container) return;

      container.innerHTML = '';
      Object.keys(CALCULATOR_DATA.brands).forEach(brand => {
        const chip = document.createElement('button');
        chip.className = 'brand-chip';
        chip.textContent = brand;
        chip.addEventListener('click', () => {
          this.selectBrand(brand);
          document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          setTimeout(() => this.goToNextStep(), 300);
        });
        container.appendChild(chip);
      });
    }

    renderMobileModels() {
      const container = document.getElementById('mobileModelChips');
      const classBadge = document.getElementById('mobileModelClass');
      if (!container || !this.selectedBrand) return;

      container.innerHTML = '';
      const models = CALCULATOR_DATA.brands[this.selectedBrand]?.models || [];

      if (classBadge && models.length > 0) {
        const carClass = this.getModelClass(this.selectedBrand, models[0]);
        classBadge.innerHTML = `<span class="class-badge">Класс: ${CALCULATOR_DATA.classes[carClass]?.name || carClass}</span>`;
      }

      models.forEach(model => {
        const chip = document.createElement('button');
        chip.className = 'model-chip';
        chip.textContent = model;
        chip.addEventListener('click', () => {
          this.selectModel(model);
          document.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          setTimeout(() => this.goToNextStep(), 300);
        });
        container.appendChild(chip);
      });
    }

    renderMobilePackages() {
      const container = document.getElementById('mobilePackageGrid');
      const zonesList = document.getElementById('mobileZonesList');
      if (!container || !this.selectedClass) return;

      container.innerHTML = '';
      const zones = this.getZonesForClass(this.selectedClass);

      // Пакет "Полная оклейка"
      const fullZone = zones.find(z => z.id === 'full');
      if (fullZone) {
        const card = document.createElement('div');
        card.className = 'package-card';
        card.innerHTML = `
          <div class="package-name">Полная оклейка</div>
          <div class="package-price">${fullZone.price.toLocaleString('ru-RU')} ₽</div>
        `;
        card.addEventListener('click', () => {
          document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          this.selectPackage('full');
          this.selectedZones.clear();
          this.selectedZones.add('full');
          this.updateTotal();
        });
        container.appendChild(card);
      }

      // Рендерим зоны
      if (zonesList) {
        zonesList.innerHTML = '';
        zones.filter(z => z.id !== 'full').forEach(zone => {
          const item = document.createElement('label');
          item.className = 'zone-item';
          item.innerHTML = `
            <input type="checkbox" value="${zone.id}" data-zone="${zone.id}">
            <span>${zone.name}</span>
            <span class="zone-price">${zone.price.toLocaleString('ru-RU')} ₽</span>
          `;
          const checkbox = item.querySelector('input');
          checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
              this.selectedZones.add(zone.id);
              this.selectedPackage = null;
              document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
            } else {
              this.selectedZones.delete(zone.id);
            }
            this.updateTotal();
          });
          zonesList.appendChild(item);
        });
      }
    }

    renderMobileSummary() {
      const container = document.getElementById('mobileWizardSummary');
      if (!container) return;

      const brand = this.selectedBrand || '—';
      const model = this.selectedModel || '—';
      const zones = Array.from(this.selectedZones).map(id => {
        const zoneList = this.getZonesForClass(this.selectedClass);
        const zone = zoneList.find(z => z.id === id);
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
          <div class="wizard-summary-value">${zones}</div>
        </div>
      `;
    }

    showMobileStep(step) {
      this.currentStep = step;
      
      document.querySelectorAll('.calculator-step').forEach(s => {
        s.classList.remove('active');
      });
      
      const stepEl = document.querySelector(`.calculator-step[data-step="${step}"]`);
      if (stepEl) {
        stepEl.classList.add('active');
      }

      const backBtn = document.getElementById('mobileWizardBack');
      const nextBtn = document.getElementById('mobileWizardNext');
      const submitBtn = document.getElementById('mobileWizardSubmit');

      if (backBtn) backBtn.style.display = step > 1 ? 'block' : 'none';
      if (nextBtn) nextBtn.style.display = step < 4 ? 'block' : 'none';
      if (submitBtn) submitBtn.style.display = step === 4 ? 'block' : 'none';

      this.renderMobileStep(step);
    }

    canGoNext() {
      if (this.currentStep === 1) return !!this.selectedBrand;
      if (this.currentStep === 2) return !!this.selectedModel;
      if (this.currentStep === 3) return this.selectedZones.size > 0 || this.selectedPackage;
      return false;
    }

    goToNextStep() {
      if (this.currentStep < 4) {
        this.showMobileStep(this.currentStep + 1);
      }
    }

    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.showMobileStep(this.currentStep - 1);
      }
    }

    updateMobileWizard() {
      this.updateTotal();
    }

    updateTotal() {
      const total = this.calculateTotal();
      
      // Mobile total
      const totalEl = document.getElementById('mobileTotalPrice');
      if (totalEl) {
        totalEl.textContent = `${total.toLocaleString('ru-RU')} ₽`;
      }
      
      // Desktop total
      const desktopTotal = document.getElementById('totalAmount');
      if (desktopTotal) {
        desktopTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
      }
      
      // Обновляем количество зон
      const zonesCount = document.getElementById('totalZones');
      if (zonesCount) {
        zonesCount.textContent = `${this.selectedZones.size} зон`;
      }
      
      // Обновляем класс
      const classInfo = document.getElementById('carClassInfo');
      if (classInfo && this.selectedClass) {
        const classNames = CALCULATOR_DATA.classes[this.selectedClass];
        classInfo.textContent = classNames ? classNames.name : this.selectedClass;
      }
    }

    submitWizard() {
      if (window.openOrderForm) {
        window.openOrderForm({
          brand: this.selectedBrand,
          model: this.selectedModel,
          class: this.selectedClass,
          zones: Array.from(this.selectedZones),
          total: this.calculateTotal()
        });
      }
      if (window.closeCalculatorModal) {
        window.closeCalculatorModal();
      }
    }

    openModal() {
      if (window.openCalculatorModal) {
        window.openCalculatorModal();
      }
    }

    reset() {
      this.selectedBrand = null;
      this.selectedModel = null;
      this.selectedClass = null;
      this.selectedZones.clear();
      this.selectedPackage = null;
      this.currentStep = 1;
      this.updateUI();
    }
  }

  // Инициализация
  if (!window.calculator) {
    window.calculator = new PropelliniCalculator();
  }

  // Экспорт для совместимости
  window.PropelliniCalculator = PropelliniCalculator;
})();

