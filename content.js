(() => {
    if (window.hasRun) {
        return;
      }
    window.hasRun = true;
    
    console.log("Connecting...");
    let myPort = browser.runtime.connect({ name: "port-from-cs" });

    myPort.onMessage.addListener((m) => {
        console.log("In content script, received message from background script: ");
        console.log(m);
    });
})();