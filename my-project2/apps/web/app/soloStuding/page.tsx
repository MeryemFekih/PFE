/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

// Background images
import cozyCafe from './backgrounds/Cafe/cozyCafe.jpg';
import cozyCafe2 from './backgrounds/Cafe/cozyCafe2.jpg';
import cozyCafe3 from './backgrounds/Cafe/cozyCafe3.png';
import animePic1 from './backgrounds/anime/animePic1.jpg';
import animePic2 from './backgrounds/anime/animePic2.jpg';

// Audio files
import jazz1 from './audio/Jazz1.mp3';
import jazz2 from './audio/jazz2.mp3';
import lofi1 from './audio/lofi1.mp3';
import lofi2 from './audio/lofi2.mp3';

// UI Components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

export default function SoloStudyPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(50 * 60);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [goals, setGoals] = useState<{ text: string; done: boolean }[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(lofi1);
  const [showControls, setShowControls] = useState({ background: false, audio: false });
  const audioRef = useRef<HTMLAudioElement>(null);

  const backgrounds = [
    { id: 'cafe1', name: 'Cozy Cafe', path: cozyCafe.src },
    { id: 'cafe2', name: 'Urban Cafe', path: cozyCafe2.src },
    { id: 'cafe3', name: 'Animated Cafe', path: cozyCafe3.src },
    { id: 'anime1', name: 'Anime 1', path: animePic1.src },
    { id: 'anime2', name: 'Anime 2', path: animePic2.src },
  ];
  const [currentBg, setCurrentBg] = useState(backgrounds[4]);

  const tracks = [
    { id: 'lofi1', name: 'Lofi Beats', path: lofi1 },
    { id: 'lofi2', name: 'Lofi Chill', path: lofi2 },
    { id: 'jazz1', name: 'Jazz Relax', path: jazz1 },
    { id: 'jazz2', name: 'Jazz Vibes', path: jazz2 },
  ];
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

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
    setTime(newMode === 'focus' ? 50 * 60 : newMode === 'shortBreak' ? 10 * 60 : 25 * 60);
    setIsRunning(false);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { text: newGoal.trim(), done: false }]);
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
    <div className="relative w-screen" style={{ height: 'calc(100dvh - 64px)' }}>
      <Head>
        <title>Focus Flow | Solo Study</title>
      </Head>

      {/* Background - now without blur */}
      <div className="fixed top-[64px] left-0 w-screen h-[calc(100dvh-64px)] overflow-hidden z-0">
        <img
          src={currentBg?.path}
          alt="Background"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>
      <audio ref={audioRef} src={currentTrack} loop />

      {/* Main content */}
      <div className="relative z-10 pt-2 px-6 pb-6 flex flex-col h-full">

        <div className="flex justify-end gap-4 mb-6">
          {/* Background selector */}
          <div className="relative">
            <Button variant="outline" size="icon" onClick={() => toggleControl('background')} className="bg-white/90 hover:bg-white shadow-md w-12 h-12">
              <span className="text-xl">🌄</span>
            </Button>
            {showControls.background && (
              <Card className="absolute right-0 mt-2 w-64 bg-white shadow-lg z-50">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Background Options</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {backgrounds.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => {
                        setCurrentBg(bg);
                        setShowControls(prev => ({ ...prev, background: false }));
                      }}
                      className={`aspect-video rounded overflow-hidden border ${currentBg?.id === bg.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <img src={bg.path} alt={bg.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Audio selector */}
          <div className="relative">
            <Button variant="outline" size="icon" onClick={() => toggleControl('audio')} className="bg-white/90 hover:bg-white shadow-md w-12 h-12">
              <span className="text-xl">🎵</span>
            </Button>
            {showControls.audio && (
              <Card className="absolute right-0 mt-2 w-64 bg-white shadow-lg z-50">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Audio Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={currentTrack} onValueChange={value => { setCurrentTrack(value); setIsPlaying(true); }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select track" />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks.map(track => (
                        <SelectItem key={track.id} value={track.path}>{track.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button variant={isPlaying ? 'default' : 'outline'} size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? (
                        <>
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pause
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          </svg>
                          Play
                        </>
                      )}
                    </Button>
                    <Input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main content body */}
        <div className="flex flex-1 gap-6 overflow-auto">
          <div className="flex flex-col gap-6 w-full lg:w-80">
            {/* Timer Card */}
            <Card className="bg-gray-800 text-white rounded-xl shadow-lg p-4 w-full max-w-sm mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">Personal Timer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-5xl font-bold text-center py-4 font-mono">{formatTime(time)}</div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setIsRunning(!isRunning)} className="w-full" variant={isRunning ? 'secondary' : 'default'}>
                    {isRunning ? (
                      <>
                        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-center">
                {(['focus', 'shortBreak', 'longBreak'] as const).map(m => (
                  <Button key={m} variant={mode === m ? 'default' : 'outline'} onClick={() => switchMode(m)}>
                    {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </Button>
                ))}
              </CardFooter>
            </Card>

            {/* Goals Card */}
            <Card className="bg-gray-800 text-white rounded-xl shadow-lg p-4 w-full max-w-sm mx-auto">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">Study Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Type your goal here..."
                    onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                    className="bg-gray-700 border-none text-white placeholder-gray-400 flex-1" // Made input longer with flex-1
                  />
                  <Button onClick={addGoal}>Add</Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {goals.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">No goals set yet</div>
                  ) : (
                    <ul className="space-y-2">
                      {goals.map((goal, idx) => (
                        <li key={idx} className="flex items-center justify-between p-2 border-b border-gray-600">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={goal.done}
                              onChange={() => {
                                setGoals((prevGoals) =>
                                  prevGoals.map((goal, i) =>
                                    i === idx ? { ...goal, done: !goal.done } : goal
                                  )
                                );
                              }}
                              className="w-5 h-5" // Made checkbox slightly larger
                            />
                            <span className={`${goal.done ? 'line-through opacity-50' : ''}`}>
                              {goal.text}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                            className="text-xl px-2" // Made X icon larger
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