// 程式碼寫在這裡
// 提示：BMI = 體重(kg) / 身高(m) 平方
const doc = runtimeSetting();
const isNodeRuntime = typeof window === "undefined";

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

  function testing() {
    let failCount = 0;

    function assertWithReset(message, assertFn) {
      reset();
      const result = assertFn();
      console.assert(result, message);
      if (!result) {
        failCount += 1;
      }
    }

    assertWithReset("一般使用情境: 身高 170、體重 65 應計算為 22.49", () => {
      heightEl.value = "170";
      weightEl.value = "65";
      calcBtn.click();
      return resultEl.textContent === "22.49";
    });

    assertWithReset("邊緣案例: 身高未填不應更新結果", () => {
      weightEl.value = "65";
      calcBtn.click();
      return resultEl.textContent === "0";
    });

    assertWithReset("邊緣案例: 體重未填不應更新結果", () => {
      heightEl.value = "170";
      calcBtn.click();
      return resultEl.textContent === "0";
    });

    assertWithReset("邊緣案例: 身高為 0 不應更新結果", () => {
      heightEl.value = "0";
      weightEl.value = "65";
      calcBtn.click();
      return resultEl.textContent === "0";
    });

    assertWithReset("邊緣案例: 體重為負數不應更新結果", () => {
      heightEl.value = "170";
      weightEl.value = "-10";
      calcBtn.click();
      return resultEl.textContent === "0";
    });

    assertWithReset("邊緣案例: 非數字輸入不應更新結果", () => {
      heightEl.value = "abc";
      weightEl.value = "65";
      calcBtn.click();
      return resultEl.textContent === "0";
    });

    if (failCount === 0) {
      console.log("BMI 測試完成：全部通過");
    } else {
      console.warn(`BMI 測試完成：失敗 ${failCount} 項`);
    }
  }

  if (isNodeRuntime) {
    testing();
  }
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

function getErrorReason(elAry = []) {
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
