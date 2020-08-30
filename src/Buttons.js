import React from "react";
import { directions } from "./functions";

export default function Buttons({ buttonClicked, disabled }) {
  return (
    <div>
      <div>
        <button
          onClick={() => buttonClicked(directions.UP)}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow up"></i>
        </button>
      </div>
      <div>
        <button
          onClick={() => buttonClicked(directions.LEFT)}
          style={{ marginRight: "60px" }}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow left"></i>
        </button>
        <button
          onClick={() => buttonClicked(directions.RIGHT)}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow right"></i>
        </button>
      </div>
      <div>
        <button
          onClick={() => buttonClicked(directions.DOWN)}
          disabled={disabled}
          className="arrowButton"
        >
          <i className="arrow down"></i>
        </button>
      </div>
    </div>
  );
}
