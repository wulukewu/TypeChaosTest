<template>
  <div class="min-h-screen flex flex-col items-center py-8 px-4">
    <!-- Header -->
    <header class="w-full max-w-4xl text-center mb-6">
      <h1 class="text-3xl font-bold text-primary mb-2">Chaotic Type Speed Test</h1>
      <p class="text-lg text-gray-600">Type accurately as the keyboard scrambles after each keystroke!</p>
    </header>

    <!-- Main Content -->
    <main class="w-full max-w-4xl flex flex-col items-center space-y-8">
      <!-- Stats Bar -->
      <stats-bar
        :time="formatTime(elapsedTime)"
        :wpm="wpm"
        :accuracy="accuracy"
        :keystrokes="keystrokes"
      />

      <!-- Text Display Area -->
      <div class="w-full bg-white rounded-lg shadow-md p-6 mb-4 relative">
        <div class="typing-text text-lg leading-relaxed whitespace-pre-wrap">
          <span 
            v-for="(char, index) in currentText" 
            :key="index" 
            :class="{
              'character-current': index === currentPosition,
              'character-correct': index < currentPosition && typedChars[index] === char,
              'character-incorrect': index < currentPosition && typedChars[index] !== char
            }"
          >
            {{ char }}
          </span>
        </div>

        <!-- Progress bar -->
        <div class="w-full h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div 
            class="h-full bg-primary rounded-full transition-all duration-300" 
            :style="`width: ${progress}%`"
          ></div>
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex space-x-4 mb-6">
        <button 
          class="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow transition"
          @click="startTest"
          :disabled="isTestActive"
          :class="{ 'opacity-50 cursor-not-allowed': isTestActive }"
        >
          Start Test
        </button>
        <button 
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow transition"
          @click="resetTest"
          :disabled="!isTestActive && !testComplete"
          :class="{ 'opacity-50 cursor-not-allowed': !isTestActive && !testComplete }"
        >
          Reset
        </button>
      </div>

      <!-- Keyboard Visualization -->
      <keyboard 
        v-if="!testComplete"
        :keyboard-layout="keyboardLayout"
        :current-key="currentKey"
      />

      <!-- Results Card -->
      <results-card
        v-if="testComplete"
        :wpm="wpm"
        :accuracy="accuracy"
        :time="formatTime(elapsedTime)"
        :chars="correctKeystrokes"
        @try-again="resetTest"
      />
    </main>

    <!-- Footer -->
    <footer class="w-full max-w-4xl mt-auto pt-8 text-center text-gray-500 text-sm">
      <p>Chaotic Type Speed Test | Challenge your typing skills with a constantly scrambling keyboard!</p>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import Keyboard from './Keyboard.vue';
import StatsBar from './StatsBar.vue';
import ResultsCard from './ResultsCard.vue';
import { typingTexts } from '../constants/typingTexts';
import { scrambleKeyboard } from '../utils/keyboard';
import { KeyboardLayout } from '../types/typing';

export default defineComponent({
  name: 'TypingTest',
  components: {
    Keyboard,
    StatsBar,
    ResultsCard
  },
  setup() {
    // State variables
    const currentTextIndex = ref(0);
    const isTestActive = ref(false);
    const startTime = ref<Date | null>(null);
    const elapsedTime = ref(0);
    const keystrokes = ref(0);
    const correctKeystrokes = ref(0);
    const wpm = ref(0);
    const accuracy = ref(100);
    const currentPosition = ref(0);
    const testComplete = ref(false);
    const timerInterval = ref<number | null>(null);
    const currentKey = ref('');
    const typedChars = ref<string[]>([]);

    // Initial keyboard layout
    const keyboardLayout = ref<KeyboardLayout>({
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    });

    // Computed properties
    const currentText = computed(() => {
      return typingTexts[currentTextIndex.value].split('');
    });

    const progress = computed(() => {
      return (currentPosition.value / currentText.value.length) * 100;
    });

    // Methods
    const startTest = () => {
      isTestActive.value = true;
      currentPosition.value = 0;
      keystrokes.value = 0;
      correctKeystrokes.value = 0;
      accuracy.value = 100;
      wpm.value = 0;
      startTime.value = null;
      testComplete.value = false;
      elapsedTime.value = 0;
      typedChars.value = [];
      
      // Reset keyboard to normal layout
      keyboardLayout.value = {
        row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      };
      
      // Focus the window to capture keystrokes
      window.focus();
    };

    const resetTest = () => {
      isTestActive.value = false;
      currentPosition.value = 0;
      keystrokes.value = 0;
      correctKeystrokes.value = 0;
      accuracy.value = 100;
      wpm.value = 0;
      startTime.value = null;
      testComplete.value = false;
      elapsedTime.value = 0;
      typedChars.value = [];
      
      // Reset keyboard to normal layout
      keyboardLayout.value = {
        row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      };
      
      // Stop timer
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };

    const startTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
      
      timerInterval.value = window.setInterval(() => {
        if (!isTestActive.value || testComplete.value) {
          if (timerInterval.value) {
            clearInterval(timerInterval.value);
            timerInterval.value = null;
          }
          return;
        }
        
        if (startTime.value) {
          elapsedTime.value = new Date().getTime() - startTime.value.getTime();
          
          // Update WPM (5 characters = 1 word)
          const elapsedMinutes = elapsedTime.value / 60000;
          if (elapsedMinutes > 0) {
            wpm.value = Math.floor((correctKeystrokes.value / 5) / elapsedMinutes);
          }
        }
      }, 1000);
    };

    const formatTime = (ms: number) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const completeTest = () => {
      isTestActive.value = false;
      testComplete.value = true;
      
      // Stop timer
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
        timerInterval.value = null;
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isTestActive.value) return;
      
      // Get expected character and pressed character
      const expectedChar = currentText.value[currentPosition.value];
      const pressedChar = event.key;
      
      // Store current key for keyboard highlighting
      currentKey.value = pressedChar.toUpperCase();
      
      // Start timer on first keystroke
      if (currentPosition.value === 0 && startTime.value === null) {
        startTime.value = new Date();
        startTimer();
      }
      
      // Store typed character
      typedChars.value[currentPosition.value] = pressedChar;
      
      // Check if the pressed key is correct
      if (pressedChar === expectedChar) {
        correctKeystrokes.value++;
        
        // Move to next character
        currentPosition.value++;
        
        // Check if typing is complete
        if (currentPosition.value >= currentText.value.length) {
          completeTest();
          return;
        }
      }
      
      // Count keystroke
      keystrokes.value++;
      
      // Update accuracy
      accuracy.value = Math.floor((correctKeystrokes.value / keystrokes.value) * 100);
      
      // Update WPM (5 characters = 1 word)
      if (startTime.value) {
        const elapsedMinutes = (new Date().getTime() - startTime.value.getTime()) / 60000;
        if (elapsedMinutes > 0) {
          wpm.value = Math.floor((correctKeystrokes.value / 5) / elapsedMinutes);
        }
      }
      
      // Scramble keyboard after every keystroke
      keyboardLayout.value = scrambleKeyboard(keyboardLayout.value);
    };

    // Set up and clean up event listeners
    onMounted(() => {
      document.addEventListener('keydown', handleKeyPress);
    });
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyPress);
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });

    return {
      currentTextIndex,
      isTestActive,
      elapsedTime,
      keystrokes,
      correctKeystrokes,
      wpm,
      accuracy,
      currentPosition,
      testComplete,
      keyboardLayout,
      currentText,
      currentKey,
      typedChars,
      progress,
      startTest,
      resetTest,
      formatTime
    };
  }
});
</script>

<style scoped>
.typing-text {
  font-family: 'Roboto Mono', monospace;
}
.character-correct {
  color: hsl(var(--correct, 142 76% 36%));
}
.character-incorrect {
  color: hsl(var(--destructive));
  text-decoration: underline;
}
.character-current {
  background-color: rgba(63, 81, 181, 0.2);
  border-left: 2px solid hsl(var(--primary));
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>
