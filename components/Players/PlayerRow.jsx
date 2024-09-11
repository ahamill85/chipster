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
              <Avatar size={50} source={item.avatar} />
              <ThemedView>
                <ThemedText type="default">{item.name}</ThemedText>
              </ThemedView>
            </ThemedView>
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: useThemeColor({}, "tint1"),
              }}
            />
          </Pressable>
        </ShadowDecorator>
      </ScaleDecorator>
    </SwipeableItem>
  );
};

const styles = StyleSheet.create({
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "gray",
  },
  inputRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  input: {
    height: 60,
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    fontSize: 20,
    border: 0,
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 20,
  },
  modal: {
    padding: 20,
    borderRadius: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
