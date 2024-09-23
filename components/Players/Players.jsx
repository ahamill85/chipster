import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";

import { ThemedView } from "../ThemedView";

import { useHeaderHeight } from "@react-navigation/elements";
import { useSelector, useDispatch } from "react-redux";
import {
  removePlayer,
  reorderPlayers,
  addPlayers,
} from "@/features/slices/playersSlice";
import AddPlayerFormModal from "./AddPlayerFormModal";
import EditPlayerFormModal from "./EditPlayerFormModal";
import PlayerRow from "./PlayerRow";
import DraggableFlatList from "react-native-draggable-flatlist";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedModal from "@/components/ThemedModal";

import { FontAwesome6 } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

import { updatePlayer } from "@/features/slices/playersSlice";
import * as Contacts from "expo-contacts";
import Avatar from "../Avatar";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import ThemedTextInput from "../ThemedTextInput";
import AddContactFormModal from "./AddContactFormModal";


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
        animationType="slide"
        transparent={true}
        visible={formState === "add-contacts"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
      <AddPlayerFormModal
        animationType="slide"
        transparent={true}
        visible={formState === "add"}
        handleClose={() => setFormState("")}
        onRequestClose={() => {
          setFormState("");
        }}
      />
      <EditPlayerFormModal
        player={activeEditPlayer}
        animationType="slide"
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
