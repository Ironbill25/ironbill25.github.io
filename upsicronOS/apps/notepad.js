import App from "../classes/App.js";
import defFiles from "./DefFiles.json" with { type: "json" };

class Notepad extends App {
    constructor() {
        super("Notepad", "notepad");
        this.lines = [""];
        this.currentLine = 0;
        this.cursorPosition = 0;
        this.isInitialized = false;
        this.fileName = "untitled.txt";
        this.currentPath = ["root", "documents"];
        this.saveMode = false;
        this.filePathInput = "";
    }

    render() {
        window.display.hardClear();
        window.display.setLine(0, "=== " + this.title + " ===");
        
        if (!this.isInitialized) {
            this.lines = [""];
            this.currentLine = 0;
            this.cursorPosition = 0;
            this.isInitialized = true;
        }
        
        this.main();
    }

    main() {
        if (this.saveMode) {
            this.renderSaveDialog();
        } else {
            this.renderNotepad();
        }
    }

    renderNotepad() {
        window.display.setLine(1, `File: ${this.fileName} | Line ${this.currentLine + 1}/${this.lines.length}`);
        window.display.setLine(2, "─────────────────────────────────────");
        
        
        const maxDisplayLines = window.maxLines - 6;
        const startLine = Math.max(0, this.currentLine - Math.floor(maxDisplayLines / 2));
        const endLine = Math.min(this.lines.length, startLine + maxDisplayLines);
        
        for (let i = startLine; i < endLine; i++) {
            const prefix = i === this.currentLine ? "> " : "  ";
            const lineText = this.lines[i] || "";
            const displayText = prefix + lineText;
            window.display.setLine(3 + (i - startLine), displayText, true);
        }
        
        window.display.setLine(window.maxLines - 3, "");
        window.display.setLine(window.maxLines - 2, "Ctrl+S: Save | Ctrl+N: New | ESC: Exit");
        window.display.setLine(window.maxLines - 1, "Arrow keys: Navigate | Type: Edit text");
    }

    renderSaveDialog() {
        window.display.setLine(2, "Save File");
        window.display.setLine(3, "─────────────────────────────────────");
        window.display.setLine(4, "Enter file path (e.g., documents/notes.txt):");
        window.display.setLine(5, "> " + this.filePathInput + "_");
        window.display.setLine(7, "Enter: Save | Escape: Cancel");
        window.display.setLine(8, "Current path: " + this.currentPath.join("/") + "/");
    }

    handleInput(key) {
        if (this.saveMode) {
            this.handleSaveInput(key);
        } else {
            this.handleNotepadInput(key);
        }
    }

    handleNotepadInput(key) {
        switch (key) {
            case "Escape":
                this.isInitialized = false;
                window.state = "idle";
                window.userInput = "";
                break;
            case "ArrowUp":
                if (this.currentLine > 0) {
                    this.currentLine--;
                    this.cursorPosition = Math.min(this.cursorPosition, this.lines[this.currentLine].length);
                }
                break;
            case "ArrowDown":
                if (this.currentLine < this.lines.length - 1) {
                    this.currentLine++;
                    this.cursorPosition = Math.min(this.cursorPosition, this.lines[this.currentLine].length);
                }
                break;
            case "ArrowLeft":
                if (this.cursorPosition > 0) {
                    this.cursorPosition--;
                }
                break;
            case "ArrowRight":
                if (this.cursorPosition < this.lines[this.currentLine].length) {
                    this.cursorPosition++;
                }
                break;
            case "Enter":
                
                const currentLineText = this.lines[this.currentLine];
                const beforeCursor = currentLineText.substring(0, this.cursorPosition);
                const afterCursor = currentLineText.substring(this.cursorPosition);
                
                this.lines[this.currentLine] = beforeCursor;
                this.lines.splice(this.currentLine + 1, 0, afterCursor);
                
                this.currentLine++;
                this.cursorPosition = 0;
                break;
            case "Backspace":
                if (this.cursorPosition > 0) {
                    
                    const line = this.lines[this.currentLine];
                    this.lines[this.currentLine] = line.substring(0, this.cursorPosition - 1) + line.substring(this.cursorPosition);
                    this.cursorPosition--;
                } else if (this.currentLine > 0) {
                    
                    const prevLineLength = this.lines[this.currentLine - 1].length;
                    this.lines[this.currentLine - 1] += this.lines[this.currentLine];
                    this.lines.splice(this.currentLine, 1);
                    this.currentLine--;
                    this.cursorPosition = prevLineLength;
                }
                break;
            case "Delete":
                if (this.cursorPosition < this.lines[this.currentLine].length) {
                    
                    const line = this.lines[this.currentLine];
                    this.lines[this.currentLine] = line.substring(0, this.cursorPosition) + line.substring(this.cursorPosition + 1);
                } else if (this.currentLine < this.lines.length - 1) {
                    
                    this.lines[this.currentLine] += this.lines[this.currentLine + 1];
                    this.lines.splice(this.currentLine + 1, 1);
                }
                break;
            default:
                if (key.length === 1) {
                    
                    const line = this.lines[this.currentLine];
                    this.lines[this.currentLine] = line.substring(0, this.cursorPosition) + key + line.substring(this.cursorPosition);
                    this.cursorPosition++;
                }
        }
    }

    handleSaveInput(key) {
        switch (key) {
            case "Escape":
                this.saveMode = false;
                this.filePathInput = "";
                break;
            case "Enter":
                this.saveFile();
                break;
            case "Backspace":
                this.filePathInput = this.filePathInput.slice(0, -1);
                break;
            default:
                if (key.length === 1 && !key.includes("Control")) {
                    this.filePathInput += key;
                }
        }
    }

    saveFile() {
        const pathParts = this.filePathInput.split("/");
        const fileName = pathParts.pop() || "untitled.txt";
        const dirPath = pathParts.length > 0 ? pathParts : ["root"];
        
        
        let current = defFiles;
        for (let i = 0; i < dirPath.length; i++) {
            const part = dirPath[i];
            if (i === 0 && part === "root") {
                
                current = current.root;
            } else {
                
                if (!current.c[part]) {
                    
                    current.c[part] = { d: true, c: {} };
                }
                current = current.c[part];
            }
        }
        
        
        current.c[fileName] = {
            d: false,
            c: this.lines.join("\n")
        };
        
        this.fileName = fileName;
        this.currentPath = dirPath;
        this.saveMode = false;
        this.filePathInput = "";
        
        
        window.display.clear();
        window.display.setLine(0, "=== " + this.title + " ===");
        window.display.setLine(2, `File saved: ${dirPath.join("/")}/${fileName}`);
        window.display.setLine(4, "Press any key to continue...");
        
        
        setTimeout(() => {
            this.saveMode = false;
        }, 1000);
    }

    newFile() {
        this.lines = [""];
        this.currentLine = 0;
        this.cursorPosition = 0;
        this.fileName = "untitled.txt";
    }
}


const originalHandleInput = Notepad.prototype.handleInput;
Notepad.prototype.handleInput = function(key) {
    if (key === "s" && window.ctrlKey) {
        this.saveMode = true;
        this.filePathInput = this.currentPath.slice(1).join("/") + "/" + this.fileName;
    } else if (key === "n" && window.ctrlKey) {
        this.newFile();
    } else {
        originalHandleInput.call(this, key);
    }
};

export default new Notepad();