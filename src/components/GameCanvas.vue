<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { GameEngine } from '../logic/GameEngine.js'

const props = defineProps({
  active: Boolean
})

const emit = defineEmits(['score', 'lives', 'gameover', 'options', 'wrong', 'correct'])

const canvasRef = ref(null)
let engine = null

onMounted(() => {
  if (canvasRef.value) {
    const callbacks = {
      onScore: (s) => emit('score', s),
      onLives: (l) => emit('lives', l),
      onGameOver: (s, w) => emit('gameover', s, w),
      onOptions: (opts) => emit('options', opts),
      onWrongAnswer: () => emit('wrong'),
      onCorrectAnswer: () => emit('correct')
    }
    
    engine = new GameEngine(canvasRef.value, callbacks)
    engine.init()
    
    // Initial size setup
    engine.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
    
    const resizeObserver = new ResizeObserver(() => {
        if (canvasRef.value) {
            engine.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
        }
    })
    resizeObserver.observe(canvasRef.value)
  }
})

watch(() => props.active, (newVal) => {
  if (newVal && engine) {
    setTimeout(() => { // slight delay to ensure canvas size is ready
        engine.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
        engine.resume()
    }, 100)
  } else if (!newVal && engine) {
    engine.setPaused(true)
  }
})

const handleAnswer = (val) => {
    if (engine) engine.handleAnswer(val)
}

const restartGame = () => {
    if(engine) {
         engine.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
         engine.start()
    }
}

const setPaused = (val) => {
    if (engine) engine.setPaused(val)
}

defineExpose({ handleAnswer, setPaused, restartGame })
</script>

<template>
  <canvas ref="canvasRef" class="game-canvas"></canvas>
</template>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
