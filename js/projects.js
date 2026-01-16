/**
 * Eastern Energy - Projects Gallery
 * Loads project data from JSON and renders gallery
 */

document.addEventListener('DOMContentLoaded', function() {
  const gallery = document.getElementById('projects-gallery');
  const emptyState = document.getElementById('projects-empty');

  if (!gallery) return;

  // Fetch and render projects
  fetch('data/projects.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      return response.json();
    })
    .then(data => {
      renderProjects(data.projects);
    })
    .catch(error => {
      console.error('Error loading projects:', error);
      showEmptyState();
    });

  function renderProjects(projects) {
    // Clear loading state
    gallery.innerHTML = '';

    // Check if we have projects
    if (!projects || projects.length === 0) {
      showEmptyState();
      return;
    }

    // Sort by date (newest first)
    projects.sort((a, b) => b.date.localeCompare(a.date));

    // Render each project card
    projects.forEach((project, index) => {
      const card = createProjectCard(project, index);
      gallery.appendChild(card);
    });

    // Trigger reveal animations
    initRevealAnimations();
  }

  function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.id = project.id;
    card.style.transitionDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" loading="lazy"
             onerror="this.src='assets/images/logo.png'; this.classList.add('fallback-image');">
        <span class="project-category">${project.category}</span>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
    `;

    return card;
  }

  function showEmptyState() {
    gallery.style.display = 'none';
    if (emptyState) {
      emptyState.style.display = 'block';
    }
  }

  function initRevealAnimations() {
    const revealElements = gallery.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }
});
