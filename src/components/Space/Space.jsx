import { useRef } from "react";

import { useStoreContext } from "../../App";
import { useSpaceScene } from "./hooks";
import classes from "./style.module.css";

const Space = () => {
  const canvasRef = useRef(null);

  const [{ angle }] = useStoreContext();

  useSpaceScene(canvasRef, { angle });

  return <canvas className={classes.canvas} ref={canvasRef} />;
};

export default Space;
