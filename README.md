# Mars Mission: Jezero Crater Expeditions

### 2D Top-Down Mars Exploration, Survival & Spaceflight Game (Phaser + React)

Join astronauts **Hazaloom**, **Hedeya**, and **Samantha** at **Ares-1 Base** inside Jezero Crater in a 3-mission interactive campaign featuring real **NASA Perseverance, RIMFAX, MEDA, and Mars Sample Return** science written in kid-friendly English.

---

## 🚀 Game Overview & Storyline

After touching down on Mars, the crew begins a routine landing check outside their spacecraft—until a sudden cabin emergency ("**The Moment Everything Changed**") damages their return ship and knocks out communications with Earth.

Progress through three linked, sequentially unlocked missions (finish each mission to unlock the next):

1. **Mission 1 — Mission Home Begins** (`Mission1Scene`)
   - Perform the opening landing check near the spacecraft to trigger the emergency cutscene (`DisasterCinematicModal`) and inspect the **Damaged Ship Status** screen.
   - Collect a spare power part from the emergency crate, drive the rover across rocky terrain, repair the Earth radio tower, and race back to the habitat before the dust storm hits.
2. **Mission 2 — Underground Cave** (`Mission2Scene`)
   - Follow the subterranean RIMFAX radar signal into Neretva Vallis and deploy two ground sensors.
   - Descend through a volcanic skylight into a dark Martian lava tube, drill a rock core sample (**Tube #14**), and escape before a Marsquake collapses the cave.
3. **Mission 3 — Rocket Home** (`Mission3Scene`)
   - Stabilize the damaged rover power grid via the interactive **Power Bus Console** (`PowerBusConsoleModal`), keeping power draw safely under `400W`.
   - Drive past swirling dust devils to the launch pad, load the rock sample into the **Mars Ascent Vehicle (MAV)**, pilot a two-stage rocket ascent (`[SPACE]` stage separation), and dock with the Earth Return Orbiter in space.

---

## 👩‍🚀 Meet the Crew

Players start through the **ARES Program** intro (`HomePage` → `LoadingScreen` → `CrewSelectionPage` / `CrewDetailsPage`) to pick a crew leader before heading to **Mission Select** (`MissionsPage`) and the **Main Menu**:

| Crew Member | ID | Role | Portrait |
|---|---|---|---|
| **Hazaloom** | `03-CMD` | Mission Commander — Drives the Mars rover, leads the team, and guides the mission home | `public/assets/characters/haz.png` |
| **Hedeya** | `01-BIO` | Fix-It & Science Engineer — Keeps spacesuits, life support, and Mars tools running safely | `public/assets/characters/had.png` |
| **Samantha** | `02-ENG` | Space Scientist & Power Lead — Checks ship power systems and studies Martian rocks & caves | `public/assets/characters/sam.png` |

---

## 🎬 In-Game Disaster Cutscene (`<video>`) Setup

During Mission 1's opening exploration, checking the spacecraft freezes gameplay and launches `DisasterCinematicModal`—an interactive HTML5 `<video>` player with timed subtitles, a **Skip** button, and a **Replay** option.

Place your AI-generated video clip(s) (e.g., from Google Flow, Kling AI, or CapCut) inside `public/assets/cinematic/`:

- **Option 1 (Single edited video):**
  ```text
  public/assets/cinematic/cutscene.mp4
  ```
- **Option 2 (Five sequential scene clips):**
  ```text
  public/assets/cinematic/scene_01.mp4
  public/assets/cinematic/scene_02.mp4
  public/assets/cinematic/scene_03.mp4
  public/assets/cinematic/scene_04.mp4
  public/assets/cinematic/scene_05.mp4
  ```

If no `.mp4` files are placed in `public/assets/cinematic/` yet, the player also lets you load a local `.mp4`/`.webm` file directly in the browser or skip ahead to the **Damaged Ship Status** briefing.

---

## ⚙️ Survival Mechanics & Controls

### Survival Systems
- **Oxygen:** Drains outdoors (`0.16%/s`), increases during the Mission 1 dust storm (`0.30%/s`), and refills inside the habitat safe ring (`+35%/s`).
- **Rover Battery:** Drains when driving (`0.20%/s` flat terrain, `0.40%/s` rough sand), `0.00%/s` idle, with extra power used by repairs and drilling.
- **Rover Integrity:** Starts at `100%`; rock, stalactite, and dust-devil impacts reduce integrity. At `0%`, the rover breaks down and you must finish on foot.
- **RIMFAX Radar (Mission 2):** Distance-based signal meter and dynamic sonar pings guide you to sensor points and the lava tube.
- **Two-Stage Ascent & Docking (Mission 3):** Steer the ascent corridor, separate Stage 1 with **`[SPACE]`**, and align with the Earth Return Orbiter docking ring.

### Controls
| Input | Action |
|---|---|
| **`W`, `A`, `S`, `D` / Arrow Keys** | Walk astronaut, drive rover, or steer the Mars Rocket |
| **`[E]`** | Interact (ship check, crates, board/exit rover, repair relay, place sensors, drill rock, launch rocket) |
| **`[SPACE]` / `[ENTER]`** | Advance radio dialogue; press **`[SPACE]`** in Mission 3 to drop Rocket Stage 1 |
| **`[M]`** | Open the **NASA Planetary Science Field Guide** |
| **`[ESC]`** | Pause Menu & Controls |
| **Speaker Icon (Top-Right)** | Mute / Unmute procedural Web Audio sound effects |

---

## 🔬 NASA Field Guide Entries (`src/data/nasaContent.ts`)

10 real NASA observation cards unlock as you play:
1. **Jezero Crater: An Old Lake on Mars** (`jezero_crater`)
2. **Fixing Broken Tools on Mars** (`equipment_maintenance`)
3. **How Mars Talks to Earth — Deep Space Network** (`space_communications`)
4. **Big Dust Storms on Mars** (`martian_dust_storms`)
5. **Looking Underground with Radar — RIMFAX** (`rimfax_subsurface_radar`)
6. **Neretva Valley: An Ancient River** (`neretva_vallis_floods`)
7. **Underground Caves on Mars — Lava Tubes** (`martian_lava_tubes`)
8. **Drilling a Mars Rock Sample** (`sample_core_caching`)
9. **Keeping Rover Power Safe from Dust — MEDA** (`sample_caching_heritage`)
10. **Launching a Rocket from Mars — Mars Ascent Vehicle** (`mars_ascent_vehicle`)

---

## 📁 Project Structure

```text
├── public/
│   └── assets/
│       ├── characters/          # Pixel-art crew portraits (had.png, haz.png, sam.png)
│       ├── cinematic/           # Drop cutscene.mp4 or scene_01..05.mp4 here
│       └── nasa/                # Real NASA Mars mission photographs
├── src/
│   ├── audio/SoundManager.ts    # Procedural Web Audio synthesizer
│   ├── components/              # HomePage, LoadingScreen, CrewSelection, MissionsPage,
│   │                            # MainMenu, HUD, DialogueOverlay, DisasterCinematicModal,
│   │                            # DamagedShipStatusModal, PowerBusConsoleModal, NasaFieldGuide, etc.
│   ├── data/
│   │   ├── CrewData.ts          # Crew profiles (Hedeya, Samantha, Hazaloom)
│   │   ├── nasaContent.ts       # Kid-friendly dialogue & 10 NASA Field Guide cards
│   │   ├── mission2Data.ts
│   │   └── mission3Data.ts
│   └── game/
│       ├── MarsGameCanvas.tsx   # Phaser lifecycle & scene bridge
│       ├── scenes/              # Mission1Scene.ts, Mission2Scene.ts, Mission3Scene.ts
│       └── textures/            # Procedural Mars terrain, rover, cave & rocket textures
├── index.html
├── metadata.json
└── package.json
```

---

## 🛠️ Tech Stack & Local Setup

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Game Engine:** Phaser (Arcade Physics, multi-scene progression, particle emitters)
- **Audio:** Procedural Web Audio API synthesizer

```bash
# 1. Install dependencies
npm install

# 2. Start the development server on port 3000
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```
