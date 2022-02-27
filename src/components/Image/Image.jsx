import cn from "classnames";

import classes from "./style.module.css";

const Image = ({ sm }) => {
  return (
    <div
      className={cn(classes.image, {
        [classes.image_sm]: sm,
      })}
    />
  );
};

export default Image;
