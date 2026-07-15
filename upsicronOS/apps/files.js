import App from "../classes/App.js";
import defFiles from "./DefFiles.json" with { type: "json" };

export default new (class Files extends App {
    constructor() {
        super("Files", "files");
        this.currentPath = ["root"];
        this.selectedItem = 0;
        this.viewingFile = false;
        this.fileContent = "";
        this.fileScroll = 0;
        this.isInitialized = false;
    }

    render() {
        window.display.clear();
        window.display.setLine(0, "=== " + this.title + " ===");
        
        if (!this.isInitialized) {
            this.selectedItem = 0;
            this.viewingFile = false;
            this.fileScroll = 0;
            this.isInitialized = true;
        }
        
        if (this.viewingFile) {
            this.viewFile(this.fileContent);
        } else {
            this.renderFiles();
        }
    }

    main() {
        // This method is called by the base render() but we override render() above
    }

    handleInput(key) {
        switch (key) {
            case "Escape":
                if (this.viewingFile) {
                    this.viewingFile = false;
                    this.fileScroll = 0;
                    window.display.hardClear();
                    this.renderFiles();
                } else {
                    this.isInitialized = false;
                    window.state = "idle";
                    window.userInput = "";
                }
                break;
            case "ArrowUp":
                if (this.viewingFile) {
                    this.fileScroll = Math.max(0, this.fileScroll - 1);
                    this.viewFile(this.fileContent);
                } else {
                    this.selectedItem = Math.max(0, this.selectedItem - 1);
                    this.renderFiles();
                }
                break;
            case "ArrowDown":
                if (this.viewingFile) {
                    this.fileScroll += 1;
                    this.viewFile(this.fileContent);
                } else {
                    const currentItems = this.getCurrentItems();
                    this.selectedItem = Math.min(currentItems.length - 1, this.selectedItem + 1);
                    this.renderFiles();
                }
                break;
            case "Enter":
                if (!this.viewingFile) {
                    this.enterItem();
                }
                break;
            case "Backspace":
                if (!this.viewingFile && this.currentPath.length > 1) {
                    this.currentPath.pop();
                    this.selectedItem = 0;
                    window.display.hardClear();
                    this.renderFiles();
                }
                break;
        }
    }

    getCurrentItems() {
        let current = defFiles;
        for (let i = 0; i < this.currentPath.length; i++) {
            const path = this.currentPath[i];
            if (i === 0) {
                // First level is direct access (e.g., defFiles.root)
                current = current[path];
            } else {
                // Subsequent levels need to go through the 'c' property
                current = current.c[path];
            }
            if (!current) {
                this.currentPath = ["root"];
                current = defFiles.root;
                break;
            }
        }
        // For directories, we need to access the 'c' property to get contents
        return Object.keys(current.c || {});
    }

    getCurrentDirectory() {
        let current = defFiles;
        for (let i = 0; i < this.currentPath.length; i++) {
            const path = this.currentPath[i];
            if (i === 0) {
                // First level is direct access (e.g., defFiles.root)
                current = current[path];
            } else {
                // Subsequent levels need to go through the 'c' property
                current = current.c[path];
            }
            if (!current) {
                this.currentPath = ["root"];
                current = defFiles.root;
                break;
            }
        }
        return current;
    }

    enterItem() {
        const currentItems = this.getCurrentItems();
        const itemName = currentItems[this.selectedItem];
        const currentDir = this.getCurrentDirectory();
        const item = currentDir.c[itemName];

        if (item.d) {
            // It's a directory
            this.currentPath.push(itemName);
            this.selectedItem = 0;
            window.display.hardClear();
            this.renderFiles();
        } else {
            // It's a file
            this.fileContent = item.c;
            this.viewFile(this.fileContent);
        }
    }

    renderFiles() {
        const currentItems = this.getCurrentItems();
        const currentDir = this.getCurrentDirectory();
        
        window.display.setLine(0, "=== " + this.title + " ===");
        window.display.setLine(1, "Files - " + this.currentPath.join("/"), true);
        window.display.setLine(2, "Use ↑↓ to navigate, Enter to open, Backspace to go back", true);
        
        let lineNum = 4;
        for (let i = 0; i < currentItems.length; i++) {
            const itemName = currentItems[i];
            const item = currentDir.c[itemName];
            const indicator = item.d ? "[DIR]" : "[FILE]";
            const prefix = i === this.selectedItem ? "> " : "  ";
            window.display.setLine(lineNum, prefix + indicator + " " + itemName, true);
            lineNum++;
        }

        window.display.setLine(lineNum + 1, "", true);
        window.display.setLine(lineNum + 2, "Press ESC to return to menu", true);
        
        // Clear remaining lines
        for (let i = lineNum + 3; i < window.maxLines; i++) {
            window.display.setLine(i, "", true);
        }
    }

    viewFile(content) {
        this.viewingFile = true;
        window.display.setLine(1, "File: " + this.currentPath.join("/") + "/" + this.getCurrentItems()[this.selectedItem], true);
        window.display.setLine(2, "Use ↑↓ to scroll, ESC to go back", true);
        window.display.setLine(3, "─────────────────────────────────────", true);
        
        const lines = content.split('\n');
        const maxLines = window.maxLines - 6; // Leave space for header, separator, footer separator, and footer
        
        let lineNum = 4;
        for (let i = this.fileScroll; i < lines.length && i < this.fileScroll + maxLines; i++) {
            const line = lines[i];
            // Add visual distinction for file content
            const displayLine = "  " + line; // Indent file content
            window.display.setLine(lineNum, displayLine, true);
            lineNum++;
        }

        // Add separator before footer
        window.display.setLine(lineNum, "─────────────────────────────────────", true);
        lineNum++;
        
        // Clear remaining lines
        for (let i = lineNum; i < window.maxLines - 1; i++) {
            window.display.setLine(i, "", true);
        }
        
        window.display.setLine(window.maxLines - 1, `Line ${this.fileScroll + 1}-${Math.min(this.fileScroll + maxLines, lines.length)} of ${lines.length}`, true);
    }
})();