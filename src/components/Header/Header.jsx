import "rc-slider/assets/index.css";
import "./style.css";

import Slider from "rc-slider";

import { useStoreContext } from "../../App";
import { ReactComponent as InfoIcon } from "../../assets/img/info.svg";
import { ReactComponent as NightModeIcon } from "../../assets/img/night.svg";
import classes from "./style.module.css";
import Logo from "../Logo/Logo";
import IconButton from "../IconButton";

const Header = () => {
  const [{ isThreeDimensional, angle }, { toggleView, setAngle }] =
    useStoreContext();
  return (
    <div className={classes.header}>
      <Logo onClick={toggleView} />
      <div className={classes.controls}>
        <IconButton>
          <InfoIcon />
        </IconButton>
        <IconButton>
          <NightModeIcon />
        </IconButton>
        <div className={classes.divider} />
        <Slider
          value={angle}
          min={-30}
          max={75}
          step={0.1}
          onChange={setAngle}
          className={classes.slider}
        />
      </div>
    </div>
  );
};

export default Header;
