(function () {
  "use strict";

  /* =========================
     Helper functions
  ========================= */
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const elements = select(el, all);
    if (!elements) return;
    if (all) elements.forEach(e => e.addEventListener(type, listener));
    else elements.addEventListener(type, listener);
  };

  /* =========================
     Burger menu
  ========================= */
  on('click', '.burger', () => {
    select('.burger')?.classList.toggle('active');
  });

  /* =========================
     Portfolio (Isotope)
  ========================= */
  window.addEventListener('load', () => {
    const portfolioContainer = select('#portfolio-grid');
    if (!portfolioContainer || typeof Isotope === "undefined") return;

    const iso = new Isotope(portfolioContainer, {
      itemSelector: '.item',
    });

    const filters = select('#filters a', true);
    on('click', '#filters a', function (e) {
      e.preventDefault();
      filters.forEach(f => f.classList.remove('active'));
      this.classList.add('active');

      iso.arrange({ filter: this.dataset.filter });
    }, true);
  });

  /* =========================
     AOS
  ========================= */
  window.addEventListener('load', () => {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 1000,
        once: true,
      });
    }
  });

  /* =========================
     SLIDESHOW
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const slidesWrapper = select(".slides-wrapper");
    const slides = select(".mySlides", true);
    const dots = select(".dot", true);

    if (!slidesWrapper || slides.length === 0) return;

    let slideIndex = 1;
    const totalSlides = slides.length;

    slidesWrapper.style.transform = "translateX(-100%)";

    slidesWrapper.addEventListener("transitionend", () => {
      if (slideIndex === 0) {
        slidesWrapper.style.transition = "none";
        slideIndex = totalSlides - 2;
        slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
      if (slideIndex === totalSlides - 1) {
        slidesWrapper.style.transition = "none";
        slideIndex = 1;
        slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
    });

    window.plusSlides = (n) => {
      slideIndex += n;
      showSlides();
    };

    window.currentSlide = (n) => {
      slideIndex = n;
      showSlides();
    };

    function showSlides() {
      slidesWrapper.style.transition = "transform 0.8s ease-in-out";
      slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      let activeIndex = slideIndex - 1;
      if (slideIndex === 0) activeIndex = dots.length - 1;
      if (slideIndex === totalSlides - 1) activeIndex = 0;

      dots.forEach(d => d.classList.remove("active"));
      dots[activeIndex]?.classList.add("active");
    }
  });

  /* =========================
     PROJECT FILTER (cards)
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.project-filters button');
    const items = document.querySelectorAll('.project-item');

    console.log('Buttons found:', buttons.length); // Debug
    console.log('Items found:', items.length); // Debug

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('Button clicked:', button.dataset.filter); // Debug

        // Remove active class from all buttons
        buttons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filter = button.dataset.filter;

        // Show/hide items based on filter
        items.forEach(item => {
          const category = item.dataset.category;
          console.log('Item category:', category, 'Filter:', filter); // Debug

          if (filter === 'all' || category === filter) {
            item.classList.remove('d-none');
          } else {
            item.classList.add('d-none');
          }
        });
      });
    });
  });

})();