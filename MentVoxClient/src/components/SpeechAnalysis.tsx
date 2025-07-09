// SpeechAnalysis.tsx
import React, { useState, useEffect } from "react";

type Props = {
  onEmotionDetected: (emotion: string) => void;
};

function SpeechAnalysis({ onEmotionDetected }: Props) {
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(true); // התחלה אוטומטית של האזנה

  // מדמה ניתוח רגש
  const analyzeEmotion = (text: string) => {
    const emotions = ["happy", "sad", "angry", "excited", "neutral"];
    const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    onEmotionDetected(detectedEmotion);
  };

  // פונקציה ששולחת טקסט לשרת ומחזירה את תשובת GPT
  const fetchOpenAiResponse = async (text: string): Promise<string> => {
    try {
      const res = await fetch("https://localhost:7059/api/chatgpt/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserMessage: text,
          UserName: "Ruti",
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("🎯 תשובת GPT:", data.botResponse);
      return data.botResponse;
    } catch (err) {
      console.error("❌ GPT API Error:", err);
      return "Sorry, I couldn't get a response.";
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("🚫 SpeechRecognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event: any) => {
      console.error("🎤 Speech recognition error:", event.error);
    };

    recognition.onresult = async (event: any) => {
      const lastTranscript = event.results[event.results.length - 1][0].transcript.trim();
      setTranscript(lastTranscript);
      console.log("🗣️ Transcript:", lastTranscript);

      const gptReply = await fetchOpenAiResponse(lastTranscript);
      analyzeEmotion(gptReply); // אפשר גם לנתח את ה־transcript המקורי
    };
    recognition.start();

    return () => recognition.abort(); // מנקה כשהקומפוננטה מוסרת
  }, []); // פעם אחת בלבד

  return (
    <div>
      {/* <p>🎧 Listening...</p>
      <p><strong>You said:</strong> {transcript}</p> */}
    </div>
  );
}

export default SpeechAnalysis;
