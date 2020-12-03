import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import Rando from './components/randoModule';
import Landing from './components/landing';
import { createAudioContext, StepContext } from './audio/createContext';
import { v4 as uuidv4 } from 'uuid';
import './app.css';
import io from 'socket.io-client';

// this must be standardized
const SOCKET_URL = '192.168.1.8:3000';
const socket = io(SOCKET_URL);

export interface TimeObj {
  deviceID: string;
  deviceSendTime: number;
  deviceReceiveTime?: number;
  serverTime: number;
  roundTripTime?: number;
  offset?: number;
}

const timeArr: TimeObj[] = [];

const deviceID = uuidv4();

const audioCtx = createAudioContext();

interface RAC {
  context: StepContext;
  setContext: (ctx: StepContext) => void;
}

export const ReactAudioContext = createContext<RAC>({context: audioCtx, setContext: () => console.log('setting up context...')});
export const SocketContext = createContext<SocketIOClient.Socket>(socket);
export const DeviceID = createContext<string>(deviceID);
export const Timing = createContext<TimeObj[]>(timeArr);

const App: React.FC = () => {
  const [context, setContext] = useState(audioCtx);
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect event')
    })
  }, [])
  return (
    <ReactAudioContext.Provider value={{context, setContext}}>
        <SocketContext.Provider value={socket}>
          <DeviceID.Provider value={deviceID}>
            <Timing.Provider value={timeArr}>
              <Router
                basename="/"
              >
                <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route path="/:id" component={Rando} />
                  <Redirect to="/" />
                </Switch>
              </Router>
            </Timing.Provider>
          </DeviceID.Provider>
        </SocketContext.Provider>
    </ReactAudioContext.Provider>
  )
}

const app: HTMLElement = document.getElementById('app')!;
ReactDOM.render(<App />, app);