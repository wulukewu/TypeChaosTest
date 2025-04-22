import { KeyboardLayout } from '../types/typing';

/**
 * Scrambles the keyboard layout by randomly rearranging all keys
 * @param currentLayout The current keyboard layout to scramble
 * @returns A new scrambled keyboard layout
 */
export function scrambleKeyboard(currentLayout: KeyboardLayout): KeyboardLayout {
  // Extract all keys into a flat array
  const allKeys = [
    ...currentLayout.row1,
    ...currentLayout.row2,
    ...currentLayout.row3
  ];
  
  // Fisher-Yates shuffle algorithm
  for (let i = allKeys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allKeys[i], allKeys[j]] = [allKeys[j], allKeys[i]];
  }
  
  // Create new keyboard layout with shuffled keys
  return {
    row1: allKeys.slice(0, 10),
    row2: allKeys.slice(10, 19),
    row3: allKeys.slice(19)
  };
}

/**
 * Resets the keyboard layout to the standard QWERTY layout
 * @returns A keyboard layout with the standard QWERTY arrangement
 */
export function resetKeyboard(): KeyboardLayout {
  return {
    row1: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    row2: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    row3: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  };
}
