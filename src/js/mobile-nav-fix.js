/* Mobile Navigation Fix - Исправление работы навигации на мобильных */

(function() {
  'use strict';

  function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
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
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }

  // Повторная инициализация
  setTimeout(initMobileNav, 500);
})();

