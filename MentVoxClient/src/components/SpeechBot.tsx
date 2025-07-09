import React, { useRef, useState } from "react";
import axios from "axios";

const SpeechBot = () => {
    const recognitionRef = useRef<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [userSpeech, setUserSpeech] = useState("");
    const [botResponse, setBotResponse] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // דיבור של הרובוט
    const speak = (text: string, lang: string = "en-US") => {
        // speechSynthesis.getVoices()
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        const voice = voices.find(v => v.lang === lang);
        if (voice) utterance.voice = voice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        synth.speak(utterance);
    };


    // זיהוי שפה לפי טקסט (מאוד בסיסי)
    const detectLanguage = (text: string): "he-IL" | "en-US" => {
        const hebrew = /[\u0590-\u05FF]/.test(text);
        return hebrew ? "he-IL" : "en-US";
    };


    // קבלת תגובה מהשרת (GPT)
    const fetchBotReply = async (text: string) => {
        try {
            setIsLoading(true);
            const res = await axios.post("http://localhost:3001/api/ask", { prompt: text });
            const reply = res.data.reply;
            setBotResponse(reply);
            speak(reply, detectLanguage(reply));
        } catch (err) {
            console.error("API error", err);
            setBotResponse("Oops, I had a glitch...");
        } finally {
            setIsLoading(false);
        }
    };

    // התחלת זיהוי קולי
    const startRecognition = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech Recognition not supported");

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserSpeech(transcript);
            fetchBotReply(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Error:", event.error);
        };

        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-xl space-y-4 border border-gray-200">
            <h2 style={{ fontSize: '1.3rem' }} className="font-bold text-center">
                {detectLanguage(userSpeech) === "he-IL" ? "🤖 רובוט דו-לשוני משוגע" : "🤖 Multilingual GPT Bot"}
            </h2>


            {/* 🤖 אייקון רובוט עם אנימציה */}
            <div className="text-6xl text-center transition-all duration-300">
                {isSpeaking ? "🗣️" : isListening ? "🎧" : "🤖"}
            </div>

            <div className="space-y-2">
                {/* <button
                    onClick={startRecognition}
                    className={`w-full py-2 rounded-xl font-semibold ${isListening ? "bg-red-500" : "bg-blue-600"
                        } text-white transition`}
                >
                    {isListening
                        ? detectLanguage(userSpeech) === "he-IL" ? "מקשיב לך..." : "Listening..."
                        : detectLanguage(userSpeech) === "he-IL" ? "התחל לדבר" : "Start Talking"}
                </button> */}

                <div className="bg-gray-100 p-3 rounded-xl">
                    {/* <p className="text-sm text-gray-500">🎤</p> */}
                    <p className="text-lg font-medium">{userSpeech}</p>
                </div>

                <div className="bg-green-100 p-3 rounded-xl min-h-[60px]">
                    {/* <p className="text-sm text-gray-500">🤖</p> */}
                    <p className="text-lg font-medium">
                        {isLoading ? (
                            <span className="animate-pulse text-gray-500">Thinking<span className="animate-bounce">...</span></span>
                        ) : (
                            botResponse
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SpeechBot;
