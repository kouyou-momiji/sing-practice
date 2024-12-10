import { useState } from 'react';
import { PracticeForm } from './components/PracticeForm';
import { VideoPlayer } from './components/VideoPlayer';
import { PracticeSettings } from './types';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedSettings, setSavedSettings] = useState<PracticeSettings>({
    videoUrl: '',
    startTime: 0,
    endTime: 0,
  });

  const handleStart = (settings: PracticeSettings) => {
    setSavedSettings(settings);
    setIsPlaying(true);
  };

  const handleBack = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12">
        {isPlaying ? (
          <VideoPlayer 
            settings={savedSettings} 
            onBack={handleBack} 
          />
        ) : (
          <PracticeForm 
            onStart={handleStart}
            previousSettings={savedSettings}
          />
        )}
      </div>
    </div>
  );
}

export default App;