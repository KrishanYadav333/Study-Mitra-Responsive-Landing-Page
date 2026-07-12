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

// Map home page category select values → courses.html data-filter values
const CATEGORY_MAP = {
  'Web Development':      'development',
  'Data Science':         'data-science',
  'Digital Marketing':    'development',
  'Cloud Computing':      'cloud'
};

// Hero search bar (index.html) — navigate to courses.html with query params
function initHeroSearch() {
  const searchInput    = document.querySelector('.search-input');
  const categorySelect = document.querySelector('.category-select');
  const searchBtn      = document.querySelector('.search-btn');

  if (!searchBtn) return; // not on home page

  function doSearch() {
    const q   = searchInput ? searchInput.value.trim() : '';
    const raw = categorySelect ? categorySelect.value : '';
    const cat = CATEGORY_MAP[raw] || 'all';
    const params = new URLSearchParams();
    if (q)          params.set('q',   q);
    if (cat !== 'all') params.set('cat', cat);
    const qs = params.toString();
    window.location.href = 'courses.html' + (qs ? '?' + qs : '');
  }

  searchBtn.addEventListener('click', doSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }
}

// courses.html — read URL params on load and apply filter + text search
function initCoursesSearchFromURL() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length === 0) return; // not on courses page

  const params = new URLSearchParams(window.location.search);
  const q      = (params.get('q')   || '').toLowerCase().trim();
  const cat    = (params.get('cat') || 'all').trim();

  // Apply category filter button
  if (cat !== 'all') {
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter') === cat);
    });
  }

  // Apply text + category filter to cards
  const courseCards = document.querySelectorAll('.course-card');
  if (courseCards.length === 0) return;

  courseCards.forEach(card => {
    const cardCat  = card.getAttribute('data-category') || '';
    const cardText = card.innerText.toLowerCase();
    const catMatch = cat === 'all' || cardCat === cat;
    const qMatch   = !q || cardText.includes(q);
    card.style.display = (catMatch && qMatch) ? 'block' : 'none';
  });

  // If search term present, scroll to courses section
  if (q || cat !== 'all') {
    const section = document.querySelector('.all-courses');
    if (section) setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }
}

// Initialize the application
function init() {
  initScrollHandler();
  initHeroSearch();
  initCoursesSearchFromURL();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Smooth scroll navigation
function handleNavigation(event) {
  const targetId = event.target.getAttribute('href');
  if (!targetId || !targetId.startsWith('#')) return;
  
  event.preventDefault();
  
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
}

// Performance monitoring (optional)
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
window.addEventListener('load', logPerformance);

// Contact form handling
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
}

// Course filtering functionality
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
        entry.target.classList.add('revealed');
        // Fallback for older script logic
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll('.course-card, .modern-course-card, .latest-course-card, .category-card, .stat-item, .feature-card, .feature-item, .testimonial-card, .mission-card, .value-card, .team-card, .instructor-card, .timeline-item');
  
  animateElements.forEach(el => {
    el.classList.add('reveal-item');
    // Keep inline styles for backward compatibility or let CSS handle it
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
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
  initHeroSearch();
  initCoursesSearchFromURL();
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



// Clerk button delegation — works before and after Clerk loads, survives innerHTML replacement
document.addEventListener('click', (e) => {
  if (e.target.closest('.login-btn')) {
    if (window.Clerk) window.Clerk.openSignIn();
    else console.warn('Clerk not loaded — check browser console for errors');
  }
  if (e.target.closest('.signup-btn')) {
    if (window.Clerk) window.Clerk.openSignUp();
    else console.warn('Clerk not loaded — check browser console for errors');
  }
});

// Clerk Authentication System
const CLERK_PK = 'pk_test_ZXhhY3QtdHVya2V5LTM1LmNsZXJrLmFjY291bnRzLmRldiQ';

const initClerk = async () => {
  // window.Clerk here is the Clerk CLASS (not instance) — script loaded without data-clerk-publishable-key
  if (!window.Clerk) {
    if(!window._clerkWait) window._clerkWait = 0;
    window._clerkWait += 50;
    if(window._clerkWait > 3000 && !window._clerkAlerted) {
        window._clerkAlerted = true;
        console.warn("Clerk Auth failed to load. Are you running via file:// instead of http://localhost?");
    }
    setTimeout(initClerk, 50);
    return;
  }

  try {
    // v4: data-clerk-publishable-key sets window.Clerk to instance; .load() initializes WITH UI components
    await window.Clerk.load({
      navigate: (to) => { window.location.href = to; },
      afterSignInUrl: window.location.origin + '/Study-Mitra-Responsive-Landing-Page/',
      afterSignUpUrl: window.location.origin + '/Study-Mitra-Responsive-Landing-Page/',
    });

    const updateAuthUI = () => {
      const navCtas = document.querySelectorAll('.nav-cta');

      navCtas.forEach(cta => {
        if (window.Clerk.user) {
          // User is signed in
          cta.innerHTML = '<div class="user-button-container" style="display:flex; align-items:center;"></div>';
          window.Clerk.mountUserButton(cta.querySelector('.user-button-container'), {
            appearance: {
              elements: {
                userButtonAvatarBox: {
                  width: '40px',
                  height: '40px'
                }
              }
            }
          });
        } else {
          // User is signed out
          cta.innerHTML = `
            <button class="login-btn glass-btn">Login</button>
            <button class="signup-btn gradient-btn">Sign Up</button>
          `;
          cta.querySelector('.login-btn').addEventListener('click', () => window.Clerk.openSignIn());
          cta.querySelector('.signup-btn').addEventListener('click', () => window.Clerk.openSignUp());
        }
      });
    };

    // Initial call
    updateAuthUI();

    // Add listener for state changes (e.g. login/logout)
    window.Clerk.addListener(() => {
      updateAuthUI();
    });

  } catch(e) {
    console.error("Clerk load error:", e);
  }
};

// Start initialization
initClerk();
