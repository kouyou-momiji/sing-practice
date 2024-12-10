import React, { useEffect, useRef } from 'react';
import { PracticeSettings } from '../types';

interface VideoPlayerProps {
  settings: PracticeSettings;
  onBack: () => void;
}

export function VideoPlayer({ settings, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= settings.endTime) {
        video.currentTime = settings.startTime;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.currentTime = settings.startTime;
    video.play();

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [settings]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto p-6">
      <video
        ref={videoRef}
        src={settings.videoUrl}
        className="w-full rounded-lg shadow-lg"
        controls
      />
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          返回设置
        </button>
        <div className="text-gray-600">
          循环区间: {settings.startTime}s - {settings.endTime}s
        </div>
      </div>
    </div>
  );
}