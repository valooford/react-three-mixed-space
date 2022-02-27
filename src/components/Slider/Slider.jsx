import Slide from "../Slide";
import classes from "./style.module.css";

const Slider = () => {
  return (
    <div className={classes.slider}>
      <Slide />
      <div className={classes.buttonsContainer}>
        <button type="button" />
        <button type="button" />
        <button type="button" />
        <button type="button" />
      </div>
    </div>
  );
};

export default Slider;
