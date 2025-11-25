/* Unified Order Form - Единая форма заявки для всего сайта */

(function() {
  'use strict';

  let isModalOpen = false;
  let phoneMask = null;

  // Инициализация маски телефона
  function initPhoneMask(input) {
    if (!input) return;

    // Простая маска для российского телефона
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.startsWith('8')) {
        value = '7' + value.slice(1);
      }
      
      if (value.startsWith('7')) {
        let formatted = '+7';
        if (value.length > 1) {
          formatted += ' (' + value.slice(1, 4);
        }
        if (value.length >= 4) {
          formatted += ') ' + value.slice(4, 7);
        }
        if (value.length >= 7) {
          formatted += '-' + value.slice(7, 9);
        }
        if (value.length >= 9) {
          formatted += '-' + value.slice(9, 11);
        }
        e.target.value = formatted;
      } else if (value.length > 0) {
        e.target.value = '+7 (' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 8) + '-' + value.slice(8, 10);
      }
    });

    input.addEventListener('keydown', (e) => {
      // Разрешаем: backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          // Разрешаем: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          // Разрешаем: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      // Запрещаем все, кроме цифр
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  }

  // Открытие формы с данными из калькулятора
  function openOrderForm(calculatorData = null) {
    const modal = document.getElementById('unifiedOrderModal');
    const overlay = document.getElementById('unifiedOrderModalOverlay');
    const form = document.getElementById('unifiedOrderForm');
    const successScreen = document.getElementById('unifiedOrderSuccess');
    const body = document.body;

    if (!modal || !overlay) return;

    // Скрываем экран успеха
    if (successScreen) {
      successScreen.classList.remove('active');
    }

    // Показываем форму
    if (form) {
      form.style.display = 'flex';
    }

    // Блокируем прокрутку (через scroll-fix.js)
    body.classList.add('unified-order-modal-open');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';

    // Показываем modal
    overlay.classList.add('active');
    modal.classList.add('active');
    isModalOpen = true;

    // Заполняем данные из калькулятора, если есть
    if (calculatorData && window.calculator) {
      const carInput = document.getElementById('unifiedOrderCar');
      const zonesInput = document.getElementById('unifiedOrderZones');
      const totalInput = document.getElementById('unifiedOrderTotal');
      const classInput = document.getElementById('unifiedOrderClass');
      const packageInput = document.getElementById('unifiedOrderPackage');

      // Автомобиль
      if (carInput && window.calculator.selectedBrand && window.calculator.selectedModel) {
        carInput.value = `${window.calculator.selectedBrand} ${window.calculator.selectedModel}`;
      }

      // Класс
      if (classInput && window.calculator.selectedClass) {
        const classNames = {
          'small': 'Малый класс',
          'business': 'Бизнес класс / Кроссоверы',
          'suv-lux': 'Внедорожники / Люкс',
          'pickup': 'Большие пикапы',
          'bus': 'Автобусы / Минивэны'
        };
        classInput.value = classNames[window.calculator.selectedClass] || window.calculator.selectedClass;
      }

      // Зоны или пакет
      if (window.calculator.selectedZones && window.calculator.selectedZones.size > 0) {
        if (zonesInput) {
          const zones = Array.from(window.calculator.selectedZones).map(zoneId => {
            const zone = window.calculator.zonesDatabase?.find(z => z.id === zoneId);
            return zone ? zone.name : zoneId;
          }).join(', ');
          zonesInput.value = zones;
        }
      }

      // Итоговая цена
      if (totalInput) {
        const totalEl = document.getElementById('totalAmount');
        if (totalEl) {
          totalInput.value = totalEl.textContent || '0 ₽';
        } else if (window.calculator.calculateTotal) {
          const total = window.calculator.calculateTotal();
          totalInput.value = `${total.toLocaleString('ru-RU')} ₽`;
        }
      }
    } else {
      // Очищаем поля, если нет данных из калькулятора
      const carInput = document.getElementById('unifiedOrderCar');
      const zonesInput = document.getElementById('unifiedOrderZones');
      const totalInput = document.getElementById('unifiedOrderTotal');
      const classInput = document.getElementById('unifiedOrderClass');
      
      if (carInput) carInput.value = '';
      if (zonesInput) zonesInput.value = '';
      if (totalInput) totalInput.value = '';
      if (classInput) classInput.value = '';
    }

    // Инициализируем маску телефона
    const phoneInput = document.getElementById('unifiedOrderPhone');
    if (phoneInput) {
      initPhoneMask(phoneInput);
    }

    // Фокус на первом поле
    const nameInput = document.getElementById('unifiedOrderName');
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 300);
    }
  }

  // Закрытие формы
  function closeOrderForm() {
    const modal = document.getElementById('unifiedOrderModal');
    const overlay = document.getElementById('unifiedOrderModalOverlay');
    const body = document.body;

    if (!modal || !overlay) return;

    modal.classList.add('closing');
    overlay.classList.remove('active');

    setTimeout(() => {
      modal.classList.remove('active', 'closing');
      body.classList.remove('unified-order-modal-open');
      body.style.overflow = '';
      body.style.position = '';
      body.style.width = '';
      isModalOpen = false;

      // Сбрасываем форму
      const form = document.getElementById('unifiedOrderForm');
      if (form) {
        form.reset();
      }
    }, 300);
  }

  // Показ экрана успеха
  function showSuccessScreen() {
    const form = document.getElementById('unifiedOrderForm');
    const successScreen = document.getElementById('unifiedOrderSuccess');

    if (form) {
      form.style.display = 'none';
    }

    if (successScreen) {
      successScreen.classList.add('active');
    }
  }

  // Обработка отправки формы
  function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Валидация
    const name = formData.get('name');
    const phone = formData.get('phone');

    if (!name || !phone) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // Здесь можно отправить данные на сервер
    // Например, через fetch API
    
    // Показываем экран успеха
    showSuccessScreen();

    // Можно отправить данные на сервер
    // fetch('/api/order', {
    //   method: 'POST',
    //   body: formData
    // }).then(response => response.json())
    //   .then(data => {
    //     showSuccessScreen();
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //     alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    //   });
  }

  // Инициализация
  function initUnifiedOrderForm() {
    // Кнопка закрытия
    const closeBtn = document.getElementById('unifiedOrderModalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeOrderForm();
      });
    }

    // Закрытие по клику на overlay (но не на саму форму)
    const overlay = document.getElementById('unifiedOrderModalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeOrderForm();
        }
      });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeOrderForm();
      }
    });

    // Обработка отправки формы
    const form = document.getElementById('unifiedOrderForm');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    // Все кнопки "Записаться" - открывают форму
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Кнопка "Записаться" в калькуляторе (desktop)
      if (target.matches('#orderBtn') || target.closest('#orderBtn')) {
        e.preventDefault();
        e.stopPropagation();
        openOrderForm({ fromCalculator: true });
      }
      
      // Кнопка отмены
      if (target.matches('#unifiedOrderCancel') || target.closest('#unifiedOrderCancel')) {
        e.preventDefault();
        e.stopPropagation();
        closeOrderForm();
      }
      
      // Кнопка в мобильном калькуляторе
      if (target.matches('#mobileOrderSubmitBtn') || target.closest('#mobileOrderSubmitBtn')) {
        // Это кнопка отправки формы, не открытия
        return;
      }
      
      // Другие кнопки "Записаться"
      if (target.matches('.application-open-btn') || 
          target.closest('.application-open-btn') ||
          target.matches('[data-action="open-order"]') ||
          target.closest('[data-action="open-order"]')) {
        e.preventDefault();
        e.stopPropagation();
        openOrderForm();
      }
      
      // Кнопки "Получить скидку" - открывают форму
      if (target.matches('.discount-open-btn') || 
          target.closest('.discount-open-btn') ||
          target.matches('[data-action="open-discount"]') ||
          target.closest('[data-action="open-discount"]')) {
        e.preventDefault();
        e.stopPropagation();
        openOrderForm();
      }
    }, true); // Используем capture phase для надежности

    // Экспортируем функции для глобального доступа
    window.openOrderForm = openOrderForm;
    window.closeOrderForm = closeOrderForm;
  }

  // Запускаем после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedOrderForm);
  } else {
    initUnifiedOrderForm();
  }

  // Повторная инициализация для надежности
  setTimeout(initUnifiedOrderForm, 500);
  setTimeout(initUnifiedOrderForm, 1000);
})();

