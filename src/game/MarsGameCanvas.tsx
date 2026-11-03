import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Mission1Scene, SceneCallbacks } from './scenes/Mission1Scene';

interface MarsGameCanvasProps {
  callbacks: SceneCallbacks;
  gameRef: React.MutableRefObject<{ resetMission: () => void } | null>;
}

export const MarsGameCanvas: React.FC<MarsGameCanvasProps> = ({ callbacks, gameRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaserInstanceRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<Mission1Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      pixelArt: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      backgroundColor: '#0c0706',
      scene: [Mission1Scene],
    };

    const game = new Phaser.Game(config);
    phaserInstanceRef.current = game;

    game.scene.start('Mission1Scene', { callbacks });

    // Store scene instance for external resets
    game.events.once('step', () => {
      sceneRef.current = game.scene.getScene('Mission1Scene') as Mission1Scene;
      if (gameRef) {
        gameRef.current = {
          resetMission: () => {
            sceneRef.current?.resetMission();
          },
        };
      }
    });

    const handleResize = () => {
      if (phaserInstanceRef.current) {
        phaserInstanceRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ touchAction: 'none' }}
    />
  );
};
