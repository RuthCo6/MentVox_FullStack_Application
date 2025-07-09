import React, { useRef, useState } from "react";
import axios from "axios";

// או ממוביקס / רידאקס
// const token = localStorage.getItem('token'); 
// axios.get('http://localhost:7059/api/auth/all-users', {
//     headers: {
//         Authorization: `Bearer ${token}`,
//     },
// });

const SpeechBotButton = () => {
    const recognitionRef = useRef<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [userSpeech, setUserSpeech] = useState("");
    const [botResponse, setBotResponse] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const speak = (text: string) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        // זיהוי שפה לפי תוכן הטקסט
        const hebrew = /[\u0590-\u05FF]/.test(text);
        const lang = hebrew ? "he-IL" : "en-US";
        utterance.lang = lang;

        // מציאת קול מתאים לשפה
        const voices = synth.getVoices();
        const voice = voices.find(v => v.lang === lang || v.lang.startsWith(lang));
        if (voice) utterance.voice = voice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synth.speak(utterance);
    };


    const detectLanguage = (text: string): "he-IL" | "en-US" => {
        const hebrew = /[\u0590-\u05FF]/.test(text);
        return hebrew ? "he-IL" : "en-US";
    };

    const typeBotReply = (text: string) => {
        let index = 0;
        setBotResponse("");
        const typingInterval = setInterval(() => {
            setBotResponse(prev => prev + text[index]);
            index++;
            if (index >= text.length) clearInterval(typingInterval);
        }, 30);
    };

    const fetchBotReply = async (text: string) => {
        if (!text || !text.trim()) {
            console.warn("❌ לא נשלח טקסט לשרת (ריק או לא תקין)");
            setBotResponse("⚠️ Please say something first!");
            return;
        }

        try {
            setIsLoading(true);
            console.log("🤖 שולחת בקשה לשרת עם טקסט:", text);

            // שליחת בקשה לשרת עם DTO מתאים
            const response = await axios.post("https://localhost:7059/api/chatgpt/message", {
                UserName: "Ruti", // לפי ChatGptRequestDto
                UserMessage: text
            });

            const { botResponse, responseTime } = response.data;
            console.log("🎯 תשובת רובוט:", botResponse, "🕐 בשעה:", responseTime);

            const lang = detectLanguage(botResponse);
            speak(botResponse);
            typeBotReply(botResponse);

            // שמירת השיחה בשרת (שדרוג יגיע אם תשלחי לי את ה־DTO וה־API הזה)
            await axios.post("https://localhost:7059/api/conversation", {
                UserMessage: text,
                UserId: 2,
                BotResponse: botResponse,
                ResponseTime: responseTime
            });

        } catch (err: any) {
            console.error("❌ API error:", err);
            setBotResponse("⚠️ Something went wrong. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOpenAiResponse = async (text: string) => {
        try {
            const res = await fetch("https://localhost:7059/api/chatgpt/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userMessage: text,
                    userName: "Ruti", // או מה שתבחרי
                }),
            });

            const data = await res.json();
            console.log("🎯 תשובת GPT:", data.botResponse);
            return data.botResponse;
        } catch (err) {
            console.error("❌ GPT API Error:", err);
            return "Oops! I couldn't get a response from GPT.";
        }
    };

    const startRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("🎙️ Speech Recognition not supported");

        const recognition = new SpeechRecognition();

        // שפות זמינות לזיהוי (אנגלית + עברית)
        recognition.lang = "he-IL"; // אפשר גם "en-US", אבל נשתמש בזיהוי חכם בהמשך
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserSpeech(transcript);

            const detectedLang = detectLanguage(transcript);
            console.log("🌐 שפה שזוהתה:", detectedLang);

            fetchBotReply(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setBotResponse("⚠️ שגיאה בזיהוי הקול");
            setIsListening(false);
            if (event.error === "aborted") {
                console.warn("🎤 שגיאה: הזיהוי הופסק פתאומית. נסי לא לעצור ידנית או לבדוק הרשאות.");
                return;
            }

        };

        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        recognition.abort(); // מוסיף ביטול לפני התחלה חדשה
        recognition.start();
        setIsListening(true);
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-xl space-y-4 border border-gray-200">
            <h2 className="text-xl font-bold text-center">
                {detectLanguage(userSpeech) === "he-IL" ? "🤖 הרובוט המאלף שלך" : "🤖 Your Smart Assistant"}
            </h2>

            <div className="text-6xl text-center transition-all duration-300">
                {isSpeaking ? "🗣️" : isListening ? "🎧" : "🤖"}
            </div>

            <button
                onClick={startRecognition}
                disabled={isLoading || isSpeaking}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${isListening
                    ? "bg-red-500"
                    : "bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90"
                    }`}
            >
                🎙️ {isListening
                    ? detectLanguage(userSpeech) === "he-IL" ? "מקשיב..." : "Listening..."
                    : detectLanguage(userSpeech) === "he-IL" ? "דברי עם הרובוט" : "Talk to the Robot"}
            </button>

            <div className="bg-gray-100 p-3 rounded-xl min-h-[50px]">
                <p className="text-lg font-medium">{userSpeech}</p>
            </div>

            <div className="bg-gray-800 p-3 rounded-xl min-h-[60px]">
                <p className="text-white font-bold whitespace-pre-line text-lg">
                    {isLoading ? (
                        <span className="animate-pulse text-gray-400">
                            {detectLanguage(userSpeech) === "he-IL" ? "חושב..." : "Thinking..."}
                        </span>
                    ) : (
                        botResponse
                    )}
                </p>
            </div>
        </div>
    );
};

export default SpeechBotButton;
