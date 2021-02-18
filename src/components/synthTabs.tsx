import React from "react";
import GridOnIcon from "@material-ui/icons/GridOn";
import MusicNoteIcon from "@material-ui/icons/MusicNote";

export interface SynthTabsProps {
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
}

const SynthTabs: React.SFC<SynthTabsProps> = ({ view, setView }) => {
  return (
    <div className="synth-tabs">
      <div
        className={`synth-pattern-tab ${view === "arp" ? "selected" : ""}`}
        onClick={() => setView("arp")}
      >
        <MusicNoteIcon
          style={{ color: `${view === "arp" ? "white" : "#aaa"}` }}
        />
      </div>
      <div
        className={`synth-pattern-tab ${view === "pattern" ? "selected" : ""}`}
        onClick={() => setView("pattern")}
      >
        <GridOnIcon
          style={{
            color: `${view === "pattern" ? "white" : "#aaa"}`,
          }}
        />
      </div>
    </div>
  );
};

export default SynthTabs;
