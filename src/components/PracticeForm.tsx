import React, { useState, useEffect } from 'react';
import { PracticeSettings } from '../types';
import { Music } from 'lucide-react';

interface PracticeFormProps {
  onStart: (settings: PracticeSettings) => void;
  previousSettings?: PracticeSettings;
}

export function PracticeForm({ onStart, previousSettings }: PracticeFormProps) {
  // 分别存储分钟和秒钟的状态
  const [timeInputs, setTimeInputs] = useState({
    startMin: previousSettings ? Math.floor(previousSettings.startTime / 60).toString() : '0',
    startSec: previousSettings ? (previousSettings.startTime % 60).toString().padStart(2, '0') : '00',
    endMin: previousSettings ? Math.floor(previousSettings.endTime / 60).toString() : '0',
    endSec: previousSettings ? (previousSettings.endTime % 60).toString().padStart(2, '0') : '00',
  });

  const [settings, setSettings] = useState<PracticeSettings>({
    videoUrl: previousSettings?.videoUrl || '',
    startTime: previousSettings?.startTime || 0,
    endTime: previousSettings?.endTime || 0,
  });

  useEffect(() => {
    if (previousSettings) {
      setTimeInputs({
        startMin: Math.floor(previousSettings.startTime / 60).toString(),
        startSec: (previousSettings.startTime % 60).toString().padStart(2, '0'),
        endMin: Math.floor(previousSettings.endTime / 60).toString(),
        endSec: (previousSettings.endTime % 60).toString().padStart(2, '0'),
      });
      setSettings(previousSettings);
    }
  }, [previousSettings]);

  // 处理时间输入变化
  const handleTimeChange = (type: 'startMin' | 'startSec' | 'endMin' | 'endSec', value: string) => {
    // 验证输入
    if (type.endsWith('Min')) {
      if (!/^\d{0,2}$/.test(value)) return;
    } else {
      if (!/^\d{0,2}$/.test(value)) return;
    }

    // 更新时间输入状态
    setTimeInputs(prev => ({
      ...prev,
      [type]: value
    }));

    // 计算总秒数并更新settings
    const newTimeInputs = { ...timeInputs, [type]: value };
    if (type.startsWith('start')) {
      const totalSeconds = parseInt(newTimeInputs.startMin || '0') * 60 + parseInt(newTimeInputs.startSec || '0');
      setSettings(prev => ({ ...prev, startTime: totalSeconds }));
    } else {
      const totalSeconds = parseInt(newTimeInputs.endMin || '0') * 60 + parseInt(newTimeInputs.endSec || '0');
      setSettings(prev => ({ ...prev, endTime: totalSeconds }));
    }
  };

  const processBilibiliUrl = async (url: string) => {
    try {
      const bvMatch = url.match(/BV\w{10}/);
      if (!bvMatch) throw new Error('无效的B站链接');
      
      const bvId = bvMatch[0];
      const apiUrl = `/api/bili/api?id=${bvId}`;
      
      // 发送请求获取视频直链
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('获取视频链接失败');
      }
      
      // 获取最终的URL
      const finalUrl = response.url;
      console.log("获取到的视频URL:", finalUrl);
      
      // 验证URL是否为有效的视频链接
      if (!finalUrl.match(/\.(mp4|m4s|flv)($|\?)/i)) {
        throw new Error('获取到的不是有效的视频链接');
      }
      
      return finalUrl;
    } catch (error) {
      console.error('处理B站链接失败:', error);
      alert('处理视频链接失败，请确保输入了正确的B站视频链接');
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证时间输入
    const startMin = parseInt(timeInputs.startMin || '0');
    const startSec = parseInt(timeInputs.startSec || '0');
    const endMin = parseInt(timeInputs.endMin || '0');
    const endSec = parseInt(timeInputs.endSec || '0');

    if (startSec >= 60 || endSec >= 60) {
      alert('秒数必须小于60');
      return;
    }

    // 处理视频URL
    if (settings.videoUrl.includes('bilibili.com')) {
      const processedUrl = await processBilibiliUrl(settings.videoUrl);
      if (!processedUrl) return;
      onStart({
        ...settings,
        videoUrl: processedUrl
      });
    } else {
      onStart(settings);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="flex items-center justify-center mb-8">
        <Music className="w-12 h-12 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800 ml-3">歌唱练习</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            视频链接
          </label>
          <input
            type="url"
            id="videoUrl"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={settings.videoUrl}
            onChange={(e) => setSettings({ ...settings, videoUrl: e.target.value })}
            placeholder="输入视频URL"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              开始时间
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={timeInputs.startMin}
                  onChange={(e) => handleTimeChange('startMin', e.target.value)}
                  placeholder="分"
                  maxLength={2}
                />
              </div>
              <span className="flex items-center">:</span>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={timeInputs.startSec}
                  onChange={(e) => handleTimeChange('startSec', e.target.value)}
                  placeholder="秒"
                  maxLength={2}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              结束时间
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={timeInputs.endMin}
                  onChange={(e) => handleTimeChange('endMin', e.target.value)}
                  placeholder="分"
                  maxLength={2}
                />
              </div>
              <span className="flex items-center">:</span>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={timeInputs.endSec}
                  onChange={(e) => handleTimeChange('endSec', e.target.value)}
                  placeholder="秒"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          开始练习
        </button>
      </form>
    </div>
  );
}