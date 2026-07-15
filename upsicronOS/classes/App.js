class App {
    constructor(title, state) {
        this.title = title;
        this.state = state;
    }

    render() {
        window.display.clear();
        window.display.setLine(0, "=== " + this.title + " ===");
        this.main();
    }

    main() {
        console.log("Main method not implemented");   
    }

    handleInput(key) {
        console.log("Input not handled");
    }
}

export default App;