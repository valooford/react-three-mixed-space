import Engine from "./engine";

export const getContext = ({ canvas }) => {
  const engine = new Engine({ canvas });

  return { engine };
};
