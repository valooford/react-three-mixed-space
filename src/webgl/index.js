import { getContext } from "./context";
import MainStartup from "./startup-main";

class WebGLOverlayApp {
  constructor({ canvas }) {
    const context = getContext({ canvas });
    this.startup = new MainStartup({ context });
  }

  setAngle(angle) {
    this.startup.setAngle(angle);
  }

  destroy() {
    this.startup.destroy();
    this.startup = null;
  }
}

export default WebGLOverlayApp;
