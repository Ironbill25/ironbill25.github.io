// Swikkit Core
// The main class for the Swikkit framework
//
// Version 1.0.0, started Aug 4, 2025
//
// (c) 2025 IronBill25

class Swikkit {
    constructor() {
        this.version = "1.0.0";
        this.init();
    }

    /**
     * Initialize the framework
     * @private
     */
    init() {
        // Initialize components when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.domReady());
        } else {
            this.domReady();
        }
    }

    /**
     * Called when the DOM is fully loaded
     * @private
     */
    domReady() {
        // Initialize components here
        console.log(`Swikkit v${this.version} initialized`);
    }
}

// Export the Swikkit class
export { Swikkit };