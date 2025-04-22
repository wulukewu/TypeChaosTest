import { useState, useEffect, useRef, useCallback } from 'react';
import Keyboard from './Keyboard';
import StatsBar from './StatsBar';
import ResultsCard from './ResultsCard';
import { typingTexts } from '../constants/typingTexts';
import { scrambleKeyboard } from '../utils/keyboard';
import { KeyboardLayout } from '../types/typing';
import { formatTime } from '../utils/typingStats';

const TypingTest = () => {
  // State variables
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [keystrokes, setKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [testComplete, setTestComplete] = useState(false);
  const [currentKey, setCurrentKey] = useState('');
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Initial keyboard layout
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>({
    row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  });

  // Current text and progress calculations
  const currentText = typingTexts[currentTextIndex].split('');
  const progress = (currentPosition / currentText.length) * 100;

  // Methods
  const startTest = () => {
    setIsTestActive(true);
    setCurrentPosition(0);
    setKeystrokes(0);
    setCorrectKeystrokes(0);
    setAccuracy(100);
    setWpm(0);
    setStartTime(null);
    setTestComplete(false);
    setElapsedTime(0);
    setTypedChars([]);
    
    // Reset keyboard to normal layout
    setKeyboardLayout({
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    });
    
    // Focus the window to capture keystrokes
    window.focus();
  };

  const resetTest = () => {
    setIsTestActive(false);
    setCurrentPosition(0);
    setKeystrokes(0);
    setCorrectKeystrokes(0);
    setAccuracy(100);
    setWpm(0);
    setStartTime(null);
    setTestComplete(false);
    setElapsedTime(0);
    setTypedChars([]);
    
    // Reset keyboard to normal layout
    setKeyboardLayout({
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    });
    
    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = window.setInterval(() => {
      if (!isTestActive || testComplete) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        return;
      }
      
      if (startTime) {
        const newElapsedTime = new Date().getTime() - startTime.getTime();
        setElapsedTime(newElapsedTime);
        
        // Update WPM (5 characters = 1 word)
        const elapsedMinutes = newElapsedTime / 60000;
        if (elapsedMinutes > 0) {
          setWpm(Math.floor((correctKeystrokes / 5) / elapsedMinutes));
        }
      }
    }, 1000);
  }, [correctKeystrokes, isTestActive, startTime, testComplete]);

  const completeTest = () => {
    setIsTestActive(false);
    setTestComplete(true);
    
    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isTestActive) return;
    
    // Get expected character and pressed character
    const expectedChar = currentText[currentPosition];
    const pressedChar = event.key;
    
    // Store current key for keyboard highlighting
    setCurrentKey(pressedChar.toUpperCase());
    
    // Start timer on first keystroke
    if (currentPosition === 0 && startTime === null) {
      setStartTime(new Date());
      startTimer();
    }
    
    // Store typed character
    const newTypedChars = [...typedChars];
    newTypedChars[currentPosition] = pressedChar;
    setTypedChars(newTypedChars);
    
    // Check if the pressed key is correct
    if (pressedChar === expectedChar) {
      setCorrectKeystrokes(prev => prev + 1);
      
      // Move to next character
      setCurrentPosition(prev => prev + 1);
      
      // Check if typing is complete
      if (currentPosition + 1 >= currentText.length) {
        completeTest();
        return;
      }
    }
    
    // Count keystroke
    setKeystrokes(prev => prev + 1);
    
    // Update accuracy
    const newKeystrokes = keystrokes + 1;
    const newAccuracy = Math.floor((correctKeystrokes + (pressedChar === expectedChar ? 1 : 0)) / newKeystrokes * 100);
    setAccuracy(newAccuracy);
    
    // Update WPM (5 characters = 1 word)
    if (startTime) {
      const elapsedMinutes = (new Date().getTime() - startTime.getTime()) / 60000;
      if (elapsedMinutes > 0) {
        const newCorrectKeystrokes = correctKeystrokes + (pressedChar === expectedChar ? 1 : 0);
        setWpm(Math.floor((newCorrectKeystrokes / 5) / elapsedMinutes));
      }
    }
    
    // Scramble keyboard after every keystroke
    setKeyboardLayout(scrambleKeyboard(keyboardLayout));
  }, [
    correctKeystrokes, 
    currentPosition, 
    currentText, 
    isTestActive, 
    keyboardLayout, 
    keystrokes, 
    startTime, 
    startTimer, 
    typedChars
  ]);

  // Set up and clean up event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Chaotic Type Speed Test</h1>
        <p className="text-lg text-gray-600">Type accurately as the keyboard scrambles after each keystroke!</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl flex flex-col items-center space-y-8">
        {/* Stats Bar */}
        <StatsBar
          time={formatTime(elapsedTime)}
          wpm={wpm}
          accuracy={accuracy}
          keystrokes={keystrokes}
        />

        {/* Text Display Area */}
        <div className="w-full bg-white rounded-lg shadow-md p-6 mb-4 relative">
          <div className="typing-text text-lg leading-relaxed whitespace-pre-wrap">
            {currentText.map((char, index) => (
              <span 
                key={index} 
                className={
                  index === currentPosition
                    ? 'character-current'
                    : index < currentPosition && typedChars[index] === char
                    ? 'character-correct'
                    : index < currentPosition && typedChars[index] !== char
                    ? 'character-incorrect'
                    : ''
                }
              >
                {char}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4 mb-6">
          <button 
            className={`px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow transition ${isTestActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={startTest}
            disabled={isTestActive}
          >
            Start Test
          </button>
          <button 
            className={`px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow transition ${!isTestActive && !testComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={resetTest}
            disabled={!isTestActive && !testComplete}
          >
            Reset
          </button>
        </div>

        {/* Keyboard Visualization or Results Card */}
        {!testComplete ? (
          <Keyboard 
            keyboardLayout={keyboardLayout}
            currentKey={currentKey}
          />
        ) : (
          <ResultsCard
            wpm={wpm}
            accuracy={accuracy}
            time={formatTime(elapsedTime)}
            chars={correctKeystrokes}
            onTryAgain={resetTest}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-auto pt-8 text-center text-gray-500 text-sm">
        <p>Chaotic Type Speed Test | Challenge your typing skills with a constantly scrambling keyboard!</p>
      </footer>
    </div>
  );
};

export default TypingTest;