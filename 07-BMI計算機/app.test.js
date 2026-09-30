const { createBMIApp, createDocumentForNode } = require("./app");

const doc = createDocumentForNode();
const app = createBMIApp(doc);

let failCount = 0;

function assertWithReset(message, assertFn) {
  app.reset();
  const result = assertFn();
  console.assert(result, message);
  if (!result) {
    failCount += 1;
  }
}

assertWithReset("一般使用情境: 身高 170、體重 65 應計算為 22.49", () => {
  app.heightEl.value = "170";
  app.weightEl.value = "65";
  app.calcBtn.click();
  return app.resultEl.textContent === "22.49";
});

assertWithReset("邊緣案例: 身高未填不應更新結果", () => {
  app.weightEl.value = "65";
  app.calcBtn.click();
  return app.resultEl.textContent === "0";
});

assertWithReset("邊緣案例: 體重未填不應更新結果", () => {
  app.heightEl.value = "170";
  app.calcBtn.click();
  return app.resultEl.textContent === "0";
});

assertWithReset("邊緣案例: 身高為 0 不應更新結果", () => {
  app.heightEl.value = "0";
  app.weightEl.value = "65";
  app.calcBtn.click();
  return app.resultEl.textContent === "0";
});

assertWithReset("邊緣案例: 體重為負數不應更新結果", () => {
  app.heightEl.value = "170";
  app.weightEl.value = "-10";
  app.calcBtn.click();
  return app.resultEl.textContent === "0";
});

assertWithReset("邊緣案例: 非數字輸入不應更新結果", () => {
  app.heightEl.value = "abc";
  app.weightEl.value = "65";
  app.calcBtn.click();
  return app.resultEl.textContent === "0";
});

if (failCount === 0) {
  console.log("BMI 測試完成：全部通過");
} else {
  console.warn(`BMI 測試完成：失敗 ${failCount} 項`);
  process.exitCode = 1;
}
