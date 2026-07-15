import Lines from "./classes/Lines.js";
import States from "./classes/States.js";
import calculator from "./apps/calc.js";
import notepad from "./apps/notepad.js";
import colortext from "./apps/colortext.js";
import files from "./apps/Files.js";

const LINEHEIGHT = 24;
const UPDATERATE = 1000 / 60;

const app = document.getElementById("app");

let state = "boot";
let countdown = 20;
let selectedApp = 0;
let userInput = "";
let maxLines;
let lastRender = "";

// Initialize maxLines before creating display
maxLines = Math.floor(document.body.clientHeight / LINEHEIGHT) - 2;
window.maxLines = maxLines;

let states = new States();
let display = new Lines();

// Expose global variables to window for module access
window.state = state;
window.countdown = countdown;
window.selectedApp = selectedApp;
window.userInput = userInput;
window.maxLines = maxLines;
window.lastRender = lastRender;
window.display = display;
window.app = app;
window.LINEHEIGHT = LINEHEIGHT;
window.states = states;

// Update window variables when local variables change
function updateWindowVars() {
    window.state = state;
    window.countdown = countdown;
    window.selectedApp = selectedApp;
    window.userInput = userInput;
    window.maxLines = maxLines;
    window.lastRender = lastRender;
    
    // Save state to localStorage
    saveState();
}

// Save OS state to localStorage
function saveState() {
    const stateData = {
        state: state,
        selectedApp: selectedApp,
        userInput: userInput
    };
    localStorage.setItem('upsicronOS_state', JSON.stringify(stateData));
}

// Load OS state from localStorage
function loadState() {
    const savedState = localStorage.getItem('upsicronOS_state');
    if (savedState) {
        try {
            const stateData = JSON.parse(savedState);
            state = stateData.state || "idle";
            selectedApp = stateData.selectedApp || 0;
            userInput = stateData.userInput || "";
        } catch (e) {
            console.error('Failed to load saved state:', e);
        }
    }
}

// Update local variables from window after state changes
function syncFromWindow() {
    if (window.state !== undefined) state = window.state;
    if (window.countdown !== undefined) countdown = window.countdown;
    if (window.selectedApp !== undefined) selectedApp = window.selectedApp;
    if (window.userInput !== undefined) userInput = window.userInput;
    if (window.maxLines !== undefined) maxLines = window.maxLines;
    if (window.lastRender !== undefined) lastRender = window.lastRender;
}

// Register apps with the states system
states.regApp(calculator);
states.regApp(notepad);
states.regApp(colortext);
states.regApp(files);

// Load saved state from localStorage
loadState();

// Store app references for input handling
const apps = {
    calc: calculator,
    notepad: notepad,
    colortext: colortext,
    files: files
};

function handleIdleInput(key) {
    // Get all registered apps
    const appStates = Object.keys(states.states).filter(appState => 
        appState.startsWith("app.")
    );
    const maxAppIndex = appStates.length - 1;
    
    switch (key) {
        case "ArrowUp":
            selectedApp = Math.max(0, selectedApp - 1);
            break;
        case "ArrowDown":
            selectedApp = Math.min(maxAppIndex, selectedApp + 1);
            break;
        case "Enter":
            userInput = "";
            const selectedAppState = appStates[selectedApp];
            if (selectedAppState) {
                display.hardClear();
                state = selectedAppState;
            }
            break;
    }
    updateWindowVars();
}

function handleInput(key) {
    switch (state.split(".")[0]) {
        case "idle":
            handleIdleInput(key);
            break;
        case "app":
            const appName = state.split(".")[1];
            if (apps[appName]) {
                apps[appName].handleInput(key);
                if (window.state !== state) {
                    display.hardClear();
                }
            }
            break;
    }
}

function tick() {
    display.updateMaxLines();
    syncFromWindow();
    updateWindowVars();
    states.states[state]?.();
    display.updateLines();
}

document.addEventListener('keydown', (e) => {
    if (["c", "v", "x", "z", "r", "i"].includes(e.key.toLowerCase()) && (e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    window.ctrlKey = e.ctrlKey || e.metaKey;
    handleInput(e.key);
    window.ctrlKey = false;
});

window.addEventListener('resize', () => {
    display.updateMaxLines();
});



let tickInterval = setInterval(tick, UPDATERATE);