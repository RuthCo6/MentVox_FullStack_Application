import { Canvas } from "@react-three/fiber";
import { Emotion } from "../components/EmotionEnum";
import Avatar from "../components/Avatar";

interface SceneProps {  
  avatarUrl: string;  
  children: React.ReactNode;
}

const Scene: React.FC<SceneProps> = ({ avatarUrl, children }) => (
  <div style={{ 
    position: "relative", 
    flex: 1, 
    backgroundImage: "url('/images/landscape.jpg')",
    backgroundSize: "cover", 
    backgroundPosition: "center"
  }}>
    <Canvas camera={{ position: [0, 1, 5] }} style={{ position: "relative" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      {children}
      
      {avatarUrl && (
        <Avatar
          avatarUrl={avatarUrl}
           emotion={Emotion.Excited}
          audioUrl="/funny.mp3"
          position={[0, -1, 0]} // 👈 ממקם את האווטאר בצורה יותר מסודרת
          // isTalking={true}
        />
      )}
    </Canvas>
  </div>
);

export default Scene;




//https://netfree.link/app/#/tickets/ticket/4784323

{/* <Canvas camera={{ position: [0, 1, 5] }}>
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} />
<Avatar
  avatarUrl={avatarUrl}  // השתמש ב-avatarUrl במקום modelUrl
  emotion={Emotion.Happy}
  audioUrl="/conversation.mp3"
  position={[0, 0, 0]}
  isTalking={true}
/>
{children} {/* הצגת children */}
// </Canvas> */}
