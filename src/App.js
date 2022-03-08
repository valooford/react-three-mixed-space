import { useMemo, useReducer } from "react";

import Header from "./components/Header";
import Page from "./components/Page";
import Space from "./components/Space";
import { getActions, initialState, reducer, StoreContext } from "./store";

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useMemo(() => getActions(dispatch), []);

  const { isThreeDimensional } = state;

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
