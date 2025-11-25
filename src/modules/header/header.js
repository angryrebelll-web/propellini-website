/* ============================================
   HEADER MODULE - JavaScript
   Управление навигацией
   ============================================ */

(function() {
  'use strict';

  function initHeader() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const mainNav = document.getElementById('mainNav');
    
    if (!navToggle || !navMenu) return;

    // Открытие/закрытие меню
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

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });

    // Scroll effect для навигации
    if (mainNav) {
      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
          mainNav.classList.add('scrolled');
        } else {
          mainNav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
      }, { passive: true });
    }
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }

  // Экспорт для глобального доступа
  window.initHeader = initHeader;
})();


