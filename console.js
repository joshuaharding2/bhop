(function(){
        // --- log box ---
        const logBox = document.createElement("textarea");
        logBox.id = "modConsole";
        logBox.style.cssText = `
            position:fixed;
            bottom:0;
            left:0;
            width:100%;
            height:200px;
            z-index:9999999999;
            background:#000;
            color:#0f0;
            font:12px monospace;
            overflow:auto;
            display:none;
        `;
        document.body.appendChild(logBox);

        // --- input box ---
        const input = document.createElement("input");
        input.style.cssText = `
            position:fixed;
            bottom:210px;
            left:0;
            width:100%;
            z-index:10000000000;
            background:#222;
            color:#0f0;
            font:12px monospace;
            display:none;
        `;
        input.placeholder = "Type JS and press Enter";
        input.spellcheck = false;
        input.autocomplete = "off";
        input.autocapitalize = "off";
        input.autocorrect = "off";
        document.body.appendChild(input);

        // --- redirect logs ---
        const oldLog = console.log;
        console.log = (...args) => {
            oldLog(...args);
            if (logBox.style.display !== "none") {
                logBox.value += args.join(" ") + "\n";
                logBox.scrollTop = logBox.scrollHeight;
            }
        };

        const oldErr = console.error;
        console.error = (...args) => {
            oldErr(...args);
            if (logBox.style.display !== "none") {
                logBox.value += "[ERR] " + args.join(" ") + "\n";
                logBox.scrollTop = logBox.scrollHeight;
            }
        };

        window.onerror = (message, source, lineno, colno, error) => {
            const msg = `[JS ERROR] ${message} at ${source}:${lineno}:${colno}`;
            logBox.value += msg + "\n" + (error?.stack || "") + "\n";
            logBox.scrollTop = logBox.scrollHeight;
            return false;
        };

        window.onunhandledrejection = (event) => {
            logBox.value += `[UNHANDLED REJECTION] ${event.reason}\n`;
            logBox.scrollTop = logBox.scrollHeight;
        };

        // --- console execution ---
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                try {
                    const result = eval(input.value);
                    console.log("> " + input.value);
                    console.log(result);
                } catch(err) {
                    console.error(err);
                }
                input.value = "";
            }
        });

        // --- secret activation ---
        const secretCode = "hop";
        let listening = false;
        let typed = "";

        document.addEventListener("keydown", e => {
            if (e.key === "b") {
                // Start listening for secret code
                listening = true;
                typed = "";
                return;
            }

            if (listening) {
				if (e.key.length === 1) typed += e.key.toLowerCase();
                if (!secretCode.startsWith(typed)) {
					listening = false; // wrong sequence, stop listening
                } else if (typed === secretCode) {
					e.preventDefault();
					// correct secret
                    listening = false;
                    typed = "";
                    toggleConsole();
					input.value = "";
                }
            }
        });

        function toggleConsole() {
            const isVisible = logBox.style.display !== "none";
            logBox.style.display = isVisible ? "none" : "block";
            input.style.display = isVisible ? "none" : "block"; 
            if (!isVisible) input.focus();
        }
})();
