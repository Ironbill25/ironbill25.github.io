import flagConfig from './Flags.json' with { type: 'json' };

class Lines {
    constructor() {
        this.lines = [];
        this.dirty = false;
        this.updateMaxLines();
    }

    updateMaxLines() {
        const newMaxLines = Math.floor(document.body.clientHeight / window.LINEHEIGHT) - 2;
        if (newMaxLines !== window.maxLines || window.maxLines === undefined) {
            window.maxLines = newMaxLines;
            this.lines = Array.from({ length: window.maxLines }, () => "");
            this.dirty = true;
        }
    }

    setLine(line, text, noClear = false) {
        if (line >= 0 && line < window.maxLines) {
            this.lines[line] = noClear ? text + `$@noclear$` : text;
            this.dirty = true;
        }
    }

    parseFlags(line) {
        const lineFlags = line.match(/\$\@.*?\$/g) || [];
        const styleFlags = [];
        const otherFlags = [];

        lineFlags.forEach(flag => {
            const flagName = flag.match(/\$\@(.*?)\=/)?.[1] || flag.match(/\$\@(.*?)\$/)?.[1];
            const flagDef = flagConfig[`$@${flagName}`];
            
            if (flagDef) {
                if (flagDef.type === "style") {
                    let cssValue = flagDef.css.value;
                    
                    if (flagDef.parse === "kv") {
                        const value = flag.match(/\=(.*?)\$/)?.[1] || "";
                        cssValue = cssValue.replace("#value", value);
                    }
                    
                    styleFlags.push(`${flagDef.css.property}:${cssValue}`);
                } else {
                    otherFlags.push(flag.replace("$@", "").replace("$", ""));
                }
            }
        });

        return { styleFlags, otherFlags };
    }

    updateLines() {
        if (!this.dirty) return;

        const newRender = this.lines.map((line, index) => {
            const { styleFlags, otherFlags } = this.parseFlags(line);
            let attributes = `data-original="${line.replace(/"/g, '&quot;')}"`;

            if (styleFlags.length > 0) {
                attributes += " style='" + styleFlags.join(";") + "'";
            }
            if (otherFlags.length > 0) {
                attributes += " " + otherFlags.join(" ");
            }

            return `<p ${attributes}>${line.replace(/\$\@.*?\$/g, '')}</p>`;
        }).join("\n");
        if (newRender !== window.lastRender) {
            window.app.innerHTML = newRender;
            window.lastRender = newRender;
        }
        this.dirty = false;
    }

    clear() {
        this.lines = this.lines.map(line => {
            if (line.includes('$@noclear$')) {
                return line;
            }
            return "";
        });
        this.dirty = true;
    }

    hardClear() { // only for things such as switching states
        this.lines = Array.from({ length: window.maxLines }, () => "");
        this.dirty = true;
    }
}

export default Lines;