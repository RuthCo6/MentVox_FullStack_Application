// components/EmotionAI.tsx
import React, { useState, useEffect } from "react";

function EmotionAI({ emotion }: { emotion: string }) {
  const [avatarExpression, setAvatarExpression] = useState("neutral");
  const [handPose, setHandPose] = useState("relaxed");

  useEffect(() => {
    switch (emotion) {
      case "happy":
        setAvatarExpression("smile");
        setHandPose("open");
        break;
      case "sad":
        setAvatarExpression("frown");
        setHandPose("down");
        break;
      case "angry":
        setAvatarExpression("angry");
        setHandPose("fist");
        break;
      case "excited":
        setAvatarExpression("big_smile");
        setHandPose("wave");
        break;
      default:
        setAvatarExpression("neutral");
        setHandPose("relaxed");
    }
  }, [emotion]);

  async function detectEmotion(text: string): Promise<string> {
    const response = await fetch("https://YOUR_EMOTION_API/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return data.emotion; // מחזיר "שמח", "עצוב", "כועס" '
  }


  return (
    <div>
      {/* <h3>Avatar Emotion: {avatarExpression}</h3>
      <h4>Hand Pose: {handPose}</h4> */}
    </div>
  );
}

export default EmotionAI;
