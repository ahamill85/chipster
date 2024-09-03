import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

import DraggableFlatList from "react-native-draggable-flatlist";
import { ThemedButton } from "../ThemedButton";
import { useHeaderHeight } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSelector, useDispatch } from "react-redux";
import { removePlayer, reorderPlayers } from "@/features/slices/playersSlice";
import { FontAwesome6 } from "@expo/vector-icons";
import AddPlayerFormModal from "./AddPlayerFormModal";
import EditPlayerFormModal from "./EditPlayerFormModal";
import PlayerRow from "./PlayerRow";

export default Players = () => {
  const players = useSelector((state) => state.players);

  const dispatch = useDispatch();

  const listElement = useRef(null);

  const [formState, setFormState] = useState("");
  const [activeEditPlayer, setActiveEditPlayer] = useState(null);

  const headerHeight = useHeaderHeight();

  const deletePlayer = (player) => {
    dispatch(removePlayer(player.id));
  };

  const editPlayer = (player) => {
    setActiveEditPlayer(player);
    setFormState("edit");
  };

  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <PlayerRow
              item={players[0]}
              deleteCallback={deletePlayer}
              editCallback={editPlayer}
            />
            {/* <DraggableFlatList
              data={players}
              extraData={players}
              renderItem={(params) => (
                <PlayerRow
                  {...params}
                  deleteCallback={deletePlayer}
                  editCallback={editPlayer}
                />
              )}
              keyExtractor={(item) => {
                return item.id.toString();
              }}
              onDragEnd={({ data }) => dispatch(reorderPlayers(data))}
              ItemSeparatorComponent={
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: useThemeColor({}, "tint"),
                  }}
                />
              }
              ref={listElement}
              onContentSizeChange={() =>
                listElement.current.scrollToEnd({ animated: true })
              }
              containerStyle={{ flex: 1 }}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              activationDistance={20}
              ListEmptyComponent={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ThemedText type="title" style={{ opacity: 0.2 }}>
                    Please Add Players
                  </ThemedText>
                </View>
              )}
              ListFooterComponent={() => (
                <View style={{ padding: 20 }}>
                  <ThemedButton
                    onPress={() => setFormState("add")}
                    icon={
                      <FontAwesome6
                        name="plus"
                        size="24"
                        color={useThemeColor({}, "buttonText")}
                      />
                    }
                  >
                    Add Player
                  </ThemedButton>
                </View>
              )}
            /> */}
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={headerHeight + 20}
          >
            <View
              style={{
                flex: 0,
                rowGap: 16,
                paddingTop: 20,
                paddingHorizontal: 20,
              }}
            ></View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ThemedView>
      <AddPlayerFormModal
        animationType="fade"
        transparent={true}
        visible={formState === "add"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
      <EditPlayerFormModal
        player={activeEditPlayer}
        animationType="fade"
        transparent={true}
        visible={formState === "edit"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    columnGap: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  itemLabel: {
    opacity: 0.5,
  },
  position: {},
  name: {
    flex: 1,
  },
  balance: {
    width: 100,
    flex: 0,
  },
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
