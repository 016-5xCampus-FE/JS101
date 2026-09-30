// 程式碼寫在這裡
let doc = runtimeSetting();

main();

function runtimeSetting() {
  if (typeof document != "undefined") {
    return document;
  } else {
    const jsdom = require("jsdom");
    const fs = require("fs");
    const { JSDOM } = jsdom;
    const htmlString = fs.readFileSync("./index.html", "utf-8");

    const dom = new JSDOM(htmlString, {
      contentType: "text/html",
      includeNodeLocations: true,
      storageQuota: 10000000,
    });

    return dom.window.document;
  }
}

function main() {
  const counterEl = doc.querySelector("#counter");
  const minusBtn = doc.querySelector("#minus");
  const plusBtn = doc.querySelector("#plus");

  let count,
    min = 1,
    max = 66;

  function inputText2Number(text) {
    if (Number.isNaN(Number(text))) {
      console.warn("無法轉換為數字，將回傳", min);
      return min;
    } else {
      return Number(text);
    }
  }

  function setCountFrom(inputEl) {
    count = inputText2Number(inputEl.value);
  }

  function setMinFrom(inputEl) {
    min = inputEl.getAttribute("min") || min;
  }

  function setMaxFrom(inputEl) {
    max = inputEl.getAttribute("max") || max;
  }

  function render() {
    counterEl.value = count;
  }

  setCountFrom(counterEl);
  setMinFrom(counterEl);
  setMaxFrom(counterEl);

  plusBtn.addEventListener("click", () => {
    setCountFrom(counterEl);
    if (count < max) {
      count++;
    }
    render();
  });

  minusBtn.addEventListener("click", () => {
    setCountFrom(counterEl);
    if (count > min) {
      count--;
    }
    render();
  });
}
