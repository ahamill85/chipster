import { FontAwesome } from "@expo/vector-icons";
import { Image } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export default Avatar = ({
  image,
  size,
  style,
  color = useThemeColor({}, "buttonBackground"),
}) => {
  return (
    <>
      {image ? (
        <Image
          style={{ width: size, height: size, borderRadius: size, ...style }}
          source={{ uri: winningPlayer.avatar }}
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
