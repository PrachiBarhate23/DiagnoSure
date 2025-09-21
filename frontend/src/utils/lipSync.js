export const analyzeLipSync = (audioElement) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    
    const source = audioContext.createMediaElementSource(audioElement);
    const analyser = audioContext.createAnalyser();
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const animate = () => {
      if (!audioElement.paused) {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average amplitude
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        const normalizedAmplitude = average / 255;
        
        // Trigger mouth animation based on amplitude
        const event = new CustomEvent('lipSyncUpdate', {
          detail: { amplitude: normalizedAmplitude }
        });
        document.dispatchEvent(event);
        
        requestAnimationFrame(animate);
      }
    };
    
    audioElement.addEventListener('play', () => {
      audioContext.resume().then(() => {
        animate();
      });
    });
    
  } catch (error) {
    console.log('Web Audio API not supported, using CSS fallback');
    // Fallback to simple CSS animation
    const fallbackAnimation = () => {
      if (!audioElement.paused) {
        const event = new CustomEvent('lipSyncUpdate', {
          detail: { amplitude: 0.5 + Math.random() * 0.5 }
        });
        document.dispatchEvent(event);
        setTimeout(fallbackAnimation, 100);
      }
    };
    
    audioElement.addEventListener('play', fallbackAnimation);
  }
};