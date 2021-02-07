import React, { useContext } from "react";
import { ReactAudioContext } from "../app";
import StepRow from "./stepRow";
import SampleSelector from "./sampleSelector";
import Audition from "./audition";
import SoundbankFxPanel from "./soundbankFxPanel";
import PatternFxPanel from "./patternFxPanel";
import GridOnIcon from "@material-ui/icons/GridOn";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import "./sampler.css";

interface Props {
  socketID: string;
  beat: number;
  currPattern: number;
  selectPattern: (pattern: number) => void;
  view: string;
  toggleView: (view: string) => void;
  audition: boolean;
  toggleAudition: () => void;
}

const Sampler: React.FC<Props> = ({
  socketID,
  beat,
  currPattern,
  selectPattern,
  view,
  toggleView,
  audition,
  toggleAudition,
}) => {
  const { context } = useContext(ReactAudioContext);

  return (
    <div className="sampler-container">
      <div className="sampler-tabs">
        <div
          id="soundbank"
          className={
            view === "soundbank" ? "sampler-tab tab-selected" : "sampler-tab"
          }
          onClick={() => toggleView("soundbank")}
          onTouchStart={() => toggleView("soundbank")}
        >
          <MusicNoteIcon
            style={{ color: `${view === "soundbank" ? "white" : "#aaa"}` }}
          />
        </div>
        <div
          id="pattern"
          className={
            view === "pattern" ? "sampler-tab tab-selected" : "sampler-tab"
          }
          onClick={() => toggleView("pattern")}
          onTouchStart={() => toggleView("pattern")}
        >
          <GridOnIcon
            style={{ color: `${view === "pattern" ? "white" : "#aaa"}` }}
          />
        </div>
      </div>
      {view === "soundbank" && (
        <SoundbankFxPanel audition={audition} toggleAudition={toggleAudition} />
      )}
      {view === "pattern" && <PatternFxPanel currPattern={currPattern} />}
      <div className="sampler-view">
        {view === "pattern" && (
          <StepRow
            row={context.sequencers[currPattern]}
            id={socketID}
            beat={beat}
          />
        )}
        {view === "soundbank" && !audition && (
          <SampleSelector
            beat={beat}
            currPattern={currPattern}
            selectPattern={selectPattern}
          />
        )}
        {view === "soundbank" && audition && (
          <Audition
            selectPattern={selectPattern}
            beat={beat}
            currPattern={currPattern}
          />
        )}
      </div>
    </div>
  );
};

export default Sampler;
