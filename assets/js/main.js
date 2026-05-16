(function () {
  "use strict";

  /* =========================
     Mobile nav toggle
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });

    // Close nav when a link is clicked (mobile)
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  });

  /* =========================
     Project filter (index.html)
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards   = document.querySelectorAll('.proj-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  });

  /* =========================
     Slideshow (if present)
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const slidesWrapper = document.querySelector(".slides-wrapper");
    const slides = document.querySelectorAll(".mySlides");
    const dots   = document.querySelectorAll(".dot");

    if (!slidesWrapper || slides.length === 0) return;

    let slideIndex = 1;
    const total = slides.length;

    slidesWrapper.style.transform = `translateX(-100%)`;

    slidesWrapper.addEventListener("transitionend", () => {
      if (slideIndex === 0) {
        slidesWrapper.style.transition = "none";
        slideIndex = total - 2;
        slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
      }
      if (slideIndex === total - 1) {
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
      let active = slideIndex - 1;
      if (slideIndex === 0) active = dots.length - 1;
      if (slideIndex === total - 1) active = 0;
      dots.forEach(d => d.classList.remove("active"));
      if (dots[active]) dots[active].classList.add("active");
    }
  });

})();