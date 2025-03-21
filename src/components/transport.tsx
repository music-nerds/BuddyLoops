import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Slider from "@material-ui/core/Slider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import PlayArrowSharpIcon from "@material-ui/icons/PlayArrowSharp";
import StopSharpIcon from "@material-ui/icons/StopSharp";
import GroupIcon from "@material-ui/icons/Group";
import { ReactAudioContext, SocketContext, Timing, DeviceID } from "../app";
import { AppState } from "./randoModule";
import { play, stop } from "../audio/audioFunctions";
import Button from "@material-ui/core/Button";
import drum from "../../images/icons/drum.png";
import piano from "../../images/icons/piano.png";
import "./transport.css";

const Alert: React.FC<AlertProps> = (props: AlertProps) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

interface Props {
  id: string;
  setBeat: React.Dispatch<React.SetStateAction<number>>;
  audition: boolean;
  toggleAudition: () => void;
  toggleInstrument: (instrument: string) => void;
  instrument: string;
}

const Transport: React.FC<Props> = ({
  id,
  setBeat,
  instrument,
  toggleInstrument,
}) => {
  const [open, setOpen] = useState(false);
  const { context, setContext } = useContext(ReactAudioContext);
  const [tempo, setTempo] = useState<number>(context.tempo);
  const [swing, setSwing] = useState<number>(context.swing);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const socket = useContext(SocketContext);
  const timeArr = useContext(Timing);
  const deviceID = useContext(DeviceID);

  useEffect(() => {
    let timeoutID: NodeJS.Timeout;
    const playAtTime = (target: number) => {
      const myTimeObj = timeArr.find((obj) => obj.deviceID === deviceID);
      const offset = myTimeObj?.offset || 0;
      const now = Date.now();
      const delay = target + offset - now;
      timeoutID = setTimeout(() => {
        play(context);
      }, delay);
    };
    socket.on("receivePlay", (target: number) => {
      console.log("received play", target);
      playAtTime(target);
    });

    return () => {
      socket.off("receivePlay");
      clearTimeout(timeoutID);
    };
  }, [timeArr, context, socket, deviceID]);

  useEffect(() => {
    socket.on("receiveStop", () => {
      console.log("received stop", Date.now());
      stop(context);
      if (!context.isPlaying) {
        setContext({ ...context });
      }
      setBeat(-1);
    });
    socket.on("receiveState", (hostState: AppState) => {
      setSwing(hostState.swing);
      setTempo(hostState.tempo);
      console.log("TRANSPORT RECEIVE STATE", hostState);
    });
    return () => {
      socket.off("receiveStop");
      socket.off("receiveState");
    };
  }, [context, setBeat, socket, setContext]);

  const handlePlay = (): void => {
    socket.emit("sendPlay", id, timeArr);
  };

  const handleStop = (): void => {
    setBeat(-1);
    socket.emit("sendStop", id);
  };

  const togglePlay = (): void => {
    !context.isPlaying ? handlePlay() : handleStop();
  };

  const clipboard = async (): Promise<void> => {
    const url: string = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setOpen(true);
    } catch (err) {
      console.error("failed to copy", err);
    }
  };

  const close = (event?: React.SyntheticEvent, reason?: string): void => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const updateTempo = (event: any, newValue: number | number[]) => {
    context.updateTempo(newValue as number);
    setTempo(newValue as number);
    context.synth.updateDelayTime(context.tempo);
    socket.emit("tempoChange", socketID, newValue);
  };

  const updateSwing = (event: any, newValue: number | number[]) => {
    setSwing(newValue as number);
    context.updateSwing(newValue as number);
    socket.emit("swingChange", socketID, newValue as number);
  };

  useEffect(() => {
    socket.on("swingChange", (value: number) => {
      setSwing(value);
      context.updateSwing(value);
    });
    socket.on("tempoChange", (value: number) => {
      setTempo(value);
      context.updateTempo(value);
    });
    return () => {
      socket.off("swingChange");
      socket.off("tempoChange");
    };
  }, [context, socket]);
  return (
    <div id="transport">
      <div className="transport-bottom-row">
        <div className="tempo-adjust">
          <span className="transport-label">{tempo} bpm</span>
          <Slider
            value={tempo}
            onChange={updateTempo}
            color="secondary"
            min={50}
            max={180}
            step={1}
          />
        </div>
        <div className="swing-adjust">
          <span className="transport-label">Swing {swing}%</span>
          <Slider
            value={swing}
            onChange={updateSwing}
            color="secondary"
            step={1}
          />
        </div>
      </div>
      <div className="transport-top-row">
        <div className="play-stop">
          <Button color="secondary" onClick={togglePlay}>
            {!context.isPlaying ? (
              <PlayArrowSharpIcon style={{ fontSize: 56 }} />
            ) : (
              <StopSharpIcon style={{ fontSize: 56 }} />
            )}
          </Button>
        </div>
        <div className="transport-instrument-select">
          <div
            className={
              instrument === "sampler"
                ? "transport-instrument-button sampler selected"
                : "transport-instrument-button sampler"
            }
          >
            <img
              className="transport-instrument-icon"
              src={drum}
              alt="sampler icon"
              onClick={() => toggleInstrument("sampler")}
            />
          </div>
          <div
            className={
              instrument === "synth"
                ? "transport-instrument-button synth selected"
                : "transport-instrument-button synth"
            }
          >
            <img
              className="transport-instrument-icon"
              src={piano}
              alt="synth icon"
              onClick={() => toggleInstrument("synth")}
            />
          </div>
        </div>
        <div className="share-btn-div">
          <Button
            startIcon={<GroupIcon fontSize="large" />}
            className="share-btn"
            color="primary"
            variant="contained"
            size="small"
            style={{ height: 24, verticalAlign: "center", padding: "0 8px" }}
            onClick={clipboard}
          >
            Invite
          </Button>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={5000} onClose={close}>
        <Alert onClose={close} severity="success">
          Link copied to clipboard, send to a friend!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Transport;
