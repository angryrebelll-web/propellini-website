/**
 * Premium Animations System - BRABUS/PRIME/ICON Level
 * GSAP ScrollTrigger animations for Propellini
 */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initParallaxLayers();
  initFadeAnimations();
  initScrollAnimations();
  initMagneticButtons();
  initHoverEffects();
  initMotionLayers();
});

/**
 * Parallax Layers System
 */
const initParallaxLayers = () => {
  // Hero parallax layers
  const heroLayers = document.querySelectorAll('.hero-layer[data-speed]');
  heroLayers.forEach(layer => {
    const speed = parseFloat(layer.dataset.speed) || 0.5;
    
    gsap.to(layer, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // About section parallax - исправлено для предотвращения наезда блоков
  const aboutBg = document.querySelector('.about-section.about-background');
  if (aboutBg) {
    const speed = 0.2; // Уменьшена скорость параллакса
    gsap.to(aboutBg, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }
  
  // Параллакс только для фонового изображения, не для контента
  const aboutBackgroundImg = document.querySelector('.about-background img');
  if (aboutBackgroundImg) {
    gsap.to(aboutBackgroundImg, {
      y: () => window.innerHeight * 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Studio section parallax
  const studioBg = document.querySelector('.studio-section-bg[data-speed]');
  if (studioBg) {
    const speed = parseFloat(studioBg.dataset.speed) || 0.25;
    gsap.to(studioBg, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '.studio',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Portfolio items parallax - ОТКЛЮЧЕНО для статичности при просмотре
  // const portfolioItems = document.querySelectorAll('.portfolio-item');
  // portfolioItems.forEach((item, index) => {
  //   gsap.to(item, {
  //     y: () => window.innerHeight * 0.35,
  //     ease: 'none',
  //     scrollTrigger: {
  //       trigger: item,
  //       start: 'top bottom',
  //       end: 'bottom top',
  //       scrub: true
  //     }
  //   });
  // });

  // Video section parallax - премиальный плавный эффект наезда поверх портфолио
  const videoSection = document.querySelector('.video-section');
  if (videoSection) {
    gsap.to(videoSection, {
      y: () => -window.innerHeight * 0.08, // Очень медленная скорость для премиального эффекта
      ease: 'none',
      scrollTrigger: {
        trigger: '.portfolio',
        start: 'top 60%', // Начинается позже, когда портфолио уже видно
        end: 'bottom 20%', // Заканчивается позже, давая время рассмотреть
        scrub: 3.5, // Очень плавный скраб для премиального ощущения
        markers: false // Отключить маркеры в продакшене
      }
    });
  }

  // Films glass items parallax - ОТКЛЮЧЕНО
  // const filmGlassItems = document.querySelectorAll('.film-glass-item');
  // filmGlassItems.forEach((item, index) => {
  //   const speed = 0.3 + (index % 3) * 0.15;
  //   gsap.to(item, {
  //     y: () => window.innerHeight * speed,
  //     x: () => (index % 2 === 0 ? -20 : 20) * speed,
  //     ease: 'none',
  //     scrollTrigger: {
  //       trigger: '.films',
  //       start: 'top bottom',
  //       end: 'bottom top',
  //       scrub: true
  //     }
  //   });
  // });
};

/**
 * Fade Animations
 */
const initFadeAnimations = () => {
  // Fade-up animations
  const fadeUpElements = document.querySelectorAll('[data-animate="fade-up"]');
  fadeUpElements.forEach(el => {
    gsap.fromTo(el, 
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Fade-in for important text
  const fadeInElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');
  fadeInElements.forEach((el, index) => {
    gsap.fromTo(el,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        delay: index * 0.3,
        ease: 'power2.out'
      }
    );
  });
};

/**
 * Scroll Animations
 */
const initScrollAnimations = () => {
  // Scale on scroll for hero car
  const heroCar = document.querySelector('.hero-layer-2');
  if (heroCar) {
    gsap.to(heroCar, {
      scale: 1.05,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Opacity shift on background gradient
  const gradients = document.querySelectorAll('.teal-haze, .studio-haze');
  gradients.forEach(gradient => {
    gsap.to(gradient, {
      opacity: 0.8,
      ease: 'none',
      scrollTrigger: {
        trigger: gradient.closest('section'),
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    });
  });

  // Blur in-out effect (Brabus style)
  const blurElements = document.querySelectorAll('.blur-in-out');
  blurElements.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => el.classList.add('blurred'),
      onLeave: () => el.classList.remove('blurred'),
      onEnterBack: () => el.classList.add('blurred'),
      onLeaveBack: () => el.classList.remove('blurred')
    });
  });
};

/**
 * Magnetic Buttons
 */
const initMagneticButtons = () => {
  const magneticButtons = document.querySelectorAll('.magnetic-btn, .btn-primary, .btn-secondary');
  
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
};

/**
 * Hover Effects
 */
const initHoverEffects = () => {
  // Glow border on film logos
  const filmLogos = document.querySelectorAll('.film-logo');
  filmLogos.forEach(logo => {
    logo.addEventListener('mouseenter', () => {
      gsap.to(logo, {
        boxShadow: '0 0 30px rgba(22, 132, 145, 0.5)',
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    logo.addEventListener('mouseleave', () => {
      gsap.to(logo, {
        boxShadow: '0 0 0px rgba(22, 132, 145, 0)',
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // 3D tilt on gallery items
  const galleryItems = document.querySelectorAll('.tilt-3d');
  galleryItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      gsap.to(item, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
};

/**
 * Motion Layers - Light Streaks
 */
const initMotionLayers = () => {
  // Create light streaks for hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    for (let i = 0; i < 3; i++) {
      const streak = document.createElement('div');
      streak.className = 'light-streak';
      streak.style.left = `${Math.random() * 100}%`;
      streak.style.animationDelay = `${Math.random() * 8}s`;
      streak.style.opacity = '0';
      hero.appendChild(streak);
    }
  }

  // Lens flare on interaction
  const interactiveElements = document.querySelectorAll('.btn, .film-logo, .portfolio-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const flare = document.createElement('div');
      flare.className = 'lens-flare';
      flare.style.left = `${e.clientX}px`;
      flare.style.top = `${e.clientY}px`;
      flare.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(flare);
      
      gsap.to(flare, {
        opacity: 1,
        scale: 1.5,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(flare, {
            opacity: 0,
            scale: 0.5,
            duration: 0.6,
            onComplete: () => flare.remove()
          });
        }
      });
    });
  });
};

/**
 * Smooth Scroll Snap - ОТКЛЮЧЕНО для плавной прокрутки
 */
// const initSmoothScroll = () => {
//   // Enable scroll snap for key sections
//   const snapSections = document.querySelectorAll('.hero, .about, .studio');
//   if (snapSections.length > 0) {
//     ScrollTrigger.create({
//       snap: {
//         snapTo: 1 / snapSections.length,
//         duration: { min: 0.2, max: 0.6 },
//         delay: 0.1,
//         ease: 'power2.inOut'
//       }
//     });
//   }
// };

// Initialize smooth scroll - ОТКЛЮЧЕНО
// initSmoothScroll();

// Refresh ScrollTrigger on resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

