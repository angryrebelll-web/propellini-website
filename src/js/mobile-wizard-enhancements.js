/* Mobile Wizard Enhancements - Авто-переходы, свайпы, улучшенная логика */

(function() {
  'use strict';

  // Инициализация после загрузки калькулятора
  function initMobileWizardEnhancements() {
    if (!window.calculator) {
      setTimeout(initMobileWizardEnhancements, 100);
      return;
    }

    const calculator = window.calculator;
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) return;

    // ============================================
    // АВТО-ПЕРЕХОДЫ МЕЖДУ ШАГАМИ
    // ============================================

    // Переопределяем selectWizardBrand для авто-перехода
    const originalSelectWizardBrand = calculator.selectWizardBrand;
    calculator.selectWizardBrand = function(brand) {
      originalSelectWizardBrand.call(this, brand);
      // Авто-переход на шаг 2 с плавной анимацией
      setTimeout(() => {
        if (this.selectedBrand) {
          const currentStep = document.querySelector('.mobile-wizard-step.active');
          if (currentStep) {
            currentStep.classList.add('slide-out');
            setTimeout(() => {
              this.showWizardStep(2);
              this.updateMobileFooter();
            }, 300);
          } else {
            this.showWizardStep(2);
            this.updateMobileFooter();
          }
        }
      }, 200);
    };

    // Переопределяем selectWizardModel для авто-перехода
    const originalSelectWizardModel = calculator.selectWizardModel;
    calculator.selectWizardModel = function(model) {
      originalSelectWizardModel.call(this, model);
      // Авто-переход на шаг 3 с плавной анимацией
      setTimeout(() => {
        if (this.selectedModel && this.selectedClass) {
          const currentStep = document.querySelector('.mobile-wizard-step.active');
          if (currentStep) {
            currentStep.classList.add('slide-out');
            setTimeout(() => {
              this.showWizardStep(3);
              this.updateMobileFooter();
            }, 300);
          } else {
            this.showWizardStep(3);
            this.updateMobileFooter();
          }
        }
      }, 200);
    };

    // Авто-переход при выборе пакета
    const originalSelectWizardPackage = calculator.selectWizardPackage;
    if (originalSelectWizardPackage) {
      calculator.selectWizardPackage = function(packageId) {
        originalSelectWizardPackage.call(this, packageId);
        // Авто-переход на шаг 4 (итог)
        setTimeout(() => {
          this.showWizardStep(4);
          this.updateMobileFooter();
        }, 300);
      };
    }

    // ============================================
    // СВАЙПЫ ДЛЯ ПЕРЕКЛЮЧЕНИЯ ШАГОВ
    // ============================================

    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // Минимальное расстояние для свайпа

    const wizardContainer = document.querySelector('.mobile-wizard-new');
    if (wizardContainer) {
      wizardContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      wizardContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Свайп влево - следующий шаг
          if (calculator.canProceedToNextStep(calculator.currentStep)) {
            calculator.nextStep();
            calculator.updateMobileFooter();
          }
        } else {
          // Свайп вправо - предыдущий шаг
          if (calculator.currentStep > 1) {
            calculator.prevStep();
            calculator.updateMobileFooter();
          }
        }
      }
    }

    // ============================================
    // ОБНОВЛЕНИЕ ФИКСИРОВАННОГО БЛОКА "ИТОГО"
    // ============================================

    calculator.updateMobileFooter = function() {
      const footerTotal = document.getElementById('mobileFooterTotal');
      const footerPrev = document.getElementById('mobileFooterPrev');
      const footerNext = document.getElementById('mobileFooterNext');
      
      if (!footerTotal) return;

      // Обновляем цену
      const total = this.calculateTotal();
      footerTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;

      // Показываем/скрываем кнопки
      if (footerPrev) {
        footerPrev.style.display = this.currentStep > 1 ? 'block' : 'none';
        footerPrev.onclick = () => {
          this.prevStep();
          this.updateMobileFooter();
        };
      }

      if (footerNext) {
        const canProceed = this.canProceedToNextStep(this.currentStep);
        footerNext.style.display = canProceed ? 'block' : 'none';
        footerNext.disabled = !canProceed;
        
        if (this.currentStep === 4) {
          footerNext.textContent = 'Записаться';
          footerNext.onclick = () => {
            // Открываем форму заказа
            const form = document.getElementById('mobileOrderForm');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          };
        } else {
          footerNext.textContent = 'Далее';
          footerNext.onclick = () => {
            this.nextStep();
            this.updateMobileFooter();
          };
        }
      }
    };

    // Переопределяем updateWizardPrice для обновления footer
    const originalUpdateWizardPrice = calculator.updateWizardPrice;
    calculator.updateWizardPrice = function() {
      originalUpdateWizardPrice.call(this);
      if (this.updateMobileFooter) {
        this.updateMobileFooter();
      }
    };

    // ============================================
    // ВЗАИМОИСКЛЮЧАЮЩИЕ ПАКЕТЫ И ЗОНЫ
    // ============================================

    // При выборе пакета - очищаем зоны
    const packageCards = document.querySelectorAll('.mobile-package-card');
    packageCards.forEach(card => {
      card.addEventListener('click', function() {
        const packageId = this.dataset.packageId;
        if (!packageId) return;

        // Убираем выделение с других пакетов
        packageCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');

        // Очищаем все зоны
        calculator.selectedZones.clear();
        document.querySelectorAll('.mobile-zone-item input[type="checkbox"]').forEach(cb => {
          cb.checked = false;
        });

        // Выбираем пакет
        calculator.selectedPackage = packageId;
        const packageZones = calculator.getPackageZones(packageId);
        packageZones.forEach(zoneId => {
          calculator.selectedZones.add(zoneId);
        });

        calculator.updateTotal();
        calculator.updateMobileFooter();
      });
    });

    // При выборе зоны - очищаем пакеты
    document.addEventListener('change', (e) => {
      if (e.target.matches('.mobile-zone-item input[type="checkbox"]')) {
        // Убираем выделение с пакетов
        packageCards.forEach(c => c.classList.remove('selected'));
        calculator.selectedPackage = null;

        // Обновляем зоны
        const zoneId = e.target.value;
        if (e.target.checked) {
          calculator.selectedZones.add(zoneId);
        } else {
          calculator.selectedZones.delete(zoneId);
        }

        calculator.updateTotal();
        calculator.updateMobileFooter();
      }
    });

    // ============================================
    // ОБНОВЛЕНИЕ ИТОГОВОЙ КАРТОЧКИ НА ШАГЕ 4
    // ============================================

    const originalRenderWizardSummary = calculator.renderWizardSummary;
    if (originalRenderWizardSummary) {
      calculator.renderWizardSummary = function() {
        originalRenderWizardSummary.call(this);
        this.updateMobileSummary();
      };
    } else {
      calculator.updateMobileSummary = function() {
        const summaryBrand = document.getElementById('summaryBrand');
        const summaryModel = document.getElementById('summaryModel');
        const summaryClass = document.getElementById('summaryClass');
        const summaryService = document.getElementById('summaryService');
        const summaryTotal = document.getElementById('summaryTotal');

        if (summaryBrand) {
          summaryBrand.textContent = this.selectedBrand || '—';
        }
        if (summaryModel) {
          summaryModel.textContent = this.selectedModel || '—';
        }
        if (summaryClass) {
          const classNames = {
            'small': 'Малый класс',
            'business': 'Бизнес класс',
            'suv-lux': 'Внедорожники / Люкс',
            'pickup': 'Пикапы',
            'bus': 'Автобусы / Минивэны'
          };
          summaryClass.textContent = classNames[this.selectedClass] || this.selectedClass || '—';
        }
        if (summaryService) {
          if (this.selectedPackage) {
            const packageNames = {
              'package-basic': 'Базовый пакет',
              'package-premium': 'Премиум пакет',
              'package-lux': 'Люкс пакет',
              'risk-zones': 'Зоны риска'
            };
            summaryService.textContent = packageNames[this.selectedPackage] || 'Пакет';
          } else if (this.selectedZones.size > 0) {
            summaryService.textContent = `${this.selectedZones.size} зон`;
          } else {
            summaryService.textContent = '—';
          }
        }
        if (summaryTotal) {
          const total = this.calculateTotal();
          summaryTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
        }

        // Обновляем форму заказа
        const orderCar = document.getElementById('mobileOrderCar');
        const orderTotal = document.getElementById('mobileOrderTotal');
        if (orderCar) {
          orderCar.value = this.selectedBrand && this.selectedModel 
            ? `${this.selectedBrand} ${this.selectedModel}` 
            : 'Не выбран';
        }
        if (orderTotal) {
          const total = this.calculateTotal();
          orderTotal.value = `${total.toLocaleString('ru-RU')} ₽`;
        }
      };
    }

    // Вызываем updateMobileSummary при переходе на шаг 4
    const originalShowWizardStep = calculator.showWizardStep;
    calculator.showWizardStep = function(step) {
      originalShowWizardStep.call(this, step);
      if (step === 4 && this.updateMobileSummary) {
        this.updateMobileSummary();
      }
      if (this.updateMobileFooter) {
        this.updateMobileFooter();
      }
    };

    // Инициализация footer при загрузке
    setTimeout(() => {
      if (calculator.updateMobileFooter) {
        calculator.updateMobileFooter();
      }
    }, 500);
  }

  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileWizardEnhancements);
  } else {
    initMobileWizardEnhancements();
  }
})();

