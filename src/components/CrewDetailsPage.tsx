
import type { crews } from "../data/CrewData";

type CrewMember = (typeof crews)[number];

interface CrewDetailsPageProps {
  crew: CrewMember;
  onBack: () => void;
  onContinue: () => void;
}

const crewStories: Record<string, string> = {
  "01-BIO": `Dr. HAD spent six years studying extremophile microbial life
in the Atacama Desert before being selected for the Ares-VI mission. Her primary
motivation was understanding how organic molecules adapt to hyper-arid, high-radiation
environments—a passion born from childhood stargazing through her father's battered
Newtonian reflector in rural Oregon.

When the habitat's descent module suffered catastrophic thruster decompression during
landing, HAD's immediate concern was not her own survival, but the integrity of the
cryogenic biological samples stored in Sector 4. She fears losing years of irreplaceable
research that could prove microbial survivability on early Mars.

Calm under extreme pressure, HAD approaches survival through methodical analysis of
atmospheric chemistry and nutrient reclamation. Her deep scientific dedication keeps
the crew grounded when rations thin and despair threatens to take over.`,

  "02-ENG": `SAM grew up maintaining high-altitude hydroelectric turbines in the Sichuan
mountains, developing an intuitive understanding of mechanical stress and thermal fatigue.
Joining Ares-VI was the culmination of a lifelong dream to design interplanetary habitats
capable of sustaining human life in raw, unyielding vacuums.

During the initial landing sequence, SAM fought valiantly at the manual override console
to divert auxiliary power to the dampening struts, saving the crew from fatal impact forces.
She carries a profound invisible weight: the haunting memory of an unheeded telemetry
warning sign that she believes precipitated the landing failure.

Pragmatic, fiercely independent, and mechanically brilliant, SAM works tirelessly through
freezing Martian nights to keep the habitat's thermal generators humming, driven by the
fierce determination to bring every remaining crew member home.`,

  "03-CMD": `Commander HAZ is a veteran orbital flight instructor and former atmospheric
test pilot with over 4,000 hours in experimental craft. For HAZ, space exploration is
neither romantic nor political; it is an absolute duty to human curiosity and survival across
the cosmos.

Tasked with leading the Ares-VI crew after the mission profile collapsed on Sol 1,
HAZ bears the crushing psychological burden of command decisions. Every rationing
decree, every oxygen allocation, and every lost colleague rests squarely on his shoulders.
He secretly fears that Earth mission control has already written off their stranded party
as a tragic loss.

Stoic, unwavering, and deeply protective of his team, HAZ maintains rigid discipline
while quietly planning every contingency for the grueling 14-kilometer trek across the
Acidalia Planitia to the extraction vehicle.`,
};

const stats = [
  {
    label: "HEART RATE",
    value: "084",
    unit: "BPM",
    color: "#dc6547",
    percent: 70,
  },
  {
    label: "STRESS LEVEL",
    value: "32",
    unit: "%",
    color: "#dc8067",
    percent: 32,
  },
  {
    label: "SUIT INTEGRITY",
    value: "96",
    unit: "%",
    color: "#b8a49e",
    percent: 96,
  },
  {
    label: "RADIATION",
    value: "12",
    unit: "mSv",
    color: "#e5a18b",
    percent: 12,
  },
];

export default function CrewDetailsPage({
  crew,
  onBack,
  onContinue,
}: CrewDetailsPageProps) {
  const story =
    crewStories[crew.id] || "NO PERSONNEL ARCHIVE AVAILABLE.";

  return (
    <section className="crew-details-page w-full h-full min-h-0 overflow-y-auto overflow-x-hidden">
      <div className="dossier-page-label">
        MISSION CONTROL // PERSONNEL DOSSIER
      </div>

      <div className="dossier-grid">
        {/* LEFT: CREW PROFILE */}
        <div className="dossier-card dossier-profile">
          <div className="dossier-id">
            &gt; PERSONNEL_ID: {crew.id}
          </div>

          <div className="dossier-image">
            {crew.image ? (
              <img
                src={crew.image}
                alt={crew.name}
                draggable={false}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  console.error("Failed to load crew image:", crew.image);
                }}
              />
            ) : (
              <span>CHARACTER IMAGE NOT AVAILABLE</span>
            )}

            <div className="dossier-image-strip" />
          </div>

          <h2 className="dossier-name">{crew.name}</h2>

          <p className="dossier-role">{crew.role}</p>

          <div className="dossier-divider" />

          <div className="dossier-section-label">
            &gt; BIOMETRIC READINGS
          </div>

          <div className="dossier-stats">
            {stats.map((stat) => (
              <div className="dossier-stat" key={stat.label}>
                <div className="dossier-stat-heading">
                  <span>{stat.label}</span>
                  <strong style={{ color: stat.color }}>
                    {stat.value} {stat.unit}
                  </strong>
                </div>

                <div className="dossier-progress">
                  {Array.from({ length: 20 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        background:
                          index < Math.ceil(stat.percent / 5)
                            ? stat.color
                            : "#241512",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="dossier-monitoring">
            SYSTEM STATUS: <span>● MONITORING</span>
          </div>
        </div>

        {/* RIGHT: PERSONNEL STORY */}
        <div className="dossier-card dossier-story-card">
          <div className="dossier-archive-label">
            ARCHIVE FILE // {crew.id}
          </div>

          <h2 className="dossier-story-title">
            PSYCHOLOGICAL PROFILE & NARRATIVE LOG
          </h2>

          <div className="dossier-divider" />

          <div className="dossier-story">
            {story}
          </div>

          <div className="dossier-file-footer">
            <span>FILE: CREW_PROFILE.DAT</span>
            <span>ACCESS: AUTHORIZED</span>
          </div>

          <div className="dossier-divider dossier-actions-divider" />

          <div className="dossier-actions">
            <button
              type="button"
              onClick={onBack}
              className="dossier-back-button"
            >
              &lt; BACK TO CREW
            </button>

            <button
              type="button"
              onClick={onContinue}
              className="dossier-continue-button"
            >
              CONTINUE MISSION &gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
