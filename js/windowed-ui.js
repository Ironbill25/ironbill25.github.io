import { $ } from "./common.js";
window.createWindow = () => {
    let win = $("window", {
        title: "Window",
        content: "Hello, world!",
    });
}
