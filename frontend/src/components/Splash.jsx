import React from "react";

export default function Splash({ fading }) {
  return (
    <div className={`vr-splash ${fading ? "vr-splash-fading" : ""}`}>
      <div className="vr-noise" />
      <div className="vr-splash-inner">
        <img
          className="vr-splash-seal"
          src="/wax-seal-square.png"
          alt="Écritoire  wax seal"
          draggable={false}
        />
        <div className="vr-splash-brand">Écritoire</div>
        <div className="vr-splash-label vr-label">opening the cover&hellip;</div>
      </div>
    </div>
  );
}
