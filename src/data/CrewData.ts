// import hadImage from "../assets/characters/had.png";
// import samImage from "../assets/characters/sam.png";
// import hazImage from "../assets/characters/haz.png";

export const crews = [
  {
    id: "01-BIO",
    name: "DR. Hadeya",
    role: "Lead Astrobiologist",
    quote:
      "Specializes in closed-loop life support and extreme biochemistry under atmospheric duress.",

    border: "#123040",

    tag: {
      bg: "#0A2528",
      border: "#144040",
      text: "#2EC4B6",
    },

    btn: {
      bg: "#0E2A32",
      border: "#1A4A52",
      text: "#4ECDC4",
    },

    glow: "rgba(46,196,182,0.15)",
    stripe: "#1E90FF",

    image:"/assets/characters/had.png",
  },

  {
    id: "02-ENG",
    name: "DR. Samanta",
    role: "Systems & Propulsion Engineer",
    quote:
      "Expert in power grid stabilization, telemetry repair, and atmospheric seals.",

    border: "#3A2810",

    tag: {
      bg: "#2A1E08",
      border: "#4A3510",
      text: "#FF9F1C",
    },

    btn: {
      bg: "#2E1E0A",
      border: "#5A3A1A",
      text: "#FFB627",
    },

    glow: "rgba(255,159,28,0.15)",
    stripe: "#FF9F1C",

    image:"/assets/characters/sam.png",
  },

  {
    id: "03-CMD",
    name: "Hazeloom",
    role: "Mission Commander",
    quote:
      "Veteran flight leader specializing in crisis navigation and resource rationing.",

    border: "#3A1515",

    tag: {
      bg: "#2A1010",
      border: "#4A1A1A",
      text: "#FF4D4D",
    },

    btn: {
      bg: "#2E1212",
      border: "#5A1E1E",
      text: "#FF8A8A",
    },

    glow: "rgba(255,77,77,0.15)",
    stripe: "#FF2A2A",

    image: "/assets/characters/haz.png",
  },
];