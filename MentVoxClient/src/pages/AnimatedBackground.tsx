// src/components/AnimatedBackground.tsx
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const AnimatedBackground = () => {
  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        particles: {
          number: { value: 40 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.4 },
          size: { value: { min: 1, max: 5 } },
          move: { enable: true, speed: 1 }
        },
        background: { color: "#0f2027" }
      }}
    />
  );
};

export default AnimatedBackground;
