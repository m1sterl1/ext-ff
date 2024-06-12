(() => {
    // original symbols saved, Map{position: symbol}
    let SAVED = new Map();

    console.log('[C] Start')
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    // Reducing answer array [["word", cost],...]
    // to contain only minimal cost words
    function filter_min_cost(m){
        m.sort((x, y) => {
            let a = x[1]; let b = y[1];
            return ((a < b)? -1: ((a > b)? 1: 0));
        });
        let min = m[0][1]
        return m.filter((el) => el[1] === min)
    }

    // Highlight words
    function highlight_desktop(words){
        let text = Array.from(
            document
            .querySelectorAll(".cursor-pointer span"))
            .map(el=>el.textContent)
            .join('');
        words.forEach(([word, cost]) => highlight_word_deskop(text, word, cost));
    }


    function highlight_word_deskop(text, word, cost){
        console.log(`[C] highligt word ${word} ${cost}`)
        let i1 = text.search(word);
        let i2 = i1 + word.length;
        Array.from(
            document.querySelectorAll(".cursor-pointer span")
        )
        .slice(i1, i2)
        .forEach(span=>{
            span.style.backgroundColor="green";
        });
        highlight_cost_desktop(cost, i2);

    }

    // i2: last index of the word
    function highlight_cost_desktop(cost, i2){
        let symbols = Array.from(
            document.querySelectorAll(".cursor-pointer span")
        )
        symbols = i2+3 > symbols.length?symbols.slice(i2-3,i2):symbols.slice(i2,i2+3);

        symbols.forEach((span, i)=>{
            span.style.backgroundColor="green";
            SAVED.set(i2+i, symbols[0].textContent);
        });

        symbols[0].textContent = "(";
        symbols[1].textContent = cost;
        symbols[2].textContent = ")"
        

    }

    function clear_highlight_desktop(){
        console.log("[C] clear highlight")
        let symbols = Array.from(
            document.querySelectorAll(".cursor-pointer span")
        );

        symbols.forEach(span=>{span.style = ""});

        SAVED.forEach((sym, i)=>{
            symbols[i].textContent = sym; 
        });
        SAVED.clear();
    }

    function is_desktop(){
        return true;
    }

    browser.runtime.onMessage.addListener((m) => {
        console.log(`[C] Get ${m}`);
        // Get min cost life elements
        if (m.length !== 0){
            if (is_desktop()){
                clear_highlight_desktop()
                let min = filter_min_cost(m);
                console.log(`[C] ${min}`)
                highlight_desktop(min);
            }
 

        } else {
            console.error("[C] empty array solver");
        }
    });
})();