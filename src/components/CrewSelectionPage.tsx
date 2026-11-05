
import { useState } from "react";
import CrewCard from "./CrewCard";
import { crews } from "../data/CrewData";
import CrewDetailsPage from "./CrewDetailsPage";

type CrewMember = (typeof crews)[number];

interface CrewSelectionPageProps {
  onContinue: (crew: CrewMember) => void;
  onBack: () => void;
}

export default function CrewSelectionPage({
  onContinue,
  onBack,
}: CrewSelectionPageProps) {
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleSelect = (crew: CrewMember) => {
    setSelectedCrew(crew);
    setShowDetails(true);
  };

  const handleContinue = () => {
    if (!selectedCrew) return;
    onContinue(selectedCrew);
  };

  if (showDetails && selectedCrew) {
    return (
      <CrewDetailsPage
        crew={selectedCrew}
        onBack={() => setShowDetails(false)}
        onContinue={handleContinue}
      />
    );
  }

  return (
<section className="crew-selection-page w-full h-full min-h-0 overflow-y-auto overflow-x-hidden">
      <header className="crew-selection-header">
        <div className="crew-selection-eyebrow">
          ARES-1 // PERSONNEL DATABASE
        </div>

        <h1 className="crew-selection-title">
          SELECT SURVIVING CREW MEMBER
        </h1>

        <p className="crew-selection-subtitle">
          CHOOSE YOUR PERSPECTIVE FOR THE MARS SURFACE SURVIVAL PROTOCOL
        </p>

        <div className="crew-selection-divider">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              className={index % 3 === 2 ? "wide" : ""}
            />
          ))}
        </div>
      </header>

      <div className="crew-grid">
        {crews.map((crew) => (
          <CrewCard
            key={crew.id}
            crew={crew}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <footer className="crew-selection-footer">
        <span>AVAILABLE UNITS: {crews.length}</span>

        <span>
          SYSTEM STATUS:{" "}
          <span className="crew-system-online">● ONLINE</span>
        </span>
      </footer>

      <button
        type="button"
        className="crew-selection-back"
        onClick={onBack}
      >
        &lt; BACK TO MAIN MENU
      </button>
    </section>
  );
}
