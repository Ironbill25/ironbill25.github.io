// Swikkit Utility Module
// Collection of helpful utility functions
//
// Version 1.0.0
// (c) 2025 IronBill25

/**
 * Check if a value is defined and not null
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is defined and not null
 */
function isDefined(value) {
    return value !== undefined && value !== null;
}

/**
 * Check if a value is an object
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is an object
 */
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Deep merge objects
 * @param {Object} target - The target object
 * @param {...Object} sources - The source objects
 * @returns {Object} - The merged object
 */
function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - A unique ID
 */
function generateId(prefix = 'swk') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @param {boolean} [immediate=false] - Whether to execute immediately
 * @returns {Function} - The debounced function
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Throttle a function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if value is a function
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a function
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * Check if value is a string
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a string
 */
function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

/**
 * Check if value is a number
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is a number
 */
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if value is empty
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
    if (isObject(value)) return Object.keys(value).length === 0;
    return false;
}

// Export all utility functions
export {
    isDefined,
    isObject,
    isFunction,
    isString,
    isNumber,
    isEmpty,
    deepMerge,
    generateId,
    debounce,
    throttle
};
