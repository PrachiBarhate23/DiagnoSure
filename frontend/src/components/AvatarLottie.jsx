import React, { useEffect, useRef, useState } from 'react';
import './AvatarLottie.css';

const AvatarLottie = ({ isPlaying, avatarType = 'doctor' }) => {
  const [useFallback, setUseFallback] = useState(true); // Using fallback by default for demo
  const avatarRef = useRef(null);

  useEffect(() => {
    // Listen for lip sync updates
    const handleLipSync = (event) => {
      // This would update Lottie animation based on audio amplitude
      // For now, we rely on CSS animations
    };

    document.addEventListener('lipSyncUpdate', handleLipSync);
    return () => document.removeEventListener('lipSyncUpdate', handleLipSync);
  }, []);

  const getAvatarStyle = () => {
    switch (avatarType) {
      case 'doctor':
        return {
          background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
          border: '3px solid #0277bd'
        };
      case 'nurse':
        return {
          background: 'linear-gradient(135deg, #81c784 0%, #66bb6a 100%)',
          border: '3px solid #388e3c'
        };
      case 'robot':
        return {
          background: 'linear-gradient(135deg, #9575cd 0%, #7e57c2 100%)',
          border: '3px solid #512da8'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 100%)',
          border: '3px solid #0277bd'
        };
    }
  };

  return (
    <div className={`avatar-fallback ${isPlaying ? 'speaking' : ''}`} style={getAvatarStyle()}>
      <div className="avatar-face">
        {/* Medical icon */}
        <div className="medical-icon">
          {avatarType === 'doctor' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1h2V8a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h5a4 4 0 0 0 4-4v-1h-2v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/>
            </svg>
          )}
          {avatarType === 'nurse' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          )}
          {avatarType === 'robot' && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2-2-2 .9-2 2 .9-2 2-2zm-2 18h4v2H10v-2zm2-16C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            </svg>
          )}
        </div>
        
        <div className="avatar-eyes">
          <div className="eye left"></div>
          <div className="eye right"></div>
        </div>
        
        <div className={`avatar-mouth ${isPlaying ? 'talking' : ''}`}>
          <div className="mouth-shape"></div>
        </div>
        
        {/* Doctor's coat collar */}
        {avatarType === 'doctor' && (
          <div className="doctor-collar">
            <div className="collar-left"></div>
            <div className="collar-right"></div>
          </div>
        )}
        
        {/* Nurse's cap */}
        {avatarType === 'nurse' && (
          <div className="nurse-cap">
            <div className="cap-base"></div>
            <div className="cap-cross">+</div>
          </div>
        )}
        
        {/* Robot antenna */}
        {avatarType === 'robot' && (
          <div className="robot-antenna">
            <div className="antenna-line"></div>
            <div className="antenna-tip"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarLottie;
