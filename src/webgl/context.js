import { Engine } from "./engine";
import { AssetManager } from "./assetManager";

export const getContext = ({ canvas }) => {
  const engine = new Engine({ canvas });

  const assets = new AssetManager();

  return {
    engine,
    assets,
  };
};
