import { FC } from 'react';
import { KeyboardLayout } from '../types/typing';

interface KeyboardProps {
  keyboardLayout: KeyboardLayout;
  currentKey: string;
}

// Standard QWERTY keyboard layout for physical key positions
const standardLayout = {
  row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
};

const Keyboard: FC<KeyboardProps> = ({ keyboardLayout, currentKey }) => {
  // Method to determine CSS class for each key
  const getKeyClass = (virtualKey: string, physicalKey: string) => {
    // Check if this key is currently pressed
    const isCurrentKey = physicalKey === currentKey || 
                         (physicalKey === 'Space' && currentKey === ' ');
    
    let className = 'key w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all animate-scramble';
    
    if (isCurrentKey) {
      className += ' bg-primary text-white';
    } else {
      className += ' bg-neutral';
    }
    
    return className;
  };

  return (
    <div className="keyboard-container w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-4 transition-all duration-300">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-500">Press the key in the same position on your physical keyboard</p>
      </div>
      
      {/* Row 1 (numbers) */}
      <div className="flex justify-center space-x-1 mb-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div 
            key={`num-${i}`} 
            className="key w-10 h-10 md:w-12 md:h-12 bg-neutral rounded flex items-center justify-center text-sm font-mono shadow cursor-default transition-all"
          >
            {i === 9 ? 0 : i + 1}
          </div>
        ))}
      </div>
      
      {/* Row 2 (QWERTY...) */}
      <div className="flex justify-center space-x-1 mb-1">
        {keyboardLayout.row1.map((virtualKey, index) => {
          const physicalKey = standardLayout.row1[index];
          return (
            <div 
              key={`row1-${index}`} 
              className={getKeyClass(virtualKey, physicalKey)}
            >
              {virtualKey}
            </div>
          );
        })}
      </div>

      {/* Row 3 (ASDF...) */}
      <div className="flex justify-center space-x-1 mb-1">
        {keyboardLayout.row2.map((virtualKey, index) => {
          const physicalKey = standardLayout.row2[index];
          return (
            <div 
              key={`row2-${index}`} 
              className={getKeyClass(virtualKey, physicalKey)}
            >
              {virtualKey}
            </div>
          );
        })}
      </div>

      {/* Row 4 (ZXCV...) */}
      <div className="flex justify-center space-x-1 mb-1">
        {keyboardLayout.row3.map((virtualKey, index) => {
          const physicalKey = standardLayout.row3[index];
          return (
            <div 
              key={`row3-${index}`} 
              className={getKeyClass(virtualKey, physicalKey)}
            >
              {virtualKey}
            </div>
          );
        })}
      </div>

      {/* Row 5 (Space) */}
      <div className="flex justify-center mt-1">
        <div 
          className={getKeyClass(' ', 'Space')}
          style={{ width: '16rem' }} // w-64 equivalent
        >
          Space
        </div>
      </div>

      {/* Key legend */}
      <div className="mt-4 pt-2 border-t border-gray-200 flex flex-wrap justify-center items-center text-xs text-gray-500 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-neutral rounded mr-1"></div>
          <span>Normal key</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary rounded mr-1"></div>
          <span>Current key</span>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;