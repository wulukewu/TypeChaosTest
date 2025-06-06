import { FC } from 'react';

interface StatsBarProps {
  time: string;
  wpm: number;
  accuracy: number;
  keystrokes: number;
}

const StatsBar: FC<StatsBarProps> = ({ time, wpm, accuracy, keystrokes }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 flex flex-wrap justify-between items-center">
      <div className="stat-box text-center px-4 py-2 rounded-md bg-neutral">
        <p className="text-sm text-gray-500">Time</p>
        <p className="text-xl font-mono font-bold">{time}</p>
      </div>
      <div className="stat-box text-center px-4 py-2 rounded-md bg-neutral">
        <p className="text-sm text-gray-500">WPM</p>
        <p className="text-xl font-mono font-bold">{wpm}</p>
      </div>
      <div className="stat-box text-center px-4 py-2 rounded-md bg-neutral">
        <p className="text-sm text-gray-500">Accuracy</p>
        <p className="text-xl font-mono font-bold">{accuracy}%</p>
      </div>
      <div className="stat-box text-center px-4 py-2 rounded-md bg-neutral">
        <p className="text-sm text-gray-500">Keystrokes</p>
        <p className="text-xl font-mono font-bold">{keystrokes}</p>
      </div>
    </div>
  );
};

export default StatsBar;