import React, { useContext, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { ReactAudioContext, DeviceID } from "../app";
import { v4 as uuidv4 } from "uuid";
import "./landing.css";

interface Props {
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const Landing: React.FC<Props> = ({ setReady }) => {
  const { context } = useContext(ReactAudioContext);
  const deviceID = useContext(DeviceID);
  const button: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const title = "BuddyLoops";
  useLayoutEffect(() => {
    let timeoutID = setTimeout(() => {
      button.current?.classList.remove("invisible");
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, []);

  const handleStart = () => {
    // if you're hitting this button, you're the host
    context.hostID = deviceID;
    if (context.context.state !== "running") {
      context.context.resume();
    }
    setReady(true);
  };

  return (
    <div className="landing">
      <h1 id="site-title">
        {title.split("").map((char, i) => (
          <span style={{ animationDelay: `${(i / title.length) * 2}s` }}>
            {char}
          </span>
        ))}
      </h1>
      <div ref={button} id="invisible" className="invisible">
        <h2 id="tagline">Make music with friends in real time</h2>
        <Link to={uuidv4()}>
          <Button id="sessionStart" variant="outlined" onClick={handleStart}>
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
