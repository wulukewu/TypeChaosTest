import { FC } from 'react';
import { KeyboardLayout } from '../types/typing';

interface KeyboardProps {
  keyboardLayout: KeyboardLayout;
  currentKey: string;
}

const Keyboard: FC<KeyboardProps> = ({ keyboardLayout, currentKey }) => {
  // Method to determine the CSS class for each key
  const getKeyClass = (key: string) => {
    // Check if this key is the current key
    const isCurrentKey = key === currentKey || 
                         (key === 'Space' && currentKey === ' ');
    
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
        {keyboardLayout.row1.map((key, index) => (
          <div 
            key={`row1-${index}`} 
            className={getKeyClass(key)}
          >
            {key}
          </div>
        ))}
      </div>

      {/* Row 3 (ASDF...) */}
      <div className="flex justify-center space-x-1 mb-1">
        {keyboardLayout.row2.map((key, index) => (
          <div 
            key={`row2-${index}`} 
            className={getKeyClass(key)}
          >
            {key}
          </div>
        ))}
      </div>

      {/* Row 4 (ZXCV...) */}
      <div className="flex justify-center space-x-1 mb-1">
        {keyboardLayout.row3.map((key, index) => (
          <div 
            key={`row3-${index}`} 
            className={getKeyClass(key)}
          >
            {key}
          </div>
        ))}
      </div>

      {/* Row 5 (Space) */}
      <div className="flex justify-center mt-1">
        <div 
          className={getKeyClass(' ')}
          style={{ width: '16rem' }} // w-64 equivalent
        >
          Space
        </div>
      </div>

      {/* Key legend */}
      <div className="mt-4 pt-2 border-t border-gray-200 flex flex-wrap justify-center items-center text-xs text-gray-500 gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-neutral rounded mr-1"></div>
          <span>Normal</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary rounded mr-1"></div>
          <span>Current Key</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-correct rounded mr-1"></div>
          <span>Correct</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-destructive rounded mr-1"></div>
          <span>Incorrect</span>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;