// app/solo/page.tsx
'use client'; // Required for interactive elements

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function SoloStudyPage() {
  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  
  // Music player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background states
  const [background, setBackground] = useState('library'); // 'library' | 'cafe' | 'nature'

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      // Timer completed
      setIsRunning(false);
      // Play completion sound or notification
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // Music player logic
  useEffect(() => {
    if (audioRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
      audioRef.current.volume = volume;
    }
  }, [isPlaying, volume]);

  // Set timer mode
  const setTimerMode = (newMode: string) => {
    setIsRunning(false);
    switch(newMode) {
      case 'focus':
        setTime(25 * 60);
        break;
      case 'shortBreak':
        setTime(5 * 60);
        break;
      case 'longBreak':
        setTime(15 * 60);
        break;
      default:
        setTime(25 * 60);
    }
    setMode(newMode);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 
      ${background === 'library' ? 'bg-[url("/library-bg.jpg")]' : 
        background === 'cafe' ? 'bg-[url("/cafe-bg.jpg")]' : 
        'bg-[url("/nature-bg.jpg")]'}`}>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        loop 
        src="/lofi-music.mp3" 
      />

      <Head>
        <title>Study Solo | Focus Timer</title>
      </Head>

      {/* Main container */}
      <div className="backdrop-blur-sm bg-black/30 p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Timer display */}
        <div className="text-center mb-8">
          <div className="text-7xl font-bold text-white mb-4">
            {formatTime(time)}
          </div>
          
          {/* Timer controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className="px-6 py-2 bg-white/90 text-gray-900 rounded-full font-medium hover:bg-white transition"
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={() => {
                setIsRunning(false);
                setTimerMode(mode);
              }}
              className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition"
            >
              Reset
            </button>
          </div>
          
          {/* Timer mode selector */}
          <div className="flex justify-center gap-2 mb-8">
            {['focus', 'shortBreak', 'longBreak'].map((m) => (
              <button
                key={m}
                onClick={() => setTimerMode(m)}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  mode === m 
                    ? 'bg-white text-gray-900' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </button>
            ))}
          </div>
        </div>

        {/* Music player */}
        <div className="bg-white/10 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-white font-medium">Lo-fi Study Beats</div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-full hover:bg-white/30"
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        {/* Background selector */}
        <div className="flex gap-2 justify-center">
          {['library', 'cafe', 'nature'].map((bg) => (
            <button
              key={bg}
              onClick={() => setBackground(bg)}
              className={`w-10 h-10 rounded-md overflow-hidden ${
                background === bg ? 'ring-2 ring-white' : ''
              }`}
            >
              <div className={`w-full h-full ${
                bg === 'library' ? 'bg-[url("/library-thumb.jpg")]' :
                bg === 'cafe' ? 'bg-[url("/cafe-thumb.jpg")]' :
                'bg-[url("/nature-thumb.jpg")]'
              } bg-cover`} />
            </button>
          ))}
        </div>
      </div>

      {/* Stats/achievements could be added here */}
    </div>
  );
}