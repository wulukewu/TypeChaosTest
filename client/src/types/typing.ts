export interface KeyboardLayout {
  row1: string[];
  row2: string[];
  row3: string[];
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  keystrokes: number;
  correctKeystrokes: number;
}
