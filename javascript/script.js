document.addEventListener("DOMContentLoaded", function () {

  const track       = document.getElementById('carouselTrack');
  const progressBar = document.getElementById('carouselProgress');

  if (track && progressBar) {
    const slides     = track.querySelectorAll('.carousel-slide');
    const total      = slides.length;
    let   current    = 0;
    let   autoTimer, progressTimer, progressStart;
    const AUTO_DELAY = 5000;

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      startAutoPlay();
    }

    function startProgress() {
      clearInterval(progressTimer);
      progressBar.style.transition = 'none';
      progressBar.style.width      = '0%';
      progressStart = Date.now();

      progressTimer = setInterval(function () {
        const pct = Math.min(((Date.now() - progressStart) / AUTO_DELAY) * 100, 100);
        progressBar.style.transition = 'width 0.1s linear';
        progressBar.style.width      = pct + '%';
      }, 80);
    }

    function startAutoPlay() {
      clearInterval(autoTimer);
      startProgress();
      autoTimer = setInterval(function () { goTo(current + 1); }, AUTO_DELAY);
    }

    let touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    });

    startAutoPlay();
  }


  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-modal';
  lightboxOverlay.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close image view">&times;</button>
      <img class="lightbox-img" src="" alt="Expanded product view">
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  const lightboxImg     = lightboxOverlay.querySelector('.lightbox-img');
  const lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
  const lightboxClose   = lightboxOverlay.querySelector('.lightbox-close');

  document.querySelectorAll('.grid-item img, .carousel-slide img').forEach(function (img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      lightboxImg.setAttribute('src', this.getAttribute('src'));
      lightboxCaption.textContent = this.getAttribute('alt') || 'Novamobile product';
      lightboxOverlay.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', function () {
    lightboxOverlay.classList.remove('active');
  });
  lightboxOverlay.addEventListener('click', function (e) {
    if (e.target === lightboxOverlay) lightboxOverlay.classList.remove('active');
  });


  const trackBtn    = document.getElementById('searchTrackBtn');
  const trackInput  = document.getElementById('orderTrackingInput');
  const trackResult = document.getElementById('trackingResultDisplay');

  if (trackBtn && trackInput && trackResult) {
    trackBtn.addEventListener('click', function () {
      const code = trackInput.value.trim().toUpperCase();
      if (!code) {
        trackResult.innerHTML = `<p class="shipping" style="color:#ef4444;font-weight:bold;">✕ Please enter an order tracking code.</p>`;
        return;
      }
      trackResult.style.display = 'block';
      trackResult.innerHTML = `
        <p class="shipping" style="color:#22c55e;font-weight:bold;">✓ Order Found</p>
        <div style="text-align:left;margin-top:10px;font-size:14px;padding-left:10px;line-height:1.6;">
          <p><strong>Tracking ID:</strong> ${code}</p>
          <p><strong>Shipping Method:</strong> Express Priority Delivery</p>
          <p><strong>Status:</strong> Handed Over to Regional Courier — Johannesburg, GP</p>
          <p><strong>ETA:</strong> 1–2 Business Days</p>
          <p style="margin-top:5px;"><strong>Courier Helpline:</strong> +27 61 452 7334</p>
        </div>
      `;
    });
  }


  
  const contactLightbox = document.createElement('div');
  contactLightbox.className = 'contact-lightbox';
  contactLightbox.id        = 'contactLightbox';
  contactLightbox.innerHTML = `
    <div class="contact-lightbox-content">
      <button class="contact-lightbox-close" id="closeContactLightbox">&times;</button>
      <div class="success-checkmark">✓</div>
      <h2>Message Sent Successfully!</h2>
      <p>Thank you, <span id="summaryName" style="color:#0061bb;font-weight:bold;"></span>. We have received your message.</p>
      <div class="summary-box">
        <p><strong>Email:</strong> <span id="summaryEmail"></span></p>
        <p><strong>Message:</strong></p>
        <p id="summarySubject" class="summary-text-block"></p>
      </div>
      <p style="font-size:13px;color:#666;margin-top:15px;">A consultant will reach out within 24 business hours.</p>
    </div>
  `;
  document.body.appendChild(contactLightbox);

  document.getElementById('closeContactLightbox').addEventListener('click', function () {
    contactLightbox.classList.remove('active');
  });
  contactLightbox.addEventListener('click', function (e) {
    if (e.target === contactLightbox) contactLightbox.classList.remove('active');
  });


  const contactForm = document.getElementById('contactForm');

  const fieldMap = [
    { id: 'fname',   errId: 'fnameError',   msg: 'Please enter your first name.' },
    { id: 'lname',   errId: 'lnameError',   msg: 'Please enter your last name.'  },
    { id: 'email',   errId: 'emailError',   msg: 'Please enter a valid email address.' },
    { id: 'subject', errId: 'subjectError', msg: 'Please enter a message.'        },
  ];

  function showError(input, errEl, msg) {
    input.classList.add('input-error');
    errEl.textContent    = msg;
    errEl.style.display  = 'block';
  }
  function clearError(input, errEl) {
    input.classList.remove('input-error');
    errEl.style.display = 'none';
  }

  if (contactForm) {
    fieldMap.forEach(function (f) {
      const input = document.getElementById(f.id);
      const errEl = document.getElementById(f.errId);
      if (!input || !errEl) return;
      input.addEventListener('input', function () {
        if (this.value.trim()) clearError(this, errEl);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      fieldMap.forEach(function (f) {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.errId);
        if (!input || !errEl) return;

        if (f.id === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            showError(input, errEl, f.msg); valid = false;
          } else {
            clearError(input, errEl);
          }
        } else {
          if (!input.value.trim()) {
            showError(input, errEl, f.msg); valid = false;
          } else {
            clearError(input, errEl);
          }
        }
      });

      if (!valid) return;

      document.getElementById('summaryName').textContent    = document.getElementById('fname').value.trim() + ' ' + document.getElementById('lname').value.trim();
      document.getElementById('summaryEmail').textContent   = document.getElementById('email').value.trim();
      document.getElementById('summarySubject').textContent = document.getElementById('subject').value.trim();
      contactLightbox.classList.add('active');
      contactForm.reset();
    });
  }

});
