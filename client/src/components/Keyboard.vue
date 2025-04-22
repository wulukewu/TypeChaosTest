<template>
  <div class="keyboard-container w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-4 transition-all duration-300">
    <!-- Row 1 (numbers) -->
    <div class="flex justify-center space-x-1 mb-1">
      <div 
        v-for="n in 10" 
        :key="`num-${n-1}`" 
        class="key w-10 h-10 md:w-12 md:h-12 bg-neutral rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all"
      >
        {{ n === 10 ? 0 : n }}
      </div>
    </div>
    
    <!-- Row 2 (QWERTY...) -->
    <div class="flex justify-center space-x-1 mb-1">
      <div 
        v-for="(key, index) in keyboardLayout.row1" 
        :key="`row1-${index}`" 
        class="key w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all"
        :class="getKeyClass(key)"
      >
        {{ key }}
      </div>
    </div>

    <!-- Row 3 (ASDF...) -->
    <div class="flex justify-center space-x-1 mb-1">
      <div 
        v-for="(key, index) in keyboardLayout.row2" 
        :key="`row2-${index}`" 
        class="key w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all"
        :class="getKeyClass(key)"
      >
        {{ key }}
      </div>
    </div>

    <!-- Row 4 (ZXCV...) -->
    <div class="flex justify-center space-x-1 mb-1">
      <div 
        v-for="(key, index) in keyboardLayout.row3" 
        :key="`row3-${index}`" 
        class="key w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all"
        :class="getKeyClass(key)"
      >
        {{ key }}
      </div>
    </div>

    <!-- Row 5 (Space) -->
    <div class="flex justify-center mt-1">
      <div 
        class="key w-64 h-10 md:h-12 rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all"
        :class="getKeyClass(' ')"
      >
        Space
      </div>
    </div>

    <!-- Key legend -->
    <div class="mt-4 pt-2 border-t border-gray-200 flex flex-wrap justify-center items-center text-xs text-gray-500 gap-4">
      <div class="flex items-center">
        <div class="w-4 h-4 bg-neutral rounded mr-1"></div>
        <span>Normal</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 bg-primary rounded mr-1"></div>
        <span>Current Key</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 bg-correct rounded mr-1"></div>
        <span>Correct</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 bg-destructive rounded mr-1"></div>
        <span>Incorrect</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { KeyboardLayout } from '../types/typing';

export default defineComponent({
  name: 'KeyboardComponent',
  props: {
    keyboardLayout: {
      type: Object as PropType<KeyboardLayout>,
      required: true
    },
    currentKey: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // Method to determine the CSS class for each key
    const getKeyClass = (key: string) => {
      // Check if this key is the current key
      const isCurrentKey = key === props.currentKey || 
                           (key === 'Space' && props.currentKey === ' ');
      
      return {
        'bg-neutral': !isCurrentKey,
        'bg-primary text-white': isCurrentKey,
        'animate-scramble': true
      };
    };

    return {
      getKeyClass
    };
  }
});
</script>

<style scoped>
.keyboard-container {
  perspective: 500px;
}
.key {
  transition: all 0.1s ease;
}
.key.active {
  transform: translateY(2px);
  box-shadow: 0 0 0 0 rgba(0,0,0,0.2);
}
.animate-scramble {
  animation: scramble 0.3s ease-in-out;
}
@keyframes scramble {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>
