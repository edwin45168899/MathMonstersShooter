import { Collision } from './Collision.js';

/**
 * 遊戲實體管理器
 * 負責維護並更新遊戲中的所有物件（怪物、子彈、粒子、玩家）
 */
export class EntityManager {
    constructor() {
        this.monsters = [];
        this.bullets = [];
        this.particles = [];
        this.player = { x: 0, y: 0, radius: 30 };
    }

    /**
     * 重置所有實體狀態（用於重新開始遊戲）
     */
    reset() {
        this.monsters = [];
        this.bullets = [];
        this.particles = [];
    }

    /**
     * 加入一隻新怪物
     * @param {Object} data - 怪物初始資料
     */
    addMonster(data) {
        this.monsters.push({
            ...data,
            radius: 35,
            scale: 0, // 用於生成時的縮放動畫
            alive: true
        });
    }

    /**
     * 發射一顆子彈
     * @param {number} startX - 起點 X
     * @param {number} startY - 起點 Y
     * @param {number} targetX - 目標 X
     * @param {number} targetY - 目標 Y
     * @param {number} radius - 子彈半徑
     */
    addBullet(startX, startY, targetX, targetY, radius = 5) {
        const angle = Math.atan2(targetY - startY, targetX - startX);
        const speed = 15;
        this.bullets.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: radius,
            color: '#00F3FF',
            alive: true
        });
    }

    /**
     * 創建爆炸效果粒子
     * @param {number} x - 爆炸中心 X
     * @param {number} y - 爆炸中心 Y
     * @param {string} color - 粒子顏色
     */
    createExplosion(x, y, color) {
        for (let i = 0; i < 20; i++) {
            const speed = Math.random() * 5 + 2;
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: Math.random() * 0.03 + 0.02,
                color: color || '#FFA500'
            });
        }
    }

    /**
     * 更新所有實體的位置與狀態
     * @param {number} dt - delta time
     * @param {number} width - 畫布寬度
     * @param {number} height - 畫布高度
     * @param {number} globalSpeedMultiplier - 全局速度倍率 (用於減速效果)
     * @returns {number} 逃脫（超出底端）的怪物數量
     */
    update(dt, width, height, globalSpeedMultiplier = 1) {
        const hasActiveBullets = this.bullets.length > 0;
        let escaped = 0;

        // 更新怪物
        for (let m of this.monsters) {
            // 出現時的縮放動畫
            if (m.scale < 1) m.scale += 0.05 * dt;

            // 當有子彈在飛行時，怪物會暫停移動（增加打擊感與命中率）
            if (!hasActiveBullets) {
                m.y += m.speed * dt * globalSpeedMultiplier;
            }

            // 檢查是否超出底部
            if (Collision.isOffScreenBottom(m, height)) {
                m.alive = false;
                escaped++;
            }
        }

        // 更新子彈
        for (let b of this.bullets) {
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            if (Collision.isOffScreen(b, width, height)) {
                b.alive = false;
            }
        }

        // 更新粒子
        for (let p of this.particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= p.decay * dt;
        }

        // 清理已死亡或失效的實體
        this.monsters = this.monsters.filter(m => m.alive);
        this.bullets = this.bullets.filter(b => b.alive);
        this.particles = this.particles.filter(p => p.life > 0);

        return escaped;
    }
}

