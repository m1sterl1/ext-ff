(() => {
    // original symbols saved, Map{position: symbol}
    let SAVED_D = new Map();
    let SAVED_M = new Map();

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

    // DESKTOP

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
            SAVED_D.set(i2+i, symbols[0].textContent);
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

        symbols.forEach(span=>{span.style.backgroundColor="";});

        SAVED_D.forEach((sym, i)=>{
            symbols[i].textContent = sym; 
        });
        SAVED_D.clear();
    }

    // MOBILE
    function highlight_mobile(words){
        words.forEach(([word, cost]) => highlight_word_mobile(word, cost));
    }

    function highlight_word_mobile(word, cost){
        // div element
        let div = Array.from(document.querySelectorAll('.text-base.lowercase'))
        .find(el=>el.textContent == word);
        if (div == undefined) return;    

        let cost_div = document.createElement('div');
        cost_div.textContent = `(${cost})`;
        div.after(cost_div);

        div.style.backgroundColor="green";
    }

    function clear_highlight_mobile(){
        console.log("[C] clear highlight")
        document.querySelectorAll('.text-base.lowercase')
        .forEach(el=>{
            if (el.nextSibling) {
                el.nextSibling.remove();
            }
            el.style.backgroundColor = "";
        });
    }

    function is_desktop(){
        return Array.from(
            document.querySelectorAll(".cursor-pointer span")
        ).length > 300;
    }

    browser.runtime.onMessage.addListener(answer => {
        console.log(`[C] Get ${answer}`);
        if (answer.length === 0) {
            console.error("[C] empty array solver");
            return
        };

        // Get min cost life elements
        let answer_min = filter_min_cost(answer);
        console.log(`[C] ${answer_min}`)
        if (is_desktop()){
            console.log("[C] Desktop");
            clear_highlight_desktop()
            highlight_desktop(answer_min);
        } else{
            console.log("[C] Mobile");
            clear_highlight_mobile();
            highlight_mobile(answer_min);
        }
    });
})();