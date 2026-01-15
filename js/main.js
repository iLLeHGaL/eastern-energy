/**
 * Eastern Energy - Main JavaScript
 * Handles: Navigation, scroll effects, animations, and form interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // =============================================
  // Mobile Navigation Toggle
  // =============================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarMenu = document.querySelector('.navbar-menu');

  if (mobileMenuBtn && navbarMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');

      // Prevent body scroll when menu is open
      document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    const navLinks = navbarMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navbarMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navbarMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navbarMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // =============================================
  // Navbar Scroll Effect
  // =============================================
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    function handleNavbarScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Initial check
    handleNavbarScroll();

    // Listen for scroll
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  }

  // =============================================
  // Scroll Reveal Animation
  // =============================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: Stop observing after reveal
          // revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  }

  // =============================================
  // Smooth Scroll for Anchor Links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // =============================================
  // Form Handling
  // =============================================
  const contactForm = document.getElementById('contact-form');
  const applicationForm = document.getElementById('application-form');

  function handleFormSubmit(form, formType) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Here you would typically send the data to a server
      // For now, we'll just show a success message
      console.log(`${formType} form submitted:`, data);

      // Show success message
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = 'var(--color-blue)';
      submitBtn.disabled = true;

      // Reset form
      form.reset();

      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  if (contactForm) {
    handleFormSubmit(contactForm, 'Contact');
  }

  if (applicationForm) {
    handleFormSubmit(applicationForm, 'Application');
  }

  // =============================================
  // File Upload Display
  // =============================================
  const fileInputs = document.querySelectorAll('.file-upload input[type="file"]');

  fileInputs.forEach(input => {
    const uploadContainer = input.closest('.file-upload');
    const uploadText = uploadContainer.querySelector('.file-upload-text');
    const originalText = uploadText.innerHTML;

    input.addEventListener('change', function() {
      if (this.files && this.files.length > 0) {
        const fileName = this.files[0].name;
        const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2);

        uploadText.innerHTML = `
          <strong style="color: var(--color-text-primary);">${fileName}</strong><br>
          <span style="font-size: 0.9em;">${fileSize} MB - Click to change</span>
        `;
      } else {
        uploadText.innerHTML = originalText;
      }
    });

    // Drag and drop visual feedback
    uploadContainer.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.style.borderColor = 'var(--color-orange)';
      this.style.background = 'rgba(249, 115, 22, 0.1)';
    });

    uploadContainer.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.style.borderColor = '';
      this.style.background = '';
    });

    uploadContainer.addEventListener('drop', function(e) {
      this.style.borderColor = '';
      this.style.background = '';
    });
  });

  // =============================================
  // Phone Number Formatting
  // =============================================
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      // Remove all non-digits
      let value = this.value.replace(/\D/g, '');

      // Format as (XXX) XXX-XXXX
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
      }

      this.value = value;
    });
  });

  // =============================================
  // Active Navigation Link Highlight
  // =============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-links a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// =============================================
// Utility: Debounce Function
// =============================================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
