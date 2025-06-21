import React, { useState } from "react";

const VoiceSearch = ({ onDateRecognized }) => {
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");

  const handleVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setSpokenText("Listening...");
    };

    recognition.onresult = (event) => {
      const voiceInput = event.results[0][0].transcript;
      setSpokenText(voiceInput);
      setListening(false);

      const parsed = new Date(voiceInput);
      if (!isNaN(parsed)) {
        const formatted = parsed.toISOString().split("T")[0];
        if (onDateRecognized) {
          onDateRecognized(formatted);
        }
      } else {
        console.error("Could not parse date from voice:", voiceInput);
      }
    };

    recognition.onerror = () => {
      setSpokenText("Voice recognition error.");
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
      <h2>🎙️ Voice Search</h2>
     
      <div>
        <button
          onClick={handleVoiceInput}
          disabled={listening}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#2f81f7",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "0.5rem"
          }}
        >
          {listening ? "Listening..." : "Start Voice Search"}
        </button>
      </div>
      {spokenText && <p>🎧 You said: {spokenText}</p>}
    </div>
  );
};

export default VoiceSearch;
