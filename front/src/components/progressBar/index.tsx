import * as React from "react";
import BigBar from "./BigBar";
import SmallBar from "./SmallBar";
import MediumSmallBar from "./mediumSmallBar";

type ProgressBarProps = {
  width: number;
  height: number;
  value: number;
  type: "big" | "small" | "medium";
};

//value = [0% ; 100%]
const ProgressBar = (props: ProgressBarProps) => {
  if (props.value > 100) {
    props.value = 100;
  }
  if (props.value < 0) {
    props.value = 0;
  }

  switch (props.type) {
    case "big":
      return <BigBar {...props} />;
    case "small":
      return <SmallBar {...props} />;
    case "medium":
      return <MediumSmallBar {...props} />;
    default:
      return <></>;
  }
};

export default ProgressBar;
