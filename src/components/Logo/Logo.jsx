import { useCallback, useState } from "react";
import { ReactComponent as ViewIcon } from "../../assets/img/3d-view.svg";
import classes from "./style.module.css";

const Logo = ({ onClick }) => {
  const [disabled, setDisabled] = useState(false);
  const handleClick = useCallback(() => {
    onClick();
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 1500);
  }, [onClick]);
  return (
    <button
      type="button"
      disabled={disabled}
      className={classes.logo}
      onClick={handleClick}
    >
      <ViewIcon />
    </button>
  );
};

export default Logo;
