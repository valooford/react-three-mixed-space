import cn from "classnames";

import { useStoreContext } from "../../App";
import ATFBanner from "../ATFBanner";
import Excerpt from "../Excerpt";
import Footer from "../Footer";
import Gallery from "../Gallery";
import Statements from "../Statements";
import classes from "./style.module.css";

const Page = () => {
  const [{ isThreeDimensional, angle }] = useStoreContext();

  return (
    <div className={classes.container}>
      <div
        className={cn(classes.page, {
          [classes.page_3d]: isThreeDimensional,
        })}
        style={{
          transform: isThreeDimensional
            ? `translateZ(-100px) rotateX(${angle}deg)`
            : "",
        }}
      >
        <div className={classes.content}>
          <div className={classes.wrapper}>
            <ATFBanner />
            <Statements />
            <Gallery />
            <Excerpt />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
