// Swikkit DOM Module
// DOM manipulation utilities
//
// Version 1.0.0
// (c) 2025 IronBill25

/**
 * Find elements by selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [context=document] - Context to search within
 * @returns {NodeList} - Matching elements
 */
function $(selector, context = document) {
    const elements = context.querySelectorAll(selector);
    
    // Add chainable methods to NodeList
    if (elements.length > 0) {
        elements.on = function(event, selector, handler) {
            return on(this, event, selector, handler);
        };
        
        elements.toggleClass = function(className, force) {
            toggleClass(this, className, force);
            return this;
        };
        
        elements.addClass = function(className) {
            this.forEach(el => el.classList.add(className));
            return this;
        };
        
        elements.removeClass = function(className) {
            this.forEach(el => el.classList.remove(className));
            return this;
        };
        
        elements.html = function(content) {
            if (content === undefined) {
                return this[0] ? this[0].innerHTML : null;
            }
            this.forEach(el => { el.innerHTML = content; });
            return this;
        };
        
        elements.text = function(content) {
            if (content === undefined) {
                return this[0] ? this[0].textContent : '';
            }
            this.forEach(el => { el.textContent = content; });
            return this;
        };
    }
    
    return elements;
}

/**
 * Find first element matching selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [context=document] - Context to search within
 * @returns {HTMLElement|null} - First matching element or null
 */
function $1(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Create a new DOM element
 * @param {string} tag - The tag name of the element
 * @param {Object} [options] - Options for the element
 * @param {string} [options.className] - Class name(s) for the element
 * @param {Object} [options.attrs] - Attributes to set on the element
 * @param {string} [options.text] - Text content for the element
 * @param {string} [options.html] - HTML content for the element
 * @returns {HTMLElement} - The created element
 */
function createElement(tag, { className, attrs = {}, text, html } = {}) {
    const el = document.createElement(tag);
    
    if (className) {
        el.className = className;
    }
    
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    
    if (text) {
        el.textContent = text;
    } else if (html) {
        el.innerHTML = html;
    }
    
    return el;
}

/**
 * Add event listener with delegation support
 * @param {HTMLElement|NodeList|string} target - Target element or selector
 * @param {string} event - Event type
 * @param {string|Function} handlerOrSelector - Selector for delegation or event handler
 * @param {Function} [handler] - Event handler (required if using delegation)
 * @returns {NodeList|HTMLElement} - The target element(s) for chaining
 */
function on(target, event, handlerOrSelector, handler) {
    const useDelegation = typeof handlerOrSelector === 'string';
    const actualHandler = useDelegation ? handler : handlerOrSelector;
    
    if (!actualHandler) {
        console.warn('No handler provided for event:', event);
        return target;
    }
    
    const elements = typeof target === 'string' ? $(target) : (Array.isArray(target) || target instanceof NodeList ? target : [target]);
    
    elements.forEach(element => {
        if (useDelegation) {
            element.addEventListener(event, (e) => {
                const delegateTarget = e.target.closest(handlerOrSelector);
                if (delegateTarget && element.contains(delegateTarget)) {
                    actualHandler.call(delegateTarget, e, delegateTarget);
                }
            });
        } else {
            element.addEventListener(event, actualHandler);
        }
    });
    
    return target;
}

/**
 * Toggle class on element(s)
 * @param {HTMLElement|NodeList|string} elements - Element(s) to toggle class on
 * @param {string} className - Class name to toggle
 * @param {boolean} [force] - Force add or remove the class
 * @returns {NodeList|HTMLElement} - The element(s) for chaining
 */
function toggleClass(elements, className, force) {
    const els = typeof elements === 'string' ? $(elements) : elements;
    const elList = Array.isArray(els) || els instanceof NodeList ? Array.from(els) : [els];
    
    elList.forEach(el => {
        if (el && el.classList) {
            if (typeof force === 'boolean') {
                el.classList.toggle(className, force);
            } else {
                el.classList.toggle(className);
            }
        }
    });
    
    return elements;
}

// Export all DOM functions
export {
    $,
    $1,
    createElement,
    on,
    toggleClass
};
