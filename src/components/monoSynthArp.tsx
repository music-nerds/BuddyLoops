import React from "react";
import { MonoSynth } from "../audio/synth";
// import { SocketContext } from "../app";
import "./synth.css";

export interface MonoSynthArpProps {
  synth: MonoSynth;
}

const MonoSynthArp: React.FC<MonoSynthArpProps> = ({ synth }) => {
  // const socket = useContext(SocketContext);
  // const [arpSquares, setArpSquares] = useState([]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    let arr = [];
    for (let i = 0; i < e.touches.length; i++) {
      const loc = e.touches[i];
      const location = document.elementFromPoint(
        loc.clientX,
        loc.clientY
      ) as HTMLDivElement;
      let index = Number(location.dataset.index);
      if (index >= 0) {
        arr.push(index);
      }
    }
    synth.arpNotes = arr;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    let arr = [];
    for (let i = 0; i < e.touches.length; i++) {
      const loc = e.touches[i];
      const location = document.elementFromPoint(
        loc.clientX,
        loc.clientY
      ) as HTMLDivElement;
      let index = Number(location.dataset.index);
      if (index >= 0) {
        arr.push(index);
      }
    }
    synth.arpNotes = arr;
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const loc = e.changedTouches[0];
    const location = document.elementFromPoint(
      loc.clientX,
      loc.clientY
    ) as HTMLDivElement;
    let index = Number(location.dataset.index);
    if (index >= 0 && !synth.arpNotes.includes(index)) {
      synth.arpNotes.push(index);
      if (synth.arpNotes.length > e.touches.length) {
        synth.arpNotes.shift();
      }
    }
  };
  return (
    <div id="arp-container">
      {new Array(15).fill(null).map((_, i) => (
        <div
          className={`arp-square ${i % 7 === 0 ? "root" : ""}`}
          data-index={i}
          key={i}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        ></div>
      ))}
    </div>
  );
};

export default MonoSynthArp;
