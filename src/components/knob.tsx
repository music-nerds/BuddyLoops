import React, { useState, useRef, useEffect, useContext } from 'react';
import './knob.css';
import { initialKnobData } from './utils/handleKnob';
import { StepRow } from '../audio/createContext';
import { ReactAudioContext } from '../app';

interface Row {
  row: StepRow;
}

const Knob: React.FC<Row> = ({row}) => {
  const knob = useRef<HTMLDivElement>(null);
  const {context} = useContext(ReactAudioContext);
  const knobData = useRef(initialKnobData)
  const handleKnob = (e: MouseEvent): void => {
    if(knobData.current.selected){
      knobData.current.curY = e.clientY
      let movement = ((knobData.current.startY - knobData.current.curY )/200)
      knobData.current.rotation = knobData.current.rotation + movement / 10
      if(knobData.current.rotation < -0.4) knobData.current.rotation = - 0.4
      if(knobData.current.rotation > .4) knobData.current.rotation = .4
      if(knob.current) {
        knob.current.style.transform = `rotate(${knobData.current.rotation}turn)`
      }
      knobData.current.value = (knobData.current.rotation + 0.4) * 1.25
      row.gain.gain.linearRampToValueAtTime(knobData.current.value, context.context.currentTime + 0.1)
    }
  }

  const handleMouseDown = function(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
    knobData.current.selected = true
    knobData.current.startY = e.clientY
    knobData.current.curY = e.clientY
    // setknobData.current(knobData.current)
    window.onmousemove = handleKnob
  }
  useEffect(()=>{
    if(knob.current) {
      knob.current.style.transform = `rotate(${knobData.current.rotation}turn)`
    }
    window.onmouseup = function(){
      if(knobData.current.selected) {
        knobData.current.selected = false
      }
      window.onmousemove = null
    }
  },[])
  return (
    <div className="knob" 
      ref={knob} 
      onMouseDown={handleMouseDown}
    />
  )
}

export default Knob;