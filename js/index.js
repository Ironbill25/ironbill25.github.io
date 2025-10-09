import { $, $1 } from "./common.js";

// Dark Mode Toggle - Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	const themeToggle = document.getElementById('theme-toggle');
	const sunIcon = themeToggle?.querySelector('.sun-icon');
	const moonIcon = themeToggle?.querySelector('.moon-icon');

	// Check for saved theme preference or default to light
	const currentTheme = localStorage.getItem('theme') || 'light';
	
	if (currentTheme === 'dark') {
		document.documentElement.setAttribute('data-theme', 'dark');
		if (sunIcon && moonIcon) {
			sunIcon.style.display = 'none';
			moonIcon.style.display = 'block';
		}
	} else {
		document.documentElement.setAttribute('data-theme', 'light');
		if (sunIcon && moonIcon) {
			sunIcon.style.display = 'block';
			moonIcon.style.display = 'none';
		}
	}

	// Theme toggle event listener
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const currentTheme = document.documentElement.getAttribute('data-theme');
			
			const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
			
			// Apply theme
			document.documentElement.setAttribute('data-theme', newTheme);
			localStorage.setItem('theme', newTheme);
			
			// Toggle icons
			if (sunIcon && moonIcon) {
				if (newTheme === 'dark') {
					sunIcon.style.display = 'none';
					moonIcon.style.display = 'block';
				} else {
					sunIcon.style.display = 'block';
					moonIcon.style.display = 'none';
				}
			}
		});
	}
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');

if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', 
            navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !e.target.matches('.nav-toggle')) {
            navbar.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            navToggle?.setAttribute('aria-expanded', 'false');
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const header = document.querySelector('header');
const navHeight = navbar?.offsetHeight || 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 10) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
    
    // Header parallax effect
    if (header) {
        const scrollValue = currentScroll * 0.5;
        header.style.backgroundPositionY = `calc(50% + ${scrollValue * 0.5}px)`;
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for hash navigation
window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash) {
        const element = $1(hash);
        if (element) {
            const headerOffset = navHeight + 20;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: "smooth"
            });
        }
    }
});

// Unregister any service workers to prevent caching issues
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
                console.log('ServiceWorker unregistered:', registration.scope);
            }
        } catch (error) {
            console.error('Error unregistering service workers:', error);
        }
    });
}

