import React, { useContext, useState } from "react";
import { ReactAudioContext } from "../app";
import "./stepRow.css";
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
  const [selected, setSelected] = useState(currPattern);
  const { context } = useContext(ReactAudioContext);

  const togglePattern = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    setSelected(Number(target.dataset.pattern));
    selectPattern(Number(target.dataset.pattern));
  };
   
  return (
    <div>
      {new Array(16).fill(null).map((n, idx) =>
        context.sequencers[idx] ? (
          <div
            key={idx}
            data-pattern={idx}
            onClick={togglePattern}
            style={{
              background: `${
                context.sequencers[idx].pattern[beat] === 1
                  ? "var(--blueGradientHL)"
                  : "var(--blueGradient)"
              }`,
            }}
            className={
              idx === selected ? "seq-square active-beat" : "seq-square"
            }
          >
            <span className="sample-name" data-pattern={idx}>
              {context.sequencers[idx].name}
            </span>
          </div>
        ) : (
          <div key={idx} className="seq-square"></div>
        )
      )}
    </div>
  );
};

export default SampleSelector;
