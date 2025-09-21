import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Send } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ConditionCard from './ConditionCard';
import ResearchList from './ResearchList';
import CaseStudyList from './CaseStudyList';
import AudioPlayer from './AudioPlayer';
import AvatarLottie from './AvatarLottie';
import AppointmentModal from './AppointmentModal';
import { getMockResponse } from '../utils/mockData';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSendMessage = (text, isVoice = false, audioBlob = null) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date(),
      isVoice,
      audioBlob
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setRecordedAudio(null);
    setIsRecordingComplete(false);

    // Simulate API delay
    setTimeout(() => {
      // Pass the input text to get the appropriate response
      const mockResponse = getMockResponse(text);
      console.log('Mock response:', mockResponse); // Debug log
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: mockResponse,
        timestamp: new Date(),
        isVoice: true // Force voice response to show audio player
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentResponse(mockResponse);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const startVoiceRecording = async () => {
    if (isListening) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ blob: audioBlob, url: audioUrl });
        setIsRecordingComplete(true);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);

      // Start speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
    }
  };

  const replayRecordedAudio = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio.url);
      audio.play();
    }
  };

  const sendVoiceMessage = () => {
    if (inputText.trim() && recordedAudio) {
      handleSendMessage(inputText, true, recordedAudio.blob);
    }
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <h1>AI Symptom Checker</h1>
          <p>Quickly understand your symptoms with our intelligent AI. Get personalized insights and potential condition suggestions to guide your next steps in health management.</p>
          <button className="start-check-btn">Start Symptom Check</button>
        </div>
      </div>

      <div className="chat-main">
        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-title">
            <h2>Symptom Assistant</h2>
          </div>
          
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>Hello! Describe your symptoms. Try typing "I have a cough and cold" to test the audio response.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message}
                isAudioPlaying={isAudioPlaying}
                setIsAudioPlaying={setIsAudioPlaying}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="input-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your symptoms here... (Try: 'I have a cough and cold')"
                className="message-input"
              />
              
              {/* Voice Recording Controls */}
              <div className="voice-controls">
                <button 
                  type="button"
                  onClick={startVoiceRecording}
                  className={`voice-btn ${isListening ? 'listening' : ''} ${isRecordingComplete ? 'complete' : ''}`}
                >
                  <div className="voice-btn-content">
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    {isListening && (
                      <div className="ripple-effect">
                        <div className="ripple"></div>
                        <div className="ripple"></div>
                        <div className="ripple"></div>
                      </div>
                    )}
                  </div>
                </button>
                
                {isRecordingComplete && recordedAudio && (
                  <>
                    <button 
                      type="button"
                      onClick={replayRecordedAudio}
                      className="replay-btn"
                      title="Replay recorded audio"
                    >
                      <Play size={16} />
                    </button>
                  </>
                )}
              </div>
              
              <button type="submit" className="send-btn">
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <h2>Potential Conditions & Insights</h2>
          
          {currentResponse ? (
            <>
              <div className="conditions-list">
                {currentResponse.potential_conditions.map((condition, index) => (
                  <ConditionCard key={index} condition={condition} />
                ))}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="appointment-btn"
                  onClick={() => setShowAppointmentModal(true)}
                >
                  Book an Appointment
                </button>
                <button className="save-report-btn">
                  Save Report to History
                </button>
              </div>
            </>
          ) : (
            <div className="no-results">
              <p>Start a conversation to see potential conditions and insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* Research Section */}
      {currentResponse && (
        <div className="research-section">
          <h2>Medical Literature Research & Past History Case Study</h2>
          <div className="research-grid">
            <ResearchList research={currentResponse.medical_research} />
            <CaseStudyList caseStudies={currentResponse.past_case_studies} />
          </div>
        </div>
      )}

      {showAppointmentModal && (
        <AppointmentModal onClose={() => setShowAppointmentModal(false)} />
      )}
    </div>
  );
};

export default ChatWindow;