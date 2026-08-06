import App from "../classes/App.js";

class ColorText extends App {
    constructor() {
        super("Color Text", "colortext");
        this.currentColor = "white";
        this.isBold = false;
        this.isItalic = false;
        this.isUnderline = false;
        this.backgroundColor = "transparent";
    }

    handleInput(key) {
        switch (key) {
            case "Escape":
                window.state = "idle";
                window.userInput = "";
                break;
            case "Enter":
                this.displayStyledText();
                break;
            case "Backspace":
                window.userInput = window.userInput.slice(0, -1);
                break;
            case "1":
                this.currentColor = "red";
                this.showNotification("Color: Red $@color=red$");
                break;
            case "2":
                this.currentColor = "green";
                this.showNotification("Color: Green $@color=green$");
                break;
            case "3":
                this.currentColor = "blue";
                this.showNotification("Color: Blue $@color=blue$");
                break;
            case "4":
                this.currentColor = "yellow";
                this.showNotification("Color: Yellow $@color=yellow$");
                break;
            case "5":
                this.backgroundColor = "black";
                this.showNotification("Background: Black $@background=black$");
                break;
            case "6":
                this.backgroundColor = "transparent";
                this.showNotification("Background: Transparent");
                break;
            case "b":
            case "B":
                this.isBold = !this.isBold;
                this.showNotification("Bold: " + (this.isBold ? "ON $@bold$" : "OFF"));
                break;
            case "i":
            case "I":
                this.isItalic = !this.isItalic;
                this.showNotification("Italic: " + (this.isItalic ? "ON $@italic$" : "OFF"));
                break;
            case "u":
            case "U":
                this.isUnderline = !this.isUnderline;
                this.showNotification("Underline: " + (this.isUnderline ? "ON $@underline$" : "OFF"));
                break;
            default:
                if (key.length === 1) {
                    window.userInput += key;
                }
        }
    }

    displayStyledText() {
        let flags = [];
        
        if (this.currentColor !== "white" && this.currentColor !== "") flags.push(`$@color=${this.currentColor}$`);
        if (this.backgroundColor !== "transparent" && this.backgroundColor !== "") flags.push(`$@background=${this.backgroundColor}$`);
        if (this.isBold) flags.push("$@bold$");
        if (this.isItalic) flags.push("$@italic$");
        if (this.isUnderline) flags.push("$@underline$");
        
        const styledText = window.userInput + " " + flags.join(" ");
        window.display.setLine(6, styledText, true);
        window.userInput = "";
    }

    showNotification(message) {
        window.display.setLine(7, message, true);
    }

    main() {
        window.display.setLine(1, "Type text and press ENTER to style it:");
        window.display.setLine(2, "Input: " + window.userInput);
        window.display.setLine(3, "");
        window.display.setLine(4, "Style Options:");
        window.display.setLine(5, "1-4: Colors | 5-6: Background | B: Bold | I: Italic | U: Underline");
        window.display.setLine(8, "");
        window.display.setLine(9, "Press ESC to return to menu");
    }
}

export default new ColorText();
