/* Portfolio Lightbox - Галерея с открытием изображений */

(function() {
  'use strict';

  function initPortfolioLightbox() {
    const gallery = document.getElementById('portfolioGallery');
    if (!gallery) return;

    // Создаем lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'portfolio-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Закрыть">&times;</button>
        <img class="lightbox-image" src="" alt="" />
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    // Открытие lightbox
    function openLightbox(imgSrc, imgAlt) {
      lightboxImage.src = imgSrc;
      lightboxImage.alt = imgAlt || 'Изображение';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Закрытие lightbox
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Обработчики событий
    gallery.addEventListener('click', (e) => {
      const img = e.target.closest('.portfolio-item img');
      if (img) {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioLightbox);
  } else {
    initPortfolioLightbox();
  }
})();

