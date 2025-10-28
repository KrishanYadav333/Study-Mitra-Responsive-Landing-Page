// Application state
const appState = {
  isScrolled: false,
  currentSection: 'home',
  isMobile: window.innerWidth <= 768
};

// Safe DOM query function
function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch (error) {
    console.warn(`Element not found: ${selector}`);
    return null;
  }
}

// Add safe event listener
function addSafeEventListener(element, event, handler) {
  if (element && typeof handler === 'function') {
    element.addEventListener(event, handler);
  }
}

// Handle scroll events for navbar background change
function handleScroll() {
  const navbar = safeQuerySelector('.navbar');
  if (!navbar) return;

  const scrollThreshold = 50;
  const isScrolled = window.scrollY > scrollThreshold;
  
  if (isScrolled !== appState.isScrolled) {
    appState.isScrolled = isScrolled;
    navbar.classList.toggle('scrolled', isScrolled);
  }
}

// Throttle scroll events for better performance
let scrollTimeout;
function throttledScrollHandler() {
  if (!scrollTimeout) {
    scrollTimeout = setTimeout(() => {
      handleScroll();
      scrollTimeout = null;
    }, 16); // ~60fps
  }
}

// Initialize scroll event listener
function initScrollHandler() {
  addSafeEventListener(window, 'scroll', throttledScrollHandler);
}

// Initialize the application
function init() {
  initScrollHandler();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}// Smo
oth scroll navigation
function handleNavigation(event) {
  event.preventDefault();
  
  const targetId = event.target.getAttribute('href');
  if (!targetId || !targetId.startsWith('#')) return;
  
  const targetElement = safeQuerySelector(targetId);
  if (!targetElement) {
    console.warn(`Target section not found: ${targetId}`);
    return;
  }
  
  // Calculate offset for fixed navbar
  const navbarHeight = safeQuerySelector('.navbar')?.offsetHeight || 0;
  const targetPosition = targetElement.offsetTop - navbarHeight;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
  
  // Update current section
  appState.currentSection = targetId.substring(1);
}

// Initialize navigation handlers
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    addSafeEventListener(link, 'click', handleNavigation);
  });
}

// Handle window resize for responsive behavior
function handleResize() {
  const wasMobile = appState.isMobile;
  appState.isMobile = window.innerWidth <= 768;
  
  // Trigger layout adjustments if needed
  if (wasMobile !== appState.isMobile) {
    // Could add specific mobile/desktop transition logic here
  }
}

// Initialize resize handler
function initResizeHandler() {
  addSafeEventListener(window, 'resize', handleResize);
}

// Enhanced initialization
function init() {
  initScrollHandler();
  initNavigation();
  initResizeHandler();
  
  // Set initial state
  handleScroll();
}// Pe
rformance monitoring (optional)
function logPerformance() {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`Page load time: ${loadTime}ms`);
  }
}

// Error handling for the entire application
window.addEventListener('error', function(event) {
  console.error('Application error:', event.error);
});

// Initialize performance monitoring
window.addEventListener('load', logPerformance);// Cont
act form handling
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.interest) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate form submission
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// Initialize contact form if on contact page
function initContactPage() {
  handleContactForm();
}

// Enhanced initialization for multi-page support
function init() {
  initScrollHandler();
  initNavigation();
  initResizeHandler();
  initContactPage();
  
  // Set initial state
  handleScroll();
}/
/ Course filtering functionality
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  if (filterButtons.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      courseCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease-in';
        } else {
          const cardCategory = card.getAttribute('data-category');
          if (cardCategory === filterValue) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

// FAQ functionality
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

// Enhanced contact form handling
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      alert('Please enter a valid phone number.');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! Our team will get back to you within 24 hours.');
      contactForm.reset();
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
    }, 2000);
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Intersection Observer for animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll('.course-card, .feature-card, .testimonial-card, .mission-card, .value-card, .team-card');
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Live chat simulation
function initLiveChat() {
  const chatButtons = document.querySelectorAll('button:contains("Start Chat")');
  
  chatButtons.forEach(button => {
    if (button.textContent.includes('Start Chat')) {
      button.addEventListener('click', () => {
        alert('Live chat feature coming soon! For immediate assistance, please call +91 88001 23456 or email support@studymitra.com');
      });
    }
  });
}

// Course enrollment simulation
function initCourseEnrollment() {
  const enrollButtons = document.querySelectorAll('.enroll-btn');
  
  enrollButtons.forEach(button => {
    button.addEventListener('click', function() {
      const courseCard = this.closest('.course-card');
      const courseName = courseCard.querySelector('h3').textContent;
      
      if (confirm(`Are you interested in enrolling for "${courseName}"? This will redirect you to our enrollment page.`)) {
        alert('Redirecting to enrollment page... (This is a demo)');
      }
    });
  });
}

// Add CSS animations
function addAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .pulse-animation {
      animation: pulse 2s infinite;
    }
  `;
  document.head.appendChild(style);
}

// Enhanced initialization for all pages
function init() {
  initScrollHandler();
  initNavigation();
  initResizeHandler();
  initContactPage();
  initCourseFilters();
  initFAQ();
  initSmoothScroll();
  initScrollAnimations();
  initLiveChat();
  initCourseEnrollment();
  addAnimations();
  
  // Set initial state
  handleScroll();
  
  // Add pulse animation to CTA buttons
  setTimeout(() => {
    const ctaButtons = document.querySelectorAll('.gradient-btn');
    ctaButtons.forEach(btn => {
      btn.classList.add('pulse-animation');
    });
  }, 3000);
}