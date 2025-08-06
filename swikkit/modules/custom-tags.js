// Swikkit Custom Elements
// Custom HTML elements for the Swikkit framework
//
// Version 1.0.0
// (c) 2025 IronBill25

// Import utility functions
import { generateId, isFunction } from './utility.js';

// Store registered custom elements
const registeredElements = new Map();

/**
 * Base class for custom elements
 */
class SwikkitElement extends HTMLElement {
    constructor() {
        super();
        this._id = generateId('swk-el');
        this._initialized = false;
        this._eventListeners = [];
    }

    /**
     * Called when the element is added to the DOM
     */
    connectedCallback() {
        if (this._initialized) return;
        
        this._initialized = true;
        this.init();
        this.render();
        this.setupEventListeners();
        
        // Fire connected event
        this.dispatchEvent(new CustomEvent('swk:connected', { 
            bubbles: true,
            detail: { element: this }
        }));
    }

    /**
     * Called when the element is removed from the DOM
     */
    disconnectedCallback() {
        this._removeAllEventListeners();
        
        // Fire disconnected event
        this.dispatchEvent(new CustomEvent('swk:disconnected', { 
            bubbles: true,
            detail: { element: this }
        }));
    }

    /**
     * Called when an attribute is changed
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this._initialized) {
            if (isFunction(this.onAttributeChanged)) {
                this.onAttributeChanged(name, oldValue, newValue);
            }
        }
    }

    /**
     * Initialize the element
     * @abstract
     */
    init() {
        // To be implemented by subclasses
    }

    /**
     * Render the element
     * @abstract
     */
    render() {
        // To be implemented by subclasses
    }

    /**
     * Set up event listeners
     * @abstract
     */
    setupEventListeners() {
        // To be implemented by subclasses
    }

    /**
     * Add an event listener and track it for cleanup
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} [options] - Event listener options
     */
    $on(event, handler, options) {
        this.addEventListener(event, handler, options);
        this._eventListeners.push({ event, handler, options });
    }

    /**
     * Remove all tracked event listeners
     * @private
     */
    _removeAllEventListeners() {
        this._eventListeners.forEach(({ event, handler, options }) => {
            this.removeEventListener(event, handler, options);
        });
        this._eventListeners = [];
    }

    /**
     * Get an attribute with a default value
     * @param {string} name - Attribute name
     * @param {*} defaultValue - Default value if attribute is not set
     * @returns {string|*} - Attribute value or default value
     */
    getAttr(name, defaultValue = '') {
        const value = this.getAttribute(name);
        return value !== null ? value : defaultValue;
    }

    /**
     * Get a boolean attribute
     * @param {string} name - Attribute name
     * @returns {boolean} - True if the attribute exists
     */
    hasAttr(name) {
        return this.hasAttribute(name);
    }

    /**
     * Toggle a boolean attribute
     * @param {string} name - Attribute name
     * @param {boolean} [force] - Force add or remove the attribute
     */
    toggleAttr(name, force) {
        if (typeof force === 'boolean') {
            if (force) {
                this.setAttribute(name, '');
            } else {
                this.removeAttribute(name);
            }
        } else {
            this.toggleAttribute(name);
        }
    }
}

/**
 * Register a custom element
 * @param {string} name - The custom element name (must contain a hyphen)
 * @param {class} elementClass - The class that extends HTMLElement
 * @returns {boolean} - True if registration was successful
 */
function registerElement(name, elementClass) {
    if (registeredElements.has(name)) {
        console.warn(`Custom element ${name} is already registered`);
        return false;
    }

    if (!name.includes('-')) {
        throw new Error('Custom element names must contain a hyphen');
    }

    try {
        customElements.define(name, elementClass);
        registeredElements.set(name, elementClass);
        return true;
    } catch (error) {
        console.error(`Failed to register custom element ${name}:`, error);
        return false;
    }
}

// Example custom element: Toggle Button
class ToggleButton extends SwikkitElement {
    static get observedAttributes() {
        return ['pressed', 'disabled'];
    }

    init() {
        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');
        if (!this.hasAttribute('aria-pressed')) {
            this.setAttribute('aria-pressed', 'false');
        }
    }

    render() {
        if (!this.hasAttribute('aria-label')) {
            console.warn('ToggleButton should have an aria-label for accessibility');
        }
    }

    setupEventListeners() {
        this.$on('click', () => !this.disabled && this.toggle());
        this.$on('keydown', (e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !this.disabled) {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    onAttributeChanged(name, oldValue, newValue) {
        if (name === 'disabled') {
            this.setAttribute('aria-disabled', String(!!newValue));
            this.toggleAttribute('disabled', newValue !== null);
        }
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(value) {
        this.toggleAttribute('disabled', value);
    }

    get pressed() {
        return this.getAttribute('aria-pressed') === 'true';
    }

    set pressed(value) {
        this.setAttribute('aria-pressed', String(!!value));
    }

    toggle() {
        this.pressed = !this.pressed;
        this.dispatchEvent(new CustomEvent('toggle', { 
            detail: { pressed: this.pressed },
            bubbles: true,
            composed: true
        }));
    }
}

// Register the example element
registerElement('swk-toggle', ToggleButton);

// Export the registerElement function for external use
export { registerElement, SwikkitElement };
