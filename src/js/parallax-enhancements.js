/* Parallax Enhancements - Плавные эффекты для HERO и "Наш бокс" */

(function() {
  'use strict';

  let ticking = false;

  function initParallax() {
    // Параллакс для HERO
    const heroSection = document.querySelector('.hero.parallax-image');
    if (heroSection) {
      const heroBg = heroSection.querySelector('.responsive-bg img') || 
                     heroSection.querySelector('[style*="background-image"]');
      
      if (heroBg) {
        window.addEventListener('scroll', () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const scrolled = window.pageYOffset;
              const rate = scrolled * 0.5;
              
              if (heroBg.style) {
                heroBg.style.transform = `translate3d(0, ${rate}px, 0)`;
              }
              
              ticking = false;
            });
            
            ticking = true;
          }
        }, { passive: true });
      }
    }

    // Параллакс для "Наш бокс" (Studio Section)
    const studioSection = document.querySelector('.studio.parallax-image');
    if (studioSection) {
      const studioBg = studioSection.querySelector('.responsive-bg img') || 
                        studioSection.querySelector('[style*="background-image"]');
      
      if (studioBg) {
        window.addEventListener('scroll', () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const scrolled = window.pageYOffset;
              const studioTop = studioSection.offsetTop;
              const studioHeight = studioSection.offsetHeight;
              const windowHeight = window.innerHeight;
              
              if (scrolled + windowHeight > studioTop && scrolled < studioTop + studioHeight) {
                const rate = (scrolled - studioTop) * 0.25;
                if (studioBg.style) {
                  studioBg.style.transform = `translate3d(0, ${rate}px, 0)`;
                }
              }
              
              ticking = false;
            });
            
            ticking = true;
          }
        }, { passive: true });
      }
    }

    // Плавный скролл с улучшенной анимацией
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const targetPosition = target.offsetTop - 80; // Учитываем фиксированную навигацию
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Запускаем после загрузки
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }
})();


