import Heading from "../Heading";
import Image from "../Image";
import Text from "../Text";
import Wrapper from "../Wrapper";
import classes from "./style.module.css";

const Gallery = () => {
  return (
    <div className={classes.gallery}>
      <Wrapper>
        <div className={classes.row1}>
          <div className={classes.headingContainer}>
            <Heading />
          </div>
          <Image />
          <Image />
          <Image />
        </div>
        <div className={classes.row2}>
          <div className={classes.slogan}>
            <Text b />
            <Text b md />
          </div>
          <Image />
          <Image />
          <Image sm />
        </div>
        <>
          <div className={classes.line1} />
          <div className={classes.line2} />
        </>
      </Wrapper>
    </div>
  );
};

export default Gallery;
