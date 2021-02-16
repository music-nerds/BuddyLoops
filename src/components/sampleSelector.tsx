import React, { useContext, useState, useCallback } from "react";
import { ReactAudioContext } from "../app";
import SelectorSquare from './selectorSquare';

interface Props {
  selectPattern: (pattern: number) => void;
  currPattern: number;
}

const SampleSelector: React.FC<Props> = ({
  selectPattern,
  currPattern,
}) => {
  const [selected, setSelected] = useState(currPattern);
  const { context } = useContext(ReactAudioContext);

  const togglePattern = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    setSelected(Number(target.dataset.pattern));
    selectPattern(Number(target.dataset.pattern));
  }, [setSelected, selectPattern]);

  return (
    <div>
      {new Array(16).fill(null).map((n, idx) =>
        context.sequencers[idx] ? (
          <SelectorSquare
            selected={selected}
            key={idx}
            idx={idx}
            data-pattern={idx}
            togglePattern={togglePattern}
          />
        ) : (
          <div key={idx} className="seq-square"></div>
        )
      )}
    </div>
  );
};

export default React.memo(SampleSelector);
