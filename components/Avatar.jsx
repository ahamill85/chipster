import { FontAwesome } from "@expo/vector-icons";
import { Image } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default Avatar = ({
  source,
  size,
  style,
  color = useThemeColor({}, "buttonBackground"),
}) => {
  return (
    <>
      {source ? (
        <Image
          style={{ width: size, height: size, borderRadius: size, ...style }}
          source={{ uri: source }}
        />
      ) : (
        <FontAwesome
          name="user-circle"
          size={size}
          color={color}
          style={{ width: size, height: size, borderRadius: size, ...style }}
        />
      )}
    </>
  );
};
