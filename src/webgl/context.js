import AssetManager from "./assetManager";
import Engine from "./engine";

export const getContext = ({ canvas }) => {
  const engine = new Engine({ canvas });

  const assets = new AssetManager();

  return { engine, assets };
};
