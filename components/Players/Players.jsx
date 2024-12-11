import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import { ThemedView } from "../ThemedView";

import { useSelector, useDispatch } from "react-redux";
import { removePlayer, reorderPlayers } from "@/features/slices/playersSlice";
import AddPlayerFormModal from "./AddPlayerFormModal";
import EditPlayerFormModal from "./EditPlayerFormModal";
import PlayerRow from "./PlayerRow";
import DraggableFlatList from "react-native-draggable-flatlist";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedButton } from "@/components/ThemedButton";

import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import AddContactFormModal from "./AddContactFormModal";
import { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";

export default Players = () => {
  const players = useSelector((state) => state.players);

  const dispatch = useDispatch();

  const listElement = useRef(null);

  const [formState, setFormState] = useState("");
  const [activeEditPlayer, setActiveEditPlayer] = useState(null);

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
            <DraggableFlatList
              data={players}
              extraData={players}
              ItemSeparatorComponent={({ highlighted }) => (
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: useThemeColor({}, "rules"),
                  }}
                />
              )}
              itemLayoutAnimation={LinearTransition}
              //itemEnteringAnimation={FadeInUp}
              //itemExitingAnimation={FadeOutUp}
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
              ref={listElement}
              onContentSizeChange={() =>
                listElement.current.scrollToEnd({ animated: true })
              }
              style={{ flex: 1 }}
              containerStyle={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
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
              ListEmptyComponentStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: 500,
              }}
            />
            <View style={{ padding: 20, gap: 10 }}>
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
                Add New Player
              </ThemedButton>
              <ThemedButton
                onPress={() => setFormState("add-contacts")}
                icon={
                  <FontAwesome6
                    name="plus"
                    size="24"
                    color={useThemeColor({}, "buttonText")}
                  />
                }
              >
                Add Player from Contacts
              </ThemedButton>
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
      <AddContactFormModal
        visible={formState === "add-contacts"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
      <AddPlayerFormModal
        visible={formState === "add"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
      <EditPlayerFormModal
        player={activeEditPlayer}
        visible={formState === "edit"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
    </>
  );
};
