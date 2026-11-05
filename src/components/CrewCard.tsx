import type { crews } from "../data/CrewData";

type CrewMember = (typeof crews)[number];

interface CrewCardProps {
  crew: CrewMember;
  onSelect: (crew: CrewMember) => void;
}

export default function CrewCard({ crew, onSelect }: CrewCardProps) {
  return (
    <article className="crew-card">
      {/* PIXEL CORNERS */}
      {[
        { top: -2, left: -2 },
        { top: -2, right: -2 },
        { bottom: -2, left: -2 },
        { bottom: -2, right: -2 },
      ].map((corner, index) => (
        <span
          key={index}
          className="crew-card-corner"
          style={corner}
        />
      ))}

      {/* CREW ID */}
      <div className="crew-id">
        <span>PERSONNEL ID:</span>
        {crew.id}
      </div>

      {/* CHARACTER DISPLAY */}
      <div className="crew-image-container">
        <div className="crew-image-grid" />

        {/* PIXEL STARS */}
        {[
          { top: "12%", left: "15%" },
          { top: "22%", right: "18%" },
          { top: "40%", left: "9%" },
          { top: "16%", right: "35%" },
          { top: "55%", right: "10%" },
          { top: "32%", left: "80%" },
        ].map((star, index) => (
          <span
            key={index}
            className="crew-pixel-star"
            style={star}
          />
        ))}

        {crew.image ? (
          <img
            src={crew.image}
            alt={crew.name}
            draggable={false}
            onError={(event) => {
              event.currentTarget.style.display = "none";
              console.error("Failed to load crew image:", crew.image);
            }}
            className="crew-character-image"
          />
        ) : (
          <div className="crew-image-fallback">
            CREW IMAGE UNAVAILABLE
          </div>
        )}

        <div className="crew-image-label">
          CREW_UNIT // {crew.id}
        </div>

        <div className="crew-image-bottom-strip" />
      </div>

      {/* CHARACTER NAME */}
      <h3 className="crew-name">{crew.name}</h3>

      {/* CHARACTER ROLE */}
      <p className="crew-role">{crew.role}</p>

      <div className="crew-divider" />

      {/* CHARACTER QUOTE */}
      <p className="crew-quote">
        "{crew.quote}"
      </p>

      {/* SELECT BUTTON */}
      <button
        type="button"
        onClick={() => onSelect(crew)}
        className="crew-select-button"
      >
        SELECT SURVIVOR  <span>&gt;</span>
      </button>

      {/* STATUS */}
      <div className="crew-status">
        <span>UNIT STATUS</span>
        <span className="crew-ready">
          <i /> READY
        </span>
      </div>
    </article>
  );
}
