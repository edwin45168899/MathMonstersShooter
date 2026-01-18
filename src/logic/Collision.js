export const Collision = {
    /**
     * 圓形與圓形的碰撞偵測
     * @param {Object} c1 - 第一個圓形 {x, y, radius}
     * @param {Object} c2 - 第二個圓形 {x, y, radius}
     * @returns {boolean} 是否發生碰撞
     */
    checkCircle: (c1, c2) => {
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < (c1.radius + c2.radius);
    },

    /**
     * 點與圓形的碰撞偵測（可用於滑鼠點擊偵測）
     * @param {number} x - 點的 X 座標
     * @param {number} y - 點的 Y 座標
     * @param {Object} circle - 圓形物件 {x, y, radius}
     * @returns {boolean} 點是否在圓形內
     */
    checkPointCircle: (x, y, circle) => {
        const dx = x - circle.x;
        const dy = y - circle.y;
        return Math.sqrt(dx * dx + dy * dy) < circle.radius;
    },

    /**
     * 檢查物件是否超出畫布底部
     * @param {Object} entity - 遊戲實體物件 {y, radius}
     * @param {number} canvasHeight - 畫布高度
     * @returns {boolean} 是否超出底部
     */
    isOffScreenBottom: (entity, canvasHeight) => {
        return (entity.y - entity.radius) > canvasHeight;
    },

    /**
     * 檢查物件是否超出畫布邊界（上下左右）
     * 通常用於子彈的存權檢查
     * @param {Object} entity - 遊戲實體物件 {x, y, radius}
     * @param {number} width - 畫布寬度
     * @param {number} height - 畫布高度
     * @returns {boolean} 是否完全超出畫布範圍
     */
    isOffScreen: (entity, width, height) => {
        return (
            entity.y < -entity.radius ||
            entity.x < -entity.radius ||
            entity.x > width + entity.radius ||
            entity.y > height + entity.radius
        );
    }
};

