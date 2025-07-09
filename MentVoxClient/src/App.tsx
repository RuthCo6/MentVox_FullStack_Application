import './App.css'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Avatar from "./components/Avatar";
import AvatarSelector from "./components/AvatarSelector";
import SpeechAnalysis from "./components/SpeechAnalysis";
import EmotionAI from "./components/EmotionAI";
import { Emotion } from "./components/EmotionEnum";
import Scene from "./components/Scene";
import Login from './pages/Login';
import { OrbitControls } from "@react-three/drei";
// import SpeechBot from "./components/SpeechBot";
import SpeechBotButton from "./components/SpeechBotButton";
import SmartChatPage from "./components/SmartChatPage";
import MyChatsPage from "./components/MyChatsPage";


// דף בית
function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="home-page" style={{ padding: 40 }}>
      <button className="laser-button" onClick={() => navigate('/robot')}>🤖 התחל שיחה עם הרובוט</button>
      <button className="laser-button" onClick={() => navigate('/avatar')}>בחרי את הדמות שלך</button>
      <button className="laser-button" onClick={handleLogout}>🚪 התנתקי</button>
    </div>
  );
}

// דף רובוט
function RobotPageContent() {
  const [avatarUrl, setAvatarUrl] = useState<string>("/YOUNGER.glb");
  const [emotion, setEmotion] = useState<Emotion>(Emotion.Neutral);
  // const [isTalking, setIsTalking] = useState(false);
  const [showRobot, setShowRobot] = useState(false);

  // const handleButtonClick = () => {
  //   if (!avatarUrl) {
  //     alert("🛑 בחרי אווטאר לפני הפעלת הרובוט!");
  //     return;
  //   }
  //   setShowRobot(true);
  //   setIsTalking(true);

  //   const utterance = new SpeechSynthesisUtterance(
  //     "הי שלום מה שלומך??!! מקווה שטוב והכל מצוין מה תרצי לספר לנו היום ??!! יאלוש תתחילי"
  //   );
  //   utterance.onend = () => setIsTalking(false);
  //   speechSynthesis.speak(utterance);
  // };

  return (
    <div className="app-wrapper"
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: `url('/OFFICE_PERFECT.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sidebar">
        <SpeechAnalysis onEmotionDetected={(e) => setEmotion(e as Emotion)} />
        <EmotionAI emotion={emotion} />
        <AvatarSelector setAvatarUrl={setAvatarUrl} />
      </div>

      <Scene avatarUrl={avatarUrl}>
        <ambientLight intensity={0.5} />
        <OrbitControls />
        {showRobot && avatarUrl && (
          <div className="robot-container">
            <Avatar
              avatarUrl={avatarUrl}
              position={[0, -1, 0]}
              emotion={emotion}
              audioUrl={''}
            />
          </div>
        )}
      </Scene>

      <div className="App">
        <SpeechBotButton />
        <SmartChatPage />
        <MyChatsPage />
      </div>

    </div>

  );
}

// אפליקציה ראשית
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // כשהאפליקציה עולה - בודקים אם יש טוקן
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  function handleLoginSuccess(token: string) {
    localStorage.setItem('token', token); // שומרים טוקן
    setIsAuthenticated(true);
  }

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login setUser={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<HomePage />} />
            <Route path="/robot" element={<RobotPageContent />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<SmartChatPage />} />
            <Route path="/my-chats" element={<MyChatsPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

// סטיילים
// const buttonStyle: React.CSSProperties = {
//   padding: '12px 24px',
//   fontSize: '16px',
//   margin: '12px',
//   color: 'white',
//   border: 'none',
// };

// const talkButtonStyle: React.CSSProperties = {
//   position: 'absolute',
//   bottom: '40px',
//   left: '50%',
//   transform: 'translateX(-50%)',
//   padding: '12px 24px',
// };

export default App;
