import React, { memo, useRef, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";

import { ThemedView } from "../ThemedView";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { removePlayer, reorderPlayers } from "@/features/slices/playersSlice";
import AddPlayerFormModal from "./AddPlayerFormModal";
import EditPlayerFormModal from "./EditPlayerFormModal";
import PlayerRow from "./PlayerRow";
import DraggableFlatList from "react-native-draggable-flatlist";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedButton } from "@/components/ThemedButton";

import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import AddContactFormModal from "./AddContactFormModal";
import { LinearTransition } from "react-native-reanimated";
import ReorderableList, { reorderItems } from "react-native-reorderable-list";

export default Players = () => {
  const players = useSelector((state) => state.players, shallowEqual);

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

  const [testState, setTestState] = useState(players);  

  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ReorderableList
              data={players}
              ItemSeparatorComponent={({ highlighted }) => (
                <View
                  style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: useThemeColor({}, "rules"),
                  }}
                />
              )}
              itemLayoutAnimation={LinearTransition}
              renderItem={(params) => (
                <PlayerRow
                  {...params}
                  deleteCallback={deletePlayer}
                  editCallback={editPlayer}
                />
              )}
              keyExtractor={(item) => item.id}
              onReorder={({from, to}) => {
                dispatch(reorderPlayers(reorderItems(players, from, to)))
              }}
              ref={listElement}
              onContentSizeChange={() => {
                listElement.current.scrollToEnd({ animated: true });
              }}
              style={{ flex: 1 }}
              containerStyle={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
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
              //shouldUpdateActiveItem={true}
            />
            <View style={{ padding: 20, gap: 10 }}>
              <ThemedButton
                onPress={() => setFormState("add")}
                icon={
                  <MaterialCommunityIcons
                    name="account-plus"
                    size="30"
                    color={useThemeColor({}, "buttonText")}
                  />
                }
              >
                Create Player
              </ThemedButton>
              <ThemedButton
                onPress={() => setFormState("add-contacts")}
                icon={
                  <FontAwesome6
                    name="contact-book"
                    size="30"
                    color={useThemeColor({}, "buttonText")}
                  />
                }
              >
                Add Players from Contacts
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
      {activeEditPlayer && (
        <EditPlayerFormModal
          player={activeEditPlayer}
          visible={formState === "edit"}
          handleClose={() => setFormState("")}
          onRequestClose={() => {
            setFormState("");
          }}
        />
      )}
    </>
  );
};
