<script setup>
import { useI18n } from 'vue-i18n'
import { TTSManager } from '../logic/TTSManager.js'

defineProps({
  options: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['answer'])
const { locale } = useI18n()

const onAnswerClick = (opt) => {
    // Speak the number (or text)
    TTSManager.speak(opt.toString(), locale.value)
    emit('answer', opt)
}
</script>

<template>
  <div class="answer-panel">
    <div v-if="!options || options.length === 0" class="no-target">{{ $t('wait_target') }}</div>
    <div v-else class="options-grid">
        <button 
          v-for="opt in options" 
          :key="opt" 
          class="option-btn"
          @click="onAnswerClick(opt)"
        >
          {{ opt }}
        </button>
    </div>
  </div>
</template>

<style scoped>
.answer-panel {
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  text-align: center;
  z-index: 5;
}

.options-grid {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.option-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  font-size: 2.5rem;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  min-width: 60px;
  flex: 1;
  transition: all 0.1s;
  font-family: inherit;
  font-weight: bold;
}

.option-btn:hover {
  background: rgba(0, 243, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0,243,255,0.4);
}

.option-btn:active {
  transform: translateY(2px);
  background: var(--primary-color);
  color: #000;
}

.no-target {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}
</style>
