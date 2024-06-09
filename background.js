import init, { solve } from "./pkg/wasm.js";

console.log("Background start...")

await init();

let LAST;
let PORT;

function connected(p) {
  PORT = p;
  console.log("Connected");
  browser.webRequest.onBeforeRequest.addListener(
    listener,
    {urls: [
      "https://app.0xterminal.game/api/game/last",
      "https://app.0xterminal.game/api/game/move"]},
    ["blocking"]
  );
}



function listener(details) {
  console.log(`Loading ${details.url}`);
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    let last = JSON.parse(str);
    if (JSON.stringify(LAST) !== JSON.stringify(last)){
      LAST = last;
      let guesses = last.wordGuessHistory.map((el)=> [el.word, el.amountGuessed]) ;
      let answer = solve(last.words, guesses);
      console.log(answer);
      PORT.postMessage(answer);

    }
    filter.write(event.data);
    filter.disconnect();
  }

  return {};
}

browser.runtime.onConnect.addListener(connected);
