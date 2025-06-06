import { FC } from 'react';

interface ResultsCardProps {
  wpm: number;
  accuracy: number;
  time: string;
  chars: number;
  onTryAgain: () => void;
}

const ResultsCard: FC<ResultsCardProps> = ({ 
  wpm, 
  accuracy, 
  time, 
  chars, 
  onTryAgain 
}) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-4">
      <h2 className="text-2xl font-bold text-center mb-4">Test Results</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-box text-center p-4 rounded-md bg-neutral">
          <p className="text-sm text-gray-500">WPM</p>
          <p className="text-3xl font-mono font-bold text-primary">{wpm}</p>
        </div>
        <div className="stat-box text-center p-4 rounded-md bg-neutral">
          <p className="text-sm text-gray-500">Accuracy</p>
          <p className="text-3xl font-mono font-bold text-primary">{accuracy}%</p>
        </div>
        <div className="stat-box text-center p-4 rounded-md bg-neutral">
          <p className="text-sm text-gray-500">Time</p>
          <p className="text-3xl font-mono font-bold text-primary">{time}</p>
        </div>
        <div className="stat-box text-center p-4 rounded-md bg-neutral">
          <p className="text-sm text-gray-500">Characters</p>
          <p className="text-3xl font-mono font-bold text-primary">{chars}</p>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button 
          className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-md shadow transition"
          onClick={onTryAgain}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ResultsCard;