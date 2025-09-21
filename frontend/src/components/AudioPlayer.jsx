import React, { useRef, useEffect, useState } from 'react';
import { analyzeLipSync } from '../utils/lipSync';
import './AudioPlayer.css';

const AudioPlayer = ({ audioUrl, isPlaying, setIsPlaying }) => {
  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (window.AudioContext || window.webkitAudioContext) {
        analyzeLipSync(audio);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setIsPlaying]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioUrl} />
      
      <button className="play-pause-btn" onClick={togglePlayPause}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <div className="audio-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="waveform-animation">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`waveform-bar ${isPlaying ? 'active' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AudioPlayer;