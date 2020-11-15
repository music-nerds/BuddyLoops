import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import Rando from './components/randoModule';
import { createAudioContext, StepContext } from './audio/createContext'
import './app.css';

const audioCtx = createAudioContext();

interface RAC {
  context: StepContext;
  setContext: (ctx: StepContext) => void;
}

export const ReactAudioContext = createContext<RAC>({context: audioCtx, setContext: () => console.log('setting up context...')});


const App: React.FC = () => {
  const [context, setContext] = useState(audioCtx);
  return (
    <ReactAudioContext.Provider value={{context, setContext}}>
      <Router
        basename="/"
        >
        <Switch>
          <Route 
            exact 
            path="/" 
            component={Rando} 
            />
          <Redirect to="/" />
        </Switch>
      </Router>
    </ReactAudioContext.Provider>
  )
}

const app: HTMLElement = document.getElementById('app')!;
ReactDOM.render(<App />, app);