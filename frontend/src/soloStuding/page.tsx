/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// Background images - using your exact paths
import cozyCafe from './backgrounds/Cafe/cozyCafe.jpg';
import cozyCafe2 from './backgrounds/Cafe/cozyCafe2.jpg';
import animePic1 from './backgrounds/anime/animePic1.jpg';
import animePic2 from './backgrounds/anime/animePic2.jpg';

// Audio files - using your exact paths
import jazz1 from './audio/Jazz1.mp3';
import jazz2 from './audio/jazz2.mp3';
import lofi1 from './audio/lofi1.mp3';
import lofi2 from './audio/lofi2.mp3';

// UI Components - using your exact paths
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

export default function SoloStudyPage() {
  // State management
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(50 * 60);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(lofi1);
  const [showControls, setShowControls] = useState({
    background: false,
    audio: false
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  // Assets
  const backgrounds = [
    { id: 'cafe1', name: 'Cozy Cafe', path: cozyCafe.src },
    { id: 'cafe2', name: 'Urban Cafe', path: cozyCafe2.src },
    { id: 'anime1', name: 'Anime 1', path: animePic1.src },
    { id: 'anime2', name: 'Anime 2', path: animePic2.src },
  ];
  const [currentBg, setCurrentBg] = useState(backgrounds[0]);

  const tracks = [
    { id: 'lofi1', name: 'Lofi Beats', path: lofi1 },
    { id: 'lofi2', name: 'Lofi Chill', path: lofi2 },
    { id: 'jazz1', name: 'Jazz Relax', path: jazz1 },
    { id: 'jazz2', name: 'Jazz Vibes', path: jazz2 },
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // Audio control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error('Playback failed:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [volume, isPlaying, currentTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    if (newMode === 'focus') setTime(50 * 60);
    if (newMode === 'shortBreak') setTime(10 * 60);
    if (newMode === 'longBreak') setTime(25 * 60);
    setIsRunning(false);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const toggleControl = (control: 'background' | 'audio') => {
    setShowControls(prev => ({
      ...prev,
      [control]: !prev[control],
      [control === 'background' ? 'audio' : 'background']: false
    }));
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${currentBg?.path})`,
        transition: 'background-image 0.5s ease-in-out'
      }}
    >
      <Head>
        <title>Focus Flow | Solo Study</title>
      </Head>

      <audio ref={audioRef} src={currentTrack} loop />

      {/* Main content container */}
      <div className="absolute inset-0 p-6 flex flex-col">
        {/* Header row with control icons */}
        <div className="flex justify-end gap-4 mb-6">
          {/* Background selector */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => toggleControl('background')}
              className="bg-white/90 hover:bg-white shadow-md w-12 h-12"
            >
              <span className="text-xl">🌄</span>
            </Button>
            {showControls.background && (
              <Card className="absolute right-0 mt-2 w-64 bg-white shadow-lg z-50">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Background Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => {
                        setCurrentBg(bg);
                        setShowControls(prev => ({ ...prev, background: false }));
                      }}
                      className={`aspect-video rounded overflow-hidden border ${currentBg?.id === bg.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <img 
                        src={bg.path} 
                        alt={bg.name} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Audio selector */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => toggleControl('audio')}
              className="bg-white/90 hover:bg-white shadow-md w-12 h-12"
            >
              <span className="text-xl">🎵</span>
            </Button>
            {showControls.audio && (
              <Card className="absolute right-0 mt-2 w-64 bg-white shadow-lg z-50">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
                    Audio Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select 
                    value={currentTrack} 
                    onValueChange={(value) => {
                      setCurrentTrack(value);
                      setIsPlaying(true);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select track" />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks.map((track) => (
                        <SelectItem key={track.id} value={track.path}>
                          {track.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={isPlaying ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 gap-6 overflow-auto">
          {/* Left sidebar - Timer and Goals */}
          <div className="flex flex-col gap-6 w-full lg:w-80">
            {/* Timer Card */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Personal Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-5xl font-bold text-center py-4 font-mono">
                  {formatTime(time)}
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={() => setIsRunning(!isRunning)}
                    className="w-full"
                    variant={isRunning ? 'secondary' : 'default'}
                  >
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-center">
                {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
                  <Button
                    key={m}
                    variant={mode === m ? 'default' : 'outline'}
                    onClick={() => switchMode(m)}
                  >
                    {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </Button>
                ))}
              </CardFooter>
            </Card>

            {/* Goals Card */}
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Setable Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    value={newGoal} 
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Type a goal"
                    onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                  />
                  <Button onClick={addGoal}>Add</Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {goals.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No goals set yet
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {goals.map((goal, idx) => (
                        <li key={idx} className="flex items-center justify-between p-2 border-b">
                          <span>{goal}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                          >
                            ×
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        
      </div>
    </div>
  );
}