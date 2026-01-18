<script setup>
defineProps({
  score: Number,
  lives: Number
})
</script>

<template>
  <div class="hud">
    <button class="pause-btn" @click="$emit('pause')">⏸</button>
    <div class="score">{{ $t('score') }} <span class="val">{{ score }}</span></div>
    <div class="lives">
      {{ $t('lives') }} 
      <span v-for="n in lives" :key="n" class="heart">❤️</span>
    </div>
  </div>
</template>

<style scoped>
.hud {
  position: absolute;
  top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: 5;
  gap: 5px;
}

.score {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
  /* No absolute positioning needed anymore */
}

.lives {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff3366;
  /* No absolute positioning needed anymore */
}

.val {
  color: #fff;
}

.heart {
  margin-left: 5px;
}

.pause-btn {
    pointer-events: auto; /* Enable clicks */
    position: absolute;
    top: 5px;
    right: 20px;
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s;
}
.pause-btn:hover {
    background: var(--primary-color);
    color: #000;
}
</style>
