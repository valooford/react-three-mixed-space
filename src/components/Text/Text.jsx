import cn from "classnames";

import classes from "./style.module.css";

const Text = ({ color, b, h, sm, md }) => {
  return (
    <span
      className={cn(classes.text, {
        [classes.text_dark]: color === "dark",
        [classes.text_light]: color === "light",
        [classes.text_b]: b,
        [classes.text_h]: h,
        [classes.text_sm]: sm,
        [classes.text_md]: md,
      })}
    ></span>
  );
};

export default Text;
