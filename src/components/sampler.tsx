import React, { useEffect, useContext } from "react";
import { ReactAudioContext, SocketContext } from "../app";
import StepRow from "./stepRow";
import SampleSelector from "./sampleSelector";
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
}

interface PatternChange {
  name: string;
  pattern: (0 | 1)[];
  id: string;
}

const Sampler: React.FC<Props> = ({
  socketID,
  beat,
  currPattern,
  selectPattern,
  view,
  toggleView,
}) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("patternChange", (data: PatternChange) => {
      const seq = context.sequencers.find((seq) => seq.name === data.name);
      if (seq) {
        seq.pattern = data.pattern;
      }
      if (!context.isPlaying) {
        // causes bug if isPlaying is true
        // stop button loses reference to context
        setContext({ ...context });
      }
    });

    // socket.on('receiveRowLaunch', (name: string) => {
    //   if(name === row.name){
    //     row.shouldPlayNextLoop = !row.shouldPlayNextLoop;
    //     // setLaunchEnabled(row.shouldPlayNextLoop);
    //   }
    // })

    return () => {
      socket.off("patternChange");
      // socket.off('receiveRowLaunch')
    };
    // }, [context, context.sequencers, row])
  }, [context, context.sequencers, setContext, socket]);

  return (
    <div className="sampler-container">
      <div className="sampler-tabs">
        <div
          id="soundbank"
          className={
            view === "soundbank" ? "sampler-tab tab-selected" : "sampler-tab"
          }
          onClick={() => toggleView("soundbank")}
        >
          <MusicNoteIcon />
          {/* Sounds */}
        </div>
        <div
          id="pattern"
          className={
            view === "pattern" ? "sampler-tab tab-selected" : "sampler-tab"
          }
          onClick={() => toggleView("pattern")}
        >
          <GridOnIcon />
          {/* Patterns */}
        </div>
      </div>
      <div className="sampler-view">
        {view === "pattern" && (
          <StepRow
            row={context.sequencers[currPattern]}
            id={socketID}
            beat={beat}
          />
        )}
        {view === "soundbank" && (
          <SampleSelector
            currPattern={currPattern}
            selectPattern={selectPattern}
          />
        )}
      </div>
    </div>
  );
};

export default Sampler;
