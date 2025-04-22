<template>
  <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-4">
    <h2 class="text-2xl font-bold text-center mb-4">Test Results</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="stat-box text-center p-4 rounded-md bg-neutral">
        <p class="text-sm text-gray-500">WPM</p>
        <p class="text-3xl font-mono font-bold text-primary">{{ wpm }}</p>
      </div>
      <div class="stat-box text-center p-4 rounded-md bg-neutral">
        <p class="text-sm text-gray-500">Accuracy</p>
        <p class="text-3xl font-mono font-bold text-primary">{{ accuracy }}%</p>
      </div>
      <div class="stat-box text-center p-4 rounded-md bg-neutral">
        <p class="text-sm text-gray-500">Time</p>
        <p class="text-3xl font-mono font-bold text-primary">{{ time }}</p>
      </div>
      <div class="stat-box text-center p-4 rounded-md bg-neutral">
        <p class="text-sm text-gray-500">Characters</p>
        <p class="text-3xl font-mono font-bold text-primary">{{ chars }}</p>
      </div>
    </div>
    
    <div class="flex justify-center mt-6">
      <button 
        class="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow transition"
        @click="$emit('tryAgain')"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ResultsCard',
  props: {
    wpm: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    chars: {
      type: Number,
      required: true
    }
  },
  emits: ['tryAgain']
});
</script>
