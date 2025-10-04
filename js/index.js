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

// Smooth scrolling for hash navigation
window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash) {
        const element = $1(hash);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
});