import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        particles: {
          number: { value: 60 },
          size: { value: 3 },
          move: { enable: true, speed: 1 },
          opacity: { value: 0.3 },
          links: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2 },
        },
        background: {
          color: '#0d0d0d',
        },
      }}
    />
  );
};

export default ParticlesBackground;
