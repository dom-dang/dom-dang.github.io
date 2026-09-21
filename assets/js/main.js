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

  /* =========================
     Wales photo gallery
  ========================= */
  document.addEventListener("DOMContentLoaded", () => {
    const table = document.getElementById('table');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const shuffleButton = document.getElementById('shuffle-photos');

    if (!table || !lightbox || !lightboxImg || !lightboxClose || !shuffleButton) return;

    const photoStructure = {
      bath: [
        'IMG_6785.jpeg', 'IMG_6786.jpeg', 'IMG_6792.jpeg',
        'IMG_6801.jpeg', 'IMG_6804.jpeg', 'IMG_6805.jpeg',
        'IMG_6819.jpeg', 'IMG_6821.jpeg', 'IMG_6828.jpeg', 'IMG_6839.jpeg', 'IMG_6841.jpeg',
        'IMG_6842.jpeg', 'IMG_6848.jpeg',
      ],
      cardiff: [
        'IMG_6382.jpeg', 'IMG_6384.jpeg', 'IMG_6385.jpeg', 'IMG_6417.jpeg', 'IMG_6420.jpeg',
        'IMG_6430.jpeg', 'IMG_6432.jpeg', 'IMG_6433.jpeg', 'IMG_6442.jpeg', 'IMG_6444.jpeg',
        'IMG_6445.jpeg',
      ],
      nature: {
        castles: [
          'IMG_6394.jpeg', 'IMG_6395.jpeg', 'IMG_6403.jpeg', 'IMG_6404.jpeg', 'IMG_6405.jpeg',
          'IMG_6407.jpeg', 'IMG_6458.jpeg', 'IMG_6466.jpeg', 'IMG_6675.jpeg', 'IMG_6691.jpeg',
        ],
        other: [
          'IMG_6451.jpeg', 'IMG_6473.jpeg', 'IMG_6492.jpeg', 'IMG_6494.jpeg', 'IMG_6530.jpeg',
          'IMG_6534.jpeg', 'IMG_6538.jpeg', 'IMG_6541.jpeg', 'IMG_6559.jpeg', 'IMG_6642.jpeg',
          'IMG_6701.jpeg', 'IMG_6705.jpeg', 'IMG_6726.jpeg', 'IMG_6739.jpeg', 'IMG_6743.jpeg',
          'IMG_6749.jpeg', 'IMG_6768.jpeg', 'IMG_6873.jpeg', 'IMG_6874.jpeg',
        ],
      },
      teaching: [
        'IMG_1398.jpeg', 'IMG_2639.jpeg', 'IMG_2648.jpeg', 'IMG_6495.jpeg', 'IMG_6496.jpeg',
        'IMG_6497.jpeg', 'IMG_6563.jpeg', 'IMG_6574.jpeg', 'IMG_6575.jpeg', 'IMG_6581.JPG',
        'IMG_6590.jpeg', 'IMG_6591.JPG', 'IMG_6592.JPG', 'IMG_6595.jpeg', 'IMG_6603.JPG',
        'IMG_6604.JPG', 'IMG_6605.JPG', 'IMG_6606.JPG',
      ],
    };

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let active = null;
    let startX = 0;
    let startY = 0;
    let didDrag = false;

    function scatter(photo) {
      const rect = table.getBoundingClientRect();
      const size = window.innerWidth <= 480 ? 115 : window.innerWidth <= 768 ? 140 : 170;
      const margin = 20;
      const availableWidth = Math.max(0, rect.width - size - margin * 2);
      const availableHeight = Math.max(0, rect.height - size - margin * 2);

      photo.style.setProperty('--x', `${margin + Math.random() * availableWidth}px`);
      photo.style.setProperty('--y', `${margin + Math.random() * availableHeight}px`);
      photo.style.setProperty('--rot', `${(Math.random() - 0.5) * 12}deg`);
      photo.style.setProperty('--dx', '0px');
      photo.style.setProperty('--dy', '0px');
    }

    function addDrag(photo, imagePath) {
      const beginDrag = (clientX, clientY) => {
        active = photo;
        photo.classList.add('dragging');
        startX = clientX;
        startY = clientY;
        didDrag = false;
      };

      photo.addEventListener('mousedown', (event) => {
        event.preventDefault();
        beginDrag(event.clientX, event.clientY);
      });

      photo.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        beginDrag(touch.clientX, touch.clientY);
      }, { passive: true });

      photo.addEventListener('click', () => {
        if (didDrag) return;
        lightboxImg.src = imagePath;
        lightbox.classList.add('active');
      });

      if (!isTouchDevice) {
        photo.addEventListener('mouseenter', () => {
          if (photo.classList.contains('dragging')) return;
          photo.style.setProperty('--dx', `${(Math.random() - 0.5) * 5}px`);
          photo.style.setProperty('--dy', `${(Math.random() - 0.5) * 5}px`);
        });

        photo.addEventListener('mouseleave', () => {
          if (photo.classList.contains('dragging')) return;
          photo.style.setProperty('--dx', '0px');
          photo.style.setProperty('--dy', '0px');
        });
      }
    }

    function addPhoto(filter, imagePath) {
      const photo = document.createElement('div');
      const tape = Math.random() > 0.5 ? '<div class="tape top"></div>' : '';
      const thumbnailPath = imagePath.replace('wales_photos/', 'assets/img/wales_thumbnails/');

      photo.className = 'photo';
      photo.dataset.filter = filter;
      photo.hidden = true;
      photo.innerHTML = `${tape}<div class="photo-frame"><img data-src="${thumbnailPath}" loading="lazy" decoding="async" alt="Wales ${filter} photo"></div>`;
      addDrag(photo, imagePath);
      return photo;
    }

    function showFilter(filter) {
      const photos = Array.from(table.querySelectorAll('.photo'));
      photos.forEach(photo => { photo.hidden = true; });

      const matchingPhotos = filter === 'all'
        ? photos
        : photos.filter(photo => photo.dataset.filter === filter);

      matchingPhotos
        .sort(() => Math.random() - 0.5)
        .forEach((photo) => {
          const image = photo.querySelector('img');
          if (!image.hasAttribute('src')) image.src = image.dataset.src;
          photo.hidden = false;
          scatter(photo);
        });
    }

    const fragment = document.createDocumentFragment();
    photoStructure.teaching.forEach(file => fragment.appendChild(addPhoto('teaching', `wales_photos/teaching/${file}`)));
    photoStructure.cardiff.forEach(file => fragment.appendChild(addPhoto('cardiff', `wales_photos/cardiff/${file}`)));
    photoStructure.bath.forEach(file => fragment.appendChild(addPhoto('bath', `wales_photos/bath/${file}`)));
    photoStructure.nature.castles.forEach(file => fragment.appendChild(addPhoto('castles', `wales_photos/nature/castles/${file}`)));
    photoStructure.nature.other.forEach(file => fragment.appendChild(addPhoto('nature', `wales_photos/nature/${file}`)));
    table.appendChild(fragment);

    document.querySelectorAll('.wales-page .filter-btn').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.wales-page .filter-btn').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        showFilter(button.dataset.filter);
      });
    });

    shuffleButton.addEventListener('click', () => {
      table.querySelectorAll('.photo:not([hidden])').forEach(scatter);
    });

    document.addEventListener('mousemove', (event) => {
      if (!active) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
      active.style.setProperty('--dx', `${dx}px`);
      active.style.setProperty('--dy', `${dy}px`);
    });

    document.addEventListener('touchmove', (event) => {
      if (!active) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;
      active.style.setProperty('--dx', `${dx}px`);
      active.style.setProperty('--dy', `${dy}px`);
    }, { passive: true });

    const endDrag = () => {
      if (!active) return;
      const x = parseFloat(active.style.getPropertyValue('--x')) || 0;
      const y = parseFloat(active.style.getPropertyValue('--y')) || 0;
      const dx = parseFloat(active.style.getPropertyValue('--dx')) || 0;
      const dy = parseFloat(active.style.getPropertyValue('--dy')) || 0;

      active.style.setProperty('--x', `${x + dx}px`);
      active.style.setProperty('--y', `${y + dy}px`);
      active.style.setProperty('--dx', '0px');
      active.style.setProperty('--dy', '0px');
      active.classList.remove('dragging');
      window.setTimeout(() => { didDrag = false; }, 10);
      active = null;
    };

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    window.addEventListener('blur', endDrag);

    const closeLightbox = () => lightbox.classList.remove('active');
    lightboxClose.addEventListener('click', (event) => {
      event.stopPropagation();
      closeLightbox();
    });
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeLightbox();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        table.querySelectorAll('.photo:not([hidden])').forEach(scatter);
      }, 250);
    });

    showFilter('all');
  });

})();
