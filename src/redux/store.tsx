import { createStore, applyMiddleware } from 'redux';
import thunks from 'redux-thunk';

interface BeatAction {
  type: string;
  beat: number;
}

export interface BeatState {
  beat: number
}

const TYPES = {
  SET_BEAT: 'SET_BEAT',
};

const initialState = {
  beat: -1,
};

const setBeatAction = (beat: number) => {
  return {
    type: TYPES.SET_BEAT,
    beat,
  };
};

export const setBeat = (beat: number) => (dispatch: any) => {
  dispatch(setBeatAction(beat));
}


const reducer = (state: BeatState = initialState, action: BeatAction) => {
  switch(action.type) {
    case TYPES.SET_BEAT:
      return {
        ...state,
        beat: action.beat,
      }
    default:
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunks));

export default store;


