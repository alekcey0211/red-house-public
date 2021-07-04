import * as React from "react";

type ProgressBarProps = {
  width: number;
  height: number;
  value: number;
};

//
//Да поможет вам Талос понять как это работает
//
const SmallBar = ({ width, height = 15, value = 100 }: ProgressBarProps) => {
  const getX = (tmp: number) => {
    const v = value / 100;
    const w = width - tmp * 2;
    const result = v * w + tmp;
    return +result.toFixed(0);
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} 15`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M0 0H
      ${width}.081L
      ${width - 20}.402 15H19.6795L0 0ZM
      ${width - 12}.735 3.92308L
      ${width - 22}.511 10.9615H21.5115L11.3467 3.92308H
      ${width - 12}.735 ZM5.96884 2.13462L20.6841 12.8077H
      ${width - 21}.397L
      ${width - 6}.054 2.13462H5.96884Z`}
        fill="black"
        fillOpacity="0.6"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M5.96884 2.13458H
      ${width - 6}.053L
      ${width - 21}.397 12.8077H20.6841L5.96884 2.13458ZM
      ${width - 12}.735 3.92304H11.3467L21.5115 10.9615H
      ${width - 22}.511L
      ${width - 12}.735 3.92304Z`}
        fill="#BBBDBF"
        fillOpacity="0.6"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M22.3781 10.2631L14.3407 4.73682H
      ${width - 14}.041L
      ${width - 22}.078 10.2631H22.3781Z`}
        fill="#2D2B44"
      />
      {/* Tyt */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M22.3781 10.2631L14.3407 4.73682H
      ${getX(value === 100 || value === 0 ? 14 : 22)}.041L
      ${getX(22)}.078 10.2631H22.3781Z`}
        fill="url(#pattern0)"
      />

      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0"
            transform="translate(-0.0630706) scale(0.00632664 0.2)"
          />
        </pattern>
        <image
          id="image0"
          width="178"
          height="5"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAAAFCAYAAADhRbalAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI4SURBVHgBpZZLUsMwEERHVWHDiqNxFxacjWNwBS7AhqKgwG4SW6Pp+QhcwVTISOrp0efZcXt6foFMrrV/cP7bvnFpX1qyffZ4H1uhOnSd9NFdN5LCpxVjTWPpRTkmfdOBoYla9Yrj9N3jxv09bhTzNMh+jNk0tNGtTJimaOV43jxuDQQDa8f1+DlL4eU8vDmtP3gg13H/XTHaB63NNuVihciSODnvH/weH+7b6e72RmaXMbDDqsUYZNWtsH7NGe1wUGZOi6H+5nSYEdThI48ZyJmGdKi/6xD3XKp9dYcU9MEqaCqwXFBDmI0kTEHyemf1Ch2Q1hAKk7Rc7fDxvSj9MMtP/kjR6e3zW2bXDqiBrFD6dn9yg/oJZH0yO8rFkhvIiPojyK2AtfHjIuaMvrBp53YTzEEONRLIfLh+KV3jQUZxZlEjASz/FAzzUS355vnuAeAnidKPJuby+1pDHedJCUibkmGzlRebEmIcBbmHp5fXD5ldlyfuAn3FwAb1QiAvsr9KbDE03nVjHP3J3clvgLsDmr2HeNhXikcekwMDWccAe5WQkIeQNzat0rFX39YAsk2Hx/oBOCs7OsvzIAPhRklnhrEkAxnC5IPGNBFjL0jDOvgaIn/5epBhhglk0N0IKuRvBITadX7yQ/Q7g/z+pS8N+TKQMaCs4F1cbPByjgNZIa1ATn0RNBwDOeUJaagtx3RHQNZfohJkZJCdhv0JpKtAdjnwmughtM/yH5BHUmpn8Or29X4iPxMtlOv6qc10AAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
};

export default SmallBar;
