// src/pages/Home.tsx
import { useState } from "react";
import SpeechAnalysis from "../components/SpeechAnalysis";
import EmotionAI from "../components/EmotionAI";
import AvatarSelector from "../components/AvatarSelector";
import Scene from "../components/Scene";
import Avatar from "../components/Avatar";
import { Emotion } from "../components/EmotionEnum";
import { OrbitControls } from "@react-three/drei";
import './HomePage.css'
interface HomeProps {
  onLogout: () => void;
}

const Home = ({ onLogout }: HomeProps) => {
  const [emotion, setEmotion] = useState<Emotion>(Emotion.Neutral);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showRobot, setShowRobot] = useState<boolean>(true);
  const [isTalking, setIsTalking] = useState<boolean>(false);

  const handleEmotionDetected = (newEmotion: string) => {
    setEmotion(newEmotion as Emotion);
  };

  const handleButtonClick = () => {
    setIsTalking(true);
    setTimeout(() => setIsTalking(false), 3000);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* צד שמאל */}
      <div
        style={{
          width: "250px",
          padding: "10px",
          background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
          color: "white",
        }}
      >
        <h3>Choose Your Avatar</h3>
        <h1>🎭 Avatar AI App</h1>
        <button
          onClick={onLogout}
          style={{
            margin: "10px 0",
            padding: "8px 12px",
            backgroundColor: "#EF4444",
            border: "none",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🔒 Logout
        </button>
        <SpeechAnalysis onEmotionDetected={handleEmotionDetected} />
        <EmotionAI emotion={emotion} />
        <AvatarSelector setAvatarUrl={setAvatarUrl} />
      </div>

      {/* צד ימין */}
      <div style={{ flex: 1, position: "relative" }}>
        {/* כאן תמקמי את הסצנה של הרובוט */}
        <div className="scene" style={{ position: "relative", height: "100%" }}>
          <img
            src="assets/images/MENTVOX_3D_background.png"
            className="background"
            alt="MENTVOX Background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
          <img
            src="assets/images/robot.png"
            className="robot"
            alt="MENTVOX Robot"
            style={{
              position: "absolute",
              bottom: "30px", // להניח אותו בתחתית
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              height: "250px", // גובה נעים לרובוט
            }}
          />
          <button
            className="speak-button"
            onClick={handleButtonClick}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            🎙️ דבר עם הרובוט
          </button>
        </div>

        {/* סצנת 3D */}
        <Scene avatarUrl={avatarUrl || ""}>
          <ambientLight intensity={0.5} />
          <OrbitControls />
          {showRobot && avatarUrl && (
            <Avatar
              avatarUrl={avatarUrl}
              position={[0, 0, 0]}
              emotion={emotion}
              audioUrl=""
            />
          )}
        </Scene>
      </div>
    </div>
  );
};

export default Home;
