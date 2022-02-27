import cn from "classnames";

import { ReactComponent as HexagonIcon } from "../../assets/img/hexagon.svg";
import Text from "../Text";
import classes from "./style.module.css";

const Heading = ({ color }) => {
  return (
    <h2
      className={cn(classes.heading, {
        [classes.heading_dark]: color === "dark",
        [classes.heading_light]: color === "light",
      })}
    >
      <HexagonIcon />
      <Text h color={color} />
    </h2>
  );
};

export default Heading;
