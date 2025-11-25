/* Button Fixes - Исправление работы всех кнопок */

(function() {
  'use strict';

  function initButtonFixes() {
    // Исправление всех кнопок калькулятора
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Кнопки открытия калькулятора
      if (target.matches('.calculator-open-btn') || target.closest('.calculator-open-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
          calculatorSection.classList.add('active');
          document.body.style.overflow = 'hidden';
          
          // Инициализация калькулятора
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
              }
              if (window.calculator.updateTotal) {
                window.calculator.updateTotal();
              }
            }, 100);
          }
        }
      }
      
      // Кнопки открытия модального окна скидки
      if (target.matches('.discount-open-btn') || target.closest('.discount-open-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const discountModal = document.getElementById('discountModal');
        if (discountModal) {
          discountModal.style.display = 'flex';
          document.body.classList.add('no-scroll');
        }
      }
      
      // Кнопки открытия формы заказа
      if (target.matches('.application-open-btn') || target.closest('.application-open-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
          orderModal.style.display = 'flex';
          document.body.classList.add('no-scroll');
        }
      }
    });

    // Исправление навигации на мобильных
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
      
      // Закрытие меню при клике на ссылку
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        });
      });
    }

    // Исправление закрытия модальных окон
    document.addEventListener('click', (e) => {
      // Закрытие калькулятора
      if (e.target.matches('#calculatorCloseBtn') || e.target.closest('#calculatorCloseBtn')) {
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
          calculatorSection.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
      
      // Закрытие модального окна скидки
      if (e.target.matches('#discountModalClose, #discountCancel') || 
          e.target.closest('#discountModalClose, #discountCancel') ||
          e.target.matches('#discountModalOverlay')) {
        const discountModal = document.getElementById('discountModal');
        if (discountModal) {
          discountModal.style.display = 'none';
          document.body.classList.remove('no-scroll');
        }
      }
      
      // Закрытие формы заказа
      if (e.target.matches('#orderModalClose, #orderCancel') || 
          e.target.closest('#orderModalClose, #orderCancel') ||
          e.target.matches('#orderModalOverlay')) {
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
          orderModal.style.display = 'none';
          document.body.classList.remove('no-scroll');
        }
      }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const calculatorSection = document.getElementById('calculator');
        const discountModal = document.getElementById('discountModal');
        const orderModal = document.getElementById('orderModal');
        
        if (calculatorSection && calculatorSection.classList.contains('active')) {
          calculatorSection.classList.remove('active');
          document.body.style.overflow = '';
        }
        if (discountModal && discountModal.style.display === 'flex') {
          discountModal.style.display = 'none';
          document.body.classList.remove('no-scroll');
        }
        if (orderModal && orderModal.style.display === 'flex') {
          orderModal.style.display = 'none';
          document.body.classList.remove('no-scroll');
        }
      }
    });

    // Убеждаемся что все кнопки кликабельны
    document.querySelectorAll('button, a.btn, .btn').forEach(btn => {
      btn.style.pointerEvents = 'auto';
      btn.style.cursor = 'pointer';
      if (btn.disabled) {
        btn.style.cursor = 'not-allowed';
      }
    });
  }

  // Запускаем после загрузки
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonFixes);
  } else {
    initButtonFixes();
  }

  // Повторная инициализация после загрузки всех скриптов
  setTimeout(initButtonFixes, 500);
  setTimeout(initButtonFixes, 1000);
})();

