/* Calculator Modal - Полноценный модальный интерфейс */

(function() {
  'use strict';

  let isModalOpen = false;

  // Открытие калькулятора
  function openCalculatorModal() {
    const modal = document.getElementById('calculatorModal');
    const overlay = document.getElementById('calculatorModalOverlay');
    const body = document.body;

    if (!modal || !overlay) return;

    // Блокируем прокрутку body
    body.classList.add('calculator-modal-open');
    
    // Показываем overlay и modal
    overlay.classList.add('active');
    modal.classList.add('active');
    
    isModalOpen = true;

    // Инициализация калькулятора при открытии
    if (window.calculator) {
      setTimeout(() => {
        const isMobile = window.innerWidth <= 900;
        
        if (isMobile && window.calculator.initMobileWizard) {
          window.calculator.initMobileWizard();
        } else if (!isMobile) {
          if (window.calculator.renderBrandChips) {
            window.calculator.renderBrandChips();
          }
          if (window.calculator.renderZones) {
            window.calculator.renderZones();
          }
          if (window.calculator.bindClassSelection) {
            window.calculator.bindClassSelection();
          }
        }
        
        if (window.calculator.updateTotal) {
          window.calculator.updateTotal();
        }
        
        // Обновляем footer для mobile
        if (window.calculator.updateMobileFooter) {
          window.calculator.updateMobileFooter();
        }
      }, 100);
    }

    // Фокус на кнопке закрытия для доступности
    const closeBtn = document.getElementById('calculatorModalClose');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 300);
    }
  }

  // Закрытие калькулятора
  function closeCalculatorModal() {
    const modal = document.getElementById('calculatorModal');
    const overlay = document.getElementById('calculatorModalOverlay');
    const body = document.body;

    if (!modal || !overlay) return;

    // Анимация закрытия
    modal.classList.add('closing');
    overlay.classList.remove('active');

    setTimeout(() => {
      modal.classList.remove('active', 'closing');
      body.classList.remove('calculator-modal-open');
      isModalOpen = false;
    }, 300);
  }

  // Инициализация обработчиков
  function initCalculatorModal() {
    // Кнопка закрытия
    const closeBtn = document.getElementById('calculatorModalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeCalculatorModal();
      });
    }

    // Закрытие по клику на overlay
    const overlay = document.getElementById('calculatorModalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeCalculatorModal();
        }
      });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeCalculatorModal();
      }
    });

    // Все кнопки открытия калькулятора - делегирование событий
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Проверяем все возможные селекторы
      if (target.matches('.calculator-open-btn') || 
          target.closest('.calculator-open-btn') ||
          target.matches('.open-calculator') ||
          target.closest('.open-calculator') ||
          target.matches('[data-action="open-calculator"]') ||
          target.closest('[data-action="open-calculator"]') ||
          // Кнопка навигации
          (target.id === 'calculatorNavBtn' || target.closest('#calculatorNavBtn'))) {
        e.preventDefault();
        e.stopPropagation();
        openCalculatorModal();
      }
    });

    // Экспортируем функции для глобального доступа
    window.openCalculatorModal = openCalculatorModal;
    window.closeCalculatorModal = closeCalculatorModal;
  }

  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculatorModal);
  } else {
    initCalculatorModal();
  }

  // Повторная инициализация для надежности
  setTimeout(initCalculatorModal, 500);
  setTimeout(initCalculatorModal, 1000);

  // Обработка формы заявки внутри калькулятора
  document.addEventListener('click', (e) => {
    // Кнопка "Записаться на оклейку"
    if (e.target.matches('#orderBtn') || e.target.closest('#orderBtn')) {
      e.preventDefault();
      e.stopPropagation();
      const form = document.getElementById('calculatorApplicationForm');
      if (form) {
        form.style.display = 'flex';
        form.classList.add('active');
        
        // Заполняем данные из калькулятора
        if (window.calculator) {
          const orderCar = document.getElementById('calcOrderCar');
          const orderZones = document.getElementById('calcOrderZones');
          const orderTotal = document.getElementById('calcOrderTotal');
          
          if (orderCar && window.calculator.selectedBrand && window.calculator.selectedModel) {
            orderCar.value = `${window.calculator.selectedBrand} ${window.calculator.selectedModel}`;
          }
          
          if (orderZones && window.calculator.selectedZones) {
            const zones = Array.from(window.calculator.selectedZones).map(zoneId => {
              const zone = window.calculator.zonesDatabase?.find(z => z.id === zoneId);
              return zone ? zone.name : zoneId;
            }).join(', ');
            orderZones.value = zones || 'Не выбраны';
          }
          
          if (orderTotal) {
            const totalEl = document.getElementById('totalAmount');
            if (totalEl) {
              orderTotal.value = totalEl.textContent || '0 ₽';
            }
          }
        }
      }
    }
    
    // Закрытие формы заявки
    if (e.target.matches('#calculatorFormClose, #calcOrderCancel') || 
        e.target.closest('#calculatorFormClose, #calcOrderCancel')) {
      e.preventDefault();
      e.stopPropagation();
      const form = document.getElementById('calculatorApplicationForm');
      if (form) {
        form.style.display = 'none';
        form.classList.remove('active');
      }
    }
  });
})();

