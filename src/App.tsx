import React, { useState, useRef, useCallback } from 'react';
import { MarsGameCanvas } from './game/MarsGameCanvas';
import { SceneCallbacks } from './game/scenes/Mission1Scene';
import { HUD } from './components/HUD';
import { DialogueOverlay } from './components/DialogueOverlay';
import { EducationalModal } from './components/EducationalModal';
import { OpeningCinematic } from './components/Cinematics';
import { MissionCompleteModal } from './components/MissionCompleteModal';
import { GameOverModal } from './components/GameOverModal';
import { PauseMenu } from './components/PauseMenu';
import { NasaFieldGuide } from './components/NasaFieldGuide';
import { MainMenu } from './components/MainMenu';
import { DIALOGUE_SCRIPTS, NASA_FACTS } from './data/nasaContent';
import { GameResources, MissionStage, Waypoint, DialogueLine, EducationalFact, MissionStats } from './types/game';
import { sounds } from './audio/SoundManager';
import LoadingScreen  from './components/LoadingScreen';
import CrewSelectionPage from './components/CrewSelectionPage';
import type { crews } from './data/CrewData';
import HomePage from './components/HomePage';
import MissionsPage from './components/MissionsPage';
import RotateDevice from "./components/RotateDevice";




type GameScreenState =
  | 'home'
  | 'loading'
  | 'crew_selection'
  | 'missions'
  | 'mission_menu'
  | 'cinematic'
  | 'playing'
  | 'mission_complete'
  | 'mission_failed';

// type GameScreenState =
//   | 'menu'
//   | 'loading'
//   | 'crew_selection'
//   | 'crew_details'
//   | 'cinematic'
//   | 'playing'
//   | 'mission_complete'
//   | 'mission_failed';

type CrewMember = (typeof crews)[number];
// type GameScreenState = 'menu' |'loading'| 'cinematic' | 'playing' | 'mission_complete' | 'mission_failed';

export default function App() {

  const [screenState, setScreenState] = useState<GameScreenState>('home');
  // const [screenState, setScreenState] = useState<GameScreenState>('menu');
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [stage, setStage] = useState<MissionStage>('stage_1_leave_habitat');

  const [resources, setResources] = useState<GameResources>({
    oxygen: 100,
    battery: 100,
    condition: 100,
    hasCoupler: false,
    isInRover: false,
    isInsideHabitat: true,
    isDustStormActive: false,
    elapsedSeconds: 0,
    rockCollisions: 0,
  });

  const [activeDialogue, setActiveDialogue] = useState<DialogueLine[] | null>(null);
  const [activeEducationalFact, setActiveEducationalFact] = useState<EducationalFact | null>(null);
  const [unlockedFactIds, setUnlockedFactIds] = useState<string[]>(['jezero_crater']);
  const [waypoint, setWaypoint] = useState<Waypoint | null>(null);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isFieldGuideOpen, setIsFieldGuideOpen] = useState(false);

  const gameRef = useRef<{ resetMission: () => void } | null>(null);

  // Warning toast clearer
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleWarning = useCallback((msg: string) => {
    setWarningMessage(msg);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = setTimeout(() => {
      setWarningMessage(null);
    }, 4000);
  }, []);

  const handleDialogueTrigger = useCallback((dialogueKey: string) => {
    const lines = DIALOGUE_SCRIPTS[dialogueKey];
    if (lines && lines.length > 0) {
      setActiveDialogue(lines);
    }
  }, []);

  const handleFactUnlock = useCallback((factId: string) => {
    setUnlockedFactIds((prev) => {
      if (!prev.includes(factId)) {
        const fact = NASA_FACTS.find((f) => f.id === factId);
        if (fact) {
          // Display the educational popup to the player
          setTimeout(() => {
            setActiveEducationalFact(fact);
          }, 800);
        }
        return [...prev, factId];
      }
      return prev;
    });
  }, []);

  const handleStageChange = useCallback((newStage: MissionStage) => {
    setStage(newStage);
  }, []);

  const handleMissionEnd = useCallback((success: boolean) => {
    if (success) {
      setScreenState('mission_complete');
    } else {
      setScreenState('mission_failed');
    }
  }, []);

  const callbacks: SceneCallbacks = {
    onResourceUpdate: (res) => {
      setResources(res);
      if (res.oxygen <= 0 && screenState === 'playing') {
        setScreenState('mission_failed');
      }
    },
    onStageChange: handleStageChange,
    onPromptChange: (prompt) => setInteractionPrompt(prompt),
    onDialogueTrigger: handleDialogueTrigger,
    onFactUnlock: handleFactUnlock,
    onWarning: handleWarning,
    onWaypointUpdate: (wp) => setWaypoint(wp),
    onMissionEnd: handleMissionEnd,
  };

  const handleStartMissionFromCinematic = () => {
    setScreenState('playing');
    sounds.playObjectiveStinger();
  };

  const handleRestartMission = () => {
    setIsPaused(false);
    setActiveDialogue(null);
    setActiveEducationalFact(null);
    setInteractionPrompt(null);
    setWarningMessage(null);
    setStage('stage_1_leave_habitat');
    setResources({
      oxygen: 100,
      battery: 100,
      condition: 100,
      hasCoupler: false,
      isInRover: false,
      isInsideHabitat: true,
      isDustStormActive: false,
      elapsedSeconds: 0,
      rockCollisions: 0,
    });
    setScreenState('playing');
    gameRef.current?.resetMission();
  };

  // Keyboard shortcut for Esc (Pause) and M (Field Guide)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screenState !== 'playing') return;
      if (e.code === 'Escape') {
        setIsPaused((prev) => !prev);
      } else if (e.code === 'KeyM') {
        setIsFieldGuideOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState]);

  const missionStats: MissionStats = {
    elapsedSeconds: resources.elapsedSeconds,
    finalOxygen: resources.oxygen,
    finalBattery: resources.battery,
    finalCondition: resources.condition,
    factsDiscovered: unlockedFactIds.length,
    totalFacts: NASA_FACTS.length,
    rockCollisions: resources.rockCollisions,
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0c0706] font-display crt-overlay">
      <RotateDevice />

 
{/* 1. HOME PAGE */}
{screenState === 'home' && (
  <HomePage
    onStart={() => setScreenState('loading')}
  />
)}

{/* 2. LOADING SCREEN */}
{screenState === 'loading' && (
  <LoadingScreen
    onComplete={() => setScreenState('crew_selection')}
  />
)}

{/* 3. CREW SELECTION + CREW DETAILS */}
{screenState === 'crew_selection' && (
  <CrewSelectionPage
    onContinue={(crew) => {
      setSelectedCrew(crew);
      setScreenState('missions');
    }}
    onBack={() => setScreenState('home')}
  />
)}

{/* 4. MISSIONS PAGE */}
{screenState === 'missions' && (
  <MissionsPage
    onSelectMission1={() => setScreenState('mission_menu')}
    onBack={() => setScreenState('crew_selection')}
  />
)}

{/* 5. ORIGINAL MISSION 1 MENU */}
{screenState === 'mission_menu' && (
  <MainMenu
    onStartGame={() => setScreenState('cinematic')}
    onOpenFieldGuide={() => setIsFieldGuideOpen(true)}
  />
)}

{/* 6. ORIGINAL OPENING CINEMATIC */}
{screenState === 'cinematic' && (
  <OpeningCinematic
    onStartMission={handleStartMissionFromCinematic}
  />
)}


      {/* 1. MAIN MENU SCREEN */}
      {/* {screenState === 'menu' && (
        <MainMenu
        onStartGame={() => setScreenState('loading')}
          // onStartGame={() => setScreenState('cinematic')}
          onOpenFieldGuide={() => setIsFieldGuideOpen(true)}
        />
      )} */}

      {/* LOADING SCREEN */}
{/* {screenState === 'loading' && (
  <LoadingScreen
    onComplete={() => setScreenState('crew_selection')}
  />
)} */}

{/* CREW SELECTION */}
{/* {screenState === 'crew_selection' && (
  <CrewSelectionPage
    onContinue={(crew) => {
      setSelectedCrew(crew);
      setScreenState('cinematic');
    }}
    onBack={() => setScreenState('menu')}
  />
)} */}

      {/* 2. OPENING CINEMATIC */}
      {/* {screenState === 'cinematic' && (
        <OpeningCinematic onStartMission={handleStartMissionFromCinematic} />
      )} */}

      {/* 3. PLAYABLE GAME PHASER SCENE */}
      {(screenState === 'playing' || screenState === 'mission_complete' || screenState === 'mission_failed') && (
        <div className="relative w-full h-full">
          <MarsGameCanvas callbacks={callbacks} gameRef={gameRef} />

          {/* DUST STORM RED VIGNETTE SHADER (STAGE 5) */}
          {resources.isDustStormActive && (
            <div className="pointer-events-none absolute inset-0 z-25 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(220,60,20,0.45)_95%)] storm-vignette mix-blend-color-burn" />
          )}

          {/* GTA-STYLE HUD */}
          {screenState === 'playing' && (
            <HUD
              resources={resources}
              stage={stage}
              waypoint={waypoint}
              interactionPrompt={interactionPrompt}
              warningMessage={warningMessage}
              discoveredFactsCount={unlockedFactIds.length}
              totalFactsCount={NASA_FACTS.length}
              onOpenFieldGuide={() => setIsFieldGuideOpen(true)}
              onOpenPauseMenu={() => setIsPaused(true)}
            />
          )}

          {/* CHARACTER DIALOGUE OVERLAY */}
          {activeDialogue && screenState === 'playing' && (
            <DialogueOverlay
              dialogues={activeDialogue}
              onComplete={() => {
                // If ending dialogue completes, transition to Mission Complete
                if (stage === 'cinematic_ending') {
                  setScreenState('mission_complete');
                }
                setActiveDialogue(null);
              }}
            />
          )}

          {/* EDUCATIONAL NASA POPUP */}
          {activeEducationalFact && (
            <EducationalModal
              fact={activeEducationalFact}
              onClose={() => setActiveEducationalFact(null)}
            />
          )}

          {/* PAUSE MENU */}
          {isPaused && (
            <PauseMenu
              onResume={() => setIsPaused(false)}
              onRestart={handleRestartMission}
              onOpenFieldGuide={() => {
                setIsPaused(false);
                setIsFieldGuideOpen(true);
              }}
            />
          )}
        </div>
      )}

      {/* 4. MISSION COMPLETED SCREEN */}
      {screenState === 'mission_complete' && (
        <MissionCompleteModal
          stats={missionStats}
          onReplay={handleRestartMission}
          onOpenFieldGuide={() => setIsFieldGuideOpen(true)}
        />
      )}

      {/* 5. MISSION FAILED / GAME OVER SCREEN */}
      {screenState === 'mission_failed' && (
        <GameOverModal
          onRestart={handleRestartMission}
          reason={
            resources.oxygen <= 0
              ? 'Primary EVA suit oxygen depleted before reaching Ares-1 habitat airlock safe zone.'
              : 'Severe damage or system failure in Jezero Crater.'
          }
        />
      )}

      {/* 6. FULL NASA SCIENCE FIELD GUIDE MODAL */}
      {isFieldGuideOpen && (
        <NasaFieldGuide
          unlockedFactIds={unlockedFactIds}
          onClose={() => setIsFieldGuideOpen(false)}
        />
      )}
    </div>
  );
}
