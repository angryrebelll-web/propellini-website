/**
 * Responsive Images Utility
 * Automatically switches between desktop and mobile images based on viewport width
 */

const setResponsiveImage = (el, desktop, mobile) => {
  if (!el) return;
  
  const isMobile = window.innerWidth <= 768;
  const imagePath = isMobile ? mobile : desktop;
  
  el.style.backgroundImage = `url(${imagePath})`;
  el.setAttribute('data-bg-desktop', desktop);
  el.setAttribute('data-bg-mobile', mobile);
};

const setResponsiveVideo = (el, desktop, mobile) => {
  if (!el) return;
  
  const isMobile = window.innerWidth <= 768;
  const videoPath = isMobile ? mobile : desktop;
  
  const source = el.querySelector('source');
  if (source) {
    source.src = videoPath;
    el.load();
  }
};

const initResponsiveBackgrounds = () => {
  // Hero section - НЕ изменяем, используем CSS стили из hero-background-fix.css
  // Фон устанавливается через CSS для надежности
  // const heroSection = document.querySelector('.hero-section');
  // if (heroSection) {
  //   setResponsiveImage(
  //     heroSection,
  //     '/public/images/hero/hero-desktop.jpg',
  //     '/public/images/hero/hero-mobile.jpg'
  //   );
  // }

  // About section
  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    setResponsiveImage(
      aboutSection,
      '/public/images/about/about-desktop.jpg',
      '/public/images/about/about-mobile.jpg'
    );
  }

  // Calculator section
  const calculatorSection = document.querySelector('.calculator-section-bg');
  if (calculatorSection) {
    setResponsiveImage(
      calculatorSection,
      '/public/images/calculator/calculator-bg-dark.jpg',
      '/public/images/calculator/calculator-bg-mobile.jpg'
    );
  }

  // Studio section
  const studioSection = document.querySelector('.studio-section-bg');
  if (studioSection) {
    setResponsiveImage(
      studioSection,
      '/public/images/studio/studio-1.jpg',
      '/public/images/studio/studio-1.jpg'
    );
  }

  // Contacts section
  const contactsSection = document.querySelector('.contacts-section-bg');
  if (contactsSection) {
    setResponsiveImage(
      contactsSection,
      '/public/images/contacts/studio-night.jpg',
      '/public/images/contacts/studio-mobile.jpg'
    );
  }

  // Video section
  const videoElement = document.querySelector('.video-section video');
  if (videoElement) {
    setResponsiveVideo(
      videoElement,
      '/public/images/video/teaser-desktop.mp4',
      '/public/images/video/teaser-mobile.mp4'
    );
  }

  // Re-apply on all elements with data attributes
  document.querySelectorAll('[data-bg-desktop]').forEach(el => {
    const desktop = el.getAttribute('data-bg-desktop');
    const mobile = el.getAttribute('data-bg-mobile');
    if (desktop && mobile) {
      setResponsiveImage(el, desktop, mobile);
    }
  });
};

// Handle window resize with debounce
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initResponsiveBackgrounds();
  }, 150);
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initResponsiveBackgrounds);
} else {
  initResponsiveBackgrounds();
}

// Re-initialize on window resize
window.addEventListener('resize', handleResize);

// Export for manual use
window.setResponsiveImage = setResponsiveImage;
window.setResponsiveVideo = setResponsiveVideo;




