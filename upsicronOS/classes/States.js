class States {
    constructor() {
        this.states = {
            boot: () => {
                window.display.setLine(0, "Please wait.");
                window.display.setLine(1, "(" + window.countdown + ")");
                window.display.setLine(3, "We need a second to make sure everything works.");
                
                if (window.countdown > 0) {
                    window.countdown--;
                }
                
                if (window.countdown <= 0) {
                    window.state = "idle";
                    window.countdown = 0;
                }
            },

            idle: () => {
                window.display.setLine(0, "Welcome to UpsicronOS!");
                window.display.setLine(1, "Please select from the following apps:");
                
                // Get all registered apps (excluding boot and idle)
                const appStates = Object.keys(this.states).filter(state => 
                    state.startsWith("app.")
                );
                
                appStates.forEach((appState, index) => {
                    const appName = appState.split(".")[1];
                    const appTitle = appName.charAt(0).toUpperCase() + appName.slice(1);
                    window.display.setLine(2 + index, (window.selectedApp === index ? '> ' : '  ') + (index + 1) + ". " + appTitle);
                });
                
                window.display.setLine(appStates.length + 3, "Use UP/DOWN arrows to select, ENTER to choose");
            }
        };
    }

    register(state, func) {
        this.states[state] = func;
    }

    detach(state) {
        delete this.states[state];
    }

    regApp(app) {
        this.states["app." + app.state] = app.render.bind(app);
    }
}

export default States;
