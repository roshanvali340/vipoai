import React, { useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS

function App() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (recording) {
      // Start recording
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);

          recorder.ondataavailable = (event) => {
            setAudioChunks((prev) => [...prev, event.data]);
          };

          recorder.start();
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
          setRecording(false);
        });
    } else if (mediaRecorder) {
      // Stop recording
      mediaRecorder.stop();
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioChunks([]);
      };
    }
  }, [recording, mediaRecorder, audioChunks]);

  const handleMicClick = () => {
    setRecording((prev) => !prev);
  };

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">VAPI</div>
        <div className="hamburger" onClick={toggleNav}>
          <i className="fas fa-bars"></i>
        </div>
        <ul className={`nav-links ${navOpen ? "show" : ""}`}>
          <li>Docs</li>
          <li>Pricing</li>
          <li>Security</li>
          <li>Dashboard</li>
          <li>Affiliates</li>
        </ul>
      </nav>
      <div className="main-content">
        <h1>Voice AI for developers</h1>
        <p>
          Vapi lets developers build, test, and deploy voice agents in minutes
          rather than months.
        </p>
        <div className="mic-container" onClick={handleMicClick}>
          <div className="mic-circle">
            <i className={`fas fa-microphone ${recording ? "recording" : ""}`}></i>
          </div>
        </div>
        <button className="try-it-button">Give it a try!</button>
        <button className="try-free-button">Try for free</button>
        <button className="ask-ai-button">
          <i className="fas fa-robot"></i> Ask AI
        </button>
        {audioUrl && (
          <div className="audio-player">
            <audio controls src={audioUrl}></audio>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
