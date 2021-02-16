import React, { useContext, useLayoutEffect, useRef } from "react";
import { ReactAudioContext, Timing, DeviceID } from "../app";
import { play, calculateFullCycleTime } from "../audio/audioFunctions";
import Button from "@material-ui/core/Button";
import "./contextOverlay.css";

interface Props {
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
  connected: boolean;
}
const ContextOverlay: React.SFC<Props> = ({ setReady, connected }) => {
  const { context } = useContext(ReactAudioContext);
  const timeArr = useContext(Timing);
  const deviceID = useContext(DeviceID);
  const button: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const title = "BuddyLoops";

  const handleStart = () => {
    setReady(true);
    context.context.resume().then(() => {
      if (context.nextCycleTime) {
        const myTimeObj = timeArr.find((obj) => obj.deviceID === deviceID);
        const offset = myTimeObj?.offset || 0;
        const now = Date.now();
        let delay =
          context.nextCycleTime + offset - now - context.scheduleAheadTime;
        while (delay < 0) {
          delay = delay + calculateFullCycleTime(context);
        }
        setTimeout(() => {
          play(context);
        }, delay);
      }
    });
  };
  useLayoutEffect(() => {
    let timeoutID = setTimeout(() => {
      button.current?.classList.remove("invisible");
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [connected]);
  return (
    <div className={"context-overlay"}>
      <h1 id="site-title">
        {title.split("").map((char, i) => (
          <span
            style={{ animationDelay: `${(i / title.length) * 2}s` }}
            key={i}
          >
            {char}
          </span>
        ))}
      </h1>

      {connected ? (
        <div ref={button} id="invisible" className="invisible">
          <h2 id="tagline">Make music with friends in real time</h2>
          <Button id="sessionStart" variant="outlined" onClick={handleStart}>
            Join Session
          </Button>
        </div>
      ) : (
        <h1 className="loading">Loading...</h1>
      )}
    </div>
  );
};

export default ContextOverlay;
