import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Emotion } from "./EmotionEnum";


interface AvatarProps {
  avatarUrl: string;
  emotion: Emotion;
  audioUrl: string;
  position: [number, number, number];
}

const BASE_URL = import.meta.env?.VITE_BASE_URL || "";

const Avatar: React.FC<AvatarProps> = ({ avatarUrl, emotion, audioUrl, position }) => {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(BASE_URL + avatarUrl);
  const { actions, mixer } = useAnimations(animations, group);

  const [audio] = useState(() => new Audio(audioUrl));
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaElementAudioSourceNode | null>(null);
  const [lipMovement, setLipMovement] = useState(0);
  const [isTalking, setIsTalking] = useState(false);
  const [currentNorm, setCurrentNorm] = useState(0);

  const lipSmoothRef = useRef(0);
  const morphRefs = useRef<Record<string, number>>({});

  // אחסון ה-MorphTargets של כל Mesh
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh && child.morphTargetDictionary) {
        morphRefs.current = child.morphTargetDictionary;
      }
    });
  }, [scene]);

  // הקמת AudioContext
  useEffect(() => {
    if (!audioContext && typeof window !== "undefined" && window.AudioContext) {
      setAudioContext(new AudioContext());
    }
  }, []);

  // חיבור Audio ל-AudioContext
  useEffect(() => {
    if (audioContext && audio && !sourceNode) {
      const node = audioContext.createMediaElementSource(audio);
      node.connect(audioContext.destination);
      setSourceNode(node);
    }
  }, [audio, audioContext, sourceNode]);

  // מדידת עוצמת קול לשפתיים
  useEffect(() => {
    if (!audioContext || !sourceNode) return;

    const analyser = audioContext.createAnalyser();
    sourceNode.connect(analyser);
    analyser.fftSize = 64;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const interval = setInterval(() => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const norm = Math.min(volume / 100, 1);
      setCurrentNorm(norm);
      setLipMovement(norm);
    }, 100);

    return () => clearInterval(interval);
  }, [audioContext, sourceNode]);

  // מיקום האווטאר
  useEffect(() => {
    if (!group.current) return;
    group.current.position.set(0, -5, -1);
    group.current.scale.set(3.5, 4, 2);
    group.current.rotation.set(0, 0, 0);
  }, [position]);

  // עיניים זזות קלות
  useEffect(() => {
    const leftEye = scene.getObjectByName("eyeLeft");
    const rightEye = scene.getObjectByName("eyeRight");

    const animateEyes = () => {
      if (!leftEye || !rightEye) return;
      const time = performance.now() * 0.001;
      const offsetX = Math.sin(time) * 0.05;
      const offsetY = Math.cos(time * 0.8) * 0.05;
      leftEye.rotation.set(offsetY, offsetX, 0);
      rightEye.rotation.set(offsetY, offsetX, 0);
    };

    const interval = setInterval(animateEyes, 100);
    return () => clearInterval(interval);
  }, [scene]);

  // מצמוץ עיניים + תנועות זרועות
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      const meshes: THREE.SkinnedMesh[] = [];

      const smoothed = 0.7 * lipSmoothRef.current + 0.3 * currentNorm;
      lipSmoothRef.current = smoothed;
      setLipMovement(smoothed);

      scene.traverse((child) => {
        if (child instanceof THREE.SkinnedMesh && child.morphTargetInfluences) {
          meshes.push(child);
        }

        // זרועות
        const name = child.name?.toLowerCase();
        if (name?.includes("upperarm") && !name.includes("hand")) {
          child.rotation.set(
            THREE.MathUtils.degToRad(-35),
            THREE.MathUtils.degToRad(name.includes("left") ? 5 : -5),
            THREE.MathUtils.degToRad(name.includes("left") ? 40 : -40)
          );
        }
      });

      const blinkIndex = morphRefs.current["blink"] ?? morphRefs.current["eyeBlink"];
      if (blinkIndex === undefined) return;

      meshes.forEach((mesh) => {
        mesh.morphTargetInfluences![blinkIndex] = 1;
      });

      setTimeout(() => {
        meshes.forEach((mesh) => {
          mesh.morphTargetInfluences![blinkIndex] = 0;
        });
      }, 150);
    }, 3000);

    return () => clearInterval(blinkInterval);
  }, [scene, currentNorm]);

  // עיבוד הבעות פנים ותנועות פה
  useEffect(() => {
    const morphableMeshes: THREE.SkinnedMesh[] = [];
    scene.traverse((child) => {
      if (child instanceof THREE.SkinnedMesh && child.morphTargetInfluences) {
        morphableMeshes.push(child);
      }
    });

    morphableMeshes.forEach((mesh) => {
      const morphs = mesh.morphTargetInfluences!;
      morphs.fill(0);

      const smileIndex = morphRefs.current["smile"];
      if (smileIndex !== undefined) morphs[smileIndex] = 2.5;

      const openIdx = morphRefs.current["mouthOpen"] ?? morphRefs.current["jawOpen"] ?? morphRefs.current["viseme_aa"];
      if (openIdx !== undefined) morphs[openIdx] = isTalking ? lipMovement : 0;

      const emotionMap: Record<Emotion, Partial<Record<string, number>>> = {
        [Emotion.Happy]: { smile: 1 },
        [Emotion.Sad]: { frown: 1 },
        [Emotion.Surprised]: { eyeWide: 1, jawOpen: 1 },
        [Emotion.Angry]: { browDownLeft: 1, browDownRight: 1 },
        [Emotion.Neutral]: {},
        [Emotion.Excited]: { smile: 1, eyeWide: 0.5, jawOpen: 0.3 },
        [Emotion.Talking]: {
          jawOpen: 0.8,
          mouthClose: 0,
          tongueOut: 0, // רק אם יש את זה בפייס-שייפ
          // את יכולה להוסיף אנימציות מתחלפות בשיחה אם תרצי
        },
      };

      const morphTargets = emotionMap[emotion] || {};
      for (const [key, value] of Object.entries(morphTargets)) {
        const index = morphRefs.current[key];
        if (index !== undefined) morphs[index] = value!;
      }
    });

    if (mixer && actions) {
      Object.values(actions).forEach((action) => action?.stop?.());
      if (isTalking && actions["Talking"]) {
        actions["Talking"].play();
      } else if (actions["Idle"]) {
        actions["Idle"].play();
      }
    }
  }, [emotion, lipMovement, isTalking, scene, actions, mixer]);

  // האזנה ל־play ו־ended של האודיו
  useEffect(() => {
    const onStart = () => setIsTalking(true);
    const onEnd = () => setIsTalking(false);
    audio.addEventListener("play", onStart);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("play", onStart);
      audio.removeEventListener("ended", onEnd);
    };
  }, [audio]);

   return <primitive object={scene} ref={group} />;
};

export default Avatar;
