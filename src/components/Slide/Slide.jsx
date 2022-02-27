import Heading from "../Heading";
import classes from "./style.module.css";

const Slide = () => {
  return (
    <div className={classes.slide}>
      <div className={classes.content}>
        <Heading color="dark" />
      </div>
      <>
        <div className={classes.circle} />
        <div className={classes.line1} />
        <div className={classes.line2} />
      </>
    </div>
  );
};

export default Slide;
