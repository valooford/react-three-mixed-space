import { useEffect, useMemo, useState } from "react";

import { useStoreContext } from "../../store";
import WebGLOverlayApp from "../../webgl";
import classes from "./style.module.css";

const WebGLOverlay = () => {
  const [canvas, setCanvas] = useState(null);

  const [{ angle }] = useStoreContext();

  const webGLOverlayApp = useMemo(
    () => (canvas ? new WebGLOverlayApp({ canvas }) : null),
    [canvas]
  );

  useEffect(() => webGLOverlayApp?.setAngle(angle), [webGLOverlayApp, angle]);

  useEffect(() => () => webGLOverlayApp?.destroy(), [webGLOverlayApp]);

  return <canvas className={classes.canvas} ref={setCanvas} />;
};

export default WebGLOverlay;
