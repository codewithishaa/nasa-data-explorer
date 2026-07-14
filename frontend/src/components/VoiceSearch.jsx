import React, { useState } from "react";

const VoiceSearch = ({ onResult, label = "Voice Search", style = {} }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError(false);
    };

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setListening(false);
      if (onResult) {
        onResult(voiceInput);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setError(true);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <button
      onClick={handleVoiceInput}
      disabled={listening}
      title="Search using voice input"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        background: listening
          ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "10px 16px",
        fontWeight: "600",
        fontSize: "0.85rem",
        cursor: "pointer",
        transition: "background 0.2s, transform 0.1s",
        ...style,
      }}
    >
      <span style={{ fontSize: "1.1rem" }}>
        {listening ? "🛑" : "🎙️"}
      </span>
      <span>
        {listening ? "Listening..." : error ? "Error! Retry" : label}
      </span>
    </button>
  );
};

export default VoiceSearch;
