import { createContext, useContext } from "react";

// action types
const TOGGLE_VIEW = "view/toggle";
const SET_ANGLE = "view/set-angle";

export const getActions = (dispatch) => ({
  toggleView: () => dispatch({ type: TOGGLE_VIEW }),
  setAngle: (payload) => dispatch({ type: SET_ANGLE, payload }),
});

export const initialState = { isThreeDimensional: true, angle: 20 };

export const reducer = (currentState, action) => {
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

export const StoreContext = createContext({});
export const useStoreContext = useContext.bind(null, StoreContext);
