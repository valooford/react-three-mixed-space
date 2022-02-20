import "rc-slider/assets/index.css";
import "./style.css";

import cn from "classnames";
import Slider from "rc-slider";

import { ReactComponent as ViewIcon } from "../../assets/img/3d-view.svg";
import { useStoreContext } from "../../App";
import classes from "./style.module.css";

const Header = () => {
  const [{ isThreeDimensional, angle }, { toggleView, setAngle }] =
    useStoreContext();
  return (
    <div className={classes.header}>
      <button
        type="button"
        className={cn(classes.toggleViewButton, {
          [classes.toggleViewButton_active]: isThreeDimensional,
        })}
        onClick={toggleView}
      >
        <ViewIcon />
      </button>
      <Slider
        value={angle}
        min={-30}
        max={75}
        step={0.1}
        onChange={setAngle}
        className={classes.slider}
      />
    </div>
  );
};

export default Header;
