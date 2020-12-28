import React, { useState, useContext, useEffect } from "react";
import { MonoSynth } from "../audio/synth";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { FormControlLabel } from "@material-ui/core";
import { SocketContext } from "../app";

const useStyles = makeStyles({
  root: {
    width: 96,
  },
});

export interface MonoSynthControlsProps {
  synth: MonoSynth;
  socketID: string;
}

const MonoSynthControls: React.SFC<MonoSynthControlsProps> = ({
  synth,
  socketID,
}) => {
  const [wave, setWave] = useState<OscillatorType>("sawtooth");
  const [noteLength, setNoteLength] = useState(synth.noteLength);
  const [attack, setAttack] = useState(synth.attackTime);
  const [release, setRelease] = useState(synth.releaseTime);
  const [filter, setFilter] = useState(synth.filter.frequency.value);
  const [q, setQ] = useState(synth.filter.Q.value);

  const socket = useContext(SocketContext);

  const classes = useStyles();

  const handleWave = (event: any) => {
    setWave(event.target.value);
    synth.osc.type = event.target.value;
    socket.emit("synthWave", socketID, event.target.value);
  };

  const handleNoteLength = (event: any, newValue: number | number[]) => {
    setNoteLength(newValue as number);
    synth.noteLength = newValue as number;
    socket.emit("synthNoteLength", socketID, newValue as number);
  };

  const handleAttack = (event: any, newValue: number | number[]) => {
    setAttack(newValue as number);
    synth.attackTime = newValue as number;
    socket.emit("synthAttack", socketID, newValue as number);
  };

  const handleRelease = (event: any, newValue: number | number[]) => {
    setRelease(newValue as number);
    synth.releaseTime = newValue as number;
    socket.emit("synthRelease", socketID, newValue as number);
  };

  const handleFilter = (event: any, newValue: number | number[]) => {
    setFilter(newValue as number);
    synth.filter.frequency.cancelScheduledValues(synth.context.currentTime);
    synth.filter.frequency.linearRampToValueAtTime(
      newValue as number,
      synth.context.currentTime + 0.1
    );
    socket.emit("synthFreq", socketID, newValue as number);
  };
  const handleQ = (event: any, newValue: number | number[]) => {
    setQ(newValue as number);
    synth.filter.Q.value = newValue as number;
    socket.emit("synthQ", socketID, newValue as number);
  };

  useEffect(() => {
    socket.on("synthWave", (val: OscillatorType) => {
      setWave(val);
      synth.osc.type = val;
    });
    socket.on("synthNoteLength", (val: number) => {
      setNoteLength(val);
      synth.noteLength = val;
    });
    socket.on("synthAttack", (val: number) => {
      setAttack(val);
      synth.attackTime = val;
    });
    socket.on("synthRelease", (val: number) => {
      setRelease(val);
      synth.releaseTime = val;
    });
    socket.on("synthFreq", (val: number) => {
      setFilter(val);
      synth.filter.frequency.cancelScheduledValues(synth.context.currentTime);
      synth.filter.frequency.linearRampToValueAtTime(
        val,
        synth.context.currentTime + 0.1
      );
    });
    socket.on("synthQ", (val: number) => {
      setQ(val);
      synth.filter.Q.value = val;
    });
    return () => {
      socket.off("synthWave");
      socket.off("synthNoteLength");
      socket.off("synthAttack");
      socket.off("synthRelease");
      socket.off("synthFreq");
      socket.off("synthQ");
    };
  }, [socket, synth]);
  return (
    <div id="mono-synth-controls">
      <div className="synth-wave">
        <FormControl>
          <RadioGroup
            aria-label="waveform"
            value={wave}
            onChange={handleWave}
            row
          >
            <FormControlLabel
              value={"sawtooth"}
              control={<Radio />}
              label="Saw"
            />
            <FormControlLabel
              value={"square"}
              control={<Radio />}
              label="Square"
            />
            <FormControlLabel
              value={"triangle"}
              control={<Radio />}
              label="Triangle"
            />
            <FormControlLabel value={"sine"} control={<Radio />} label="Sine" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className="synth-sliders">
        <div className="synth-param">
          <p className="label">
            Note Length: <span>{noteLength * 100}%</span>
          </p>
          <Slider
            value={noteLength}
            onChange={handleNoteLength}
            min={0.125}
            max={1}
            step={0.125}
            color="primary"
            className={classes.root}
          />
        </div>
        <div className="synth-param">
          <p className="label">
            Attack: <span>{attack}s</span>
          </p>
          <Slider
            value={attack}
            onChange={handleAttack}
            min={0.01}
            max={0.25}
            step={0.01}
            color="primary"
            className={classes.root}
          />
        </div>
        <div className="synth-param">
          <p className="label">
            Release: <span>{release}s</span>
          </p>
          <Slider
            value={release}
            onChange={handleRelease}
            min={0.01}
            max={0.5}
            step={0.01}
            color="primary"
            className={classes.root}
          />
        </div>
        <div className="synth-param">
          <p className="label">
            Filter Freq: <span>{filter}Hz</span>
          </p>
          <Slider
            value={filter}
            onChange={handleFilter}
            min={100}
            max={10000}
            step={100}
            color="primary"
            className={classes.root}
          />
        </div>
        <div className="synth-param">
          <p className="label">
            Q: <span>{q}</span>
          </p>
          <Slider
            value={q}
            onChange={handleQ}
            min={0.5}
            max={12}
            step={0.25}
            color="primary"
            className={classes.root}
          />
        </div>
      </div>
    </div>
  );
};

export default MonoSynthControls;
