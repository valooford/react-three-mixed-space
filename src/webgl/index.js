import { getContext } from "./context";

class WebGLOverlayApp {
  constructor({ canvas }) {
    const context = getContext({ canvas });
  }

  destroy() {}
}

export default WebGLOverlayApp;
