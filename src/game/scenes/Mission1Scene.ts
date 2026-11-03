import Phaser from 'phaser';
import { generateMarsTextures } from '../textures/MarsTextures';
import { GameResources, MissionStage, Waypoint } from '../../types/game';
import { sounds } from '../../audio/SoundManager';

export interface SceneCallbacks {
  onResourceUpdate: (resources: GameResources) => void;
  onStageChange: (stage: MissionStage) => void;
  onPromptChange: (prompt: string | null) => void;
  onDialogueTrigger: (dialogueKey: string) => void;
  onFactUnlock: (factId: string) => void;
  onWarning: (msg: string) => void;
  onWaypointUpdate: (wp: Waypoint) => void;
  onMissionEnd: (success: boolean) => void;
}

export class Mission1Scene extends Phaser.Scene {
  private callbacks!: SceneCallbacks;

  // Entities
  private astronaut!: Phaser.Physics.Arcade.Sprite;
  private rover!: Phaser.Physics.Arcade.Sprite;
  private roverHeadlight!: Phaser.GameObjects.Image;
  private habitatSprite!: Phaser.GameObjects.Sprite;
  private crateSprite!: Phaser.GameObjects.Sprite;
  private relayTowerSprite!: Phaser.GameObjects.Sprite;
  private relayDishGlow!: Phaser.GameObjects.Arc;
  private safeZoneCircle!: Phaser.GameObjects.Arc;

  // Groups
  private rocksGroup!: Phaser.Physics.Arcade.StaticGroup;
  private roughZonesGroup!: Phaser.GameObjects.Zone[];

  // Dust storm particles
  private stormEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  // Controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
  };

  // State
  private stage: MissionStage = 'stage_1_leave_habitat';
  private oxygen = 100;
  private battery = 100;
  private condition = 100;
  private hasCoupler = false;
  private isInRover = false;
  private isInsideHabitat = true;
  private isDustStormActive = false;
  private rockCollisions = 0;
  private elapsedSeconds = 0;

  // Rover physics
  private roverSpeed = 0;
  private roverMaxSpeed = 260;
  private roverAcceleration = 220;
  private roverDrag = 140;
  private roverTurnSpeed = 2.4;

  // Repair tracking
  private isRepairing = false;
  private repairProgress = 0;

  // Cooldowns
  private eKeyCooldown = 0;
  private collisionCooldown = 0;

  // Waypoints
  private waypointLocations = {
    crate: { x: 520, y: 720, label: 'Supply Crate' },
    rover: { x: 700, y: 520, label: 'Mars Rover' },
    relay: { x: 1950, y: 850, label: 'Communications Relay' },
    habitat: { x: 350, y: 500, label: 'Ares-1 Habitat' },
  };

  constructor() {
    super('Mission1Scene');
  }

  public init(data: { callbacks: SceneCallbacks }) {
    this.callbacks = data.callbacks;
  }

  public preload() {
    // Generate all game textures directly in memory
    generateMarsTextures(this);
  }

  public create() {
    // World bounds: 2400 x 1800
    const worldWidth = 2400;
    const worldHeight = 1800;
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    // 1. Martian Ground Tilemap Simulation
    this.add.tileSprite(worldWidth / 2, worldHeight / 2, worldWidth, worldHeight, 'martian_ground');

    // 2. Rough Sand Dune zones (rough terrain that drains battery faster)
    this.roughZonesGroup = [];
    const duneAreas = [
      { x: 1050, y: 650, w: 280, h: 420 },
      { x: 1400, y: 1100, w: 320, h: 360 },
      { x: 1650, y: 500, w: 260, h: 400 },
    ];

    duneAreas.forEach((d) => {
      this.add.tileSprite(d.x, d.y, d.w, d.h, 'rough_dunes').setAlpha(0.85);
      const zone = this.add.zone(d.x, d.y, d.w, d.h);
      this.roughZonesGroup.push(zone);
    });

    // 3. Rover Wheel Tracks / Trail Layer (Ground decorative guides)
    const trackGraphics = this.add.graphics();
    trackGraphics.lineStyle(4, 0x822e16, 0.45);
    // Draw trail between habitat and crate
    trackGraphics.beginPath();
    trackGraphics.moveTo(370, 560);
    trackGraphics.lineTo(520, 700);
    trackGraphics.lineTo(690, 530);
    trackGraphics.stroke();

    // 4. Habitat Base at (350, 500)
    this.habitatSprite = this.add.sprite(350, 500, 'habitat_base');
    this.safeZoneCircle = this.add.circle(350, 500, 140, 0x22c55e, 0.12);
    this.safeZoneCircle.setStrokeStyle(2, 0x22c55e, 0.4);

    // 5. Supply Crate at (520, 720)
    this.crateSprite = this.add.sprite(520, 720, 'supply_crate');

    // Pulsing crate beacon
    this.tweens.add({
      targets: this.crateSprite,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // 6. Communications Relay Tower at (1950, 850)
    this.relayTowerSprite = this.add.sprite(1950, 850, 'relay_tower');
    this.relayDishGlow = this.add.circle(1950, 844, 28, 0x0284c7, 0);
    this.relayDishGlow.setStrokeStyle(2, 0x38bdf8, 0);

    // 7. Basalt Rock Obstacle Field (Creates winding path through the central crater)
    this.rocksGroup = this.physics.add.staticGroup();

    const rockPositions = [
      // Habitat perimeter barriers
      { x: 220, y: 340, key: 'rock_2' },
      { x: 180, y: 520, key: 'rock_1' },
      { x: 230, y: 680, key: 'rock_3' },
      { x: 420, y: 280, key: 'rock_1' },

      // Central gorge / canyon obstacles (forces navigation)
      { x: 880, y: 380, key: 'rock_2' },
      { x: 890, y: 460, key: 'rock_1' },
      { x: 920, y: 740, key: 'rock_3' },
      { x: 910, y: 920, key: 'rock_2' },
      { x: 950, y: 1100, key: 'rock_1' },

      // Mid canyon choke point
      { x: 1160, y: 320, key: 'rock_1' },
      { x: 1220, y: 480, key: 'rock_2' },
      { x: 1180, y: 880, key: 'rock_2' },
      { x: 1260, y: 1040, key: 'rock_3' },
      { x: 1140, y: 1300, key: 'rock_1' },

      // East approach to relay
      { x: 1480, y: 420, key: 'rock_3' },
      { x: 1540, y: 700, key: 'rock_2' },
      { x: 1500, y: 960, key: 'rock_1' },
      { x: 1560, y: 1250, key: 'rock_2' },
      { x: 1720, y: 580, key: 'rock_1' },
      { x: 1750, y: 980, key: 'rock_3' },
      { x: 1820, y: 720, key: 'rock_2' },
      { x: 2080, y: 780, key: 'rock_2' },
      { x: 2060, y: 940, key: 'rock_1' },
      { x: 1950, y: 1020, key: 'rock_3' },

      // Perimeter border rocks
      { x: 800, y: 1500, key: 'rock_2' },
      { x: 1200, y: 1600, key: 'rock_1' },
      { x: 1600, y: 1550, key: 'rock_3' },
      { x: 600, y: 150, key: 'rock_2' },
      { x: 1400, y: 140, key: 'rock_1' },
    ];

    rockPositions.forEach((pos) => {
      const rock = this.rocksGroup.create(pos.x, pos.y, pos.key) as Phaser.Physics.Arcade.Sprite;
      rock.refreshBody();
      // Adjust circular physics body for natural round rock collisions
      const radius = rock.width * 0.38;
      rock.body?.setCircle(radius, rock.width / 2 - radius, rock.height / 2 - radius);
    });

    // 8. Mars Rover Entity at (700, 520)
    this.rover = this.physics.add.sprite(700, 520, 'rover');
    this.rover.setOrigin(0.5, 0.5);
    this.rover.setCollideWorldBounds(true);
    this.rover.setDepth(15);
    this.rover.setRotation(Math.PI / 2); // Facing east
    // Rover collider size
    this.rover.body?.setSize(48, 70);

    // Rover Headlight Cone
    this.roverHeadlight = this.add.image(700, 520, 'headlight_cone');
    this.roverHeadlight.setOrigin(0.5, 0);
    this.roverHeadlight.setDepth(14);
    this.roverHeadlight.setVisible(true);

    // 9. Astronaut Player Entity at Habitat Airlock (350, 550)
    this.astronaut = this.physics.add.sprite(350, 550, 'astronaut');
    this.astronaut.setOrigin(0.5, 0.5);
    this.astronaut.setCollideWorldBounds(true);
    this.astronaut.setDepth(20);
    this.astronaut.body?.setCircle(14, 10, 10);

    // 10. Physics Collisions
    this.physics.add.collider(this.astronaut, this.rocksGroup);
    this.physics.add.collider(this.rover, this.rocksGroup, this.handleRoverRockCollision, undefined, this);

    // 11. Dust Storm Particle Emitter (dormant until Stage 5)
    this.stormEmitter = this.add.particles(0, 0, 'dust_particle', {
      x: { min: 0, max: worldWidth },
      y: { min: 0, max: worldHeight },
      speedX: { min: -380, max: -240 },
      speedY: { min: 80, max: 180 },
      scale: { start: 1.2, end: 0.2 },
      alpha: { start: 0.7, end: 0 },
      lifespan: 1400,
      frequency: 25,
      emitting: false,
    });
    this.stormEmitter.setDepth(35);

    // 12. Camera Follow Setup
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.astronaut, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.15);

    // 13. Input Keys
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      E: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      SPACE: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    // Trigger first educational fact on start
    this.callbacks.onFactUnlock('jezero_crater');
    this.callbacks.onStageChange(this.stage);
    this.callbacks.onDialogueTrigger('stage1_exit');
    sounds.playObjectiveStinger();
  }

  // Rover Collision with Rocks
  private handleRoverRockCollision() {
    if (!this.isInRover || this.collisionCooldown > 0) return;

    const currentSpeed = Math.abs(this.roverSpeed);
    if (currentSpeed > 50) {
      this.collisionCooldown = 0.8; // 800ms cooldown between damage hits
      this.rockCollisions++;
      this.condition = Math.max(0, this.condition - 10);

      sounds.playCrash();
      this.cameras.main.shake(180, 0.012);

      // Bounce back slightly
      this.roverSpeed = -this.roverSpeed * 0.4;

      this.callbacks.onWarning(`IMPACT DETECTED! Rover integrity: ${Math.round(this.condition)}%`);

      // Check if rover is broken
      if (this.condition <= 0) {
        this.callbacks.onWarning('ROVER CRITICAL FAILURE: Rocker-bogie suspension snapped! Abandon vehicle!');
        this.exitRover();
      }
    }
  }

  // Enter Rover
  private enterRover() {
    if (this.condition <= 0) {
      this.callbacks.onWarning('Rover is unusable due to severe structural damage.');
      return;
    }
    this.isInRover = true;
    this.astronaut.setVisible(false);
    this.astronaut.body!.enable = false;
    this.cameras.main.startFollow(this.rover, true, 0.08, 0.08);

    if (this.stage === 'stage_3_drive_rover') {
      this.callbacks.onDialogueTrigger('stage3_rover_enter');
    }
  }

  // Exit Rover
  private exitRover() {
    this.isInRover = false;
    this.roverSpeed = 0;
    sounds.stopEngine();

    // Position astronaut beside rover
    const exitAngle = this.rover.rotation + Math.PI / 2;
    const exitX = this.rover.x + Math.cos(exitAngle) * 44;
    const exitY = this.rover.y + Math.sin(exitAngle) * 44;

    this.astronaut.setPosition(exitX, exitY);
    this.astronaut.setVisible(true);
    this.astronaut.body!.enable = true;
    this.cameras.main.startFollow(this.astronaut, true, 0.08, 0.08);
  }

  public update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.elapsedSeconds += dt;

    if (this.eKeyCooldown > 0) this.eKeyCooldown -= dt;
    if (this.collisionCooldown > 0) this.collisionCooldown -= dt;

    // Check if player is inside safe habitat
    const distToHabitat = Phaser.Math.Distance.Between(
      this.isInRover ? this.rover.x : this.astronaut.x,
      this.isInRover ? this.rover.y : this.astronaut.y,
      350,
      500
    );
    this.isInsideHabitat = distToHabitat < 135;

    // 1. Oxygen Drain Calculation
    if (this.isInsideHabitat) {
      // Refill oxygen inside habitat safe zone
      this.oxygen = Math.min(100, this.oxygen + 35 * dt);
    } else {
      // Outdoor oxygen consumption
      const drainRate = this.isDustStormActive ? 0.30 : 0.15;
      this.oxygen = Math.max(0, this.oxygen - drainRate * dt);

      if (this.oxygen <= 0 && this.stage !== 'mission_failed') {
        this.stage = 'mission_failed';
        sounds.playMissionFailed();
        this.callbacks.onMissionEnd(false);
        return;
      }
    }

    // Check if in rough dunes (increases battery consumption)
    let inRoughDunes = false;
    const currentEntityX = this.isInRover ? this.rover.x : this.astronaut.x;
    const currentEntityY = this.isInRover ? this.rover.y : this.astronaut.y;

    for (const zone of this.roughZonesGroup) {
      if (
        currentEntityX >= zone.x - zone.width / 2 &&
        currentEntityX <= zone.x + zone.width / 2 &&
        currentEntityY >= zone.y - zone.height / 2 &&
        currentEntityY <= zone.y + zone.height / 2
      ) {
        inRoughDunes = true;
        break;
      }
    }

    // 2. Handle Controls
    if (!this.isInRover) {
      this.updateAstronautMovement(dt);
    } else {
      this.updateRoverMovement(dt, inRoughDunes);
    }

    // 3. Interactions & Objective logic
    this.updateMissionLogic(dt);

    // 4. Update Headlights
    this.roverHeadlight.setPosition(this.rover.x, this.rover.y);
    this.roverHeadlight.setRotation(this.rover.rotation - Math.PI / 2);

    // 5. Send Resource State to React HUD
    this.callbacks.onResourceUpdate({
      oxygen: this.oxygen,
      battery: this.battery,
      condition: this.condition,
      hasCoupler: this.hasCoupler,
      isInRover: this.isInRover,
      isInsideHabitat: this.isInsideHabitat,
      isDustStormActive: this.isDustStormActive,
      elapsedSeconds: this.elapsedSeconds,
      rockCollisions: this.rockCollisions,
    });
  }

  // Astronaut Walking Movement
  private updateAstronautMovement(_dt: number) {
    const body = this.astronaut.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    let vy = 0;
    const speed = 150;

    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    if (left) vx -= speed;
    if (right) vx += speed;
    if (up) vy -= speed;
    if (down) vy += speed;

    // Normalize diagonal velocity
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    body.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      const angle = Math.atan2(vy, vx);
      this.astronaut.setRotation(angle - Math.PI / 2);
      sounds.playFootstep();
    }
  }

  // Rover Driving Movement
  private updateRoverMovement(dt: number, inRoughDunes: boolean) {
    const left = this.cursors.left.isDown || this.wasd.A.isDown;
    const right = this.cursors.right.isDown || this.wasd.D.isDown;
    const up = this.cursors.up.isDown || this.wasd.W.isDown;
    const down = this.cursors.down.isDown || this.wasd.S.isDown;

    const maxSpeed = inRoughDunes ? 160 : this.roverMaxSpeed;

    // Steering (can only turn effectively when in motion or throttle applied)
    if (left) {
      this.rover.rotation -= this.roverTurnSpeed * dt;
    }
    if (right) {
      this.rover.rotation += this.roverTurnSpeed * dt;
    }

    // Throttle & Braking
    if (up && this.battery > 0 && this.condition > 0) {
      this.roverSpeed = Math.min(maxSpeed, this.roverSpeed + this.roverAcceleration * dt);
    } else if (down && this.battery > 0 && this.condition > 0) {
      this.roverSpeed = Math.max(-100, this.roverSpeed - this.roverAcceleration * dt);
    } else {
      // Natural drag / rolling resistance
      if (this.roverSpeed > 0) {
        this.roverSpeed = Math.max(0, this.roverSpeed - this.roverDrag * dt);
      } else if (this.roverSpeed < 0) {
        this.roverSpeed = Math.min(0, this.roverSpeed + this.roverDrag * dt);
      }
    }

    // Set Arcade physics velocity vector aligned with rover orientation
    const angle = this.rover.rotation - Math.PI / 2;
    const vx = Math.cos(angle) * this.roverSpeed;
    const vy = Math.sin(angle) * this.roverSpeed;
    this.rover.setVelocity(vx, vy);

    // Battery Drain while driving
    const isDriving = Math.abs(this.roverSpeed) > 10;
    if (isDriving) {
      const drainRate = inRoughDunes ? 0.40 : 0.20;
      this.battery = Math.max(0, this.battery - drainRate * dt);

      if (this.battery <= 0) {
        this.callbacks.onWarning('ROVER BATTERY DEPLETED! Vehicle halted. Proceed on foot.');
        this.roverSpeed = 0;
      }
    }

    // Audio engine pitch
    const speedRatio = Math.abs(this.roverSpeed) / this.roverMaxSpeed;
    sounds.updateEngine(speedRatio, isDriving);
  }

  // Interactive Prompts and Mission State Progressions
  private updateMissionLogic(dt: number) {
    const px = this.isInRover ? this.rover.x : this.astronaut.x;
    const py = this.isInRover ? this.rover.y : this.astronaut.y;

    const distToCrate = Phaser.Math.Distance.Between(this.astronaut.x, this.astronaut.y, 520, 720);
    const distToRover = Phaser.Math.Distance.Between(this.astronaut.x, this.astronaut.y, this.rover.x, this.rover.y);
    const distToRelay = Phaser.Math.Distance.Between(this.astronaut.x, this.astronaut.y, 1950, 850);
    const distToHabitat = Phaser.Math.Distance.Between(px, py, 350, 500);

    let prompt: string | null = null;
    const ePressed = Phaser.Input.Keyboard.JustDown(this.wasd.E);

    // 1. Stage 1: Leave Habitat -> Collect Coupler
    if (this.stage === 'stage_1_leave_habitat') {
      this.callbacks.onWaypointUpdate({
        x: 520,
        y: 720,
        label: 'Supply Crate',
        distanceMeters: Math.round(distToCrate / 10),
        stage: this.stage,
      });

      if (!this.isInsideHabitat) {
        this.stage = 'stage_2_collect_coupler';
        this.callbacks.onStageChange(this.stage);
      }
    }

    // 2. Stage 2: Open Crate & Collect Coupler
    if (this.stage === 'stage_2_collect_coupler') {
      this.callbacks.onWaypointUpdate({
        x: 520,
        y: 720,
        label: 'Supply Crate',
        distanceMeters: Math.round(distToCrate / 10),
        stage: this.stage,
      });

      if (!this.hasCoupler && distToCrate < 75 && !this.isInRover) {
        prompt = '[E] Open Supply Crate';
        if (ePressed && this.eKeyCooldown <= 0) {
          this.eKeyCooldown = 0.5;
          this.hasCoupler = true;
          sounds.playPickup();
          this.callbacks.onFactUnlock('equipment_maintenance');
          this.callbacks.onDialogueTrigger('stage2_crate');
          sounds.playObjectiveStinger();
          this.stage = 'stage_3_drive_rover';
          this.callbacks.onStageChange(this.stage);
        }
      }
    }

    // 3. Stage 3: Reach & Enter Rover, Drive to Relay
    if (this.stage === 'stage_3_drive_rover') {
      if (!this.isInRover) {
        this.callbacks.onWaypointUpdate({
          x: this.rover.x,
          y: this.rover.y,
          label: 'Mars Rover Depot',
          distanceMeters: Math.round(distToRover / 10),
          stage: this.stage,
        });

        if (distToRover < 80) {
          prompt = '[E] Enter Mars Rover';
          if (ePressed && this.eKeyCooldown <= 0) {
            this.eKeyCooldown = 0.5;
            this.enterRover();
            this.stage = 'stage_4_repair_relay';
            this.callbacks.onStageChange(this.stage);
            sounds.playObjectiveStinger();
          }
        }
      }
    }

    // 4. Stage 4: Reach Relay & Repair
    if (this.stage === 'stage_4_repair_relay') {
      this.callbacks.onWaypointUpdate({
        x: 1950,
        y: 850,
        label: 'Communications Relay Tower',
        distanceMeters: Math.round(Phaser.Math.Distance.Between(px, py, 1950, 850) / 10),
        stage: this.stage,
      });

      // Can enter/exit rover anytime
      if (this.isInRover) {
        prompt = '[E] Exit Rover';
        if (ePressed && this.eKeyCooldown <= 0) {
          this.eKeyCooldown = 0.5;
          this.exitRover();
        }
      } else if (distToRover < 80) {
        prompt = '[E] Enter Rover';
        if (ePressed && this.eKeyCooldown <= 0) {
          this.eKeyCooldown = 0.5;
          this.enterRover();
        }
      }

      // Approach relay on foot with coupler
      if (!this.isInRover && distToRelay < 95) {
        if (this.hasCoupler) {
          if (!this.isRepairing) {
            prompt = '[E] Repair Communications Relay';
            if (ePressed && this.eKeyCooldown <= 0) {
              this.eKeyCooldown = 0.5;
              this.isRepairing = true;
              this.repairProgress = 0;
              sounds.playRepairHum();
            }
          } else {
            prompt = `Repairing Relay Bus... ${Math.round(this.repairProgress)}%`;
            this.repairProgress += 45 * dt;

            if (this.repairProgress >= 100) {
              this.isRepairing = false;
              // Relay repaired! Deduct 5% battery for jumper power
              this.battery = Math.max(0, this.battery - 5);

              // Visual restoration effects
              this.relayDishGlow.setAlpha(0.7);
              this.tweens.add({
                targets: this.relayDishGlow,
                scaleX: 2.2,
                scaleY: 2.2,
                alpha: 0,
                duration: 1400,
                repeat: -1,
              });

              sounds.playObjectiveStinger();
              this.callbacks.onDialogueTrigger('stage4_repaired');
              this.callbacks.onFactUnlock('space_communications');

              // Advance to Stage 5: Dust Storm Escape!
              this.time.delayedCall(2200, () => {
                this.stage = 'stage_5_escape_storm';
                this.callbacks.onStageChange(this.stage);
                this.callbacks.onDialogueTrigger('stage5_storm_alert');
                this.callbacks.onFactUnlock('martian_dust_storms');
                this.isDustStormActive = true;
                this.stormEmitter.start();
                sounds.setStormWind(true);
                sounds.playWarningAlarm();
                sounds.playObjectiveStinger();
              });
            }
          }
        } else {
          prompt = 'Coupler Missing! Retrieve from Supply Crate.';
        }
      }
    }

    // 5. Stage 5: Escape the Storm & Return to Habitat
    if (this.stage === 'stage_5_escape_storm') {
      this.callbacks.onWaypointUpdate({
        x: 350,
        y: 500,
        label: 'Ares-1 Habitat (Safe Haven)',
        distanceMeters: Math.round(distToHabitat / 10),
        stage: this.stage,
      });

      // Enter/exit rover toggles
      if (this.isInRover) {
        prompt = '[E] Exit Rover';
        if (ePressed && this.eKeyCooldown <= 0) {
          this.eKeyCooldown = 0.5;
          this.exitRover();
        }
      } else if (distToRover < 80) {
        prompt = '[E] Enter Rover';
        if (ePressed && this.eKeyCooldown <= 0) {
          this.eKeyCooldown = 0.5;
          this.enterRover();
        }
      }

      // Check if safely returned inside habitat
      if (distToHabitat < 130) {
        this.stage = 'cinematic_ending';
        this.callbacks.onStageChange(this.stage);
        sounds.setStormWind(false);
        sounds.stopEngine();
        sounds.playMissionSuccess();
        this.callbacks.onDialogueTrigger('ending');
      }
    }

    this.callbacks.onPromptChange(prompt);
  }

  // Reset entire mission
  public resetMission() {
    this.stage = 'stage_1_leave_habitat';
    this.oxygen = 100;
    this.battery = 100;
    this.condition = 100;
    this.hasCoupler = false;
    this.isInRover = false;
    this.isInsideHabitat = true;
    this.isDustStormActive = false;
    this.rockCollisions = 0;
    this.elapsedSeconds = 0;
    this.roverSpeed = 0;
    this.isRepairing = false;
    this.repairProgress = 0;

    sounds.setStormWind(false);
    sounds.stopEngine();

    this.stormEmitter.stop();
    this.relayDishGlow.setAlpha(0);

    this.rover.setPosition(700, 520);
    this.rover.setRotation(Math.PI / 2);
    this.rover.setVelocity(0, 0);

    this.astronaut.setPosition(350, 550);
    this.astronaut.setVisible(true);
    this.astronaut.body!.enable = true;
    this.astronaut.setVelocity(0, 0);

    this.cameras.main.startFollow(this.astronaut, true, 0.08, 0.08);

    this.callbacks.onStageChange(this.stage);
    this.callbacks.onDialogueTrigger('stage1_exit');
    sounds.playObjectiveStinger();
  }
}
