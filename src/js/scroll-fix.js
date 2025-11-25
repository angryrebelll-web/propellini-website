/* ============================================
   SCROLL FIX - Убираем блокировку скролла
   ============================================ */

(function() {
  'use strict';

  // Убираем все глобальные блокировки скролла
  document.addEventListener('touchmove', (e) => {
    // Разрешаем скролл везде, кроме модальных окон
    const modal = document.querySelector('.calculator-modal.active, .unified-order-modal.active');
    if (!modal) {
      // Не блокируем скролл на основной странице
      return;
    }
    
    // В модальном окне блокируем только если это не скроллируемый контент
    const scrollable = e.target.closest('.calculator-content, .calculator-modal-content, .unified-order-modal-content');
    if (scrollable) {
      return; // Разрешаем скролл внутри модального окна
    }
    
    // Блокируем только скролл фона когда открыт модал
    if (modal.contains(e.target)) {
      return;
    }
    e.preventDefault();
  }, { passive: false });

  // Убираем лишние обработчики wheel
  document.addEventListener('wheel', (e) => {
    const modal = document.querySelector('.calculator-modal.active');
    if (modal && !modal.contains(e.target)) {
      // Блокируем скролл фона только когда модал открыт
      e.preventDefault();
    }
  }, { passive: false });

  // Исправляем overflow на body
  function fixBodyScroll() {
    const body = document.body;
    const hasActiveModal = body.classList.contains('calculator-modal-open') || 
                          document.querySelector('.calculator-modal.active') ||
                          document.querySelector('.unified-order-modal.active');
    
    if (hasActiveModal) {
      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.width = '100%';
    } else {
      body.style.overflow = '';
      body.style.position = '';
      body.style.width = '';
    }
  }

  // Наблюдаем за модальными окнами
  const observer = new MutationObserver(fixBodyScroll);
  const modal = document.getElementById('calculatorModal');
  const orderModal = document.getElementById('unifiedOrderModal');
  
  if (modal) {
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
  if (orderModal) {
    observer.observe(orderModal, { attributes: true, attributeFilter: ['class'] });
  }
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Исправляем при загрузке
  fixBodyScroll();
})();


