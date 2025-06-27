/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef, useCallback, SetStateAction } from 'react';
import Head from 'next/head';
import { Maximize, Minimize, Volume2, VolumeX, Play, Pause, Image as ImageIcon, Settings, LogOut, X } from 'lucide-react';

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
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Slider } from '../components/ui/slider';

export default function SoloStudyPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(50 * 60);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [goals, setGoals] = useState<{ text: string; done: boolean }[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(lofi1);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const backgrounds = [
    { id: 'cafe1', name: 'Cozy Cafe', path: cozyCafe.src },
    { id: 'cafe2', name: 'Urban Cafe', path: cozyCafe2.src },
    { id: 'cafe3', name: 'Animated Cafe', path: cozyCafe3.src },
    { id: 'anime1', name: 'Anime Focus', path: animePic1.src },
    { id: 'anime2', name: 'Anime Serene', path: animePic2.src },
  ];
  const [currentBg, setCurrentBg] = useState(backgrounds[4]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tracks = [
    { id: 'lofi1', name: 'Lofi Beats', path: lofi1 },
    { id: 'lofi2', name: 'Lofi Chill', path: lofi2 },
    { id: 'jazz1', name: 'Jazz Relax', path: jazz1 },
    { id: 'jazz2', name: 'Jazz Vibes', path: jazz2 },
  ];

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    } else if (time === 0) {
      setIsRunning(false);
      // Removed: Play a notification sound when timer ends
      // Optionally switch to the next mode automatically after a short delay
      // For example, after focus, automatically start a short break
      // setTimeout(() => switchMode(mode === 'focus' ? 'shortBreak' : 'focus'), 2000);
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

  const switchMode = useCallback((newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setTime(newMode === 'focus' ? 50 * 60 : newMode === 'shortBreak' ? 10 * 60 : 25 * 60);
    setIsRunning(false);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleGoalDone = useCallback((index: number) => {
    setGoals(prevGoals => {
      const updatedGoals = [...prevGoals];
      if (updatedGoals[index]) {
        updatedGoals[index].done = !updatedGoals[index].done;
      }
      return updatedGoals;
    });
  }, []);

  const removeGoal = useCallback((index: number) => {
    setGoals(prevGoals => prevGoals.filter((_, i) => i !== index));
  }, []);

  const addGoal = useCallback(() => {
    if (newGoal.trim()) {
      setGoals(prevGoals => [...prevGoals, { text: newGoal.trim(), done: false }]);
      setNewGoal('');
    }
  }, [newGoal]);

  // Unified blue color palette - ONLY COLOR CLASSES HAVE BEEN MODIFIED
  const modeColors = {
    focus: {
      bg: 'from-blue-950/80 to-blue-900/80', // Darker gradient for parameter area
      text: 'text-blue-50', // Text color
      buttonPrimary: 'bg-blue-900 hover:bg-blue-950', // Deepest primary button color
      buttonOutline: 'text-blue-300 border-blue-900 hover:bg-white/10 hover:text-white', // Darker outline button
      timerPulse: 'animate-pulse-blue'
    },
    shortBreak: {
      bg: 'from-blue-950/80 to-blue-900/80', // Darker gradient for parameter area
      text: 'text-blue-50',
      buttonPrimary: 'bg-blue-900 hover:bg-blue-950',
      buttonOutline: 'text-blue-300 border-blue-900 hover:bg-white/10 hover:text-white',
      timerPulse: 'animate-pulse-blue'
    },
    longBreak: {
      bg: 'from-blue-950/80 to-blue-900/80', // Darker gradient for parameter area
      text: 'text-blue-50',
      buttonPrimary: 'bg-blue-900 hover:bg-blue-950',
      buttonOutline: 'text-blue-300 border-blue-900 hover:bg-white/10 hover:text-white',
      timerPulse: 'animate-pulse-blue'
    },
  };

  const currentModeStyle = modeColors[mode];

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out font-sans"
      style={{
        backgroundImage: `url(${currentBg?.path})`,
      }}
    >
      <Head>
        <title>Focus Flow | Solo Study</title>
      </Head>
      {/* Overlay with subtle blur and transparency for glassmorphism effect */}
      <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-black/30 z-0" />
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDQiPjxwYXRoIGQ9Ik0zNiAzMGgydjJoLTJ2LTJ6bTAgNHY0aDJ2LTRoLTJ6bTAgNGgxdjFoLTF2LTF6bTQgMEgzOHYyaC0ydi0yem0wIDRoMnYyaC0ydi0yek0wIDI4aDEydjEySDB2LTQ0ek00IDBoMTJ2MTJIMDR2LTQ0ekM0IDQwSDEydjEwSDB2LTQ0ek0yMCAwSDMyVjEySDE2VjJoLTQ0ek0yMCA0MGgxMnYxMkgxNlYyem0zNiA0SDI4djZoOHYtNnptMCA4aDJ2MmgtMnYtMnp6bTAgNGgydjJoLTJ2LTJ6TTAgMjhoMTJ2MTJIMDB2LTQ0ekM0IDBoMTJ2MTJIMDR2LTQ0ekMwIDQwSDEydjEwSDB2LTQ0ek0yMCAwSDMyVjEySDE2VjJoLTQ0ek0yMCA0MGgxMnYxMkgxNlYyem0zNiA0SDI4djZoOHYtNnptMCA4aDJ2MmgtMnYtMnp6bTAgNGgydjJoLTJ2LTJ6TTAgMjhoMTJ2MTJIMDB2LTQ0ekM0IDBoMTJ2MTJIMDR2LTQ0ekMwIDQwSDEydjEwSDB2LTQ0ek0yMCAwSDMyVjEySDE2VjJoLTQ0ek0yMCA0MGgxMnYxMkgxNlYyem0zNiA0SDI4djZoOHYtNnptMCA4aDJ2MmgtMnYtMnp6bTAgNGgydjJoLTJ2LTJ6TTAgMjhoMTJ2MTJIMDB2LTQ0ekM0IDBoMTJ2MTJIMDR2LTQ0ekMwIDQwSDEydjEwSDB2LTQ0ek0yMCAwSDMyVjEySDE2VjJoLTQ0ek0yMCA0MGgxMnYxMkgxNlYyem0zNiA0SDI4djZoOHYtNnptMCA4aDJ2MmgtMnYtMnp6bTAgNGgydjJoLTJ2LTJ6TTAgMjhoMTJ2MTJIMDB2LTQ0ekM0IDBoMTJ2MTJIMDR2LTQ0ekMwIDQwSDEydjEwSDB2LTQ0ek0yMCAwSDMyVjEySDE2VjJoLTQ0ek0yMCA0MGgxMnYxMkgxNlYyem0zNiA0SDI4djZoOHYtNnptMCA4aDJ2MmgtMnYtMnp6bTAgNGgydjJoLTJ2LTJ6TTQ0IDBoMTJ2MTJIMDQwdi00NHpNNTYgMGgydjJoLTJ2LTJ6bTggNGgydjJoLTJ2LTJ6TTQ0IDQ0aDEydjEwSDQwdi00NHpNNTYgNDRoMnYySjQ4VjQ2eiIvPjwvZz48L2c+PC9zdmc+)' }} />

      <audio ref={audioRef} src={currentTrack} loop />
      {/* Removed: <audio ref={timerEndAudioRef} src={timerEndSound} /> */}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Top-right utility controls */}
        <div className="absolute top-4 right-4 flex space-x-2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { window.location.href = '/profile'; }}
            className="text-white hover:bg-white/20 transition-colors duration-300 rounded-full"
            title="Go to Profile"
          >
            <LogOut size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 transition-colors duration-300 rounded-full"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            className="text-white hover:bg-white/20 transition-colors duration-300 rounded-full"
            title="Settings"
          >
            <Settings size={24} />
          </Button>
        </div>

        {/* Settings Panel (slides in/out) */}
        <div className={`fixed top-0 right-0 h-full w-80 bg-gradient-to-br ${currentModeStyle.bg} backdrop-blur-xl shadow-2xl z-30 transform transition-transform duration-500 ease-in-out border-l border-white/20
          ${showSettingsPanel ? 'translate-x-0' : 'translate-x-full'}`}>
          <Card className="h-full bg-transparent text-white border-none rounded-none overflow-y-auto custom-scrollbar">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
              <CardTitle className="text-xl font-semibold">Settings</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowSettingsPanel(false)} className="text-white hover:bg-white/20">
                <X size={24} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 p-4 pt-2">
              {/* Background Options */}
              <div className="space-y-3">
                <h2 className="text-lg font-medium flex items-center gap-2"><ImageIcon size={20} /> Backgrounds</h2>
                <div className="grid grid-cols-2 gap-3">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => setCurrentBg(bg)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 group
                        ${currentBg?.id === bg.id ? 'border-blue-400 ring-2 ring-blue-400' : 'border-transparent hover:border-white/50'}`}
                    >
                      <img
                        src={bg.path}
                        alt={bg.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {bg.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Controls */}
              <div className="space-y-3">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />} Audio
                </h2>
                <Select
                  value={currentTrack}
                  onValueChange={(value: SetStateAction<string>) => {
                    setCurrentTrack(value);
                    setIsPlaying(true);
                  }}
                >
                  <SelectTrigger className="w-full bg-white/20 border-white/30 text-white hover:bg-white/30 focus:ring-blue-900">
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-blue-900/80 to-blue-700/80 text-white border-blue-900/50 shadow-lg">
                    {tracks.map((track) => (
                      <SelectItem key={track.id} value={track.path} className="hover:bg-blue-800/50 focus:bg-blue-800/50">
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-3">
                  <Slider
                    value={[volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(val) => setVolume(val[0] ?? 0)}
                    className="w-full [&>span:first-child]:bg-white/30 [&>span:last-child]:bg-blue-400"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:bg-white/20 transition-colors duration-300 rounded-full"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Study Card */}
        <Card className={`w-full max-w-md bg-white/10 backdrop-filter backdrop-blur-lg shadow-2xl rounded-xl p-6 text-white border border-white/20 animate-fade-in transition-all duration-500 ease-in-out`}>
          <CardHeader className="pb-4">
            <CardTitle className={`text-4xl font-extrabold text-center tracking-tight ${currentModeStyle.text}`}>
              Solo Focus Session
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Timer */}
            <div className="flex flex-col items-center">
              <div className={`text-7xl md:text-8xl font-black font-mono ${currentModeStyle.text} ${isRunning ? currentModeStyle.timerPulse : ''}`}>
                {formatTime(time)}
              </div>
              <div className="flex justify-center gap-3 mt-6 flex-wrap">
                {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
                  <Button
                    key={m}
                    size="lg"
                    variant={mode === m ? 'default' : 'outline'}
                    onClick={() => switchMode(m)}
                    className={`min-w-[120px] text-lg font-semibold rounded-full transition-all duration-300
                      ${mode === m
                        ? currentModeStyle.buttonPrimary + ' text-white shadow-lg'
                        : currentModeStyle.buttonOutline
                      }`}
                  >
                    {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                  </Button>
                ))}
              </div>
              <Button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full mt-6 py-3 text-xl font-bold rounded-full transition-all duration-300 ease-in-out
                  ${isRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                    : 'bg-blue-900 hover:bg-blue-950 text-white shadow-lg' // Darkest blue for Start button
                  }`}
              >
                {isRunning ? 'Pause' : 'Start'}
              </Button>
            </div>

            {/* Daily Goals */}
            <div className="space-y-4">
              <h2 className={`text-xl font-semibold ${currentModeStyle.text}`}>Daily Goals</h2>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a new goal..."
                  className="flex-grow bg-white/20 border-white/30 text-white placeholder-blue-400 focus:border-blue-900 focus:ring-blue-900"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addGoal();
                    }
                  }}
                />
                <Button
                  onClick={addGoal}
                  className="bg-blue-900 hover:bg-blue-950 text-white" // Darkest blue for Add button
                >
                  Add
                </Button>
              </div>
              <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {goals.map((goal, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-md transition-colors duration-200 cursor-pointer
                      ${goal.done ? 'bg-blue-900/30 text-blue-200 line-through' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
                  >
                    <span className="flex-grow" onClick={() => toggleGoalDone(index)}>
                      {goal.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoal(index)}
                      className="text-blue-200 hover:text-red-400"
                    >
                      <X size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global styles for animations and custom components */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .font-sans {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        .font-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Dynamic pulse animations based on mode */
        .animate-pulse-blue { animation: pulse-blue 2s infinite ease-in-out; }

        @keyframes pulse-blue {
          0%, 100% { transform: scale(1); opacity: 1; text-shadow: 0 0 5px rgba(29, 78, 216, 0.4); } /* Blue 700 */
          50% { transform: scale(1.02); opacity: 0.95; text-shadow: 0 0 15px rgba(29, 78, 216, 0.8); }
        }

        /* Custom scrollbar for settings panel and goals list */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Styling for Shadcn Slider component's track */
        /* These specific selectors target the Shadcn UI slider elements within the component. */
        .w-full.\\[\\&>span\\:first-child\\]\\:bg-white\\/30.\\[\\&>span\\:last-child\\]\\:bg-blue-400 .rc-slider-track {
            background-color: #1e3a8a !important; /* Changed to Tailwind blue-900 equivalent */
        }
        .w-full.\\[\\&>span\\:first-child\\]\\:bg-white\\/30.\\[\\&>span\\:last-child\\]\\:bg-blue-400 .rc-slider-handle {
            border-color: #1e3a8a !important; /* Changed to Tailwind blue-900 equivalent */
            background-color: #1e3a8a !important; /* Changed to Tailwind blue-900 equivalent */
        }
        .w-full.\\[\\&>span\\:first-child\\]\\:bg-white\\/30.\\[\\&>span\\:last-child\\]\\:bg-blue-400 .rc-slider-rail {
            background-color: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </div>
  );
}