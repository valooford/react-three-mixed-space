import { ReactComponent as HexagonIcon } from "../../assets/img/hexagon.svg";
import classes from "./style.module.css";

const ListIcon = () => {
  return (
    <div className={classes.listIcon}>
      <HexagonIcon />
      <div className={classes.circle} />
    </div>
  );
};

export default ListIcon;
