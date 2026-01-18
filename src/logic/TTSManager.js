/**
 * 語音合成管理器 (TTS)
 * 負責將文字轉換為語音，用於按鈕提示或遊戲反饋
 */
export class TTSManager {
    static enabled = true; // 是否啟用語音功能

    /**
     * 設定語音啟用狀態
     * @param {boolean} val - 是否啟用
     */
    static setEnabled(val) {
        this.enabled = val;
        if (!val) window.speechSynthesis.cancel(); // 停用時立即取消正在播放的語音
    }

    /**
     * 播放語音
     * @param {string} text - 要播放的文字內容
     * @param {string} locale - 語言標記 ('zh' 或 'en')
     */
    static speak(text, locale) {
        if (!this.enabled || !window.speechSynthesis) return;

        // 取消之前的語音以避免重疊
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // 將語系對應到瀏覽器標準格式
        utterance.lang = locale === 'zh' ? 'zh-TW' : 'en-US';

        // 調整語速與音調，使聲音對小朋友更親切且符合遊戲節奏
        utterance.rate = 1.5; // 稍快的語速以匹配遊戲節奏
        utterance.pitch = 1.1; // 稍高的音調增加親和力

        window.speechSynthesis.speak(utterance);
    }
}

