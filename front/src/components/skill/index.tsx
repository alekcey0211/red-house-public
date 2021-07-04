import * as React from "react";
import { ProgressBar } from "../";
import "./styles.sass";
type SkillProps = {
  level: number;
  name: string;
  barSetting?: {
    type: "big" | "small";
    width: number;
    height: number;
    value: number;
  };
};

const Skill = ({ level, name, barSetting }: SkillProps) => (
  <div className={`skill ${barSetting?.type ?? "small"}`}>
    <div className={"text"}>
      {name} <mark>{level}</mark>
    </div>
    <ProgressBar
      width={barSetting?.width ?? 117}
      value={barSetting?.value ?? 20}
      type={barSetting?.type ?? "small"}
    />
  </div>
);

export default Skill;
