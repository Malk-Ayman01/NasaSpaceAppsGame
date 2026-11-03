import { DialogueLine, EducationalFact } from '../types/game';

export const NASA_FACTS: EducationalFact[] = [
  {
    id: 'jezero_crater',
    title: 'Jezero Crater & Ancient Lake Delta',
    subtitle: 'Site of NASA Perseverance Rover Landing (2021)',
    category: 'GEOLOGY',
    imageSrc: '/assets/nasa/jezero_crater.jpg',
    imageCaption: 'NASA orbital map of Jezero Crater river delta and Perseverance traverse route (Credit: NASA/JPL-Caltech).',
    nasaFact:
      'Scientists chose Jezero Crater because orbital spectroscopy revealed it was flooded with water approximately 3.5 to 3.8 billion years ago. The fan-shaped river delta deposited clay minerals and carbonates, which are prime environments for preserving fossilized traces of ancient microscopic life.',
    gameContext:
      'In Mission 1, our habitat and communications tower are stationed along the ancient delta rim where treacherous boulder fields and fine regolith test both astronaut suits and rover mobility.',
    sourceName: 'NASA Science - Mars 2020 Perseverance Mission',
    sourceUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/',
    unlockedAtStage: 'stage_1_leave_habitat',
  },
  {
    id: 'equipment_maintenance',
    title: 'Planetary In-Situ Repairs & Spares',
    subtitle: 'Why Equipment Reliability Determines Crew Survival',
    category: 'ROVER TECH',
    imageSrc: '/assets/nasa/perseverance_rover.jpg',
    imageCaption: 'Perseverance Rover with Ingenuity helicopter at Van Zyl Overlook, Mars (Credit: NASA/JPL-Caltech/MSSS).',
    nasaFact:
      'Mars missions operate under extreme logistical constraints. With cargo transit times of 7-9 months from Earth, every critical system relies on redundancy and modular replacement parts. Rovers like Perseverance carry specialized tool arrays, duplicate avionics, and auto-nav computers because physical repair by humans is not yet possible.',
    gameContext:
      'You retrieved the spare Power Coupler from the exterior emergency supply crate. Planetary habitats must cache critical electronic components outside airlocks in pressurized pods for rapid EVA deployment.',
    sourceName: 'NASA Jet Propulsion Laboratory - Mars Exploration Program',
    sourceUrl: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
    unlockedAtStage: 'stage_2_collect_coupler',
  },
  {
    id: 'space_communications',
    title: 'Deep Space Network & Mars Relay Orbiters',
    subtitle: 'Overcoming the 5 to 20-Minute Light-Speed Lag',
    category: 'COMMUNICATIONS',
    imageSrc: '/assets/nasa/deep_space_network.jpg',
    imageCaption: 'NASA Deep Space Network 70-meter giant radio antenna dish array (Credit: NASA/JPL-Caltech).',
    nasaFact:
      'Radio signals between Mars and Earth take between 5 to 20 minutes each way depending on orbital positions. Surface rovers and future crewed bases do not talk to Earth directly most of the time; instead, they transmit UHF radio signals up to orbital satellites (such as NASA’s Mars Reconnaissance Orbiter and MAVEN), which then relay high-power X-band and Ka-band beams to the Deep Space Network antennas on Earth.',
    gameContext:
      'Fixing the relay antenna re-aligns the microwave transponder with orbiting relay spacecraft, ending the habitat crew’s blackout.',
    sourceName: 'NASA Deep Space Network & Space Communications',
    sourceUrl: 'https://www.nasa.gov/directorates/somd/space-communications-navigation-program/deep-space-network/',
    unlockedAtStage: 'stage_4_repair_relay',
  },
  {
    id: 'martian_dust_storms',
    title: 'Martian Dust Storms & Atmospheric Hazards',
    subtitle: 'Global Storms That Envelop the Entire Planet',
    category: 'ATMOSPHERE',
    imageSrc: '/assets/nasa/mars_dust_storm.jpg',
    imageCaption: 'Hubble and orbiter views of Mars before and during a planet-encircling dust storm (Credit: NASA/JPL-Caltech).',
    nasaFact:
      'Martian atmospheric pressure is less than 1% of Earth’s, so even high-speed storm winds do not exert crushing physical force. However, airborne dust particles are extremely fine (like talcum powder), highly abrasive, and electrostatically charged. Storms can block up to 99% of sunlight for months (which ended the Opportunity rover mission) and degrade thermal radiators and spacesuit joint seals.',
    gameContext:
      'As the dust storm sweeps across Jezero Crater, outdoor visibility drops dramatically and suit oxygen purification demands double due to filter clogging.',
    sourceName: 'NASA Mars Exploration Science',
    sourceUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/science/',
    unlockedAtStage: 'stage_5_escape_storm',
  },
];

export const DIALOGUE_SCRIPTS: Record<string, DialogueLine[]> = {
  intro: [
    {
      id: 'intro_1',
      speaker: 'DIRECTOR CHEN',
      characterId: 'chen',
      callsign: 'CAPCOM - HOUSTON',
      text: 'Ares Base, this is Mission Control. We lost your primary telemetry burst. Deep Space Network is reading zero carrier frequency on the X-band downlink.',
    },
    {
      id: 'intro_2',
      speaker: 'DR. ELENA SOTO',
      characterId: 'soto',
      callsign: 'CHIEF ENGINEER - HABITAT',
      text: 'Alex, diagnostics confirm the main relay station atop the eastern ridge blew its power coupling during last night’s thermal drop. We are completely deaf.',
    },
    {
      id: 'intro_3',
      speaker: 'DIRECTOR CHEN',
      characterId: 'chen',
      callsign: 'CAPCOM - HOUSTON',
      text: 'Worse news, team. Orbital radar from MRO indicates a massive regional dust storm has formed over Syrtis Major and is heading straight into Jezero Crater.',
    },
    {
      id: 'intro_4',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'Copy that, Director. I will suit up, grab a replacement coupler, drive the rover out to the ridge, and restore the relay before we lose our window.',
    },
  ],
  stage1_exit: [
    {
      id: 's1_1',
      speaker: 'DR. ELENA SOTO',
      characterId: 'soto',
      callsign: 'CHIEF ENGINEER - HABITAT',
      text: 'Airlock cycling complete. Alex, watch your suit telemetry. Oxygen drains steadily outside the habitat. Refill inside if you ever run low.',
    },
    {
      id: 's1_2',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'Heads up. I see the external cargo crate directly south of the airlock. Moving in to collect the power coupler.',
    },
  ],
  stage2_crate: [
    {
      id: 's2_1',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'Cargo pod opened. Power coupler is secured in suit inventory. Heading over to the rover depot now.',
    },
  ],
  stage3_rover_enter: [
    {
      id: 's3_1',
      speaker: 'DR. ELENA SOTO',
      characterId: 'soto',
      callsign: 'CHIEF ENGINEER - HABITAT',
      text: 'Rover ignition confirmed. Alex, steer carefully through the central basalt boulder field. High-speed collisions will crack the rocker-bogie suspension!',
    },
    {
      id: 's3_2',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'Roger. Navigating through the canyon pass. Battery levels are looking stable.',
    },
  ],
  stage4_repaired: [
    {
      id: 's4_1',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'Coupler locked into terminal bus! Dish actuators are spinning up... Transmitter alignment locking on 8.4 GHz.',
    },
    {
      id: 's4_2',
      speaker: 'DIRECTOR CHEN',
      characterId: 'chen',
      callsign: 'CAPCOM - HOUSTON',
      text: 'Lock acquired! We have full telemetry stream back online! Fantastic work, Commander!',
    },
  ],
  stage5_storm_alert: [
    {
      id: 's5_1',
      speaker: 'DIRECTOR CHEN',
      characterId: 'chen',
      callsign: 'CAPCOM - HOUSTON',
      text: 'Alex! Emergency alert! The dust front accelerated—it is rolling across your exact coordinates right now! Visibility is dropping!',
    },
    {
      id: 's5_2',
      speaker: 'DR. ELENA SOTO',
      characterId: 'soto',
      callsign: 'CHIEF ENGINEER - HABITAT',
      text: 'Atmospheric electrostatic charge is spiking suit scrubber loads! Oxygen consumption has doubled! Return to the habitat immediately!',
    },
    {
      id: 's5_3',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'I can see the red wall coming over the ridge. Punching the throttle back to base!',
    },
  ],
  ending: [
    {
      id: 'end_1',
      speaker: 'DR. ELENA SOTO',
      characterId: 'soto',
      callsign: 'CHIEF ENGINEER - HABITAT',
      text: 'Airlock sealed! Safe pressure restored! Alex, you made it before the storm reached full density.',
    },
    {
      id: 'end_2',
      speaker: 'DIRECTOR CHEN',
      characterId: 'chen',
      callsign: 'CAPCOM - HOUSTON',
      text: 'Wait... Director Chen here. Look at the high-gain receiver band. What is that carrier wave?',
    },
    {
      id: 'end_3',
      speaker: 'DR. ELENA SOTO',
      characterId: 'soto',
      callsign: 'CHIEF ENGINEER - HABITAT',
      text: 'It is not Earth, and it is not MRO. We are picking up an organized pulse originating 4 kilometers northeast in the crater floor...',
    },
    {
      id: 'end_4',
      speaker: 'CMDR. ALEX VANCE',
      characterId: 'alex',
      callsign: 'EVA SPECIALIST - PLAYER',
      text: 'A repeating narrowband pulse. That’s impossible. Nothing out there is supposed to be broadcasting...',
    },
  ],
};
