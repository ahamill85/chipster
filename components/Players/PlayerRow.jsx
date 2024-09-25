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

  return (
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
      <View style={{ flexGrow: 0, width: 100, height: "100%" }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: useThemeColor({}, "warningBackground"),
          }}
          onPress={() => {
            editItem(player);
            close();
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ color: useThemeColor({}, "warningText") }}
          >
            EDIT
          </ThemedText>
        </TouchableOpacity>
      </View>
      <View style={{ flexGrow: 0, width: 100, height: "100%" }}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: useThemeColor({}, "errorBackground"),
          }}
          onPress={() => {
            deleteItem(player);
            close();
          }}
        >
          <ThemedText
            type="defaultSemiBold"
            style={{ color: useThemeColor({}, "errorText") }}
          >
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
      style={{ flex: 1 }}
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
              <Avatar size={50} source={item.avatar} color={useThemeColor({}, "text")} />
              <ThemedView>
                <ThemedText type="default">{item.name}</ThemedText>
              </ThemedView>
            </ThemedView>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: useThemeColor({}, "rules"),
              }}
            />
          </Pressable>
        </ShadowDecorator>
      </ScaleDecorator>
    </SwipeableItem>
  );
};
