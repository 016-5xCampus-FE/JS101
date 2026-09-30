// 程式碼寫在這裡
// 提示：BMI = 體重(kg) / 身高(m) 平方
const doc = runtimeSetting();

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
  const heightEl = doc.querySelector("#bodyHeight");
  const weightEl = doc.querySelector("#bodyWeight");
  const calcBtn = doc.querySelector(".fields>button");
  const resultEl = doc.querySelector("#resultText");

  calcBtn.addEventListener("click", () => {
    const bH = heightEl.value;
    const bW = weightEl.value;
    if (!isAllValueValid([bH, bW])) {
      const errorMsg = getErrorReason([heightEl, weightEl]);
      console.warn("輸入值錯誤: " + errorMsg);
      return;
    }
    resultEl.textContent = roundAfterByDigit(calcBMI(bW, bH), 2);
  });

  function reset() {
    heightEl.value = "";
    weightEl.value = "";
    resultEl.textContent = "0";
  }
}

function isAllValueValid(valAry = []) {
  return valAry.every((val) => {
    const num = Number(val);
    if (num <= 0) {
      return false;
    }

    return true;
  });
}

function calcBMI(weight, height) {
  const w = weight;
  const h = height / 100;
  return w / (h * h);
}

function roundAfterByDigit(val, digit = 2) {
  const tempUnitDigit = Math.pow(10, digit);
  return Math.round(val * tempUnitDigit) / tempUnitDigit;
}

function getErrorReason(elAry = []) {
  return elAry.reduce((msg, el, i) => {
    const breakStr = i != 0 ? ", " : "";
    const elLabel = doc.querySelector(`label[for="${el.id}"]`);
    if (el.value == "") {
      return msg + breakStr + elLabel.textContent + "沒有填";
    }
    if (el.value <= 0) {
      return msg + breakStr + elLabel.textContent + "不能小於等於 0";
    }
    return msg;
  }, "");
}
