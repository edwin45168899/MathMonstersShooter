/**
 * 音效管理器
 * 使用 Web Audio API 調頻合成音效，不依賴外部音檔，確保輕量與即時性
 */
export const SoundManager = {
    ctx: null, // AudioContext 實體
    muted: false, // 是否靜音旗標

    /**
     * 初始化 AudioContext (需在用戶交互後觸發以符合瀏覽器規範)
     */
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    /**
     * 設定靜音狀態
     * @param {boolean} val - 是否靜音
     */
    setMuted(val) {
        this.muted = val;
        if (this.ctx) {
            if (val) {
                this.ctx.suspend(); // 掛起音頻上下文
                if (this.bgmTimer) {
                    clearTimeout(this.bgmTimer);
                    this.bgmTimer = null;
                }
            } else {
                this.ctx.resume(); // 恢復音頻上下文
                if (this.isPlayingBGM && !this.bgmTimer) {
                    this.scheduleBGM();
                }
            }
        }
    },

    /**
     * 通用的頻率播放方法
     * @param {number} freq - 頻率 (Hz)
     * @param {string} type - 波形類型 ('sine', 'square', 'sawtooth', 'triangle')
     * @param {number} duration - 持續時間 (秒)
     */
    play(freq, type, duration) {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, t + duration); // 頻率下降效果

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + duration); // 音量漸弱

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + duration);
    },

    /**
     * 射擊音效 (鋸齒波下降)
     */
    shoot() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.2);
    },

    /**
     * 爆炸音效 (方波低頻)
     */
    explosion() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.3);
    },

    /**
     * 答錯或受傷音效 (鋸齒波低沉下降)
     */
    wrong() {
        if (this.muted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.3);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + 0.3);
    },

    // --- 背景音樂 (BGM) 系統 ---
    bgmTimer: null,
    isPlayingBGM: false,

    // 充滿活力的分解和弦 (C Major -> F Major -> G Major -> C Major)
    bgmNotesNormal: [
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, // C
        349.23, 440.00, 523.25, 698.46, 523.25, 440.00, // F
        392.00, 493.88, 587.33, 783.99, 587.33, 493.88, // G
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63  // C
    ],

    // 勝利凱旋樂 (加長的分解和弦)
    bgmNotesVictory: [
        // C Major 上行
        392.00, 523.25, 659.25, 783.99, // G4, C5, E5, G5
        1046.50, 783.99, 659.25, 523.25, // C6, G5, E5, C5
        // F Major
        349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
        // G Major
        392.00, 493.88, 587.33, 783.99, // G4, B4, D5, G5
        // C Major 高八度
        523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
        1318.51, 1046.50, 783.99, 659.25, // E6, C6, G5, E5
        // 下行與轉場
        523.25, 392.00, 329.63, 261.63, // C5, G4, E4, C4
        293.66, 349.23, 392.00, 523.25  // D4, F4, G4, C5
    ],

    currentBGMNotes: [],
    currentBGMType: 'normal',

    bgmIndex: 0,

    /**
     * 播放一般背景音樂
     */
    playBGM() {
        if (this.isPlayingBGM && this.currentBGMType === 'normal') return;

        this.stopBGM();
        this.currentBGMNotes = this.bgmNotesNormal;
        this.currentBGMType = 'normal';
        this.isPlayingBGM = true;
        this.bgmIndex = 0;
        this.scheduleBGM();
    },

    /**
     * 播放勝利背景音樂
     */
    playVictoryBGM() {
        this.stopBGM();
        this.currentBGMNotes = this.bgmNotesVictory;
        this.currentBGMType = 'victory';
        this.isPlayingBGM = true;
        this.bgmIndex = 0;
        this.scheduleBGM();
    },

    /**
     * 停止背景音樂
     */
    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    },

    /**
     * 暫停背景音樂
     */
    pauseBGM() {
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    },

    /**
     * 恢復背景音樂
     */
    resumeBGM() {
        if (this.isPlayingBGM && !this.bgmTimer) {
            this.scheduleBGM();
        }
    },

    /**
     * 排程下一顆音符的播放 (遞迴)
     */
    scheduleBGM() {
        if (!this.isPlayingBGM) return;

        if (!this.muted) {
            this.init();
            if (this.ctx.state === 'running') {
                const notes = this.currentBGMNotes.length > 0 ? this.currentBGMNotes : this.bgmNotesNormal;
                const freq = notes[this.bgmIndex % notes.length];
                this.playBGMNote(freq);
            }
        }

        this.bgmIndex++;
        // 150ms 的間隔，營造明快動感的節奏
        this.bgmTimer = setTimeout(() => this.scheduleBGM(), 150);
    },

    /**
     * 播放單個 BGM 音符
     * @param {number} freq - 音調頻率
     */
    playBGMNote(freq) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 勝利時使用方波 (8-bit NES 風格)，一般時使用三角波
        osc.type = this.currentBGMType === 'victory' ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        // 短促有力的 ADSR 包絡線
        gain.gain.setValueAtTime(0, t);

        if (this.currentBGMType === 'victory') {
            // 勝利：聲音更清晰，衰減較慢
            gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        } else {
            // 一般：節奏明快
            gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        }

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(t + (this.currentBGMType === 'victory' ? 0.35 : 0.15));
    }
};

