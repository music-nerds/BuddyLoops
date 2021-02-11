import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { BeatState } from '../redux/store';
import { ReactAudioContext } from '../app';

interface Props {
  idx: number;
  beat: number;
  selectedNum: number;
  currPattern: number;
  auditionStart: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  auditionEndUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => void;
  auditionEndLeave: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => void;
  auditionStartEnter: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  touchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  touchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  touchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
}

const AuditionSquare: React.FC<Props> = ({
  idx,
  beat,
  currPattern,
  selectedNum,
  auditionStart,
  auditionEndUp,
  auditionEndLeave,
  auditionStartEnter,
  touchStart,
  touchMove,
  touchEnd,
}) => {
  const { context } = useContext(ReactAudioContext);
  return (
    <div
      id={`${idx}`}
      onMouseDown={auditionStart}
      onMouseUp={(e) => auditionEndUp(e, idx)}
      onMouseLeave={(e) => auditionEndLeave(e, idx)}
      onMouseEnter={auditionStartEnter}
      onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
      style={{
        backgroundColor: `${
          context.sequencers[idx].pattern[beat] === 1 &&
          context.sequencersArePlaying
            ? "var(--highlight)"
            : "var(--blue)"
        }`,
      }}
      className={`aud-square ${
        idx === currPattern ? "active-beat" : ""
      } ${selectedNum === idx ? "active" : ""}`}
      data-index={idx}
    >
      {/* 
        ALL CHILD ELEMENTS NEED THE DATA INDEX PROPERTY
        OTHERWISE, IT WILL BREAK IF CLICKED ON. 
        E.TARGET IS THE MOST HIGHLY NESTED ELEMENT
      */}
      <span data-index={idx} className="sample-name">
        {context.sequencers[idx].name}
      </span>
    </div>
  );
};

const mapState = (state:BeatState) => state;

export default connect(mapState, {})(AuditionSquare);
