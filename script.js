//refine the code 

// Add this to your existing script.js file
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Check scroll position on page load
  handleScroll();

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking links
  document.querySelectorAll('.nav-links a').forEach(n => 
    n.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    })
  );
});


// for loading of 3d model

document.addEventListener('DOMContentLoaded', function() {
  const iframe = document.querySelector('.sketchfab-embed-wrapper iframe');
  
  iframe.addEventListener('load', function() {
    iframe.classList.add('loaded');
  });
});




//animation for section 2 

// Intersection Observer for scroll animations
const observerCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add visible class to heading
      const heading = entry.target.querySelector('.role-heading');
      if (heading) heading.classList.add('visible');
      
      // Add visible class to cards
      const cards = entry.target.querySelectorAll('.role-card');
      cards.forEach(card => card.classList.add('visible'));
    } else {
      // Remove visible class when section is out of view
      const heading = entry.target.querySelector('.role-heading');
      if (heading) heading.classList.remove('visible');
      
      const cards = entry.target.querySelectorAll('.role-card');
      cards.forEach(card => card.classList.remove('visible'));
    }
  });
};

// Create observer
const observer = new IntersectionObserver(observerCallback, {
  threshold: 0.2,
  rootMargin: '0px'
});

// Observe section-2
document.addEventListener('DOMContentLoaded', function() {
  const section2 = document.querySelector('.section-2');
  if (section2) observer.observe(section2);
});



// for vacancy home tab section 3

let currentSlide = 0;
let totalSlides = 0;
const cardsPerView = 3;

function createVacancyCard(vacancy) {
  const card = document.createElement('div');
  card.className = 'vacancy-card';
  
  card.innerHTML = `
    <div class="vacancy-header">
      <h3 class="vacancy-title">${vacancy.title || 'No Title'}</h3>
      <span class="subject-tag">${vacancy.subject || 'Subject N/A'}</span>
    </div>
    <div class="requirements-section">
      <h4>Requirements</h4>
      <ul>
        ${Array.isArray(vacancy.requirements) ? 
          vacancy.requirements.map(req => `
            <li><i class="fas fa-check-circle"></i> ${req}</li>
          `).join('') : 
          '<li>No requirements specified</li>'
        }
      </ul>
    </div>
    <div class="salary-section">
      <i class="fas fa-money-bill-wave"></i> 
      <span>Salary: ${vacancy.salary || 'Not specified'}</span>
    </div>
    <button class="apply-button" onclick="handleVacancyApply(this)" data-vacancy-id="${vacancy._id}">
      Apply Now
    </button>
  `;
  
  return card;
}

function slideVacancies(direction) {
  const slider = document.querySelector('.vacancies-slider');
  const cards = document.querySelectorAll('.vacancy-card');
  totalSlides = Math.ceil(cards.length / cardsPerView);

  if (direction === 'right' && currentSlide < totalSlides - 1) {
    currentSlide++;
  } else if (direction === 'left' && currentSlide > 0) {
    currentSlide--;
  }

  // Calculate the translation considering 3 cards per view
  const translation = currentSlide * -(100 / cardsPerView) * cardsPerView;
  slider.style.transform = `translateX(${translation}%)`;

  // Update navigation buttons
  updateNavButtons();
}

function updateNavButtons() {
  const prevButton = document.querySelector('.slider-nav.prev');
  const nextButton = document.querySelector('.slider-nav.next');

  if (prevButton && nextButton) {
    prevButton.classList.toggle('hidden', currentSlide === 0);
    nextButton.classList.toggle('hidden', currentSlide === totalSlides - 1);
  }
}

async function loadVacancies() {
  try {
    const response = await fetch('http://localhost:5000/api/vacancies/featured');
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message);
    }

    const vacanciesList = document.querySelector('.vacancies-slider');
    
    if (!data.data || data.data.length === 0) {
      vacanciesList.innerHTML = '<p class="no-vacancies">No vacancies available</p>';
      return;
    }

    // Clear existing content
    vacanciesList.innerHTML = '';

    // Create and append vacancy cards
    data.data.forEach(vacancy => {
      const card = createVacancyCard(vacancy);
      vacanciesList.appendChild(card);
    });

    // Initialize slider
    totalSlides = Math.ceil(data.data.length / cardsPerView);
    updateNavButtons();

  } catch (error) {
    console.error('Error loading vacancies:', error);
    const vacanciesList = document.querySelector('.vacancies-slider');
    vacanciesList.innerHTML = 
      '<p class="error-message">Error loading vacancies. Please try again later.</p>';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadVacancies();
});

// Handle vacancy application
async function handleVacancyApply(button) {
  const vacancyId = button.dataset.vacancyId;
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = 'Apply/teacher.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/teacher-apply/apply-vacancy/${vacancyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      alert('Application submitted successfully!');
      button.disabled = true;
      button.textContent = 'Applied';
    } else {
      alert(data.message || 'Failed to submit application');
    }

  } catch (error) {
    console.error('Error applying:', error);
    alert('Error submitting application. Please try again.');
  }
}