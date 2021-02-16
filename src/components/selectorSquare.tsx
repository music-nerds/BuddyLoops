import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { ReactAudioContext } from '../app';
import { BeatState } from '../redux/store';

interface Props {
  idx: number;
  togglePattern: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  beat: number;
  selected: number;
}

const SelectorSquare: React.FC<Props> = ({ idx, togglePattern, beat, selected }) => {
  const { context } = useContext(ReactAudioContext);
  return (
    <div
      data-pattern={idx}
      onClick={togglePattern}
      style={{
        backgroundColor: `${
          context.sequencers[idx].pattern[beat] === 1
            ? "var(--highlight)"
            : "var(--blue)"
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
  )
}

const mapState = (state: BeatState) => state;

export default connect(mapState, {})(SelectorSquare);
