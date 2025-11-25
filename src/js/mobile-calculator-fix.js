/* Mobile Calculator Fix - Исправление работы мобильного калькулятора */

(function() {
  'use strict';

  function ensureMobileCalculatorWorks() {
    // Проверяем что калькулятор загружен
    if (!window.calculator) {
      setTimeout(ensureMobileCalculatorWorks, 100);
      return;
    }

    // Проверяем что модальное окно открыто
    const modal = document.getElementById('calculatorModal');
    if (!modal || !modal.classList.contains('active')) {
      return;
    }

    const isMobile = window.innerWidth <= 900;
    if (!isMobile) return;

    // Убеждаемся что мобильная версия видна
    const mobileCalc = document.getElementById('calculatorMobile');
    const desktopCalc = document.getElementById('calculatorDesktop');
    
    if (mobileCalc) {
      mobileCalc.style.display = 'block';
    }
    if (desktopCalc) {
      desktopCalc.style.display = 'none';
    }

    // Проверяем наличие контейнеров
    const brandsContainer = document.getElementById('mobileBrandsChips');
    if (!brandsContainer || brandsContainer.children.length === 0) {
      // Если бренды не загружены, инициализируем заново
      if (window.calculator.initMobileWizard) {
        window.calculator.initMobileWizard();
      } else if (window.calculator.renderWizardBrands) {
        window.calculator.renderWizardBrands();
      }
    }

    // Проверяем что обработчики событий привязаны
    const brandSearch = document.getElementById('mobileBrandSearch');
    if (brandSearch && !brandSearch.dataset.bound) {
      brandSearch.dataset.bound = 'true';
      brandSearch.addEventListener('input', (e) => {
        if (window.calculator && window.calculator.handleWizardBrandSearch) {
          window.calculator.handleWizardBrandSearch(e.target.value);
        }
      });
    }

    const modelSearch = document.getElementById('mobileModelSearch');
    if (modelSearch && !modelSearch.dataset.bound) {
      modelSearch.dataset.bound = 'true';
      modelSearch.addEventListener('input', (e) => {
        if (window.calculator && window.calculator.handleWizardModelSearch) {
          window.calculator.handleWizardModelSearch(e.target.value);
        }
      });
    }

    // Проверяем кнопки навигации
    const nextBtn = document.getElementById('mobileFooterNext');
    const prevBtn = document.getElementById('mobileFooterPrev');
    
    if (nextBtn && !nextBtn.dataset.bound) {
      nextBtn.dataset.bound = 'true';
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.calculator && window.calculator.nextStep) {
          window.calculator.nextStep();
        }
      });
    }

    if (prevBtn && !prevBtn.dataset.bound) {
      prevBtn.dataset.bound = 'true';
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.calculator && window.calculator.prevStep) {
          window.calculator.prevStep();
        }
      });
    }
  }

  // Запускаем проверку при открытии модального окна
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const modal = mutation.target;
        if (modal.id === 'calculatorModal' && modal.classList.contains('active')) {
          setTimeout(ensureMobileCalculatorWorks, 100);
          setTimeout(ensureMobileCalculatorWorks, 500);
        }
      }
    });
  });

  // Наблюдаем за модальным окном
  const modal = document.getElementById('calculatorModal');
  if (modal) {
    observer.observe(modal, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Также проверяем при загрузке
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(ensureMobileCalculatorWorks, 500);
    });
  } else {
    setTimeout(ensureMobileCalculatorWorks, 500);
  }
})();


