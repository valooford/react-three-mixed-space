import { getContext } from "./context";
import MainStartup from "./startup-main";

class WebGLOverlayApp {
  constructor({ canvas }) {
    const context = getContext({ canvas });
    this.startup = new MainStartup({ context });
  }

  destroy() {}
}

export default WebGLOverlayApp;
