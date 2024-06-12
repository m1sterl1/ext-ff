import init, { solve } from "./pkg/wasm.js";

console.log("[B] start...")

await init();

let LAST;

function send_message(m){
  browser.tabs
  .query({
    currentWindow: true,
    active: true,
  })
  .then(tabs=>{
    let tab = tabs[0];
    console.log(`[B] tab ${tab.id}`);
    return browser.tabs.sendMessage(tab.id, m);
  })
  .catch(console.log);
}

function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    let last = JSON.parse(str);
    if (JSON.stringify(LAST) !== JSON.stringify(last)){
      LAST = last;
      let guesses = last.wordGuessHistory.map((el)=> [el.word, el.amountGuessed]) ;
      let answer = solve(last.words, guesses);
      console.log("[B] Sending answer");
      send_message(answer);

    }
    filter.write(event.data);
    filter.disconnect();
  }

  return {};
}

browser.tabs
  .executeScript({ file: "/content.js" })
  .then(_=>{
    browser.webRequest.onBeforeRequest.addListener(
      listener,
      {urls: [
        "https://app.0xterminal.game/api/game/last",
        "https://app.0xterminal.game/api/game/move"]},
      ["blocking"]
    );
  })
  .catch((e) => console.log(e));
