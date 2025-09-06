import { $, $1 } from "common.js";

window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash) {
        const element = $1(hash);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
})