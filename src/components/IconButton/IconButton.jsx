// import { ReactComponent as ViewIcon } from "../../assets/img/3d-view.svg";
import classes from "./style.module.css";

const IconButton = ({ children, onClick }) => {
  return (
    <button type="button" className={classes.iconButton} onClick={onClick}>
      {children}
    </button>
  );
};

export default IconButton;
