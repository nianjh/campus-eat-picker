// src/components/PixelMario.jsx — 16×12 Pixel-Perfect 8-Bit Mario
import React from "react";

const MATRIX = [
  ". . . R R R R R R . . .",
  ". . R R R R R R R R R .",
  ". . B B B S S B S . . .",
  ". B S B S S S B S S S .",
  ". B S B B S S S B S S B",
  ". B B S S S S B B B B .",
  ". . . S S S S S S S . .",
  ". . R R U R R R U . . .",
  ". R R R U R R R U R R R",
  "R R R R U U U U R R R R",
  "S S R U Y U U Y U R S S",
  "S S S U U U U U U S S S",
  "S S U U U U U U U U S S",
  ". . U U U . . U U U . .",
  ". B B B . . . . B B B .",
  "B B B B . . . . B B B B",
];

const COLOR = {
  ".": "transparent",
  R: "#E52521",
  B: "#5A3825",
  S: "#F7D1A1",
  U: "#002FA7",
  Y: "#F4C463",
};

const COLS = 12;
const ROWS = MATRIX.length;

export default function PixelMario({ px = 10, className = "" }) {
  const flat = MATRIX.flatMap((row) => row.split(" "));

  return (
    <div
      className={`inline-block leading-[0] ${className}`}
      style={{ imageRendering: "pixelated" }}
      title="It's-a me, Mario!"
    >
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${px}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${px}px)`,
        }}
      >
        {flat.map((ch, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: `${px}px`,
              height: `${px}px`,
              backgroundColor: COLOR[ch] || "transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
