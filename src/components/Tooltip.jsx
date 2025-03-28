import React from "react";
import "./Tooltip.css";

function Tooltip({ mensaje, children }) {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip">{mensaje}</span>
    </div>
  );
}

export default Tooltip;
