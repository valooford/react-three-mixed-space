import classes from "./style.module.css";

const Slider = () => {
  return (
    <div className={classes.sliderRoot}>
      <div className={classes.infoContainer}>
        <div className={classes.info}></div>
      </div>
      <div className={classes.picture}></div>
    </div>
  );
};

export default Slider;
