document.addEventListener('DOMContentLoaded', function() {
  // Get all elements with tooltips
  const tooltipLinks = document.querySelectorAll('a[data-title]');
  
  // Add tooltip container to each link
  tooltipLinks.forEach(link => {
    // Create container if it doesn't exist
    if (!link.parentElement.classList.contains('tooltip-container')) {
      const container = document.createElement('span');
      container.className = 'tooltip-container';
      link.parentNode.insertBefore(container, link);
      container.appendChild(link);
    }
    
    // Initialize position attribute if not set
    if (!link.hasAttribute('data-position')) {
      link.setAttribute('data-position', 'top');
    }
    
    // Add event listeners for positioning
    link.addEventListener('mouseenter', positionTooltip);
    link.addEventListener('focus', positionTooltip);
  });
  
  function positionTooltip(e) {
    const tooltip = this;
    const tooltipRect = this.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Default position is top
    let position = 'top';
    
    // Check if tooltip would go off screen
    const spaceAbove = tooltipRect.top;
    const spaceBelow = viewportHeight - tooltipRect.bottom;
    const spaceLeft = tooltipRect.left;
    const spaceRight = viewportWidth - tooltipRect.right;
    
    // Calculate which position has the most space
    const maxSpace = Math.max(spaceAbove, spaceBelow, spaceLeft, spaceRight);
    
    // Choose position with most space
    if (maxSpace === spaceBelow) position = 'bottom';
    else if (maxSpace === spaceLeft) position = 'left';
    else if (maxSpace === spaceRight) position = 'right';
    
    // Apply the position
    tooltip.setAttribute('data-position', position);
    
    // For very small viewports, ensure tooltip is visible
    if (viewportWidth < 480) {
      const tooltipEl = this;
      // Small delay to ensure tooltip is rendered
      setTimeout(() => {
        const ttRect = tooltipEl.getBoundingClientRect();
        const ttAfter = window.getComputedStyle(tooltipEl, '::after');
        const ttWidth = ttAfter.width ? parseInt(ttAfter.width) : 200;
        
        // Adjust if tooltip goes off right edge
        if (ttRect.right + ttWidth > viewportWidth) {
          tooltipEl.style.setProperty('--tooltip-offset', `${viewportWidth - ttRect.right - 10}px`);
        }
        // Adjust if tooltip goes off left edge
        else if (ttRect.left - ttWidth < 0) {
          tooltipEl.style.setProperty('--tooltip-offset', `${-ttRect.left + 10}px`);
        }
      }, 10);
    }
  }
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      tooltipLinks.forEach(link => {
        if (document.activeElement === link) {
          positionTooltip.call(link);
        }
      });
    }, 250);
  });
});
