/* Mobile Gallery Swipe - Улучшенная галерея с swipe, zoom, close */

(function() {
  'use strict';

  function initMobileGallery() {
    const galleries = document.querySelectorAll('.portfolio-grid, .gallery-grid, #portfolioGallery');
    
    galleries.forEach(gallery => {
      if (!gallery) return;

      // Создаем lightbox если его нет
      let lightbox = document.querySelector('.mobile-gallery-lightbox');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'mobile-gallery-lightbox';
        lightbox.innerHTML = `
          <div class="lightbox-overlay"></div>
          <button class="lightbox-close" aria-label="Закрыть">&times;</button>
          <div class="lightbox-image-wrapper">
            <img class="lightbox-image" src="" alt="" />
          </div>
          <div class="lightbox-nav">
            <button class="lightbox-nav-btn lightbox-prev" aria-label="Предыдущее">&larr;</button>
            <button class="lightbox-nav-btn lightbox-next" aria-label="Следующее">&rarr;</button>
          </div>
        `;
        document.body.appendChild(lightbox);
      }

      const images = gallery.querySelectorAll('img');
      const imageArray = Array.from(images);
      let currentIndex = 0;

      const lightboxImage = lightbox.querySelector('.lightbox-image');
      const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
      const lightboxClose = lightbox.querySelector('.lightbox-close');
      const lightboxPrev = lightbox.querySelector('.lightbox-prev');
      const lightboxNext = lightbox.querySelector('.lightbox-next');

      // Открытие lightbox
      function openLightbox(index) {
        currentIndex = index;
        const img = imageArray[currentIndex];
        if (!img) return;

        lightboxImage.src = img.src || img.dataset.src;
        lightboxImage.alt = img.alt || 'Изображение';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateNavButtons();
      }

      // Закрытие lightbox
      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImage.style.transform = 'scale(1)';
      }

      // Навигация
      function showNext() {
        if (currentIndex < imageArray.length - 1) {
          currentIndex++;
          openLightbox(currentIndex);
        }
      }

      function showPrev() {
        if (currentIndex > 0) {
          currentIndex--;
          openLightbox(currentIndex);
        }
      }

      function updateNavButtons() {
        if (lightboxPrev) {
          lightboxPrev.style.display = currentIndex > 0 ? 'flex' : 'none';
        }
        if (lightboxNext) {
          lightboxNext.style.display = currentIndex < imageArray.length - 1 ? 'flex' : 'none';
        }
      }

      // Обработчики кликов на изображения
      images.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          openLightbox(index);
        });
      });

      // Закрытие
      if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
      }

      if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
      }

      // Навигация
      if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
          e.stopPropagation();
          showNext();
        });
      }

      if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
          e.stopPropagation();
          showPrev();
        });
      }

      // Swipe навигация
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      let isZoomed = false;

      lightboxImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      });

      lightboxImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      });

      function handleSwipe() {
        if (isZoomed) return; // Не обрабатываем swipe при зуме

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Горизонтальный swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            showNext(); // Swipe влево - следующее
          } else {
            showPrev(); // Swipe вправо - предыдущее
          }
        }
      }

      // Zoom (pinch-to-zoom)
      let initialDistance = 0;
      let currentScale = 1;

      lightboxImage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2 && lightbox.classList.contains('active')) {
          e.preventDefault();
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          initialDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );
        }
      }, { passive: false });

      lightboxImage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && lightbox.classList.contains('active')) {
          e.preventDefault();
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );

          const scale = currentDistance / initialDistance;
          currentScale = Math.max(1, Math.min(scale, 3));
          lightboxImage.style.transform = `scale(${currentScale})`;
          isZoomed = currentScale > 1.1;
        }
      }, { passive: false });

      lightboxImage.addEventListener('touchend', () => {
        if (currentScale < 1.1) {
          lightboxImage.style.transform = 'scale(1)';
          isZoomed = false;
        }
      });

      // Двойной тап для zoom
      let lastTap = 0;
      lightboxImage.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
          // Двойной тап
          if (currentScale === 1) {
            currentScale = 2;
            isZoomed = true;
          } else {
            currentScale = 1;
            isZoomed = false;
          }
          lightboxImage.style.transform = `scale(${currentScale})`;
          e.preventDefault();
        }
        lastTap = currentTime;
      });

      // Закрытие по Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        } else if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
          showPrev();
        } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
          showNext();
        }
      });
    });
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileGallery);
  } else {
    initMobileGallery();
  }

  // Повторная инициализация для динамически загруженных галерей
  setTimeout(initMobileGallery, 1000);
})();

