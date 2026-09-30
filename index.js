// Portfolio Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle Setup ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve previous theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });

  // --- Header Scrolled Effect ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Responsive Nav Menu ---
  const menuBtn = document.getElementById('menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('nav-menu-open');
  });

  // Close mobile menu on clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('nav-menu-open');
    });
  });

  // --- Projects Filtering Logic ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on filter buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Simple trigger logic for smooth fade-in
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.classList.add('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
        }
      });
    });
  });

  // --- Fallback Scroll Entrance Animations (For Firefox, etc.) ---
  const hasNativeScrollTimeline = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
  
  if (!hasNativeScrollTimeline) {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully shows up
    });

    revealElements.forEach(el => {
      // Set initial styles for fallback browsers
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      revealObserver.observe(el);
    });
  }

  // --- Contact Form Interaction & Validation ---
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  // Helper validation function
  const validateField = (input, errorElId) => {
    const errorEl = document.getElementById(errorElId);
    let isValid = true;

    if (input.required && !input.value.trim()) {
      isValid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      // Regex for basic email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        isValid = false;
      }
    }

    if (!isValid) {
      input.parentElement.classList.add('invalid');
    } else {
      input.parentElement.classList.remove('invalid');
    }

    return isValid;
  };

  // Real-time error removal
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.parentElement.classList.remove('invalid');
    });
  });

  // Form submission handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const isNameValid = validateField(nameInput, 'name-error');
    const isEmailValid = validateField(emailInput, 'email-error');
    const isSubjectValid = validateField(subjectInput, 'subject-error');
    const isMessageValid = validateField(messageInput, 'message-error');

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      // Custom toast success notification
      showToast('Message sent successfully! Thank you for getting in touch.', 'success');
      contactForm.reset();
    } else {
      showToast('Please correct the highlighted validation errors.', 'error');
    }
  });

  // Toast indicator helper
  const showToast = (message, type) => {
    formToast.textContent = message;
    formToast.className = 'toast'; // Reset
    
    if (type === 'success') {
      formToast.classList.add('success');
    }
    
    formToast.classList.add('show');

    // Automatically hide after 4 seconds
    setTimeout(() => {
      formToast.classList.remove('show');
    }, 4000);
  };
});
