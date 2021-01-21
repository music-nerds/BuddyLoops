import React, { useContext } from "react";
import { ReactAudioContext, Timing, DeviceID } from "../app";
import { play, calculateFullCycleTime } from "../audio/audioFunctions";

import Button from "@material-ui/core/Button";
import "./contextOverlay.css";

interface Props {
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}
const ContextOverlay: React.SFC<Props> = ({ setReady }) => {
  const { context } = useContext(ReactAudioContext);
  const timeArr = useContext(Timing);
  const deviceID = useContext(DeviceID);

  const handleStart = () => {
    setReady(true);
    context.context.resume().then(() => {
      if (context.nextCycleTime) {
        const myTimeObj = timeArr.find((obj) => obj.deviceID === deviceID);
        const offset = myTimeObj?.offset || 0;
        const now = Date.now();
        let delay = context.nextCycleTime + offset - now;
        while (delay < 0) {
          delay = delay + calculateFullCycleTime(context);
        }
        setTimeout(() => {
          play(context);
        }, delay);
      }
    });
  };

  return (
    <div className={"context-overlay"}>
      <Button variant="outlined" onClick={handleStart}>
        Get Started
      </Button>
    </div>
  );
};

export default ContextOverlay;
