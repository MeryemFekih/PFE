/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Maximize, Minimize } from 'lucide-react';

// Background images - using your exact paths
import cozyCafe from './backgrounds/Cafe/cozyCafe.jpg';
import cozyCafe2 from './backgrounds/Cafe/cozyCafe2.jpg';
import animePic1 from './backgrounds/anime/animePic1.jpg';
import animePic2 from './backgrounds/anime/animePic2.jpg';

// Audio files - using your exact paths


// UI Components - using your exact paths
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { faImage, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SoloStudyPage() {
  // State management
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(50 * 60);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

const [currentTrack, setCurrentTrack] = useState('/audio/lofi1.mp3');
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
    { id: 'lofi1', name: 'Lofi Beats', path:  '/audio/lofi1.mp3'},
    { id: 'lofi2', name: 'Lofi Chill', path:  '/audio/lofi2.mp3'},
    { id: 'jazz1', name: 'Jazz Relax', path:  '/audio/jazz1.mp3'},
    { id: 'jazz2', name: 'Jazz Vibes', path:  '/audio/jazz2.mp3'},
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
    const [isFullscreen, setIsFullscreen] = useState(false);

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
  className="relative min-h-screen   bg-cover bg-center bg-no-repeat"
  style={{ 
    backgroundImage: `url(${currentBg?.path})`,
    transition: 'background-image 0.5s ease-in-out'
  }}
>
  <Head>
    <title>Focus Flow | Solo Study</title>
  </Head>
  <div className="absolute inset-0 backdrop-blur-xs  bg-black/20 z-0" />
      <audio ref={audioRef} src={currentTrack} loop />
      
      <div className="absolute text-white inset-0 flex flex-col   ">  
        <div className="m-auto ">
           <div className=" flex justify-center gap-2 mb-2 z-10 ">
            {/* 🌄 Background Toggle */}
            
              <Button
              variant="destructive"
              onClick={() => {
                window.location.href = '/profile';
              }}
              className="w-15 text-gray-50 bg-red-700 hover:bg-red-700/40 hover:border-3 hover:border-red-700 h-12 text-lg"
            >
          <FontAwesomeIcon icon={faRightFromBracket} size="2x" flip="horizontal" />
            </Button>
            <div className="relative">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => toggleControl('background')}
                className="bg-white/10 hover:bg-white hover:text-black shadow-md w-12 h-12"
              > 
              <FontAwesomeIcon icon={faImage} size="2x" />
              </Button>

              {showControls.background && (
                <Card className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 text-black bg-white/80 backdrop-blur-sm shadow-lg z-50">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-center">
                      Background Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 px-2 pb-2">
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

            {/* 🖥 Fullscreen Toggle */}
            <Button
              variant="outline"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="w-15 h-12 hover:bg-black/20 shadow-md flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize size={36} /> : <Maximize size={36} />}
            </Button>
            
          </div>
        <div className="flex w-md justify-center ">
        <Card className="w-full p-4 px-6  backdrop-blur-md  shadow-2xl rounded-xl mb-3">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Solo Focus Session
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Timer */}
            <div>
              <div className="text-5xl font-bold text-center py-4 font-mono">
                {formatTime(time)}
              </div>
              <Button 
                onClick={() => setIsRunning(!isRunning)}
                className="w-full"
                variant={isRunning ? 'secondary' : 'default'}
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <div className="flex justify-center gap-2 mt-4">
                {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={mode === m ? 'default' : 'outline'}
                    onClick={() => switchMode(m)}
                  >
                    {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </Button>
                ))}
              </div>
            </div>
              {/* Audio Controls inside main card */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Sound option</h2>
              
                <div className="relative w-full  ">
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

                  <SelectContent
                    side="bottom"
                    position="popper" // ✅ Use popper for placement control
                    className="bg-transparent backdrop-blur-sm shadow-xl border border-white/20 text-white"
                  >
                    {tracks.map((track) => (
                      <SelectItem key={track.id} value={track.path}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                   className="w-full  accent-black
            
  "
            />
                <Button 
                  variant={isPlaying ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                
              </div>
              
              
            </div>
        </CardContent>
        </Card>
         </div>  
    
         

           
           </div>
     </div>
    </div>  

        
     
  );
}