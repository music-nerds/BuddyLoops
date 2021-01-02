import React, { useState, useContext } from "react";
import { ReactAudioContext } from "../app";

interface Props {
  selectPattern: (pattern: number) => void;
  currPattern: number;
}

const SampleSelector: React.FC<Props> = ({ selectPattern, currPattern }) => {
  const { context } = useContext(ReactAudioContext);
  const [selected, setSelected] = useState(currPattern);

  const togglePattern = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    setSelected(Number(target.id));
    selectPattern(Number(target.id));
  };

  return (
    <div>
      {new Array(16).fill(null).map((n, idx) =>
        context.sequencers[idx] ? (
          <div
            key={idx}
            id={`${idx}`}
            onClick={togglePattern}
            style={{ backgroundColor: "var(--blue)" }}
            className={
              idx === selected ? "seq-square active-beat" : "seq-square"
            }
          >
            <span>{context.sequencers[idx].name}</span>
          </div>
        ) : (
          <div key={idx} className="seq-square"></div>
        )
      )}
    </div>
  );
};

export default SampleSelector;
