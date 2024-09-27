import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default Avatar = ({
  source,
  name = "",
  size,
  style,
  backgroundColor = useThemeColor({}, "buttonBackground"),
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const color = useThemeColor({}, "buttonText");

  return (
    <>
      {source ? (
        <Image
          style={{ width: size, height: size, borderRadius: size, ...style }}
          source={{ uri: source }}
        />
      ) : (
        // <FontAwesome
        //   name="user-circle"
        //   size={size}
        //   color={color}
        //   style={{ width: size, height: size, borderRadius: size, ...style }}
        // />
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor,
            ...style,
          }}
        >
          <Text style={{ color, fontSize: 24, fontWeight: "600" }}>
            {initials}
          </Text>
        </View>
      )}
    </>
  );
};
