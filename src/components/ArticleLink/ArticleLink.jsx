import cn from "classnames";

import Heading from "../Heading";
import classes from "./style.module.css";

const ArticleLink = ({ color = "light" }) => {
  let headingColor;
  switch (color) {
    case "dark":
      headingColor = "light";
      break;
    case "light":
      headingColor = "dark";
      break;
    default:
      break;
  }
  return (
    <a
      href="/#"
      className={cn(classes.articleLink, {
        [classes.articleLink_dark]: color === "dark",
      })}
    >
      <Heading color={headingColor} />
    </a>
  );
};

export default ArticleLink;
