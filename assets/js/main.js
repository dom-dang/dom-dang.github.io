/**
* Template Name: MyPortfolio - v4.7.0
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * burgerMenu
   */
  const burgerMenu = select('.burger')
  on('click', '.burger', function(e) {
    burgerMenu.classList.toggle('active');
  })

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('#portfolio-grid');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.item',
      });

      let portfolioFilters = select('#filters a', true);

      on('click', '#filters a', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('active');
        });
        this.classList.add('active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh()
        });
      }, true);
    }

  });


  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})()




let slideIndex = 1;
const slidesWrapper = document.querySelector(".slides-wrapper");
const slides = document.getElementsByClassName("mySlides");
const totalSlides = slides.length;

// Initialize the slideshow
document.addEventListener("DOMContentLoaded", () => {
    setInitialPosition();
    updateDots(slideIndex);
});

function setInitialPosition() {
    // Offset to show the first "real" slide
    slidesWrapper.style.transform = `translateX(-100%)`;
}

function plusSlides(n) {
    slideIndex += n;
    showSlides();
}

function currentSlide(n) {
    slideIndex = n;
    showSlides();
}

function showSlides() {
    const dots = document.getElementsByClassName("dot");

    // Smooth transition
    slidesWrapper.style.transition = "transform 0.8s ease-in-out";

    // Adjust the transform to slide to the current index
    slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;

    // Reset the position if at cloned slides
    slidesWrapper.addEventListener("transitionend", () => {
        if (slideIndex === 0) {
            // Reset to last "real" slide
            slidesWrapper.style.transition = "none";
            slideIndex = totalSlides - 2;
            slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        } else if (slideIndex === totalSlides - 1) {
            // Reset to first "real" slide
            slidesWrapper.style.transition = "none";
            slideIndex = 1;
            slidesWrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
    });

    // Update active dots
    updateDots(slideIndex);
}

function updateDots(index) {
    const dots = document.getElementsByClassName("dot");

    // Adjust for cloned slides
    let activeIndex = index - 1;
    if (index === 0) activeIndex = totalSlides - 3; // Last real slide
    if (index === totalSlides - 1) activeIndex = 0; // First real slide

    // Update dot styles
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[activeIndex].className += " active";
}

