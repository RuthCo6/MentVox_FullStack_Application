import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Scene from "./Scene";
import AvatarSelector from "./AvatarSelector";
import { Emotion } from "./EmotionEnum";
import Avatar from "./Avatar";
import api from '../pages/api';

const DEFAULT_AVATAR = "/FORMAL.glb"; // נתיב ברירת מחדל

const Dashboard: React.FC = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await api.get('/auth/all-users');
        console.log("📦 Users:", data);
        // setUsers(data); // אם יש לך state
      } catch (err) {
        console.error("❌ Failed to fetch users", err);
      }
    };

    fetchData();
  }, [user, navigate]);



  useEffect(() => {
    console.log("Avatar URL selected:", avatarUrl); // בדיקה בקונסול
  }, [avatarUrl]);

  if (!user) return null; // אם אין משתמש, לא מציג כלום

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <AvatarSelector setAvatarUrl={setAvatarUrl} />
      <p>אווטאר שנבחר: {avatarUrl}</p> {/* יציג את כתובת ה-GLB שבחרו */}

      <Scene avatarUrl={avatarUrl}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Avatar
          avatarUrl={avatarUrl}
          emotion={Emotion.Happy}
          audioUrl="/funny.mp3"
          position={[0, 0, 0]}
        // isTalking={false}
        />
      </Scene>
    </div>
  );
};

export default Dashboard;
