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
        paddingHorizontal: 20,
        fontSize: 20,
        border: 0,
        borderColor: useThemeColor({}, "tint2"),
        backgroundColor: useThemeColor({}, "highlight"),
        color: useThemeColor({}, "text"),
      }}
      placeholderTextColor={"#dbdbdb"}
      {...props}
      ref={ref}
    />
  );
});
