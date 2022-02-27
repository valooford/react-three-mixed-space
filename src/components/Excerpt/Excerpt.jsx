import Button from "../Button";
import Text from "../Text";
import Wrapper from "../Wrapper";
import classes from "./style.module.css";

const Excerpt = () => {
  return (
    <div className={classes.excerpt}>
      <Wrapper>
        <div className={classes.content}>
          <div className={classes.text1}>
            <Text />
            <Text />
            <Text md />
          </div>
          <div className={classes.image}>
            <div className={classes.bgCircle} />
            <div className={classes.bgCircle} />
            <div className={classes.circle} />
          </div>
          <div className={classes.text2}>
            <div className={classes.cta}>
              <Text b />
              <Text md />
              <Text sm />
              <div className={classes.ctaButtonContainer}>
                <Button />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
      <>
        <div className={classes.divider} />
      </>
    </div>
  );
};

export default Excerpt;
