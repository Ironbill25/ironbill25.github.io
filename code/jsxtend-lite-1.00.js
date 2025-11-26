/* JSxtend Lite

======LICENSE======

(c) 2025 IronBill25

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

======END LICENSE======

=== About
JSxtend Lite is a lightweight JavaScript utility library for web development.
This file is currently version 1.0.0.
JSxtend will be out soon, but this one is the main library for now.

=== Backwards Compatibility
This library is and will be backwards compatible with all previous versions.
The only changes to existing functions will be small bug fixes that do not
affect the functionality of the library.

=== How to use
To use this, you should either import it as a module or add it via a <script>.

Use this code to import it:
import $ from "https://ironbill25.github.io/code/jsxtend-lite-1.00.js";

This code will add it from a script:
<script src="https://ironbill25.github.io/code/jsxtend-lite-1.00.js"></script>

You can also download it:
https://ironbill25.github.io/jsxtend-lite

*/

/**
 * JSxtend Lite
 * The main class for JSxtend Lite; should be used only interally for the library
 * @namespace
 */
class JSxtend {
  constructor() {
    this.init();
  }

  init() {
    Object.assign(this, {
      version: "1.0.0",
    });
  }

  _addUtils(el) {
    if (
      !(
        el instanceof HTMLElement ||
        el instanceof Node ||
        el instanceof NodeList
      )
    )
      throw new Error(
        "[JSxtend Lite] Internal error: Element must be an HTMLElement, Node, or NodeList"
      );
    if (el instanceof NodeList) {
      el = [...el].map((e) => this._addUtils(e));
      return el.length === 1 ? el[0] : el;
    }
    return Object.assign(el, new this.__utils());
  }

  /**
   * Creates a draggable, resizable window
   * @param {Object} options Window options
   * @param {string} options.title Window title
   * @param {string|HTMLElement} options.content Window content (HTML string or element)
   * @param {number} [options.width=400] Initial width in pixels
   * @param {number} [options.height=300] Initial height in pixels
   * @param {number} [options.x=100] Initial x position (centered if not specified)
   * @param {number} [options.y=100] Initial y position (centered if not specified)
   * @param {boolean} [options.resizable=true] Whether the window can be resized
   * @param {boolean} [options.draggable=true] Whether the window can be dragged
   * @param {boolean} [options.closable=true] Whether the window can be closed
   * @param {boolean} [options.minimizable=false] Whether the window can be minimized
   * @param {boolean} [options.modal=false] Whether the window is modal (blocks interaction with other elements)
   * @param {number} [options.minWidth=200] Minimum width in pixels
   * @param {number} [options.minHeight=150] Minimum height in pixels
   * @param {number} [options.maxWidth=window.innerWidth] Maximum width in pixels
   * @param {number} [options.maxHeight=window.innerHeight] Maximum height in pixels
   * @param {Function} [options.onClose] Callback when window is closed
   * @param {Function} [options.onResize] Callback when window is resized
   * @param {Function} [options.onDrag] Callback when window is dragged
   * @returns {HTMLElement} The created window element
   */
  createWindow(options = {}) {
    // Destructure with defaults
    let {
      title = "Window",
      content = "",
      width = 400,
      height = 300,
      x = null,
      y = null,
      resizable = true,
      draggable = true,
      closable = true,
      minimizable = true,
      modal = false,
      minWidth = 200,
      minHeight = 150,
      maxWidth = window.innerWidth,
      maxHeight = window.innerHeight,
      onClose = null,
      onResize = null,
      onDrag = null,
    } = options;

    // Create window element
    const windowEl = document.createElement("div");
    windowEl.className = "jsx-window" + (modal ? " jsx-window-modal" : "");
    windowEl.style.width = `${Math.min(Math.max(width, minWidth), maxWidth)}px`;
    windowEl.style.height = `${Math.min(
      Math.max(height, minHeight),
      maxHeight
    )}px`;

    // Center window if position not specified
    if (x === null) {
      x =
        (window.innerWidth - Math.min(Math.max(width, minWidth), maxWidth)) / 2;
    }
    if (y === null) {
      y =
        (window.innerHeight -
          Math.min(Math.max(height, minHeight), maxHeight)) /
        3;
    }
    windowEl.style.left = `${x}px`;
    windowEl.style.top = `${y}px`;

    // Create window header
    const header = document.createElement("div");
    header.className = "jsx-window-header";

    const titleEl = document.createElement("div");
    titleEl.className = "jsx-window-title";
    titleEl.textContent = title;

    header.appendChild(titleEl);

    if (closable) {
      const closeBtn = document.createElement("div");
      closeBtn.className = "jsx-window-close";
      closeBtn.innerHTML = "&times;";
      closeBtn.onclick = () => {
        windowEl.remove();
        if (modal) {
          document.body.classList.remove("jsx-window-modal-open");
        }
        onClose?.();
      };
      header.appendChild(closeBtn);
    }

    if (minimizable) {
      const minimizeBtn = document.createElement("div");
      minimizeBtn.className = "jsx-window-minimize";
      minimizeBtn.innerHTML = "−";
      minimizeBtn.onclick = () => {
        windowEl.classList.toggle("jsx-window-minimized");
      };
      header.appendChild(minimizeBtn);
    }

    // Create content area
    const contentEl = document.createElement("div");
    contentEl.className = "jsx-window-content";

    if (typeof content === "string") {
      contentEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentEl.appendChild(content);
    }

    // Add elements to window
    windowEl.appendChild(header);
    windowEl.appendChild(contentEl);

    // Enable CSS-based resizing if resizable
    if (resizable) {
      windowEl.style.resize = "both";
      windowEl.style.overflow = "auto";

      windowEl.style.minWidth = `${minWidth}px`;
      windowEl.style.minHeight = `${minHeight}px`;
      windowEl.style.maxWidth = `${maxWidth}px`;
      windowEl.style.maxHeight = `${maxHeight}px`;

      // Add resize observer for callback
      if (typeof onResize === "function") {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            const { width, height } = entry.contentRect;
            onResize({
              width,
              height,
              x: parseInt(windowEl.style.left),
              y: parseInt(windowEl.style.top),
            });
          }
        });

        resizeObserver.observe(windowEl);

        // Store observer for cleanup
        windowEl._resizeObserver = resizeObserver;
      }

      // Make window draggable
      if (draggable) {
        let isDragging = false;
        let offsetX, offsetY;

        const startDrag = (e) => {
          // Don't start drag if clicking on input/button/select/etc.
          if (e.target.tagName.match(/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/i)) {
            return;
          }

          isDragging = true;
          offsetX = e.clientX - windowEl.getBoundingClientRect().left;
          offsetY = e.clientY - windowEl.getBoundingClientRect().top;

          // Bring to front
          const maxZ = Math.max(
            ...Array.from(document.querySelectorAll(".jsx-window")).map(
              (el) => parseInt(el.style.zIndex) || 1000
            )
          );
          windowEl.style.zIndex = maxZ + 1;

          e.preventDefault();
        };

        const onDrag = (e) => {
          if (!isDragging) return;

          let newX = e.clientX - offsetX;
          let newY = e.clientY - offsetY;

          // Keep window within viewport
          newX = Math.max(
            0,
            Math.min(newX, window.innerWidth - windowEl.offsetWidth)
          );
          newY = Math.max(
            0,
            Math.min(newY, window.innerHeight - windowEl.offsetHeight)
          );

          windowEl.style.left = `${newX}px`;
          windowEl.style.top = `${newY}px`;

          // Call drag callback if provided
          if (typeof onDragCallback === "function") {
            onDragCallback({
              x: newX,
              y: newY,
              width: windowEl.offsetWidth,
              height: windowEl.offsetHeight,
            });
          }
        };

        const stopDrag = () => {
          isDragging = false;
        };

        header.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", stopDrag);

        // Call drag end callback when mouse is released
        document.addEventListener("mouseup", () => {
          if (isDragging) {
            stopDrag();
            if (typeof onDragCallback === "function") {
              onDragCallback({
                x: parseInt(windowEl.style.left),
                y: parseInt(windowEl.style.top),
                width: windowEl.offsetWidth,
                height: windowEl.offsetHeight,
              });
            }
          }
        });
      }

      // Add to body
      document.body.appendChild(windowEl);

      // Add modal overlay if needed
      if (modal) {
        document.body.classList.add("jsx-window-modal-open");
      }

      // Bring to front on click and handle focus
      windowEl.addEventListener("mousedown", (e) => {
        // Don't bring to front if clicking on a form element
        if (e.target.tagName.match(/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/i)) {
          return;
        }

        const maxZ = Math.max(
          ...Array.from(document.querySelectorAll(".jsx-window")).map(
            (el) => parseInt(el.style.zIndex) || 1000
          )
        );
        windowEl.style.zIndex = maxZ + 1;
      });

      // Focus the window
      windowEl.focus();

      return windowEl;
    }

    __utils = class {
      /**
       * Adds a class to the element
       * @param {string} className - The class name to add
       * @returns {HTMLElement} The element for chaining
       */
      addClass(className) {
        this.classList.add(className);
        return this;
      }

      /**
       * Gets or sets the value of a form element
       * @param {string|number} [value] - Optional value to set
       * @returns {string|number|this} The value or the element for chaining
       */
      val(value) {
        if (value === undefined) {
          return this.value;
        }
        this.value = value;
        return this;
      }

      /**
       * Shows the element by setting display to its default or specified value
       * @param {string} [display=''] - Display value to use (defaults to '' which uses browser default)
       * @returns {HTMLElement} The element for chaining
       */
      show(display = "") {
        this.style.display = display || "";
        return this;
      }

      /**
       * Hides the element by setting display to 'none'
       * @returns {HTMLElement} The element for chaining
       */
      hide() {
        this.style.display = "none";
        return this;
      }

      /**
       * Toggles the element's visibility
       * @param {boolean} [state] - Optional state to set (true = show, false = hide)
       * @returns {HTMLElement} The element for chaining
       */
      toggle(state) {
        if (state !== undefined) {
          return state ? this.show() : this.hide();
        }
        this.style.display = this.style.display === "none" ? "" : "none";
        return this;
      }
      /**
       * Gets or sets the inner HTML of the element
       * @param {string} [str] - Optional HTML to set
       * @returns {string|this} The HTML content or the element for chaining
       */
      html(str) {
        if (str === undefined) {
          return this.innerHTML;
        }
        this.innerHTML = str;
        return this;
      }

      /**
       * Gets or sets the text content of the element
       * @param {string} [str] - Optional text to set
       * @returns {string|this} The text content or the element for chaining
       */
      txt(str) {
        if (str === undefined) {
          return this.textContent;
        }
        this.textContent = str;
        return this;
      }

      /**
       * Sets an attribute of the element
       * @param {string} name - The name of the attribute
       * @param {string} [value] - The value of the attribute (if not provided, acts as a getter)
       * @returns {string|this} The attribute value or the element for chaining
       */
      att(name, value) {
        if (value === undefined) {
          return this.getAttribute(name);
        }
        this.setAttribute(name, value);
        return this;
      }

      /**
       * Sets the CSS of the element
       * @param {Object} obj - The CSS properties to set
       */
      css(obj) {
        Object.entries(obj).forEach(([key, value]) => {
          this.style[key] = value;
        });
        return this;
      }

      /**
       * Adds an event listener to the element
       * @param {string} name - The name of the event
       * @param {Function} handler - The event handler
       */
      ev(name, handler) {
        this.addEventListener(name, handler);
        return this;
      }

      /**
       * Removes an event listener from the element
       * @param {string} name - The name of the event
       * @param {Function} handler - The event handler
       */
      rmEv(name, handler) {
        this.removeEventListener(name, handler);
        return this;
      }

      /**
       * Toggles a class on the element
       * @param {string} name - The name of the class
       */
      class(name) {
        this.classList.toggle(name);
        return this;
      }

      /**
       * Removes a class from the element
       * @param {string} name - The name of the class
       */
      rmClass(name) {
        this.classList.remove(name);
        return this;
      }

      /**
       * Checks if the element has a class
       * @param {string} name - The name of the class
       * @returns {boolean} - True if the element has the class
       */
      hasClass(name) {
        return this.classList.contains(name);
      }

      /**
       * Checks if the element has an attribute
       * @param {string} name - The name of the attribute
       * @returns {boolean} - True if the element has the attribute
       */
      hasAttr(name) {
        return this.hasAttribute(name);
      }

      /**
       * Gets an attribute of the element
       * @param {string} name - The name of the attribute
       * @returns {string} - The value of the attribute
       */
      attr(name) {
        return this.getAttribute(name);
      }

      /**
       * Gets the computed style of the element
       * @param {string} [property] - Optional CSS property to get
       * @returns {string|CSSStyleDeclaration} The computed style value or the whole computed style object
       */
      getStyle(property) {
        const style = window.getComputedStyle(this);
        return property ? style.getPropertyValue(property) : style;
      }

      /**
       * Gets the position of the element relative to the document
       * @returns {Object} Object with top, left, right, bottom, width, and height properties
       */
      position() {
        const rect = this.getBoundingClientRect();
        return {
          top: rect.top + window.pageYOffset,
          left: rect.left + window.pageXOffset,
          right: rect.right + window.pageXOffset,
          bottom: rect.bottom + window.pageYOffset,
          width: rect.width,
          height: rect.height,
        };
      }

      /**
       * Inserts HTML or element after the current element
       * @param {string|HTMLElement} content - HTML string or element to insert
       * @returns {HTMLElement} The inserted element
       */
      after(content) {
        if (typeof content === "string") {
          this.insertAdjacentHTML("afterend", content);
          return this.nextElementSibling;
        } else if (content instanceof HTMLElement) {
          this.parentNode.insertBefore(content, this.nextSibling);
          return content;
        }
        return this;
      }

      /**
       * Inserts HTML or element before the current element
       * @param {string|HTMLElement} content - HTML string or element to insert
       * @returns {HTMLElement} The inserted element
       */
      before(content) {
        if (typeof content === "string") {
          this.insertAdjacentHTML("beforebegin", content);
          return this.previousElementSibling;
        } else if (content instanceof HTMLElement) {
          this.parentNode.insertBefore(content, this);
          return content;
        }
        return this;
      }

      /**
       * Removes the element from the DOM
       * @returns {void}
       */
      remove() {
        this.parentNode?.removeChild(this);
      }

      /**
       * Empties the element (removes all child nodes)
       * @returns {HTMLElement} The element for chaining
       */
      empty() {
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }
        return this;
      }

      /**
       * Gets the parent element, optionally filtered by a selector
       * @param {string} [selector] - Optional CSS selector to filter parent
       * @returns {HTMLElement|null} The parent element or null if not found
       */
      parent(selector) {
        const parent = this.parentElement;
        if (!parent) return null;
        if (!selector) return parent;
        return parent.matches(selector) ? parent : null;
      }

      /**
       * Gets all ancestor elements, optionally filtered by a selector
       * @param {string} [selector] - Optional CSS selector to filter ancestors
       * @returns {HTMLElement[]} Array of ancestor elements
       */
      parents(selector) {
        const parents = [];
        let el = this.parentElement;
        while (el) {
          if (!selector || el.matches(selector)) {
            parents.push(el);
          }
          el = el.parentElement;
        }
        return parents;
      }
    };
  }
}

const JSxtend_ = new JSxtend();

/** The main function for JSxtend Lite.
 * Selects elements and adds utility functions to them, or calls a utility function on the elements.
 *
 * Note on windows: You can pass "window" to the "type" parameter to create a new window.
 * Windows are draggable elements that can be moved around the screen, resized, and closed.
 *
 * @param {string} selector The selector to select elements with
 * @param {HTMLElement|Document|string} [type=document]  The context for elements to be selected from (pass an HTMLElement or the document) OR the name of a utility function to call on the elements that are selected with the document context. You can also pass "window" to create a new window.
 * @param  {...any} args The arguments to pass to the utility function (if a utility function is called)
 * @returns
 */
function $(selector, type = document, ...args) {
  let el;

  if (selector === "window") {
    const options = type === document ? {} : type;
    el = JSxtend_.createWindow(options);
  } else {
    if (type instanceof HTMLElement || type instanceof Document) {
      el = JSxtend_._addUtils(type.querySelectorAll(selector));
    } else {
      el = JSxtend_._addUtils(document.querySelectorAll(selector));
      if (args.length > 0) {
        if (Array.isArray(el)) {
          el = el.map((e) => e[args[0]](...args.slice(1)));
        } else {
          el = el[args[0]](...args.slice(1));
        }
      }
    }
    return el;
  }
}

const windowstyle = `
    .jsx-window {
        position: fixed;
        background: #f0f0f0;
        border: 1px solid #999;
        border-radius: 4px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        overflow: hidden;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        transition: box-shadow 0.2s ease;
    }
    
    .jsx-window:hover {
        box-shadow: 0 6px 25px rgba(0,0,0,0.25);
    }
    
    .jsx-window-modal {
        z-index: 1001;
    }
    
    .jsx-window-modal-open {
        overflow: hidden;
    }
    
    .jsx-window-modal-open::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        pointer-events: none;
    }
    .jsx-window-header {
        background: #e0e0e0;
        padding: 6px 10px;
        cursor: move;
        user-select: none;
        border-bottom: 1px solid #ccc;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .jsx-window-title {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .jsx-window-close {
        cursor: pointer;
        margin-left: 10px;
        font-size: 1.2em;
        line-height: 1;
    }
    .jsx-window-content {
        padding: 10px;
        height: calc(100% - 40px);
        overflow: auto;
    }
    .jsx-window.minimized .jsx-window-content {
        display: none;
    }
    .jsx-window {
        resize: both;
        overflow: auto;
    }
    
    .jsx-window::-webkit-resizer {
        background: #999;
        width: 15px;
        height: 15px;
    }
`;
const styles = document.createElement("style");
styles.textContent = windowstyle;
styles.setAttribute(
  "comment",
  "Note: This element is added by JSxtend Lite. Removing this will break the window styles."
);
document.head.appendChild(styles);

export default $;
