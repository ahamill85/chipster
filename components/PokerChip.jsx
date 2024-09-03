import * as React from "react";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  G,
  Circle,
  Path,
  Text,
} from "react-native-svg";

const SvgComponent = ({ fillColor = "#000", size = "100", value }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    data-name="Layer_2"
    viewBox="0 0 100 100"
    width={size}
    height={size}
  >
    <Defs>
      <LinearGradient
        id="a"
        x1={14.64}
        x2={85.36}
        y1={14.64}
        y2={85.36}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#7d7d7d" />
        <Stop offset={1} stopColor="#231f20" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={23.13}
        x2={76.87}
        y1={23.13}
        y2={76.87}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#231f20" />
        <Stop offset={1} stopColor="#7d7d7d" />
      </LinearGradient>
      <LinearGradient
        xlinkHref="#a"
        id="c"
        x1={25.96}
        x2={74.04}
        y1={25.96}
        y2={74.04}
      />
    </Defs>
    <G data-name="b">
      <Circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: fillColor,
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: "url(#a)",
          opacity: 0.5,
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={49}
        style={{
          fill: fillColor,
        }}
      />
      <Path
        d="M50 50 3.4 34.86c1.67-5.15 3.78-9.28 6.96-13.66L50 50ZM50 50 21.2 89.64c-4.38-3.18-7.66-6.46-10.84-10.84L50 50ZM50 50l28.8 39.64c-4.38 3.18-8.51 5.29-13.66 6.96L50 50ZM50 50l46.6-15.14C98.27 40.01 99 44.59 99 50H50ZM50 50V1c5.41 0 9.99.73 15.14 2.4L50 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={41.5}
        style={{
          fill: fillColor,
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={38}
        style={{
          fill: "url(#b)",
          opacity: 0.5,
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={37}
        style={{
          fill: fillColor,
        }}
      />
      <Path
        d="M50 50 38.57 14.81c1.94-.63 3.63-1.04 5.65-1.36l5.79 36.54ZM50 50 28.25 20.07c1.65-1.2 3.13-2.11 4.95-3.03L50 50.01Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50 20.07 28.25c1.2-1.65 2.33-2.97 3.77-4.41L50 50ZM50 50 14.81 38.57c.63-1.94 1.29-3.54 2.22-5.36L50 50.01Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50H13c0-2.04.14-3.77.46-5.79L50 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50 14.81 61.43c-.63-1.94-1.04-3.63-1.36-5.65l36.54-5.79ZM50 50 20.07 71.75c-1.2-1.65-2.11-3.13-3.03-4.95L50.01 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50 28.25 79.93c-1.65-1.2-2.97-2.33-4.41-3.77L50 50ZM50 50 38.57 85.19c-1.94-.63-3.54-1.29-5.36-2.22L50.01 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50v37c-2.04 0-3.77-.14-5.79-.46L50 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="m50 50 11.43 35.19c-1.94.63-3.63 1.04-5.65 1.36l-5.79-36.54ZM50 50l21.75 29.93c-1.65 1.2-3.13 2.11-4.95 3.03L50 49.99Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="m50 50 29.93 21.75c-1.2 1.65-2.33 2.97-3.77 4.41L50 50ZM50 50l35.19 11.43c-.63 1.94-1.29 3.54-2.22 5.36L50 49.99Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50h37c0 2.04-.14 3.77-.46 5.79L50 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="m50 50 35.19-11.43c.63 1.94 1.04 3.63 1.36 5.65l-36.54 5.79ZM50 50l29.93-21.75c1.2 1.65 2.11 3.13 3.03 4.95L49.99 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="m50 50 21.75-29.93c1.65 1.2 2.97 2.33 4.41 3.77L50 50ZM50 50l11.43-35.19c1.94.63 3.54 1.29 5.36 2.22L49.99 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Path
        d="M50 50V13c2.04 0 3.77.14 5.79.46L50 50Z"
        style={{
          fill: "#fff",
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={34}
        style={{
          fill: "url(#c)",
          opacity: 0.5,
        }}
      />
      <Circle
        cx={50}
        cy={50}
        r={33}
        style={{
          fill: fillColor,
        }}
      />
      <Circle
        cx={80.8}
        cy={19.2}
        r={2}
        style={{
          fill: "#fff",
        }}
      />
      <Circle
        cx={88.8}
        cy={70.2}
        r={2}
        style={{
          fill: "#fff",
        }}
      />
      <Circle
        cx={30.76}
        cy={10.5}
        r={2}
        style={{
          fill: "#fff",
        }}
      />
      <Circle
        cx={6.88}
        cy={57.04}
        r={2}
        style={{
          fill: "#fff",
        }}
      />
      <Circle
        cx={42.75}
        cy={93.5}
        r={2}
        style={{
          fill: "#fff",
        }}
      />
      <Text
        fill="white"
        fontSize="36"
        fontWeight="bold"
        x="50"
        y="62"
        textAnchor="middle"
      >
        {value}
      </Text>
    </G>
  </Svg>
);
export default SvgComponent;
