export type MissionStage =
  | 'cinematic_intro'
  | 'stage_1_leave_habitat'
  | 'stage_2_collect_coupler'
  | 'stage_3_drive_rover'
  | 'stage_4_repair_relay'
  | 'stage_5_escape_storm'
  | 'cinematic_ending'
  | 'mission_complete'
  | 'mission_failed';

export interface GameResources {
  oxygen: number; // 0 - 100
  battery: number; // 0 - 100
  condition: number; // 0 - 100
  hasCoupler: boolean;
  isInRover: boolean;
  isInsideHabitat: boolean;
  isDustStormActive: boolean;
  elapsedSeconds: number;
  rockCollisions: number;
}

export type CharacterId = 'alex' | 'chen' | 'soto';

export interface DialogueLine {
  id: string;
  speaker: string;
  characterId: CharacterId;
  callsign: string;
  text: string;
  onCompleteStage?: MissionStage;
}

export interface EducationalFact {
  id: string;
  title: string;
  subtitle: string;
  category: 'GEOLOGY' | 'ROVER TECH' | 'COMMUNICATIONS' | 'ATMOSPHERE';
  imageSrc: string;
  imageCaption: string;
  nasaFact: string;
  gameContext: string;
  sourceName: string;
  sourceUrl: string;
  unlockedAtStage: MissionStage;
}

export interface Waypoint {
  x: number;
  y: number;
  label: string;
  distanceMeters: number;
  stage: MissionStage;
}

export interface MissionStats {
  elapsedSeconds: number;
  finalOxygen: number;
  finalBattery: number;
  finalCondition: number;
  factsDiscovered: number;
  totalFacts: number;
  rockCollisions: number;
}
