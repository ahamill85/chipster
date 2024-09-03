import chroma from "chroma-js";


const themeColors = {
  darkBlue: "#001B32",
  lightBlue: "#092B50",
  darkGreen: "#1B4742",
  mediumGreen: "#DBFCD1",
  lightGreen: "#FBFBEF",
};

export const Colors = {
  light: {
    text: themeColors.darkBlue,
    background: themeColors.lightGreen,
    buttonBackground: themeColors.darkGreen,
    buttonText: themeColors.lightGreen,
    tint: chroma(themeColors.darkGreen).darken().hex(),
    icon: themeColors.darkBlue,
    tabIconDefault: "#687076",
    tabIconSelected: themeColors.mediumGreen,
    errorBackground: "#ff1e1e",
    successBackground: "green",
    warningBackground: "#ffe868",
    errorText: "#FFFFFF",
    successText: "green",
    warningText: "yellow",
    inputBackground: chroma(themeColors.lightGreen).darken().hex(),
  },
  dark: {
    text: "#FFF",
    background: themeColors.darkGreen,
    buttonBackground: themeColors.lightGreen,
    buttonText: themeColors.darkGreen,
    tint: chroma(themeColors.lightGreen).darken().hex(),
    icon: themeColors.lightGreen,
    tabIconDefault: "#9BA1A6",
    tabIconSelected: themeColors.mediumGreen,
    errorBackground: "#ff1e1e",
    successBackground: "green",
    warningBackground: "#ffe868",
    errorText: "#FFFFFF",
    successText: "green",
    warningText: "#534910",
    inputBackground: themeColors.lightGreen,
  },
  themeColors,
};
