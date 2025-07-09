// ✅ קובץ SpeechBot משודרג ברמה פסיכית
// כולל: זיהוי רגשות, מצב רוח, תרגום, זיכרון שיחה ועוד
export {};
// הגדרות טיפוס זמניות (להימנע משגיאות TypeScript)
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// 🎙️ התחלה: יצירת אובייקט זיהוי דיבור
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "he-IL"; // עברית כברירת מחדל

// 🧠 מצב זיכרון שיחה (Memory Mode)
let chatHistory: string[] = JSON.parse(localStorage.getItem("mentvox-chat") || "[]");
function remember(message: string) {
  chatHistory.push(message);
  if (chatHistory.length > 20) chatHistory.shift();
  localStorage.setItem("mentvox-chat", JSON.stringify(chatHistory));
}

// 🎭 זיהוי מצב רוח מהטקסט
function detectMood(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("עצוב") || lower.includes("בוכה")) return "😢";
  if (lower.includes("שמח") || lower.includes("כיף")) return "😄";
  if (lower.includes("עצבני") || lower.includes("כועס")) return "😡";
  if (lower.includes("לחוץ") || lower.includes("פחד")) return "😰";
  return "🙂";
}

// 🌍 תרגום קולי פשוט
async function translateToEnglish(text: string): Promise<string> {
  const res = await fetch("https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=he|en");
  const data = await res.json();
  return data.responseData.translatedText;
}

// 🖼️ תגובה חזותית
function visualReply(text: string) {
  if (text.includes("מתכון")) {
    const img = document.createElement("img");
    img.src = "https://source.unsplash.com/400x200/?food";
    document.body.appendChild(img);
  }
}

// 🧩 משחק קולי
function startGame() {
  const q = "מהי עיר הבירה של צרפת?";
  speak(q);
  // ניתן להרחיב למנגנון חידונים שלם
}

// 🎤 דיבור טקסט
// 🗣️ דיבור טקסט
function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

// 🎙️ הגדרה בטוחה של זיהוי דיבור
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("הדפדפן לא תומך בזיהוי דיבור");
  throw new Error("SpeechRecognition not supported");
}

const recognizer = new SpeechRecognition();
recognizer.lang = "he-IL";
recognizer.interimResults = false;
recognizer.maxAlternatives = 1;

// 📥 תוצאה
recognizer.onresult = async (event: any) => {
  const transcript = Array.from(event.results)
    .map((result: any) => result[0].transcript)
    .join("");

  console.log("המשתמש אמר:", transcript);

  const mood = detectMood(transcript);
  const moodIcon = document.getElementById("mood-icon");
  if (moodIcon) moodIcon.textContent = mood;

  const translated = await translateToEnglish(transcript);

  remember(transcript);

  if (transcript.includes("שחקי")) {
    startGame();
  } else if (transcript.includes("בדיחה")) {
    speak("למה תוכי לא עובר כביש? כי הוא מעופף!");
  } else {
    speak("הבנתי שאמרת: " + translated);
  }

  visualReply(transcript);
};

// 🚨 שגיאה
recognizer.onerror = (e: any) => {
  console.error("שגיאה בזיהוי דיבור", e);
};

recognizer.start();


// 🟢 הצגת מצב רוח UI
const moodEl = document.createElement("div");
moodEl.id = "mood-icon";
moodEl.style.position = "fixed";
moodEl.style.bottom = "10px";
moodEl.style.right = "10px";
moodEl.style.fontSize = "40px";
document.body.appendChild(moodEl);
