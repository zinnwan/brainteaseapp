import React from "react";
import '../css/LoadingIcon.css';

export default function LoadingIcon() {

  return (
    <div className="load-icon-cont">
      <div className="load-icon-card">
        <div className="load-icon-side front"></div>
        <div className="load-icon-side back"></div>
      </div>
    </div>
  );
}