import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
import { FaUpload, FaFileAlt, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type ChatMessage = {
    from: "user" | "bot";
    text: string;
};

type Conversation = {
    conversationId?: number;
    userId: string;
    userMessage: string;
    botResponse: string;
    responseTime: string;
};

const SmartChatPage: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const currentUserId = "450289";

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [summary, setSummary] = useState("");
    // const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const [robotText, setRobotText] = useState('');


    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const res = await axios.get<Conversation[]>("https://localhost:7059/api/conversation");
            const userChats = res.data.filter(c => c.userId === currentUserId);
            setConversations(userChats);

            const allMsgs: ChatMessage[] = userChats.flatMap(chat => {
                const time = new Date(chat.responseTime).toLocaleString("he-IL");
                return [
                    { from: "user", text: `📅 ${time}\n${chat.userMessage}` },
                    { from: "bot", text: chat.botResponse }
                ];
            });

            setMessages(allMsgs);
        } catch (err) {
            console.error("❌ שגיאה בטעינת השיחות", err);
        }
    };

    const goToChats = () => {
        navigate("/my-chats");
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const userMsg = newMessage.trim();
        const botReply = "🤖 זו תגובת דמו, יש להחליף בחיבור ל-GPT";
        const responseTime = new Date().toISOString();

        const conversation: Conversation = {
            userId: currentUserId,
            userMessage: userMsg,
            botResponse: botReply,
            responseTime
        };

        try {
            await axios.post("https://localhost:7059/api/conversation", conversation);

            // 🎵 ניגון צליל שליחה
            const audio = new Audio("/send.mp3");
            audio.play().catch((e) => console.error("שגיאה בהפעלת הסאונד", e));

            // 📨 עדכון הודעות במסך
            setMessages(prev => [
                ...prev,
                { from: "user", text: userMsg },
                { from: "bot", text: botReply }
            ]);

            // איפוס שדה הקלט
            setNewMessage("");
        } catch (err) {
            console.error("❌ שגיאה בשליחת הודעה", err);
        }
    };


    const handleSummarizeChat = async () => {
        if (conversations.length === 0) {
            alert("אין שיחות לסיכום 🙈");
            return;
        }

        setLoading(true);
        try {
            const chatText = conversations
                .map(c => `👩‍🦰: ${c.userMessage}\n🤖: ${c.botResponse}`)
                .join("\n");

            const res = await axios.post("https://localhost:7059/api/ChatGpt/message", {
                userMessage: chatText
            });

            setSummary(res.data);
        } catch (err) {
            console.error("❌ שגיאה בסיכום", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        setUploadStatus("");
    };

    const handleUploadSubmit = async () => {
        if (!file) return alert("לא נבחר קובץ ⛔");

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploadStatus("⏳ מעלה קובץ...");
            // const res = await axios.post("https://localhost:7059/api/FileUpload/upload", formData, {
            //     headers: { "Content-Type": "multipart/form-data" }
            // });
            setUploadStatus("✅ קובץ הועלה!");
        } catch (err) {
            console.error("❌ שגיאה בהעלאת קובץ", err);
            setUploadStatus("❌ כשלון בהעלאה");
        }
    };

    const simulateTypingEffect = async () => {
        const text = "שלום רותי! הנה ההודעה שלך מהרובוט החמוד 😊"; // או לקבל את זה מהשרת
        let currentText = '';
        setRobotText(''); // לאפס כל מה שהיה

        for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            setRobotText(currentText);
            await new Promise(resolve => setTimeout(resolve, 50)); // מהירות הקלדה
        }
    };


    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <aside className="w-64 mr-6 space-y-4">
                <div className="bg-white rounded-2xl shadow-md p-4 space-y-4">
                    <button
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl transition-all"
                        onClick={simulateTypingEffect}
                    >
                        🤖 הרובוט מקליד
                    </button>
                    <div className="mt-2 text-sm bg-white p-2 rounded shadow">
                        {robotText}
                    </div>
                    <hr className="border-gray-200" />
                    <button
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        onClick={goToChats}
                    >
                        <FaHistory /> שיחות קודמות
                    </button>

                    <button
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        onClick={handleSummarizeChat}
                    >
                        <FaFileAlt /> סיכום שיחה
                    </button>

                    <button
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        onClick={() => setShowUploadOptions(prev => !prev)}
                    >
                        <FaUpload /> העלאת קובץ
                    </button>

                    {showUploadOptions && (
                        <>
                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-xl"
                            >
                                בחר קובץ 📁
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-xl"
                            >
                                שלח קובץ 📤
                            </button>
                            <div className="text-sm text-gray-600">{uploadStatus}</div>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Chat */}
            <main className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between">
                <div className="overflow-y-auto h-[500px] space-y-3 pr-2">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[70%] px-4 py-3 rounded-2xl whitespace-pre-wrap text-white ${msg.from === "user"
                                ? "bg-blue-500 self-end ml-auto rounded-br-none"
                                : "bg-gray-400 self-start rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="💬 הקלד הודעה..."
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
                    >
                        🚀 שלח
                    </button>
                </div>

                {loading && <p className="text-sm mt-2">🔄 מסכם שיחה...</p>}
                {summary && (
                    <div className="bg-yellow-100 p-4 mt-4 rounded-xl border border-yellow-400 text-sm">
                        <h4 className="font-bold mb-2">📋 סיכום:</h4>
                        <p>{summary}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SmartChatPage;
