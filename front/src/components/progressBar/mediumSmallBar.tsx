import * as React from "react";

type ProgressBarProps = {
  width: number;
  height: number;
  value: number;
};

//
//Да поможет вам Талос понять как это работает
//
const MediumSmallBar = ({
  width,
  height = 25,
  value = 100,
}: ProgressBarProps) => {
  const getX = (tmp: number) => {
    console.log("tmp", tmp);
    console.log("width", width);
    const v = value / 100;
    const w = width;
    const result = tmp;
    console.log("result", result);
    return +result.toFixed(0);
  };
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M0 0H
        ${width}.661L
        ${width - 31}.861 25H30.8001L0 0ZM
        ${width - 18}.902 6.53846L
        ${width - 34}.901 18.2692H33.6674L17.7586 6.53846H
        ${width - 18}.902ZM9.34177 3.55769L32.3725 21.3462H
        ${width - 32}.289L
        ${width - 9}.227 3.55769H9.34177Z`}
        fill="black"
        fillOpacity="0.6"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M35.2663 17L23 8H
        ${width - 23}L
        ${width - 35}.253 17H35.2663Z`}
        fill="#2D2B44"
      />

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={`M9.01123 3.55768H
        ${width - 10}.896L
        ${width - 33}.958 21.3461H32.0419L9.01123 3.55768ZM
        ${width - 18}.572 6.53845H17.4281L33.3368 18.2692H
        ${width - 34}.571L
        ${width - 18}.572 6.53845Z`}
        fill="#BBBDBF"
        fillOpacity="0.6"
      />

      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="23"
        y="8"
        width={width - 47}
        height="9"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={`M35.2663 17L23 8H
          ${width - 23}L
          ${width - 35}.253 17H35.2663Z`}
          fill="#2D2B44"
        />
      </mask>
      <g mask="url(#mask0)">
        <rect
          x="23"
          y="8"
          width={getX(value === 100 ? 250 : value === 0 ? 10 : 130)}
          // width={125}
          height="9"
          fill="url(#pattern0)"
        />
      </g>
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0"
            transform="translate(0 -0.0917603) scale(0.00561798 0.0986267)"
          />
        </pattern>
        <image
          id="image0"
          width="178"
          height="12"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default MediumSmallBar;
