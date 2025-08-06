// Swikkit
// The web dev toolkit that's swift, light, and easy to use.
//
// Version 1.0.0, started Aug 4, 2025
//
// (c) 2025 IronBill25

// Import core modules
import { $ as domQuery } from './modules/dom.js';
import * as utils from './modules/utility.js';
import { registerElement } from './modules/custom-tags.js';

// Main Swikkit function
function $(selector, context = document) {
    return domQuery(selector, context);
}

// Attach utilities
$.utils = utils;

// Attach custom elements API
$.registerElement = registerElement;

// Version
$.version = '1.0.0';

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`Swikkit v${$.version} initialized`);
    });
} else {
    console.log(`Swikkit v${$.version} initialized`);
}

// Export the main function
export default $;
