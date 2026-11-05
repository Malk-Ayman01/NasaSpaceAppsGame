import { useEffect, useState } from "react";

export default function RotateDevice() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(
        window.innerHeight > window.innerWidth &&
        window.innerWidth <= 900
      );
    };

    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="rotate-device-overlay">
      <div className="rotate-device-content">
        <div className="rotate-icon">
          <span>📱</span>
        </div>

        <p className="rotate-eyebrow">ARES-1 // DISPLAY WARNING</p>

        <h1>ROTATE YOUR DEVICE</h1>

        <p className="rotate-description">
          THIS MISSION REQUIRES A LANDSCAPE DISPLAY.
          <br />
          PLEASE ROTATE YOUR DEVICE TO CONTINUE.
        </p>

        <div className="rotate-status">
          <span className="rotate-status-dot" />
          WAITING FOR LANDSCAPE MODE...
        </div>
      </div>
    </div>
  );
}