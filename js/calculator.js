/* ============================================
   CALCULATOR - Полная логика калькулятора
   ============================================ */

// Данные калькулятора
const autoClassMap = {
  "Малый класс": ["Polo", "Rio", "Solaris", "Fabia", "Mini Cooper"],
  "Средний / C-класс": ["Mazda 3", "Corolla", "Octavia", "Civic", "Elantra"],
  "Бизнес": ["E-Class", "5-Series", "A6", "ES", "Genesis G80"],
  "Кроссоверы": ["Tiguan", "RAV4", "Sportage", "CX-5", "Qashqai"],
  "Премиальные кроссоверы": ["X5", "GLE", "Q7", "Cayenne", "Velar"],
  "Внедорожники / Люкс": ["Range Rover", "LX600", "GLS", "Urus", "Cullinan", "G63"],
  "Купе / Спорт": ["911 Turbo S", "AMG GT", "RS7", "M8", "Huracan", "Ferrari Roma"],
  "Пикапы": ["F-150", "Ram", "Tundra", "Hilux"],
  "Минивэны": ["V-Class", "Carnival", "Sienna"]
};

const basePriceByClass = {
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

const packages = {
  "Базовый": {
    description: "Зоны риска + частичный капот",
    priceFrom: 35000
  },
  "Премиум": {
    description: "Почти весь кузов, глянцевая пленка",
    priceFrom: 120000
  },
  "Люкс": {
    description: "Полная оклейка, мат/глянец, антихром",
    priceFrom: 200000
  }
};

const zones = {
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
  "Лобовое бронирование": 20000
};

const addons = {
  "Керамика поверх пленки": 30000,
  "Полировка перед оклейкой": 15000,
  "Химчистка салона": 10000,
  "Антихром": 25000,
  "Тонировка": 12000,
  "Защита стекол": 8000
};

// Состояние калькулятора
let calculatorState = {
  step: 1,
  selectedClass: null,
  selectedModel: null,
  selectedPackage: null,
  selectedZones: [],
  selectedAddons: []
};

// Получить класс по модели
const getClassByModel = (model) => {
  for (const [className, models] of Object.entries(autoClassMap)) {
    if (models.includes(model)) {
      return className;
    }
  }
  return null;
};

// Получить базовую цену по классу
const getBasePrice = (className) => {
  return basePriceByClass[className] || 0;
};

// Расчет итоговой стоимости
const calculateTotal = () => {
  let total = 0;
  
  // Базовая цена класса
  if (calculatorState.selectedClass) {
    total += getBasePrice(calculatorState.selectedClass);
  }
  
  // Пакет или зоны
  if (calculatorState.selectedPackage) {
    const pkg = packages[calculatorState.selectedPackage];
    if (pkg) {
      total += pkg.priceFrom;
    }
  } else if (calculatorState.selectedZones.length > 0) {
    calculatorState.selectedZones.forEach(zone => {
      if (zones[zone]) {
        total += zones[zone];
      }
    });
  }
  
  // Дополнения
  calculatorState.selectedAddons.forEach(addon => {
    if (addons[addon]) {
      total += addons[addon];
    }
  });
  
  return total;
};

// Проверка возможности перехода к следующему шагу
const canGoNext = () => {
  switch(calculatorState.step) {
    case 1: return !!calculatorState.selectedClass;
    case 2: return !!calculatorState.selectedModel;
    case 3: return calculatorState.selectedPackage || calculatorState.selectedZones.length > 0;
    case 4: return true;
    default: return false;
  }
};

// Инициализация калькулятора
const initCalculator = () => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    initMobileWizard();
  } else {
    initDesktopCalculator();
  }
};

// Мобильный wizard
const initMobileWizard = () => {
  const modal = document.getElementById('calcModal');
  if (!modal) return;
  
  const stepContent = document.getElementById('calcStepContent');
  const stepTitle = document.getElementById('calcStepTitle');
  const nextBtn = document.getElementById('nextStepBtn');
  const prevBtn = document.getElementById('prevStepBtn');
  const totalEl = document.getElementById('calcTotal');
  const closeBtn = document.getElementById('closeCalcBtn');
  
  // Рендеринг шагов
  const renderStep = () => {
    if (!stepContent) return;
    
    const step = calculatorState.step;
    
    // Обновляем заголовок
    if (stepTitle) {
      const titles = {
        1: "Выберите класс автомобиля",
        2: "Выберите модель",
        3: "Выберите услугу",
        4: "Проверьте данные"
      };
      stepTitle.textContent = titles[step] || "";
    }
    
    stepContent.innerHTML = "";
    
    if (step === 1) renderStep1();
    else if (step === 2) renderStep2();
    else if (step === 3) renderStep3();
    else if (step === 4) renderStep4();
    
    updateButtons();
    updateTotal();
  };
  
  // Шаг 1: Выбор класса
  const renderStep1 = () => {
    const container = document.createElement('div');
    container.className = 'step-content';
    
    // Поиск
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Поиск класса...';
    let searchTerm = '';
    
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      renderClassesList(container, searchTerm);
    });
    
    container.appendChild(searchInput);
    
    // Список классов
    const classesList = document.createElement('div');
    classesList.className = 'classes-list';
    container.appendChild(classesList);
    
    renderClassesList(container, '');
    
    stepContent.appendChild(container);
  };
  
  const renderClassesList = (container, searchTerm) => {
    const classesList = container.querySelector('.classes-list');
    if (!classesList) return;
    
    classesList.innerHTML = '';
    
    Object.keys(autoClassMap).forEach(className => {
      if (searchTerm && !className.toLowerCase().includes(searchTerm)) return;
      
      const chip = document.createElement('button');
      chip.className = `class-chip ${calculatorState.selectedClass === className ? 'active' : ''}`;
      chip.textContent = className;
      chip.addEventListener('click', () => {
        calculatorState.selectedClass = className;
        calculatorState.selectedModel = null;
        renderStep();
      });
      classesList.appendChild(chip);
    });
  };
  
  // Шаг 2: Выбор модели
  const renderStep2 = () => {
    if (!calculatorState.selectedClass) return;
    
    const container = document.createElement('div');
    container.className = 'step-content';
    
    // Бейдж класса
    const badge = document.createElement('div');
    badge.className = 'class-badge';
    badge.textContent = `Класс: ${calculatorState.selectedClass}`;
    container.appendChild(badge);
    
    // Поиск модели
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Поиск модели...';
    let searchTerm = '';
    
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.toLowerCase();
      renderModelsList(container, searchTerm);
    });
    
    container.appendChild(searchInput);
    
    // Список моделей
    const modelsList = document.createElement('div');
    modelsList.className = 'models-list';
    container.appendChild(modelsList);
    
    renderModelsList(container, '');
    
    stepContent.appendChild(container);
  };
  
  const renderModelsList = (container, searchTerm) => {
    const modelsList = container.querySelector('.models-list');
    if (!modelsList) return;
    
    modelsList.innerHTML = '';
    
    const models = autoClassMap[calculatorState.selectedClass] || [];
    
    models.forEach(model => {
      if (searchTerm && !model.toLowerCase().includes(searchTerm)) return;
      
      const chip = document.createElement('button');
      chip.className = `model-chip ${calculatorState.selectedModel === model ? 'active' : ''}`;
      chip.textContent = model;
      chip.addEventListener('click', () => {
        calculatorState.selectedModel = model;
        setTimeout(() => {
          calculatorState.step = 3;
          renderStep();
        }, 300);
      });
      modelsList.appendChild(chip);
    });
  };
  
  // Шаг 3: Выбор услуги
  const renderStep3 = () => {
    const container = document.createElement('div');
    container.className = 'step-content';
    
    // Пакеты
    const packagesTitle = document.createElement('h3');
    packagesTitle.className = 'step-subtitle';
    packagesTitle.textContent = 'Пакеты услуг';
    container.appendChild(packagesTitle);
    
    const packagesGrid = document.createElement('div');
    packagesGrid.className = 'packages-grid';
    
    Object.keys(packages).forEach(pkgName => {
      const pkg = packages[pkgName];
      const card = document.createElement('div');
      card.className = `package-card ${calculatorState.selectedPackage === pkgName ? 'active' : ''}`;
      card.innerHTML = `
        <div class="package-name">${pkgName}</div>
        <div class="package-desc">${pkg.description}</div>
        <div class="package-price">от ${pkg.priceFrom.toLocaleString('ru-RU')} ₽</div>
      `;
      card.addEventListener('click', () => {
        calculatorState.selectedPackage = pkgName;
        calculatorState.selectedZones = [];
        updateTotal();
        updateButtons();
        renderStep();
      });
      packagesGrid.appendChild(card);
    });
    
    container.appendChild(packagesGrid);
    
    // Разделитель
    const divider = document.createElement('div');
    divider.className = 'divider';
    divider.innerHTML = '<span>или</span>';
    container.appendChild(divider);
    
    // Зоны
    const zonesTitle = document.createElement('h3');
    zonesTitle.className = 'step-subtitle';
    zonesTitle.textContent = 'Выбор зон';
    container.appendChild(zonesTitle);
    
    const zonesList = document.createElement('div');
    zonesList.className = 'zones-list';
    
    Object.keys(zones).forEach(zoneName => {
      const item = document.createElement('label');
      item.className = 'zone-item';
      const isChecked = calculatorState.selectedZones.includes(zoneName);
      item.innerHTML = `
        <input type="checkbox" ${isChecked ? 'checked' : ''} value="${zoneName}">
        <span class="zone-name">${zoneName}</span>
        <span class="zone-price">${zones[zoneName].toLocaleString('ru-RU')} ₽</span>
      `;
      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          calculatorState.selectedZones.push(zoneName);
          calculatorState.selectedPackage = null;
        } else {
          calculatorState.selectedZones = calculatorState.selectedZones.filter(z => z !== zoneName);
        }
        updateTotal();
        updateButtons();
      });
      zonesList.appendChild(item);
    });
    
    container.appendChild(zonesList);
    
    stepContent.appendChild(container);
  };
  
  // Шаг 4: Итог
  const renderStep4 = () => {
    const container = document.createElement('div');
    container.className = 'step-content summary-content';
    
    const total = calculateTotal();
    
    container.innerHTML = `
      <div class="summary-item">
        <span class="summary-label">Класс:</span>
        <span class="summary-value">${calculatorState.selectedClass || '—'}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Модель:</span>
        <span class="summary-value">${calculatorState.selectedModel || '—'}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Услуга:</span>
        <span class="summary-value">${calculatorState.selectedPackage || (calculatorState.selectedZones.length > 0 ? calculatorState.selectedZones.join(', ') : '—')}</span>
      </div>
      <div class="summary-item summary-total">
        <span class="summary-label">Итого:</span>
        <span class="summary-value">${total.toLocaleString('ru-RU')} ₽</span>
      </div>
    `;
    
    stepContent.appendChild(container);
  };
  
  // Обновление кнопок
  const updateButtons = () => {
    if (nextBtn) {
      nextBtn.disabled = !canGoNext();
      nextBtn.textContent = calculatorState.step === 4 ? 'Записаться' : 'Далее';
    }
    
    if (prevBtn) {
      prevBtn.style.display = calculatorState.step > 1 ? 'flex' : 'none';
    }
  };
  
  // Обновление итоговой стоимости
  const updateTotal = () => {
    if (totalEl) {
      const total = calculateTotal();
      totalEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }
  };
  
  // Обработчики
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (calculatorState.step === 4) {
        openRequestForm();
      } else if (canGoNext()) {
        calculatorState.step++;
        renderStep();
      }
    });
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (calculatorState.step > 1) {
        calculatorState.step--;
        renderStep();
      }
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeCalculator();
    });
  }
  
  // Инициализация
  renderStep();
};

// Desktop калькулятор
const initDesktopCalculator = () => {
  // TODO: Реализовать desktop версию
  console.log('Desktop calculator');
};

// Открытие калькулятора
const openCalculator = () => {
  const modal = document.getElementById('calcModal');
  if (!modal) return;
  
  calculatorState = {
    step: 1,
    selectedClass: null,
    selectedModel: null,
    selectedPackage: null,
    selectedZones: [],
    selectedAddons: []
  };
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  initCalculator();
};

// Закрытие калькулятора
const closeCalculator = () => {
  const modal = document.getElementById('calcModal');
  if (!modal) return;
  
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  calculatorState = {
    step: 1,
    selectedClass: null,
    selectedModel: null,
    selectedPackage: null,
    selectedZones: [],
    selectedAddons: []
  };
};

// Открытие формы заявки
const openRequestForm = () => {
  const modal = document.getElementById('requestModal');
  if (!modal) return;
  
  const summaryEl = document.getElementById('reqSummary');
  if (summaryEl) {
    const total = calculateTotal();
    summaryEl.innerHTML = `
      <p><strong>Класс:</strong> ${calculatorState.selectedClass || '—'}</p>
      <p><strong>Модель:</strong> ${calculatorState.selectedModel || '—'}</p>
      <p><strong>Услуга:</strong> ${calculatorState.selectedPackage || (calculatorState.selectedZones.length > 0 ? calculatorState.selectedZones.join(', ') : '—')}</p>
      <p><strong>Итого:</strong> ${total.toLocaleString('ru-RU')} ₽</p>
    `;
  }
  
  // Автозаполнение полей формы
  const form = document.getElementById('requestForm');
  if (form) {
    const autoInput = form.querySelector('input[name="auto"]');
    const serviceInput = form.querySelector('input[name="service"]');
    
    if (autoInput && calculatorState.selectedModel) {
      autoInput.value = `${calculatorState.selectedClass || ''} ${calculatorState.selectedModel || ''}`.trim();
    }
    
    if (serviceInput) {
      if (calculatorState.selectedPackage) {
        serviceInput.value = calculatorState.selectedPackage;
      } else if (calculatorState.selectedZones.length > 0) {
        serviceInput.value = calculatorState.selectedZones.join(', ');
      }
    }
  }
  
  closeCalculator();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

// Закрытие формы заявки
const closeRequestForm = () => {
  const modal = document.getElementById('requestModal');
  if (!modal) return;
  
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  
  const form = document.getElementById('requestForm');
  if (form) {
    form.reset();
  }
};

// Обработка отправки формы
const handleFormSubmit = (e) => {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    auto: formData.get('auto'),
    service: formData.get('service'),
    comment: formData.get('comment'),
    summary: document.getElementById('reqSummary')?.innerHTML || ''
  };
  
  // Логирование данных (пока console.log)
  console.log('Form submitted:', data);
  
  // Здесь будет отправка на сервер
  // fetch('/api/request', { method: 'POST', body: JSON.stringify(data) })
  
  alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
  closeRequestForm();
};

// Экспорт функций
window.openCalculator = openCalculator;
window.closeCalculator = closeCalculator;
window.openRequestForm = openRequestForm;
window.closeRequestForm = closeRequestForm;

// Инициализация при загрузке
const initApp = () => {
  // Обработчики кнопок открытия калькулятора
  document.addEventListener('click', (e) => {
    if (e.target.matches('#openCalcBtn, .calculator-open-btn, #calculatorNavBtn, .open-calculator, [data-open-calculator]') ||
        e.target.closest('#openCalcBtn, .calculator-open-btn, #calculatorNavBtn, .open-calculator, [data-open-calculator]')) {
      e.preventDefault();
      openCalculator();
    }
  });
  
  // Обработчики кнопок открытия формы заявки
  document.addEventListener('click', (e) => {
    if (e.target.matches('.request-btn, .order-btn, .zapisatsya-btn, [data-action="request"]') ||
        e.target.closest('.request-btn, .order-btn, .zapisatsya-btn, [data-action="request"]')) {
      e.preventDefault();
      openRequestForm();
    }
  });
  
  // Обработчики кнопок открытия калькулятора (включая data-open-calculator)
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-open-calculator], .calculator-open-btn, #openCalcBtn, #calculatorNavBtn') ||
        e.target.closest('[data-open-calculator], .calculator-open-btn, #openCalcBtn, #calculatorNavBtn')) {
      e.preventDefault();
      if (window.openCalculator) {
        window.openCalculator();
      }
    }
  });
  
  // Обработчик закрытия формы заявки
  const closeReqBtn = document.getElementById('closeReqBtn');
  const reqOverlay = document.querySelector('.req-overlay');
  
  if (closeReqBtn) {
    closeReqBtn.addEventListener('click', closeRequestForm);
  }
  
  if (reqOverlay) {
    reqOverlay.addEventListener('click', closeRequestForm);
  }
  
  // Обработчик отправки формы
  const requestForm = document.getElementById('requestForm');
  if (requestForm) {
    requestForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Закрытие по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const calcModal = document.getElementById('calcModal');
      const requestModal = document.getElementById('requestModal');
      
      if (calcModal && !calcModal.classList.contains('hidden')) {
        closeCalculator();
      }
      if (requestModal && !requestModal.classList.contains('hidden')) {
        closeRequestForm();
      }
    }
  });
  
  // Параллакс для HERO (только desktop)
  if (window.innerWidth > 768) {
    let ticking = false;
    const heroBg = document.querySelector('.hero-bg');
    
    if (heroBg) {
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }
  
  // Мобильное меню
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

