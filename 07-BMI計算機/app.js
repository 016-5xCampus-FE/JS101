// 程式碼寫在這裡
// 提示：BMI = 體重(kg) / 身高(m) 平方
function createDocumentForNode() {
  const jsdom = require("jsdom");
  const fs = require("fs");
  const path = require("path");
  const { JSDOM } = jsdom;
  const htmlPath = path.join(__dirname, "index.html");
  const htmlString = fs.readFileSync(htmlPath, "utf-8");

  const dom = new JSDOM(htmlString, {
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
  });

  return dom.window.document;
}

function createBMIApp(doc) {
  const heightEl = doc.querySelector("#bodyHeight");
  const weightEl = doc.querySelector("#bodyWeight");
  const calcBtn = doc.querySelector(".fields>button");
  const resultEl = doc.querySelector("#resultText");

  function calculate() {
    const bH = heightEl.value;
    const bW = weightEl.value;
    if (!isAllValueValid([bH, bW])) {
      const errorMsg = getErrorReason([heightEl, weightEl], doc);
      console.warn("輸入值錯誤: " + errorMsg);
      return;
    }
    resultEl.textContent = String(roundAfterByDigit(calcBMI(bW, bH), 2));
  }

  calcBtn.addEventListener("click", calculate);

  function reset() {
    heightEl.value = "";
    weightEl.value = "";
    resultEl.textContent = "0";
  }

  return {
    heightEl,
    weightEl,
    calcBtn,
    resultEl,
    reset,
  };
}

function isAllValueValid(valAry = []) {
  return valAry.every((val) => {
    const num = Number(val);
    if (!Number.isFinite(num) || num <= 0) {
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

function getErrorReason(elAry = [], doc) {
  const reasons = elAry.reduce((msgAry, el) => {
    const elLabel = doc.querySelector(`label[for="${el.id}"]`);
    const valNum = Number(el.value);
    if (el.value == "") {
      msgAry.push(elLabel.textContent + "沒有填");
      return msgAry;
    }
    if (!Number.isFinite(valNum)) {
      msgAry.push(elLabel.textContent + "不是有效數值");
      return msgAry;
    }
    if (valNum <= 0) {
      msgAry.push(elLabel.textContent + "不能小於等於 0");
      return msgAry;
    }
    return msgAry;
  }, []);

  return reasons.join(", ");
}

if (typeof document !== "undefined") {
  createBMIApp(document);
}

if (typeof module !== "undefined") {
  module.exports = {
    createBMIApp,
    createDocumentForNode,
    isAllValueValid,
    calcBMI,
    roundAfterByDigit,
    getErrorReason,
  };
}
