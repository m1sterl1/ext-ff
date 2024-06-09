
function listenForClicks() {
    console.log("Listen for clicks")
    document.addEventListener("click", (e) => {

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not beastify: ${error}`);
        }

 
        if (e.target.id === "reload_ext") {
            console.log("Reloading");
            browser.runtime.reload();
        }
    });
}

listenForClicks();
