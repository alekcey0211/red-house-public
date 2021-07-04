import * as React from "react";

type ProgressBarProps = {
  width: number;
  height: number;
  value: number;
};
//
//Да поможет вам Талос понять как это работает
//
const magicVariable = 11;
const BigBar = ({ width, height, value = 0 }: ProgressBarProps) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width + magicVariable} 32`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      d={`M
      ${magicVariable + width - 26}.92 2.69091L
      ${magicVariable + width - 22}.397 0.145454L
      ${magicVariable + width - 1}.186 15.9273L
      ${magicVariable + width - 22}.397 31.5636L
      ${magicVariable + width - 26}.698 28.9455L
      ${
        magicVariable + width - 29
      }.591 31.4909H27.5213L24.414 28.9455L20.7149 31.5636L0 15.9273L20.7149 0.145454L24.2661 2.69091L27.5213 0H
      ${magicVariable + width - 29}.665L
      ${magicVariable + width - 26}.92 2.69091ZM
      ${magicVariable + width - 26}.254 13.1636V18.5455L
      ${magicVariable + width - 26}.476 18.7636L
      ${magicVariable + width - 22}.175 15.8545L
      ${magicVariable + width - 26}.624 12.8727L
      ${magicVariable + width - 26}.254 13.1636ZM
      ${magicVariable + width - 23}.288 7.27273L
      ${magicVariable + width - 22}.323 6.54545L
      ${magicVariable + width - 10}.678 15.9273L
      ${magicVariable + width - 22}.323 25.2364L
      ${magicVariable + width - 24}.844 24.0727C
      ${magicVariable + width - 24}.055 24.8485 
      ${magicVariable + width - 25}.66 25.503 
      ${magicVariable + width - 25}.66 26.0364L
      ${magicVariable + width - 22}.397 27.9273L
      ${magicVariable + width - 6}.303 15.9273L
      ${magicVariable + width - 22}.397 3.78182L
      ${magicVariable + width - 25}.438 5.96364L
      ${magicVariable + width - 24}.696 7.05454L
      ${magicVariable + width - 23}.288 7.27273ZM
      ${magicVariable + width - 28}.405 8.50909L
      ${magicVariable + width - 28}.109 8.36364L
      ${magicVariable + width - 31}.076 10.6182V21.0909L
      ${magicVariable + width - 28}.183 23.4182L
      ${magicVariable + width - 28}.627 23.2727L
      ${magicVariable + width - 27}.81 21.8909L
      ${magicVariable + width - 29}.295 20V11.7091L
      ${magicVariable + width - 27}.662 9.96364L
      ${magicVariable + width - 28}.405 8.50909ZM
      ${
        magicVariable + width - 31
      }.741 26.4H29.3708L16.35 15.8545L26.3376 7.70909L26.5595 7.49091L29.3708 5.09091H
      ${magicVariable + width - 31}.741L
      ${magicVariable + width - 18}.836 15.8545L
      ${magicVariable + width - 31}.741 26.4ZM
      ${magicVariable + width - 14}.313 15.8545L
      ${
        magicVariable + width - 30
      }.555 2.90909H28.631L12.8728 15.8545L22.6385 23.7091V23.7818L28.631 28.5818H
      ${magicVariable + width - 30}.555L
      ${
        magicVariable + width - 14
      }.313 15.8545ZM20.7889 3.78182L4.80882 15.9273L20.7889 27.9273L23.4523 26.0364C23.4523 25.5515 23.0824 24.897 22.3425 24.0727L20.7889 25.2364L8.43393 15.9273L20.7889 6.54545L21.8247 7.27273L22.4165 7.05454L23.0824 6.4L23.6742 5.96364L20.7889 3.78182ZM24.562 12.8727L20.9369 15.8545L24.636 18.7636L24.9319 18.5455V13.1636L24.562 12.8727ZM27.8912 11.7091V20L25.3758 21.8909L26.4855 23.2727L26.9294 23.4182L30.1106 21.0909V10.6182L27.0034 8.36364L26.4855 8.72727L25.4498 9.96364L27.8912 11.7091Z
      `}
      fill="black"
      fillOpacity="0.6"
    />
    <path
      d={`M
      ${magicVariable + width - 24}.696 7.05454L
      ${magicVariable + width - 25}.438 5.96363L
      ${magicVariable + width - 22}.397 3.78181L
      ${magicVariable + width - 6}.303 15.9273L
      ${magicVariable + width - 22}.397 27.9273L
      ${magicVariable + width - 25}.66 26.0364C
      ${magicVariable + width - 25}.66 25.503 
      ${magicVariable + width - 24}.055 24.8485 
      ${magicVariable + width - 24}.844 24.0727L
      ${magicVariable + width - 22}.323 25.2364L
      ${magicVariable + width - 10}.678 15.9273L
      ${magicVariable + width - 22}.323 6.54545L
      ${magicVariable + width - 23}.288 7.27272L
      ${magicVariable + width - 24}.696 7.05454ZM
      ${magicVariable + width - 27}.662 9.96363L
      ${magicVariable + width - 29}.295 11.7091V20L
      ${magicVariable + width - 27}.81 21.8909L
      ${magicVariable + width - 28}.627 23.2727L
      ${magicVariable + width - 28}.183 23.4182L
      ${magicVariable + width - 31}.076 21.0909V10.6182L
      ${magicVariable + width - 28}.109 8.36363L
      ${magicVariable + width - 28}.405 8.50909L
      ${magicVariable + width - 27}.662 9.96363ZM
      ${magicVariable + width - 18}.836 15.8545L
      ${
        magicVariable + width - 31
      }.741 5.09091H29.3708L26.5595 7.49091L26.3376 7.70909L16.35 15.8545L29.3708 26.4H
      ${magicVariable + width - 31}.741L
      ${magicVariable + width - 18}.836 15.8545ZM
      ${
        magicVariable + width - 30
      }.555 28.5818H28.631L22.6385 23.7818V23.7091L12.8729 15.8545L28.631 2.90909H
      ${magicVariable + width - 30}.555L
      ${magicVariable + width - 14}.313 15.8545L
      ${
        magicVariable + width - 30
      }.555 28.5818ZM23.6742 5.96363L23.0824 6.4L22.4165 7.05454L21.8247 7.27272L20.7889 6.54545L8.43395 15.9273L20.7889 25.2364L22.3425 24.0727C23.0824 24.897 23.4523 25.5515 23.4523 26.0364L20.7889 27.9273L4.80884 15.9273L20.7889 3.78181L23.6742 5.96363ZM25.4498 9.96363L26.4855 8.72727L27.0034 8.36363L30.1106 10.6182V21.0909L26.9294 23.4182L26.4855 23.2727L25.3758 21.8909L27.8912 20V11.7091L25.4498 9.96363Z
     `}
      fill="#BBBDBF"
      fillOpacity="0.6"
    />

    <rect
      x="32"
      y="7"
      width={(width - 27 * 2) * (value / 100)}
      height="18"
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
          transform="translate(-0.681416) scale(0.0132743 0.0833333)"
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

export default BigBar;
