import React, { useState, useEffect } from "react";
import Scene from "./Scene";
import Avatar from "./Avatar";
import { Emotion } from "./EmotionEnum";
import SpeechBot from "./SpeechBot";

const avatars = [
  { name: "Younger", url: "/YOUNGER.glb" },
  { name: "Man", url: "/FORMAL.glb" }
];
console.log("Avatar URL:", avatars[0].url);

interface AvatarSelectorProps {
  setAvatarUrl: (url: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ setAvatarUrl }) => {
  const [isTalking, setIsTalking] = useState(false);
  const [avatarUrl, setAvatarUrlState] = useState(avatars[0].url);
  const [audio] = useState(new Audio("/funny.mp3"));

  useEffect(() => {
    const enableAudio = () => {
      audio.play().catch(err => console.log("Audio play failed:", err));
      document.removeEventListener("click", enableAudio);
    };
    document.addEventListener("click", enableAudio);
    return () => document.removeEventListener("click", enableAudio);
  }, [audio]);

  const handleSpeak = () => {
    setIsTalking(true);
    const utterance = new SpeechSynthesisUtterance("הי שלום מה שלומך??!! מקווה שטוב והכל מצוין מה תרצי לספר לנו היום ??!! יאלוש תתחילי");
    utterance.onend = () => setIsTalking(false);
    speechSynthesis.speak(utterance);
  };

  const handleAvatarChange = (url: string) => {
    setAvatarUrlState(url);
    setAvatarUrl(url);
  };

  return (
    <div>
      <h2>Select Your Avatar</h2>
      {avatars.map((avatar, index) => (
        <button key={`${avatar.url}-${index}`} onClick={() => handleAvatarChange(avatar.url)}>
          {avatar.name}
        </button>
      ))}

      <Scene avatarUrl={avatarUrl}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <Avatar
          avatarUrl={avatarUrl}
          position={[0, -1, 0]}
          // isTalking={isTalking}
          emotion={Emotion.Happy}
          audioUrl={"/funny.mp3"}
        />
      </Scene>
      {/* הרובוט המהמם */}
      <div className="fixed bottom-4 right-4 z-50">
        <SpeechBot />
      </div>
      {/* <button
        onClick={handleSpeak}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        🗣️ Talk
      </button> */}
    </div>

  );
};

export default AvatarSelector;
