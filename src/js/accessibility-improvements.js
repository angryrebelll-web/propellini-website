/* Accessibility Improvements - Доступность и SEO */

(function() {
  'use strict';

  // Улучшение фокус-стилей для доступности
  function initAccessibility() {
    // Улучшенные фокус-стили для всех интерактивных элементов
    const style = document.createElement('style');
    style.textContent = `
      *:focus-visible {
        outline: 2px solid var(--primary, #168491);
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 3px solid var(--primary, #168491);
        outline-offset: 3px;
        box-shadow: 0 0 0 4px rgba(22, 132, 145, 0.2);
      }
      
      /* Улучшенный контраст для текста */
      .text-muted {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      /* Skip to main content для клавиатурной навигации */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);

    // Добавляем skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Перейти к основному содержимому';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Добавляем main content ID
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.id = 'main-content';
    }

    // Улучшаем aria-labels для кнопок без текста
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
      if (!btn.textContent.trim() && !btn.querySelector('span, img[alt]')) {
        btn.setAttribute('aria-label', 'Кнопка');
      }
    });

    // Улучшаем контрастность для всех текстов
    const checkContrast = () => {
      const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button');
      textElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        // Проверка контраста (упрощенная)
        if (color.includes('rgba') && parseFloat(color.match(/[\d.]+/g)?.[3] || '1') < 0.7) {
          el.style.color = 'rgba(255, 255, 255, 0.9)';
        }
      });
    };

    // Проверяем контраст после загрузки
    setTimeout(checkContrast, 1000);
  }

  // Запускаем после загрузки
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
})();

