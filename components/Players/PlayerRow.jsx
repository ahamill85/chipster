import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, StyleSheet, View, Image } from "react-native";
import {
  ScaleDecorator,
  ShadowDecorator,
} from "react-native-draggable-flatlist";
import { TouchableOpacity } from "react-native-gesture-handler";
import SwipeableItem, {
  useSwipeableItemParams,
} from "react-native-swipeable-item";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import Avatar from "../Avatar";

const QuickActions = ({ player, editItem, deleteItem }) => {
  const { close } = useSwipeableItemParams();

  const warningBackground = useThemeColor({}, "warningBackground");
  const warningText = useThemeColor({}, "warningText");
  const errorBackground = useThemeColor({}, "errorBackground");
  const errorText = useThemeColor({}, "errorText");

  return (
    <View
      style={{
        flexDirection: "row",
        width: 200,
        height: "100%",
        alignSelf: "flex-end",
        alignItems: "stretch",
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <TouchableOpacity
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: warningBackground,
          }}
          onPress={() => {
            editItem(player);
            close();
          }}
        >
          <ThemedText type="defaultSemiBold" style={{ color: warningText }}>
            EDIT
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: errorBackground,
          }}
          onPress={() => {
            deleteItem(player);
            close();
          }}
        >
          <ThemedText type="defaultSemiBold" style={{ color: errorText }}>
            DELETE
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayerRow = ({
  item,
  drag,
  isActive,
  editCallback,
  deleteCallback,
}) => {
  const buttonText = useThemeColor({}, "buttonText");

  return (
    <SwipeableItem
      //style={{ flex: 1 }}
      renderUnderlayLeft={() => (
        <QuickActions
          player={item}
          editItem={editCallback}
          deleteItem={deleteCallback}
        />
      )}
      snapPointsLeft={[200]}
    >
      <ScaleDecorator>
        <ShadowDecorator>
          <Pressable onLongPress={drag} disabled={isActive}>
            <ThemedView
              style={{
                height: 80,
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                columnGap: 20,
              }}
            >
              <Avatar
                name={item.name}
                size={50}
                source={item.avatar}
                color={useThemeColor({}, "text")}
              />
              <ThemedView>
                <ThemedText type="default">{item.name}</ThemedText>
              </ThemedView>
            </ThemedView>
            
          </Pressable>
        </ShadowDecorator>
      </ScaleDecorator>
    </SwipeableItem>
  );
};
