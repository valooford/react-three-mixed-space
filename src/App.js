import { createContext, useContext, useMemo, useReducer } from "react";

import Header from "./components/Header";
import Page from "./components/Page";
import Space from "./components/Space";

const TOGGLE_VIEW = "view/toggle";
const SET_ANGLE = "view/set-angle";
const initialState = { isThreeDimensional: false, angle: 30 };
const reducer = (currentState, action) => {
  switch (action.type) {
    case TOGGLE_VIEW:
      return {
        ...currentState,
        isThreeDimensional: !currentState.isThreeDimensional,
      };
    case SET_ANGLE:
      return {
        ...currentState,
        angle: action.payload,
      };
    default:
  }
  return currentState;
};

const StoreContext = createContext({});
export const useStoreContext = useContext.bind(null, StoreContext);

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isThreeDimensional } = state;
  const actions = useMemo(
    () => ({
      toggleView: () => dispatch({ type: TOGGLE_VIEW }),
      setAngle: (payload) => dispatch({ type: SET_ANGLE, payload }),
    }),
    []
  );

  return (
    <StoreContext.Provider value={[state, actions]}>
      <div>
        {isThreeDimensional && <Space />}
        <Header />
        <Page />
      </div>
    </StoreContext.Provider>
  );
};

export default App;
