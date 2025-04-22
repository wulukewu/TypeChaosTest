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

  // 找出鍵盤佈局中指定字母的位置
  const findKeyPosition = useCallback((layout: KeyboardLayout, char: string): { row: number, index: number } | null => {
    char = char.toUpperCase();
    
    // 檢查第一排
    const row1Index = layout.row1.indexOf(char);
    if (row1Index !== -1) {
      return { row: 1, index: row1Index };
    }
    
    // 檢查第二排
    const row2Index = layout.row2.indexOf(char);
    if (row2Index !== -1) {
      return { row: 2, index: row2Index };
    }
    
    // 檢查第三排
    const row3Index = layout.row3.indexOf(char);
    if (row3Index !== -1) {
      return { row: 3, index: row3Index };
    }
    
    return null;
  }, []);
  
  // 將實體鍵盤按鍵映射到虛擬鍵盤上的字母
  const mapPhysicalKeyToVirtual = useCallback((physicalKey: string, layout: KeyboardLayout): string => {
    // 針對字母按鍵進行映射
    physicalKey = physicalKey.toUpperCase();
    
    // 標準 QWERTY 鍵盤布局
    const qwertyLayout = {
      row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    };
    
    // 找出物理按鍵在標準鍵盤中的位置
    const physicalKeyPosition = findKeyPosition(qwertyLayout, physicalKey);
    
    // 如果找不到或不是字母按鍵，直接返回原始按鍵
    if (!physicalKeyPosition || !/^[A-Z]$/i.test(physicalKey)) {
      return physicalKey;
    }
    
    // 根據物理按鍵位置找出虛擬鍵盤上的字母
    if (physicalKeyPosition.row === 1) {
      return layout.row1[physicalKeyPosition.index] || physicalKey;
    } else if (physicalKeyPosition.row === 2) {
      return layout.row2[physicalKeyPosition.index] || physicalKey;
    } else if (physicalKeyPosition.row === 3) {
      return layout.row3[physicalKeyPosition.index] || physicalKey;
    }
    
    return physicalKey;
  }, [findKeyPosition]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isTestActive) return;
    
    // 獲取當前需要輸入的字符
    const expectedChar = currentText[currentPosition];
    
    // 將物理鍵盤按鍵映射到虛擬鍵盤上的字母（只處理字母按鍵）
    const physicalKey = event.key;
    const mappedKey = mapPhysicalKeyToVirtual(physicalKey, keyboardLayout);
    
    // 用於輸入比較的按鍵
    const pressedChar = mappedKey;
    
    // 儲存當前按鍵用於鍵盤高亮（顯示物理按鍵）
    setCurrentKey(physicalKey.toUpperCase());
    
    // 在第一次按鍵時啟動計時器
    if (currentPosition === 0 && startTime === null) {
      setStartTime(new Date());
      startTimer();
    }
    
    // 儲存已輸入的字符
    const newTypedChars = [...typedChars];
    newTypedChars[currentPosition] = pressedChar;
    setTypedChars(newTypedChars);
    
    // 計數按鍵
    setKeystrokes(prev => prev + 1);
    
    // 檢查輸入是否正確
    const isCorrect = pressedChar === expectedChar;
    
    if (isCorrect) {
      // 如果輸入正確，增加正確按鍵計數
      setCorrectKeystrokes(prev => prev + 1);
      
      // 移動到下一個字符
      setCurrentPosition(prev => prev + 1);
      
      // 檢查打字是否完成
      if (currentPosition + 1 >= currentText.length) {
        completeTest();
        return;
      }
    }
    
    // 更新準確度
    const newKeystrokes = keystrokes + 1;
    const newAccuracy = Math.floor((correctKeystrokes + (isCorrect ? 1 : 0)) / newKeystrokes * 100);
    setAccuracy(newAccuracy);
    
    // 更新 WPM（每5個字符為一個單詞）
    if (startTime) {
      const elapsedMinutes = (new Date().getTime() - startTime.getTime()) / 60000;
      if (elapsedMinutes > 0) {
        const newCorrectKeystrokes = correctKeystrokes + (isCorrect ? 1 : 0);
        setWpm(Math.floor((newCorrectKeystrokes / 5) / elapsedMinutes));
      }
    }
    
    // 在每次按鍵後打亂鍵盤布局
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
    typedChars,
    mapPhysicalKeyToVirtual
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
        <h1 className="text-3xl font-bold text-primary mb-2">混亂打字速度測試</h1>
        <p className="text-lg text-gray-600">在每次按鍵後鍵盤位置都會重新洗牌！你能保持準確度嗎？</p>
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
            開始測試
          </button>
          <button 
            className={`px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow transition ${!isTestActive && !testComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={resetTest}
            disabled={!isTestActive && !testComplete}
          >
            重置
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
        <p>混亂打字速度測試 | 挑戰你的打字技能，克服不斷變化的鍵盤佈局！</p>
      </footer>
    </div>
  );
};

export default TypingTest;