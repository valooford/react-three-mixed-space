import { ReactComponent as ViewIcon } from "../../assets/img/3d-view.svg";
import classes from "./style.module.css";

const Logo = ({ onClick }) => {
  return (
    <button type="button" className={classes.logo} onClick={onClick}>
      <ViewIcon />
    </button>
  );
};

export default Logo;
