# Mars Mission: The Lost Signal (Mission 1)
### 2D Top-Down Mars Exploration & Survival Prototype

Inspired by **GTA V mission architecture**, narrative choice and emotional storytelling, and authentic **NASA Perseverance & Jezero Crater scientific data**.

---

## 🚀 Game Overview

The year is 2038. Earth is facing an accelerating resource crisis, and the human Mars exploration program has established the **Ares-1 Research Base** inside Jezero Crater—the same ancient river delta explored by NASA's Perseverance rover.

During **Sol 248**, a severe power coupling rupture at the regional communications relay tower leaves the base completely disconnected from Earth's Deep Space Network. Concurrently, orbital weather satellites detect a massive planetary dust storm advancing toward Jezero Crater.

As **Commander Alex Vance**, you must leave the habitat, secure a replacement power coupler, drive the 6-wheeled exploration rover across a hazardous basalt boulder canyon, repair the communications dish, and race back before the dust storm engulfs your sector.

---

## 🎮 Gameplay & Mission Sequence

### Stage 1: Leave the Habitat
- Exit the pressurized Ares-1 airlock into the Martian environment.
- Suit life support activates; outdoor oxygen consumption begins.
- Receive mission briefing from Chief Engineer Dr. Elena Soto and Capcom Director Chen.

### Stage 2: Retrieve the Power Coupler
- Locate the exterior emergency supply crate south of the habitat.
- Press **[E]** to interact, opening the crate and adding the power coupler to your inventory.
- Unlocks NASA Science Card #2: *Planetary In-Situ Repairs & Spares*.

### Stage 3: Board and Pilot the Mars Rover
- Move to the rover parking depot and press **[E]** to board the rover.
- Drive using **WASD** or **Arrow Keys** with realistic steering and momentum.
- Avoid collisions with basalt boulders: each hard impact damages chassis integrity (-10%) and triggers alarms.
- Rough sand dunes reduce vehicle speed and double battery consumption.

### Stage 4: Repair Communications Relay
- Reach the communications relay tower past the central crater gorge.
- Exit rover (**[E]**), approach the terminal, and initiate the repair sequence.
- Uses 5% battery to jump-start the transmitter.
- Restores downlink with Earth; unlocks NASA Science Card #3: *Deep Space Network & Relay Satellites*.

### Stage 5: Dust Storm Evacuation
- High-priority alert: the dust storm shifts course, enveloping the sector in minutes.
- Visibility drops with thick red dust particle effects and howling ambient winds.
- Suit oxygen consumption doubles (0.30%/s).
- Race back to Ares-1 habitat on wheels or on foot.

### Stage 6: Mission Complete & Mystery Signal
- Re-enter the habitat airlock safe zone (oxygen restores to 100%).
- Restored communications pick up an unidentified anomalous signal originating from the crater floor:
  > *“Signal recovered. But we are not alone out here…”*
- GTA-style debriefing screen displays total time, remaining oxygen, rover battery, hull integrity, and discoveries unlocked.

---

## ⚙️ Game Rules & Technical Calculations

All mechanics use delta time (`dt = delta / 1000`) for framerate-independent consistency:

### 1. Oxygen Life Support
- **Baseline outdoor drain:** `0.15%` per second
- **Dust storm outdoor drain:** `0.30%` per second
- **Formula:** `oxygen = max(0, oxygen - drainRate * dt)`
- **Habitat safe zone:** Standing inside the airlock ring restores oxygen at `+35%/s` up to `100%`.
- **Failure state:** If oxygen reaches `0%`, mission fails immediately with an incident debrief.

### 2. Rover Battery
- **Flat terrain driving drain:** `0.20%` per second
- **Rough sand dune drain:** `0.40%` per second
- **Relay repair power cost:** `-5.0%`
- **Stationary / idle:** `0.0%` drain
- **Formula:** `battery = max(0, battery - drainRate * dt)`
- If battery drains to `0%`, the rover stops. The astronaut can disembark and complete the mission on foot!

### 3. Rover Hull Condition
- **Starting integrity:** `100%`
- **Significant rock impact:** `-10%` per collision (with camera shake and metallic collision audio).
- If condition reaches `0%`, the suspension breaks permanently, forcing the player to proceed on foot.

---

## ⌨️ Controls

| Action | Key / Control |
|---|---|
| **Walk / Drive** | `W`, `A`, `S`, `D` or `Arrow Keys` |
| **Interact / Board Rover / Exit Rover** | `[E]` |
| **Advance / Fast-Forward Radio Dialogue** | `[SPACE]` or `[ENTER]` |
| **Open NASA Field Guide** | `[M]` or HUD button |
| **Pause / Controls Guide** | `[ESC]` or top-right menu button |
| **Audio Toggle (Mute/Unmute)** | Top-right speaker icon |

---

## 🔬 Authentic NASA Science & Image Credits

All scientific entries are grounded in official NASA documentation and use real mission images stored locally:

1. **Jezero Crater & Ancient Lake Delta**
   - *File:* `/assets/nasa/jezero_crater.jpg`
   - *NASA ID:* PIA25673 (Map of Perseverance's Delta Top Campaign)
   - *Source:* [NASA Mars 2020 Perseverance Mission](https://science.nasa.gov/mission/mars-2020-perseverance/)

2. **Planetary In-Situ Repairs & Spares**
   - *File:* `/assets/nasa/perseverance_rover.jpg`
   - *NASA ID:* PIA24542 (Perseverance & Ingenuity at Van Zyl Overlook)
   - *Source:* [NASA JPL Mars Exploration Program](https://mars.nasa.gov/mars2020/multimedia/raw-images/)

3. **Deep Space Network & Mars Relay Orbiters**
   - *File:* `/assets/nasa/deep_space_network.jpg`
   - *NASA ID:* PIA13559 (70-Meter Deep Space Communications Antenna)
   - *Source:* [NASA Deep Space Network](https://www.nasa.gov/directorates/somd/space-communications-navigation-program/deep-space-network/)

4. **Martian Dust Storms & Atmospheric Hazards**
   - *File:* `/assets/nasa/mars_dust_storm.jpg`
   - *NASA ID:* PIA22329 (NASA Mars Global Dust Storm Comparison)
   - *Source:* [NASA Mars Exploration Science](https://science.nasa.gov/mission/mars-2020-perseverance/science/)

---

## 🛠️ Technology Stack & Architecture

- **Game Engine:** Phaser 3 (Arcade Physics, dynamic particle emitters, custom procedural texture generation).
- **Frontend Framework:** React 19 + TypeScript + Vite.
- **Audio Engine:** Zero-dependency Web Audio API procedural synthesizer (dynamic engine pitch, footstep crunches, radio beeps, collision clatter, warning alarms, wind ambiance, and GTA-style brass stingers).
- **Styling:** Tailwind CSS v4, custom CRT scanline overlays, responsive HUD layout.
- **Backend:** 100% client-side prototype. No server or database required.

### Project Directory Structure
```
/
├── public/
│   └── assets/
│       └── nasa/                  # Authentic NASA photographs (local offline cache)
│           ├── jezero_crater.jpg
│           ├── perseverance_rover.jpg
│           ├── deep_space_network.jpg
│           └── mars_dust_storm.jpg
├── src/
│   ├── audio/
│   │   └── SoundManager.ts        # Web Audio API synthesizer
│   ├── components/
│   │   ├── Cinematics.tsx         # Opening mission cinematic
│   │   ├── DialogueOverlay.tsx    # Character portraits & typewriter radio box
│   │   ├── EducationalModal.tsx   # Verified NASA science popup cards
│   │   ├── GameOverModal.tsx      # Life support failure screen
│   │   ├── HUD.tsx                # GTA V style radar, meters, and objective banners
│   │   ├── MainMenu.tsx           # Mission launcher & briefing screen
│   │   ├── MissionCompleteModal.tsx # Debrief stats & cliffhanger ending
│   │   ├── NasaFieldGuide.tsx     # Full encyclopedia of discovered NASA facts
│   │   └── PauseMenu.tsx          # Controls guide & options
│   ├── data/
│   │   └── nasaContent.ts         # Educational facts & radio dialogue scripts
│   ├── game/
│   │   ├── scenes/
│   │   │   └── Mission1Scene.ts   # Core Phaser 3 physics, driving, and mission loop
│   │   ├── textures/
│   │   │   └── MarsTextures.ts    # Procedural texture & sprite generator
│   │   └── MarsGameCanvas.tsx     # React to Phaser canvas mounting bridge
│   ├── types/
│   │   └── game.ts                # TypeScript interfaces
│   ├── App.tsx                    # Root orchestrator
│   ├── index.css                  # Martian themes & scanlines
│   └── main.tsx                   # React entry point
└── package.json
```

---

## 📦 Installation & Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:3000
```

---

## ⚠️ Known Limitations & Future Roadmap

- **Mission 2: The Anomaly:** The mysterious repeating signal discovered in Mission 1 sets up the narrative arc for Mission 2 (exploring an ancient subsurface lava tube).
- **Controller Support:** The prototype is currently optimized for desktop keyboard controls (`WASD` + `E` + `Space`). Gamepad API integration can be added in subsequent milestones.
- **Expanded Map Zones:** Mission 1 is intentionally compact and bounded to deliver a tightly calibrated university team prototype without overextending maintenance scope.
