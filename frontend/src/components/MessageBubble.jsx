import React from 'react';
import { Play } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import AvatarLottie from './AvatarLottie';
import './MessageBubble.css';

const MessageBubble = ({ message, isAudioPlaying, setIsAudioPlaying }) => {
  const isUser = message.type === 'user';
  const content = message.content;

  const replayUserAudio = () => {
    if (message.audioBlob) {
      const audioUrl = URL.createObjectURL(message.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'bot'}`}>      
      <div className="message-content">
        {isUser ? (
          <div className="user-message">
            <div className="user-content">
              {message.isVoice && <span className="voice-indicator">🎤 </span>}
              {content}
              {message.isVoice && message.audioBlob && (
                <button 
                  className="replay-user-audio"
                  onClick={replayUserAudio}
                  title="Replay your voice message"
                >
                  <Play size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bot-message">
            <div className="bot-avatar-container">
              <AvatarLottie 
                isPlaying={isAudioPlaying} 
                avatarType="doctor"
              />
              <div className="avatar-label">Dr. AI</div>
            </div>
            <div className="bot-response">
              {content.plain_text_summary && (
                <p className="summary-text">{content.plain_text_summary}</p>
              )}
              
              {message.isVoice && content.tts_audio_url && (
                <AudioPlayer 
                  audioUrl={content.tts_audio_url}
                  isPlaying={isAudioPlaying}
                  setIsPlaying={setIsAudioPlaying}
                />
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="message-time">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default MessageBubble;