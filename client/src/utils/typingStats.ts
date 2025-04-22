/**
 * Calculate Words Per Minute (WPM) from keystrokes and elapsed time
 * @param correctChars Number of correctly typed characters
 * @param elapsedTimeMs Time elapsed in milliseconds
 * @returns Calculated WPM
 */
export function calculateWPM(correctChars: number, elapsedTimeMs: number): number {
  // Convert milliseconds to minutes
  const elapsedMinutes = elapsedTimeMs / 60000;
  
  // Standard formula: (characters / 5) / minutes
  // Using 5 characters as the standard word length
  if (elapsedMinutes <= 0) return 0;
  
  return Math.floor((correctChars / 5) / elapsedMinutes);
}

/**
 * Calculate typing accuracy percentage
 * @param correctChars Number of correctly typed characters
 * @param totalKeystrokes Total number of keystrokes
 * @returns Accuracy percentage (0-100)
 */
export function calculateAccuracy(correctChars: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  
  return Math.floor((correctChars / totalKeystrokes) * 100);
}

/**
 * Format elapsed time in milliseconds to MM:SS display format
 * @param timeMs Time in milliseconds
 * @returns Formatted time string (e.g., "1:23")
 */
export function formatTime(timeMs: number): string {
  const minutes = Math.floor(timeMs / 60000);
  const seconds = Math.floor((timeMs % 60000) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
