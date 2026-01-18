/**
 * 數學題目生成系統
 * 負責產生 0-20 範圍內的加減法題目，並生成干擾選項
 */
export class MathSystem {
  constructor() {
    this.maxNumber = 20; // 最大數值範圍 (基準值)
  }

  /**
   * 生成一個新的數學問題
   * @returns {Object} 包含算式、答案與選項的物件
   */
  generateProblem() {
    // 50% 機率生成加法，50% 機率生成減法
    const isAddition = Math.random() < 0.5;
    let a, b, result, operator;

    if (isAddition) {
      // 加法：確保兩數之和不超過 20 (符合國小一年級程度)
      a = Math.floor(Math.random() * 21); // 0-20
      b = Math.floor(Math.random() * (21 - a)); // 確保 a + b <= 20
      result = a + b;
      operator = '+';
    } else {
      // 減法：確保被減數大於減數 (答案為正數)
      a = Math.floor(Math.random() * 21); // 0-20
      b = Math.floor(Math.random() * (a + 1)); // 確保 0 <= b <= a
      result = a - b;
      operator = '-';
    }

    const options = this.generateOptions(result);
    return {
      equation: `${a} ${operator} ${b} = ?`,
      answer: result,
      options: options
    };
  }

  /**
   * 生成選擇題的選項 (1 個正確答案 + 2 個干擾項)
   * @param {number} correctValue - 正確答案
   * @returns {number[]} 隨機排序後的選項陣列
   */
  generateOptions(correctValue) {
    const options = new Set([correctValue]);
    while (options.size < 3) {
      // 生成與答案接近的干擾項 (+/- 1 到 3 之間)
      const offset = (Math.floor(Math.random() * 3) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const val = correctValue + offset;

      // 確保選項為正數且在合理範圍內
      if (val >= 0 && val <= 40) {
        options.add(val);
      } else {
        // 如果偏移後超出範圍，則隨機生成一個 0-20 的數字
        options.add(Math.floor(Math.random() * 21));
      }
    }
    // 打亂選項順序
    return Array.from(options).sort(() => Math.random() - 0.5);
  }
}

