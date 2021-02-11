import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Rando from "./components/randoModule";
import Landing from "./components/landing";
import CssBaseline from "@material-ui/core/CssBaseline";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { createAudioContext, StepContext } from "./audio/createContext";
import { v4 as uuidv4 } from "uuid";
import "./fonts/Audiowide-Regular.ttf";
import "./fonts/Montserrat-Regular.ttf";
import "./app.css";
import io from "socket.io-client";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1a8b9d",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

const socket = io();

export interface TimeObj {
  deviceID: string;
  socketDeviceID?: string;
  deviceSendTime: number;
  deviceReceiveTime?: number;
  serverTime: number;
  roundTripTime?: number;
  offset?: number;
  context?: StepContext;
  isHost?: boolean;
}

const timeArr: TimeObj[] = [];

const deviceID = uuidv4();

const audioCtx = createAudioContext();

interface RAC {
  context: StepContext;
  setContext: (ctx: StepContext) => void;
}

export const ReactAudioContext = createContext<RAC>({
  context: audioCtx,
  setContext: () => console.log("setting up context..."),
});
export const SocketContext = createContext<SocketIOClient.Socket>(socket);
export const DeviceID = createContext<string>(deviceID);
export const Timing = createContext<TimeObj[]>(timeArr);

const App: React.FC = () => {
  const [context, setContext] = useState(audioCtx);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect event");
    });
  }, []);
  return (
    <ReactAudioContext.Provider value={{ context, setContext }}>
      <SocketContext.Provider value={socket}>
        <DeviceID.Provider value={deviceID}>
          <Timing.Provider value={timeArr}>
            <Router basename="/">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <Landing setReady={setReady} />}
                />
                <Route
                  path="/:id"
                  render={() => <Rando ready={ready} setReady={setReady} />}
                />
                <Redirect to="/" />
              </Switch>
            </Router>
          </Timing.Provider>
        </DeviceID.Provider>
      </SocketContext.Provider>
    </ReactAudioContext.Provider>
  );
};

const app: HTMLElement = document.getElementById("app")!;
ReactDOM.render(
  <CssBaseline>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </CssBaseline>,
  app
);
