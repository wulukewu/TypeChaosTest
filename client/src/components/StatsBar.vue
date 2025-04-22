<template>
  <div class="w-full bg-white rounded-lg shadow-md p-4 flex flex-wrap justify-between items-center">
    <div class="stat-box text-center px-4 py-2 rounded-md bg-neutral">
      <p class="text-sm text-gray-500">Time</p>
      <p class="text-xl font-mono font-bold">{{ time }}</p>
    </div>
    <div class="stat-box text-center px-4 py-2 rounded-md bg-neutral">
      <p class="text-sm text-gray-500">WPM</p>
      <p class="text-xl font-mono font-bold">{{ wpm }}</p>
    </div>
    <div class="stat-box text-center px-4 py-2 rounded-md bg-neutral">
      <p class="text-sm text-gray-500">Accuracy</p>
      <p class="text-xl font-mono font-bold">{{ accuracy }}%</p>
    </div>
    <div class="stat-box text-center px-4 py-2 rounded-md bg-neutral">
      <p class="text-sm text-gray-500">Keystrokes</p>
      <p class="text-xl font-mono font-bold">{{ keystrokes }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatsBar',
  props: {
    time: {
      type: String,
      default: '0:00'
    },
    wpm: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 100
    },
    keystrokes: {
      type: Number,
      default: 0
    }
  }
});
</script>

<style scoped>
.stat-box {
  margin: 4px;
}

@media (max-width: 640px) {
  .stat-box {
    flex-basis: calc(50% - 8px);
  }
}
</style>
