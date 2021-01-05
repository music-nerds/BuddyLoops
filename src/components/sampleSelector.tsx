import React, { useContext } from "react";
import { ReactAudioContext } from "../app";

interface Props {
  selectPattern: (pattern: number) => void;
  currPattern: number;
  beat: number;
}

const SampleSelector: React.FC<Props> = ({
  selectPattern,
  currPattern,
  beat,
}) => {
  const { context } = useContext(ReactAudioContext);

  const togglePattern = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
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
            style={{
              backgroundColor: `${
                context.sequencers[idx].pattern[beat] === 1
                  ? "var(--highlight)"
                  : "var(--blue)"
              }`,
            }}
            className="seq-square"
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
