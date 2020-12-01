import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import Rando from './components/randoModule';
import Landing from './components/landing';
import { createAudioContext, StepContext } from './audio/createContext';
import { v4 as uuidv4 } from 'uuid';
import './app.css';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';
const socket = io(SOCKET_URL);

const audioCtx = createAudioContext();

interface RAC {
  context: StepContext;
  setContext: (ctx: StepContext) => void;
}

export const ReactAudioContext = createContext<RAC>({context: audioCtx, setContext: () => console.log('setting up context...')});
export const SocketContext = createContext<SocketIOClient.Socket>(socket);

const App: React.FC = () => {
  const [context, setContext] = useState(audioCtx);
  return (
    <ReactAudioContext.Provider value={{context, setContext}}>
        <SocketContext.Provider value={socket}>
          <Router
            basename="/"
            >
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/:id" component={Rando} />
              <Redirect to="/" />
            </Switch>
          </Router>
        </SocketContext.Provider>
    </ReactAudioContext.Provider>
  )
}

const app: HTMLElement = document.getElementById('app')!;
ReactDOM.render(<App />, app);