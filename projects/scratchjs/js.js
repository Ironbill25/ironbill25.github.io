let bookmarklet = `
        javascript:(async()=>{try{const t=await fetch("https://cdn.jsdelivr.net/gh/Ironbill25/JavaScript-For-Scratch@refs/heads/main/scratchjs.js");if(!t.ok)throw new Error("Fetch failed: "+t.status);const c=await t.text(),e=document.createElement("script");e.textContent=c,document.body.appendChild(e),console.log("%c[ScratchJS]%c Script loaded and executed!","color: lime;","color: none;")}catch(t){console.error("[ScratchJS] Failed to load script:",t)}})();`;

document.querySelector("#link").href = bookmarklet;
document.querySelector("#code").textContent = bookmarklet;

document.querySelector("#copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(bookmarklet);
    
});