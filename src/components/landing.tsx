import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { ReactAudioContext, DeviceID } from "../app";
import { v4 as uuidv4 } from "uuid";
import "./landing.css";

// const logo = require("../../public/images/logo.png");

interface Props {
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const Landing: React.FC<Props> = ({ setReady }) => {
  const { context } = useContext(ReactAudioContext);
  const deviceID = useContext(DeviceID);
  const handleStart = () => {
    // if you're hitting this button, you're the host
    context.hostID = deviceID;
    if (context.context.state !== "running") {
      context.context.resume().then(() => {
        // triggers re-render to avoid context overlay
        setReady(true);
      });
    }
  };

  return (
    <div className="landing">
      <img src="/images/logo.png" alt="Buddy Loops Logo" className="logo" />
      <h1 className="tagline">Make Music in Real Time</h1>
      <Link to={uuidv4()}>
        <Button id="sessionStart" variant="outlined" onClick={handleStart}>
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default Landing;
