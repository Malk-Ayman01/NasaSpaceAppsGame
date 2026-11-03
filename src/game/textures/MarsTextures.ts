import Phaser from 'phaser';

/**
 * Procedural pixel-art and vector texture generator for Phaser 3
 * Generates high-quality Mars mission sprites directly into the game texture cache.
 */
export function generateMarsTextures(scene: Phaser.Scene) {
  // 1. Martian Regolith Ground Texture (64x64 repeatable)
  if (!scene.textures.exists('martian_ground')) {
    const canvas = scene.textures.createCanvas('martian_ground', 128, 128);
    if (canvas) {
      const ctx = canvas.getContext();
      ctx.fillStyle = '#b44a2c'; // Base Mars rust orange
      ctx.fillRect(0, 0, 128, 128);

      // Subtle texture variation & pebbles
      for (let i = 0; i < 220; i++) {
        const x = Math.random() * 128;
        const y = Math.random() * 128;
        const radius = Math.random() * 1.8 + 0.5;
        const colorVal = Math.random() > 0.5 ? '#94381e' : '#c85a38';
        ctx.fillStyle = colorVal;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Small crater ripples
      ctx.strokeStyle = 'rgba(70, 20, 10, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(36, 42, 14, 0.2, 2.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(95, 88, 10, 0.3, 2.8);
      ctx.stroke();

      canvas.refresh();
    }
  }

  // 2. Rough Sand Dune / Loose Regolith Tile (128x128)
  if (!scene.textures.exists('rough_dunes')) {
    const canvas = scene.textures.createCanvas('rough_dunes', 128, 128);
    if (canvas) {
      const ctx = canvas.getContext();
      ctx.fillStyle = '#8e351b'; // Darker sandy dune
      ctx.fillRect(0, 0, 128, 128);

      // Dune wind ripples
      ctx.strokeStyle = 'rgba(215, 100, 60, 0.4)';
      ctx.lineWidth = 3;
      for (let y = 15; y < 128; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(35, y - 8, 85, y + 8, 128, y);
        ctx.stroke();
      }

      // Darker ripple shadows
      ctx.strokeStyle = 'rgba(50, 15, 8, 0.35)';
      ctx.lineWidth = 2;
      for (let y = 18; y < 128; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(35, y - 6, 85, y + 10, 128, y);
        ctx.stroke();
      }

      canvas.refresh();
    }
  }

  // 3. Astronaut Sprite (48x48)
  if (!scene.textures.exists('astronaut')) {
    const canvas = scene.textures.createCanvas('astronaut', 48, 48);
    if (canvas) {
      const ctx = canvas.getContext();
      const cx = 24;
      const cy = 24;

      // Soft shadow
      ctx.fillStyle = 'rgba(40, 15, 10, 0.5)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 18, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Life support backpack (PLSS)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 10, cy - 14, 20, 10);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 10, cy - 14, 20, 10);

      // Oxygen connector tubes
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 14);
      ctx.lineTo(cx - 6, cy - 6);
      ctx.stroke();

      // Suit body (torso and shoulders)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Mission orange shoulder patches
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(cx - 15, cy - 1, 3, 6);
      ctx.fillRect(cx + 12, cy - 1, 3, 6);

      // Helmet (white sphere)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy + 5, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Golden reflective visor (facing downwards by default)
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy + 7, 7, 0, Math.PI);
      ctx.fill();

      // Visor highlight reflection
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 2, cy + 8, 2, 0, Math.PI * 2);
      ctx.fill();

      canvas.refresh();
    }
  }

  // 4. Mars Exploration Rover (64x96)
  if (!scene.textures.exists('rover')) {
    const canvas = scene.textures.createCanvas('rover', 72, 100);
    if (canvas) {
      const ctx = canvas.getContext();
      const cx = 36;
      const cy = 50;

      // Drop shadow
      ctx.fillStyle = 'rgba(30, 10, 5, 0.55)';
      ctx.beginPath();
      ctx.roundRect(cx - 30, cy - 42, 60, 84, 10);
      ctx.fill();

      // 6 Heavy-duty aluminum wheels (cleats)
      const wheelPositions = [
        { x: cx - 28, y: cy - 32 }, // Front-left
        { x: cx + 28, y: cy - 32 }, // Front-right
        { x: cx - 30, y: cy },      // Mid-left
        { x: cx + 30, y: cy },      // Mid-right
        { x: cx - 28, y: cy + 32 }, // Rear-left
        { x: cx + 28, y: cy + 32 }, // Rear-right
      ];

      wheelPositions.forEach((pos) => {
        // Wheel rubber/metal
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(pos.x - 5, pos.y - 10, 10, 20, 3);
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Cleat treads
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        for (let dy = -6; dy <= 6; dy += 4) {
          ctx.beginPath();
          ctx.moveTo(pos.x - 4, pos.y + dy);
          ctx.lineTo(pos.x + 4, pos.y + dy);
          ctx.stroke();
        }

        // Suspension bogie arm
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
      });

      // Main Rover Chassis Deck
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(cx - 20, cy - 34, 40, 68, 6);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gold Multi-Layer Insulation (MLI) blanket section
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 16, cy - 8, 32, 22);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 16, cy - 8, 32, 22);

      // Solar Panel / Equipment Grid
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(cx - 15, cy - 30, 30, 18);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 15, cy - 30, 30, 18);
      // Grid lines
      ctx.beginPath();
      ctx.moveTo(cx, cy - 30);
      ctx.lineTo(cx, cy - 12);
      ctx.moveTo(cx - 15, cy - 21);
      ctx.lineTo(cx + 15, cy - 21);
      ctx.stroke();

      // Mastcam-Z Sensor Tower (forward facing)
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(cx, cy - 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dual High-Intensity Headlights
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx - 12, cy - 34, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + 12, cy - 34, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // RTG (Radioisotope Thermoelectric Generator) cylinder at rear
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.roundRect(cx - 8, cy + 18, 16, 12, 3);
      ctx.fill();
      ctx.strokeStyle = '#dc2626'; // Red thermal warning strip
      ctx.lineWidth = 2;
      ctx.stroke();

      canvas.refresh();
    }
  }

  // 5. Basalt Boulders (3 variations: rock_1, rock_2, rock_3)
  const rockConfigs = [
    { key: 'rock_1', w: 60, h: 50, points: [[12, 10], [42, 8], [55, 26], [45, 44], [16, 46], [6, 30]] },
    { key: 'rock_2', w: 75, h: 65, points: [[18, 12], [54, 10], [70, 34], [58, 58], [22, 60], [8, 38]] },
    { key: 'rock_3', w: 45, h: 40, points: [[10, 8], [34, 6], [42, 22], [32, 36], [12, 36], [4, 20]] },
  ];

  rockConfigs.forEach((rock) => {
    if (!scene.textures.exists(rock.key)) {
      const canvas = scene.textures.createCanvas(rock.key, rock.w, rock.h);
      if (canvas) {
        const ctx = canvas.getContext();

        // Shadow
        ctx.fillStyle = 'rgba(25, 8, 4, 0.6)';
        ctx.beginPath();
        ctx.ellipse(rock.w / 2, rock.h / 2 + 4, rock.w / 2 - 4, rock.h / 2 - 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dark basalt body
        ctx.fillStyle = '#3f3f46';
        ctx.beginPath();
        rock.points.forEach(([px, py], idx) => {
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.fill();

        // Edge highlights (sunlit side)
        ctx.strokeStyle = '#71717a';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dust coating on top surfaces
        ctx.fillStyle = 'rgba(180, 74, 44, 0.45)';
        ctx.beginPath();
        ctx.moveTo(rock.points[0][0], rock.points[0][1]);
        ctx.lineTo(rock.points[1][0], rock.points[1][1]);
        ctx.lineTo(rock.w / 2, rock.h / 2);
        ctx.closePath();
        ctx.fill();

        canvas.refresh();
      }
    }
  });

  // 6. Habitat Module (180x180)
  if (!scene.textures.exists('habitat_base')) {
    const canvas = scene.textures.createCanvas('habitat_base', 180, 180);
    if (canvas) {
      const ctx = canvas.getContext();
      const cx = 90;
      const cy = 90;

      // Soft ground ambient occlusion
      ctx.fillStyle = 'rgba(30, 10, 5, 0.45)';
      ctx.beginPath();
      ctx.arc(cx, cy, 84, 0, Math.PI * 2);
      ctx.fill();

      // Main inflatable habitat dome (white geodesic pressurized shell)
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.arc(cx, cy, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Inner structural rings
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.stroke();

      // Central Cupola Observation Window
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Airlock Module (facing southwards towards x=90, y=160)
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 18, cy + 45, 36, 32);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 18, cy + 45, 36, 32);

      // Safe Zone Green LED Airlock Seal
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(cx - 12, cy + 68, 24, 6);

      // Habitat Markings
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ARES-1 BASE', cx, cy - 48);

      canvas.refresh();
    }
  }

  // 7. Supply Crate (44x44)
  if (!scene.textures.exists('supply_crate')) {
    const canvas = scene.textures.createCanvas('supply_crate', 44, 44);
    if (canvas) {
      const ctx = canvas.getContext();
      const cx = 22;
      const cy = 22;

      // Shadow
      ctx.fillStyle = 'rgba(30, 10, 5, 0.5)';
      ctx.beginPath();
      ctx.roundRect(4, 6, 36, 34, 4);
      ctx.fill();

      // Outer crate body
      ctx.fillStyle = '#ea580c'; // High-visibility hazard orange
      ctx.beginPath();
      ctx.roundRect(4, 4, 36, 34, 4);
      ctx.fill();
      ctx.strokeStyle = '#fdba74';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corner reinforced metal brackets
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillRect(32, 4, 8, 8);
      ctx.fillRect(4, 30, 8, 8);
      ctx.fillRect(32, 30, 8, 8);

      // Pulsing cyan status beacon in center
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // NASA stencil
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SPARE', cx, cy + 14);

      canvas.refresh();
    }
  }

  // 8. Communications Relay Tower (80x80)
  if (!scene.textures.exists('relay_tower')) {
    const canvas = scene.textures.createCanvas('relay_tower', 90, 90);
    if (canvas) {
      const ctx = canvas.getContext();
      const cx = 45;
      const cy = 45;

      // Shadow
      ctx.fillStyle = 'rgba(20, 8, 4, 0.5)';
      ctx.beginPath();
      ctx.ellipse(cx + 8, cy + 12, 34, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // Concrete / Foundation Hex Pad
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const hx = cx + Math.cos(angle) * 36;
        const hy = cy + Math.sin(angle) * 36;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Truss legs
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 26, cy + 22);
      ctx.lineTo(cx, cy);
      ctx.moveTo(cx + 26, cy + 22);
      ctx.lineTo(cx, cy);
      ctx.moveTo(cx, cy - 26);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Parabolic Satellite Dish (facing northeast)
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 4, 24, 16, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Central Feed Horn
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx + 4, cy - 6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Status LED indicator
      ctx.fillStyle = '#ef4444'; // Red until repaired
      ctx.beginPath();
      ctx.arc(cx - 20, cy + 20, 4, 0, Math.PI * 2);
      ctx.fill();

      canvas.refresh();
    }
  }

  // 9. Dust storm particle
  if (!scene.textures.exists('dust_particle')) {
    const canvas = scene.textures.createCanvas('dust_particle', 8, 8);
    if (canvas) {
      const ctx = canvas.getContext();
      ctx.fillStyle = 'rgba(234, 88, 12, 0.7)';
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      canvas.refresh();
    }
  }

  // 10. Headlight Beam Texture (200x240)
  if (!scene.textures.exists('headlight_cone')) {
    const canvas = scene.textures.createCanvas('headlight_cone', 160, 240);
    if (canvas) {
      const ctx = canvas.getContext();
      const grad = ctx.createRadialGradient(80, 20, 10, 80, 120, 140);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      grad.addColorStop(0.6, 'rgba(254, 240, 138, 0.15)');
      grad.addColorStop(1, 'rgba(254, 240, 138, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(80, 10);
      ctx.lineTo(10, 240);
      ctx.lineTo(150, 240);
      ctx.closePath();
      ctx.fill();
      canvas.refresh();
    }
  }
}
