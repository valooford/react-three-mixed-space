import Card from "../Card";
import Wrapper from "../Wrapper";
import classes from "./style.module.css";

const Statements = () => {
  return (
    <div className={classes.statements}>
      <Wrapper>
        <div className={classes.cardsContainer}>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </Wrapper>
      <>
        <div className={classes.divider} />
      </>
    </div>
  );
};

export default Statements;
