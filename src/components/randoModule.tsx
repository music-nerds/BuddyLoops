import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  ReactAudioContext,
  SocketContext,
  DeviceID,
  TimeObj,
  Timing,
} from "../app";
import ContextOverlay from "./contextOverlay";
import Transport from "./transport";
import Instruments from "./instruments";
import UserIndicators from "./userIndicators";

interface NewUser {
  id: string;
  timeStamp: number;
}

interface SeqData {
  name: string;
  pattern: (0 | 1)[];
  isPlaying: boolean;
  shouldPlayNextLoop: boolean;
}

interface SynthData {
  wave: OscillatorType;
  noteLength: number;
  attackTime: number;
  releaseTime: number;
  filterFreq: number;
  q: number;
  pattern: (0 | 1)[][];
}

export interface AppState {
  isPlaying: boolean;
  nextCycleTime?: number;
  tempo: number;
  swing: number;
  seqData: SeqData[];
  synthState: SynthData;
  sequencersArePlaying: boolean;
  sequencersShouldPlayNextLoop: boolean;
}

interface Props {
  ready: boolean;
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}
const Rando: React.FC<Props> = ({ ready, setReady }) => {
  const { context, setContext } = useContext(ReactAudioContext);
  const [beat, setBeat] = useState(-1);
  const [audition, setAudition] = useState(true);
  const [connected, setConnected] = useState(false);
  const socket = useContext(SocketContext);
  const deviceID = useContext(DeviceID);
  let timeArr = useContext(Timing);
  const {
    location: { pathname },
  } = useHistory();
  const socketID = pathname.slice(1);
  const [currPattern, setCurrPattern] = useState(0);
  const [view, setView] = useState("soundbank");
  const [instrument, setInstrument] = useState("sampler");
  const [numUsers, setNumUsers] = useState(0);

  useEffect(() => {
    context.sequencers.forEach((seq) => {
      seq.loadSample().then(() => {
        if (seq.errMsg) {
          // TODO: do something with the errors
        }
      });
    });
  }, [context.sequencers]);
  useEffect(() => {
    // prevents retriggering if user hits 'back'button
    context.subscribeSquares(setBeat);
    // sync devices to each other
    socket.emit("handshake", socketID);
    socket.emit("getOffset", socketID, {
      deviceID,
      deviceSendTime: Date.now(),
      isHost: false,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    socket.on("receiveServerTime", (timeObj: TimeObj) => {
      // console.log("RECEIVE SERVER TIME PRE", timeArr);
      timeObj.deviceReceiveTime = Date.now();
      timeObj.roundTripTime =
        timeObj.deviceReceiveTime - timeObj.deviceSendTime;
      timeObj.offset = timeObj.deviceReceiveTime - timeObj.serverTime;
      if (!timeArr.find((obj) => obj.deviceID === deviceID)) {
        timeArr.push(timeObj);
      }
      setNumUsers(timeArr.length);
      setConnected(true);
      if (timeObj.deviceID !== deviceID) {
        const myTimeObj = timeArr.find((obj) => obj.deviceID === deviceID);
        socket.emit("notifyTime", socketID, myTimeObj);
      } else {
        socket.emit("notifyTime", socketID, timeObj);
      }
    });
    socket.on("notifyTime", (timeObj: TimeObj) => {
      const deviceHasThisAlready = timeArr.find(
        (obj) => obj.deviceID === timeObj.deviceID
      );
      if (!deviceHasThisAlready) {
        timeArr.push(timeObj);
        setNumUsers(timeArr.length);
      }
      if (timeArr.length > 1) {
        // person on the longest becomes the host
        timeArr.sort(
          (a, b) => Number(a.deviceReceiveTime) - Number(b.deviceReceiveTime)
        );
        timeArr[0].isHost = true;
        if (deviceID === timeArr[0].deviceID) {
          // I'm the host, send context
          const seqData = context.sequencers.map((seq) => {
            return {
              pattern: seq.pattern,
              name: seq.name,
              isPlaying: seq.isPlaying,
              shouldPlayNextLoop: seq.shouldPlayNextLoop,
            };
          });
          const {
            tempo,
            isPlaying,
            swing,
            nextCycleTime,
            sequencersArePlaying,
            sequencersShouldPlayNextLoop,
            synth: { attackTime, releaseTime, pattern, filter, noteLength },
          } = context;
          socket.emit("sendState", socketID, {
            nextCycleTime:
              (nextCycleTime as number) - Number(timeArr[0].offset),
            seqData,
            tempo,
            isPlaying,
            swing,
            sequencersArePlaying,
            sequencersShouldPlayNextLoop,
            synthState: {
              attackTime,
              releaseTime,
              pattern,
              noteLength,
              wave: context.synth.osc.type,
              filterFreq: filter.frequency.value,
              q: filter.Q.value,
            },
          });
        }
      }
    });
    let timeoutID: number;
    socket.on("receiveState", (hostContext: AppState) => {
      context.nextCycleTime = hostContext.nextCycleTime;
      context.tempo = hostContext.tempo;
      context.swing = hostContext.swing;
      context.sequencersArePlaying = hostContext.sequencersArePlaying;
      context.sequencersShouldPlayNextLoop =
        hostContext.sequencersShouldPlayNextLoop;
      hostContext.seqData.forEach((seq) => {
        const sameSeq = context.sequencers.find(
          (ctxSeq) => ctxSeq.name === seq.name
        );
        if (sameSeq) {
          sameSeq.pattern = seq.pattern;
          sameSeq.isPlaying = seq.isPlaying;
          sameSeq.shouldPlayNextLoop = seq.shouldPlayNextLoop;
        }
      });
      const {
        synthState: {
          attackTime,
          releaseTime,
          pattern,
          noteLength,
          wave,
          filterFreq,
          q,
        },
      } = hostContext;
      const { synth } = context;
      synth.attackTime = attackTime;
      synth.releaseTime = releaseTime;
      synth.pattern = pattern;
      synth.noteLength = noteLength;
      synth.osc.type = wave;
      synth.filter.frequency.linearRampToValueAtTime(
        filterFreq,
        context.context.currentTime + 0.01
      );
      synth.filter.Q.linearRampToValueAtTime(
        q,
        context.context.currentTime + 0.01
      );

      if (!context.isPlaying) {
        setContext({ ...context });
      }
    });
    socket.on("userJoined", (data: NewUser) => {
      console.log("NEW USER", data);
    });
    socket.on("userLeft", (id: string) => {
      console.log("USER LEFT", id);
      const host = timeArr.find((obj) => obj.isHost === true);
      const hostIndex = timeArr.indexOf(host!);
      // if the person who left is the host
      if (timeArr[hostIndex].socketDeviceID === id) {
        // assign new host
        timeArr.splice(hostIndex, 1);
        timeArr[0].isHost = true;
        setNumUsers(timeArr.length);
      } else {
        // find the person who left and splice them out
        const userThatLeft = timeArr.find((obj) => obj.socketDeviceID === id);
        const userThatLeftIndex = timeArr.indexOf(userThatLeft!);
        timeArr.splice(userThatLeftIndex, 1);
        setNumUsers(timeArr.length);
      }
      console.log(timeArr);
    });
    // console.log("USEEFFECT", context)
    return () => {
      socket.off("notifyTime");
      socket.off("userLeft");
      socket.off("receiveState");
      socket.off("receiveServerTime");
      clearTimeout(timeoutID);
    };
  }, [timeArr, context, deviceID, socket, socketID, setContext]);

  const selectPattern = (pattern: number): void => {
    setCurrPattern(pattern);
    if (!audition) {
      setView("pattern");
    }
  };

  const toggleView = (view: string) => {
    setView(view);
  };

  const toggleInstrument = (instrument: string) => {
    setInstrument(instrument);
  };

  const toggleAudition = () => {
    setAudition(!audition);
  };

  return (
    <div className="fullPage">
      <div className="container">
        <UserIndicators numUsers={numUsers} />
        {!ready ? (
          <ContextOverlay setReady={setReady} connected={connected} />
        ) : (
          <>
            <Transport
              id={socketID}
              setBeat={setBeat}
              audition={audition}
              toggleAudition={toggleAudition}
              toggleInstrument={toggleInstrument}
              instrument={instrument}
            />
            <Instruments
              socketID={socketID}
              beat={beat}
              selectPattern={selectPattern}
              currPattern={currPattern}
              view={view}
              toggleView={toggleView}
              audition={audition}
              toggleAudition={toggleAudition}
              synth={context.synth}
              instrument={instrument}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Rando;
