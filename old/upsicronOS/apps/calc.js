import App from "../classes/App.js";

class Calculator extends App {
    constructor() {
        super("Calculator", "calc");
    }

    handleInput(key) {
        switch (key) {
            case "Escape":
                window.state = "idle";
                window.userInput = "";
                break;
            case "Enter":
                this.evaluateExpression();
                break;
            case "Backspace":
                window.userInput = window.userInput.slice(0, -1);
                break;
            default:
                if (key.length === 1 && /[0-9+\-*/().]/.test(key)) {
                    window.userInput += key;
                }
        }
    }

    evaluateExpression() {
        try {
            const result = Function('"use strict"; return (' + window.userInput + ')')();
            window.display.setLine(2, "Result: " + result + " $@color=green$", true);
            window.userInput = "";
        } catch (e) {
            window.display.setLine(2, "Error: Invalid expression $@color=red$ $@bold$", true);
        }
    }

    main() {
        window.display.setLine(1, "Input: " + window.userInput);
        window.display.setLine(3, "Type an expression (e.g., 2+2) and press ENTER");
        window.display.setLine(4, "Press ESC to return to main menu");
    }
}

export default new Calculator();