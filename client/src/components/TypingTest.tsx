import { useState, useEffect, useRef, useCallback } from "react";
import Keyboard from "./Keyboard";
import StatsBar from "./StatsBar";
import ResultsCard from "./ResultsCard";
import { typingTexts } from "../constants/typingTexts";
import { scrambleKeyboard } from "../utils/keyboard";
import { KeyboardLayout } from "../types/typing";
import { formatTime } from "../utils/typingStats";

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
  const [currentKey, setCurrentKey] = useState("");
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Start the timer for the test
  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Define a reference point for time calculation
    const timeStarted = new Date();
    setStartTime(timeStarted);

    timerIntervalRef.current = window.setInterval(() => {
      if (!isTestActive || testComplete) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        return;
      }

      // Update elapsed time directly from the reference point
      const newElapsedTime = new Date().getTime() - timeStarted.getTime();
      setElapsedTime(newElapsedTime);

      // Update WPM calculation
      const elapsedMinutes = newElapsedTime / 60000;
      if (elapsedMinutes > 0) {
        setWpm(Math.floor(correctKeystrokes / 5 / elapsedMinutes));
      }
    }, 100); // Update more frequently for smoother time display
  }, [correctKeystrokes, isTestActive, testComplete]);

  // Start timer when test becomes active
  useEffect(() => {
    if (isTestActive && !testComplete) {
      startTimer();
    }
  }, [isTestActive, testComplete, startTimer]);

  // Initial keyboard layout
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>({
    row1: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    row2: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    row3: ["Z", "X", "C", "V", "B", "N", "M"],
  });

  // Flag to track if keyboard has been scrambled yet
  const [keyboardScrambled, setKeyboardScrambled] = useState<boolean>(false);

  // Current text and progress calculations
  const currentText = typingTexts[currentTextIndex].split("");
  const progress = (currentPosition / currentText.length) * 100;

  // Reset and initialize the test
  const resetTest = () => {
    // Reset everything first
    setCurrentPosition(0);
    setKeystrokes(0);
    setCorrectKeystrokes(0);
    setAccuracy(100);
    setWpm(0);
    setStartTime(null);
    setTestComplete(false);
    setElapsedTime(0);
    setTypedChars([]);
    setPreviousLayouts([]);
    setCorrectedChars([]);

    // Reset keyboard to normal layout
    setKeyboardLayout({
      row1: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      row2: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      row3: ["Z", "X", "C", "V", "B", "N", "M"],
    });

    // Stop any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Reset test status but leave it inactive until first keystroke
    setIsTestActive(false);
    setKeyboardScrambled(false);

    // Focus the window to capture keystrokes
    window.focus();
  };

  // Start the test manually
  const startTest = () => {
    resetTest();
    setIsTestActive(true);
  };

  // Auto-start test when keypress is detected
  const autoStartTest = useCallback(() => {
    if (!isTestActive) {
      setIsTestActive(true);
    }
  }, [isTestActive]);

  // Complete the test
  const completeTest = () => {
    setIsTestActive(false);
    setTestComplete(true);

    // Stop timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Find the position of a key in the keyboard layout
  const findKeyPosition = useCallback(
    (
      layout: KeyboardLayout,
      char: string
    ): { row: number; index: number } | null => {
      char = char.toUpperCase();

      // Check row 1
      const row1Index = layout.row1.indexOf(char);
      if (row1Index !== -1) {
        return { row: 1, index: row1Index };
      }

      // Check row 2
      const row2Index = layout.row2.indexOf(char);
      if (row2Index !== -1) {
        return { row: 2, index: row2Index };
      }

      // Check row 3
      const row3Index = layout.row3.indexOf(char);
      if (row3Index !== -1) {
        return { row: 3, index: row3Index };
      }

      return null;
    },
    []
  );

  // Map physical keyboard key to virtual keyboard letter
  const mapPhysicalKeyToVirtual = useCallback(
    (physicalKey: string, layout: KeyboardLayout): string => {
      // Convert to uppercase for position finding
      const upperPhysicalKey = physicalKey.toUpperCase();

      // Standard QWERTY keyboard layout
      const qwertyLayout = {
        row1: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        row2: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        row3: ["Z", "X", "C", "V", "B", "N", "M"],
      };

      // Find position of physical key on standard keyboard
      const physicalKeyPosition = findKeyPosition(
        qwertyLayout,
        upperPhysicalKey
      );

      // If key not found or not a letter key, return original key
      if (!physicalKeyPosition || !/^[A-Z]$/i.test(upperPhysicalKey)) {
        return physicalKey;
      }

      // Get the letter at the same position in the scrambled layout
      let virtualKey = "";
      if (physicalKeyPosition.row === 1) {
        virtualKey = layout.row1[physicalKeyPosition.index] || upperPhysicalKey;
      } else if (physicalKeyPosition.row === 2) {
        virtualKey = layout.row2[physicalKeyPosition.index] || upperPhysicalKey;
      } else if (physicalKeyPosition.row === 3) {
        virtualKey = layout.row3[physicalKeyPosition.index] || upperPhysicalKey;
      }

      // Apply case based on shift state
      if (isShiftPressed) {
        return virtualKey.toUpperCase();
      } else {
        return virtualKey.toLowerCase();
      }
    },
    [findKeyPosition, isShiftPressed]
  );

  // Process key press events
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isTestActive) return;

      // Get the expected character
      const expectedChar = currentText[currentPosition];

      // Get the physical key pressed
      const physicalKey = event.key;

      // Check if this is a typing character (a-z, punctuation)
      const isTypingChar = /^[a-zA-Z,.\s]$/i.test(physicalKey);

      // Don't process control keys
      if (!isTypingChar) {
        return;
      }

      // Map physical keyboard key to virtual keyboard letter
      const mappedKey = mapPhysicalKeyToVirtual(physicalKey, keyboardLayout);

      // Key used for input comparison
      const pressedChar = mappedKey;

      // Store current key for keyboard highlighting (show physical key)
      setCurrentKey(physicalKey.toUpperCase());

      // Start timer on first keystroke
      if (currentPosition === 0 && startTime === null) {
        setStartTime(new Date());
        startTimer();
      }

      // Store typed character
      const newTypedChars = [...typedChars];
      newTypedChars[currentPosition] = pressedChar;
      setTypedChars(newTypedChars);

      // Count keystroke
      setKeystrokes((prev) => prev + 1);

      // Check if input is correct
      const isCorrect = pressedChar === expectedChar;

      // If correct, increment correct keystroke count
      if (isCorrect) {
        setCorrectKeystrokes((prev) => prev + 1);
      }

      // Always move to next character regardless of correctness
      setCurrentPosition((prev) => prev + 1);

      // Check if typing is complete
      if (currentPosition + 1 >= currentText.length) {
        completeTest();
        return;
      }

      // Update accuracy
      const newKeystrokes = keystrokes + 1;
      const newAccuracy = Math.floor(
        ((correctKeystrokes + (isCorrect ? 1 : 0)) / newKeystrokes) * 100
      );
      setAccuracy(newAccuracy);

      // Update WPM (5 characters = 1 word)
      if (startTime) {
        const elapsedMinutes =
          (new Date().getTime() - startTime.getTime()) / 60000;
        if (elapsedMinutes > 0) {
          const newCorrectKeystrokes = correctKeystrokes + (isCorrect ? 1 : 0);
          setWpm(Math.floor(newCorrectKeystrokes / 5 / elapsedMinutes));
        }
      }

      // Only scramble keyboard layout after typing characters are pressed
      if (isTypingChar) {
        // Set flag to indicate keyboard has been scrambled at least once
        if (!keyboardScrambled) {
          setKeyboardScrambled(true);
        }

        // Store current layout before scrambling
        setPreviousLayouts((prev) => [...prev, { ...keyboardLayout }]);

        // Scramble the keyboard
        const newLayout = scrambleKeyboard(keyboardLayout);
        setKeyboardLayout(newLayout);
      }
    },
    [
      correctKeystrokes,
      currentPosition,
      currentText,
      isTestActive,
      keyboardLayout,
      keystrokes,
      startTime,
      startTimer,
      typedChars,
      mapPhysicalKeyToVirtual,
      keyboardScrambled,
      findKeyPosition,
    ]
  );

  // Function to update keyboard highlight showing the next key to press
  const updateNextKeyHighlight = useCallback(() => {
    // Get the next expected character
    const nextExpectedChar = currentText[currentPosition];
    if (!nextExpectedChar) return;

    // Find the key in the scrambled layout that shows this character
    // We need to find which physical key would type this virtual character
    const qwertyLayout = {
      row1: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      row2: ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
      row3: ["Z", "X", "C", "V", "B", "N", "M"],
    };

    // Find the virtual key we need to type
    const nextExpectedCharUpper = nextExpectedChar.toUpperCase();

    // Special handling for space character
    if (nextExpectedChar === " ") {
      setCurrentKey("SPACE");
      return;
    }

    // Find which physical key will type this character in current layout
    let foundPhysicalKey = "";
    const findKey = (row: string[], qwertyRow: string[]) => {
      const index = row.findIndex(
        (key) => key.toUpperCase() === nextExpectedCharUpper
      );
      if (index !== -1) {
        foundPhysicalKey = qwertyRow[index];
        return true;
      }
      return false;
    };

    // Search through each row
    if (!findKey(keyboardLayout.row1, qwertyLayout.row1)) {
      if (!findKey(keyboardLayout.row2, qwertyLayout.row2)) {
        findKey(keyboardLayout.row3, qwertyLayout.row3);
      }
    }

    // If we found the key, highlight it
    if (foundPhysicalKey) {
      setCurrentKey(foundPhysicalKey);
    }
  }, [currentPosition, currentText, keyboardLayout]);

  // Run the highlight update when the component first mounts or when cursor position changes
  useEffect(() => {
    updateNextKeyHighlight();
  }, [updateNextKeyHighlight, currentPosition, keyboardLayout]);

  // Store previous keyboard layouts to enable backspace
  const [previousLayouts, setPreviousLayouts] = useState<KeyboardLayout[]>([]);
  const [correctedChars, setCorrectedChars] = useState<boolean[]>([]);

  // Handle key down events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Auto-start test when a regular key is pressed
      if (!isTestActive && !testComplete) {
        const isRegularKey = /^[a-zA-Z0-9]$/i.test(event.key);
        if (isRegularKey) {
          // Start test with a clean state
          setIsTestActive(true);

          // Start timer immediately when test starts
          if (startTime === null) {
            setStartTime(new Date());
            startTimer();
          }
        }
      }

      // Don't process further if test isn't active
      if (!isTestActive) return;

      // Track shift key state
      if (event.key === "Shift") {
        setIsShiftPressed(true);
        return; // Don't process Shift key as input
      }

      // Also update shift state from the shiftKey property
      if (event.shiftKey) {
        setIsShiftPressed(true);
      }

      // Handle backspace
      if (event.key === "Backspace") {
        // Only allow backspace if we're not at the beginning
        if (currentPosition > 0) {
          // Move cursor back
          setCurrentPosition((prev) => prev - 1);

          // Mark this position as corrected if it was initially wrong and is now being fixed
          const expectedChar = currentText[currentPosition - 1];
          const typedChar = typedChars[currentPosition - 1];
          const wasWrong = typedChar !== expectedChar;

          if (wasWrong) {
            const newCorrected = [...correctedChars];
            newCorrected[currentPosition - 1] = true;
            setCorrectedChars(newCorrected);
          }

          // Restore previous keyboard layout if available
          if (previousLayouts.length > 0) {
            const prevLayouts = [...previousLayouts];
            const lastLayout = prevLayouts.pop();
            if (lastLayout) {
              setKeyboardLayout(lastLayout);
              setPreviousLayouts(prevLayouts);
            }
          }
        }

        // Don't process further
        return;
      }

      // Process regular keypress
      handleKeyPress(event);
    },
    [
      handleKeyPress,
      isTestActive,
      testComplete,
      currentPosition,
      currentText,
      typedChars,
      previousLayouts,
    ]
  );

  // Handle key up events
  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // Track shift key state
    if (event.key === "Shift") {
      setIsShiftPressed(false);
    }

    // Check shift key state
    if (!event.shiftKey) {
      setIsShiftPressed(false);
    }
  }, []);

  // Set up and clean up event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Chaotic Typing Speed Test
        </h1>
        <p className="text-lg text-gray-600">
          Type accurately as the keyboard scrambles after each keystroke!
        </p>
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
                    ? "character-current"
                    : index < currentPosition &&
                      typedChars[index] === char &&
                      correctedChars[index]
                    ? "character-corrected"
                    : index < currentPosition && typedChars[index] === char
                    ? "character-correct"
                    : index < currentPosition && typedChars[index] !== char
                    ? "character-incorrect"
                    : ""
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
            className={`px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow transition ${
              isTestActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={startTest}
            disabled={isTestActive}
          >
            Start Test
          </button>
          <button
            className={`px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md shadow transition ${
              !isTestActive && !testComplete && keystrokes === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={resetTest}
            disabled={!isTestActive && !testComplete && keystrokes === 0}
          >
            Reset
          </button>
        </div>

        {/* Keyboard Visualization or Results Card */}
        {!testComplete ? (
          <Keyboard
            keyboardLayout={keyboardLayout}
            currentKey={currentKey}
            virtualKey={
              mapPhysicalKeyToVirtual(
                currentKey.toLowerCase(),
                keyboardLayout
              ) || ""
            }
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
        <p>
          Chaotic Typing Speed Test | Challenge your typing skills with a
          constantly scrambling keyboard!
        </p>
      </footer>
    </div>
  );
};

export default TypingTest;
