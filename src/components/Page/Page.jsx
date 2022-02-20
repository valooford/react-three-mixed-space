import cn from "classnames";

import { useStoreContext } from "../../App";
import Slider from "../Slider";
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
          <Slider />
          <div className={classes.wrapper}></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
