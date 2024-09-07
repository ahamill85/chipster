import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemedButton({
  children,
  style,
  lightColor,
  darkColor,
  theme = "primary",
  type = "default",
  icon,
  ...rest
}) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBackground"
  );
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonText"
  );

  const buttonStyle = button[type];
  const textStyle = text[type];

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[{ backgroundColor, ...buttonStyle }, style]}
      {...rest}
    >
      {icon}
      <Text style={[{ color, ...textStyle }, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

const buttonBase = {
  borderRadius: 10,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: 60,
  gap: 10,
  paddingHorizontal: 20,
};

const textBase = {
  fontSize: 24,
  textAlign: "center",
};

const button = StyleSheet.create({
  default: {
    ...buttonBase,
  },
  large: {
    ...buttonBase,
  },
  small: {
    ...buttonBase,
    height: 30,
  },
  headerNav: {
    ...buttonBase,
    backgroundColor: "transparent",
  },
  outline: {
    ...buttonBase,
  },
  circle: {
    ...buttonBase,
    borderRadius: 60,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  link: {
    ...buttonBase,
  },
  danger: {
    ...buttonBase,
    backgroundColor: "#ff1e1e",
  },
});

const text = StyleSheet.create({
  default: {
    ...textBase,
  },
  large: {
    ...textBase,
    fontSize: 32,
    lineHeight: 32,
  },
  small: {
    ...textBase,
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 18,
  },
  headerNav: {
    ...textBase,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
  },
  outline: {
    ...textBase,
    fontSize: 20,
  },
  circle: {
    ...textBase,
    fontSize: 14,
    paddingHorizontal: 0,
    fontWeight: "bold",
  },
  link: {
    ...textBase,
    lineHeight: 30,
    fontSize: 16,
  },
  danger: {
    ...textBase,
    color: "white",
  },
});
