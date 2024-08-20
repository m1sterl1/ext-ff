
function listenForClicks() {
    console.log("Listen for clicks")
    document.addEventListener("click", (e) => { 
        if (e.target.id === "reload_ext") {
            console.log("Reloading");
            browser.runtime.reload();
        }
    });
}

listenForClicks();
