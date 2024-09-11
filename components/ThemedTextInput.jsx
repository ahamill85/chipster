import { TextInput } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { forwardRef } from "react";

export default ThemedTextInput = forwardRef((props, ref) => {
  return (
    <TextInput
      style={{
        height: 60,
        backgroundColor: "#fff",
        color: "#000",
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 20,
        fontSize: 20,
        border: 0,
        backgroundColor: useThemeColor({}, "buttonBackground"),
        color: useThemeColor({}, "buttonText"),
      }}
      placeholderTextColor={"#dbdbdb"}
      {...props}
      ref={ref}
    />
  );
});
