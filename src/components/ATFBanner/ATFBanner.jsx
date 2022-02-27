import ArticleLink from "../ArticleLink";
import Slider from "../Slider";
import classes from "./style.module.css";

const ATFBanner = () => {
  return (
    <div className={classes.banner}>
      <div className={classes.image} />
      <div className={classes.sliderContainer}>
        <Slider />
      </div>
      <div className={classes.articles}>
        <div className={classes.articleContainer}>
          <ArticleLink />
        </div>
        <div className={classes.articleContainer} />
        <div className={classes.articleContainer}>
          <ArticleLink color="dark" />
        </div>
      </div>
    </div>
  );
};

export default ATFBanner;
