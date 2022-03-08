import { getContext } from "./context";
import SpaceStartup from "./startup-space";

class WebGLOverlayApp {
  constructor({ canvas }) {
    const context = getContext({ canvas });
    this.startup = new SpaceStartup({ context });
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
