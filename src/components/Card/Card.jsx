import ListIcon from "../ListIcon";
import Text from "../Text";
import classes from "./style.module.css";

const Card = () => {
  return (
    <div className={classes.card}>
      <ListIcon />
      <div className={classes.content}>
        <Text />
        <Text />
        <Text />
        <Text />
        <Text />
        <Text sm />
      </div>
    </div>
  );
};

export default Card;
