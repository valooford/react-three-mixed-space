import { useEffect, useMemo, useState } from "react";

import WebGLOverlayApp from "../../webgl";
import classes from "./style.module.css";

const WebGLOverlay = () => {
  const [canvas, setCanvas] = useState(null);

  const webGLOverlayApp = useMemo(
    () => (canvas ? new WebGLOverlayApp({ canvas }) : null),
    [canvas]
  );

  useEffect(() => () => webGLOverlayApp?.destroy(), [webGLOverlayApp]);

  return <canvas className={classes.canvas} ref={setCanvas} />;
};

export default WebGLOverlay;
