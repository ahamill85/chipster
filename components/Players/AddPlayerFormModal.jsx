import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Image } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedButton } from "../ThemedButton";
import { TextInput } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDispatch } from "react-redux";
import { addPlayer } from "@/features/slices/playersSlice";
import { nanoid } from "@reduxjs/toolkit";
import { FontAwesome6 } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

export default AddPlayerFormModal = ({ handleClose, ...rest }) => {
  const [playerName, setPlayerName] = useState("");

  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      base64: true,
    });

    if (!result.canceled) {
      setImage("data:image/jpeg;base64," + result.assets[0].base64);
    }
  };

  const inputField = useRef(null);

  const dispatch = useDispatch();

  const defaults = {
    currentBet: 0,
    balance: 100,
    isDealer: false,
    status: "ready",
    inTheGun: false,
  };

  const handleAddPlayer = () => {
    if (playerName) {
      dispatch(
        addPlayer({
          ...defaults,
          name: playerName,
          id: nanoid(),
          avatar: image,
        })
      );
      setPlayerName("");
      inputField.current.clear();
      handleClose();
    }
  };

  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonText = useThemeColor({}, "buttonText");

  return (
    <Modal {...rest} onShow={() => inputField.current.focus() }>
      <View style={styles.backdrop}>
        <ThemedView style={styles.modal}>
          <View>
            <ThemedView
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                alignSelf: "center",
                marginTop: -90,
                overflow: "hidden",
                padding: 10,
                paddingBottom: 0,
              }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 130,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: buttonBackground,
                }}
              >
                {image ? (
                  <Image
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 130,
                    }}
                    source={{ uri: image }}
                  />
                ) : (
                  <FontAwesome6
                    name="camera"
                    size="50"
                    style={{ color: buttonText }}
                  />
                )}
              </TouchableOpacity>
            </ThemedView>
            {/* <FontAwesome6 name="trash" size="20" style={{ color: "#FFFFFF" }} /> */}
            <TextInput
              style={{
                ...styles.input,
              }}
              placeholder="Player Name"
              placeholderTextColor={"#dbdbdb"}
              value={playerName}
              onChangeText={setPlayerName}
              ref={inputField}
            />
          </View>
          <View style={{ gap: 10 }}>
            <ThemedButton
              disabled={!playerName}
              style={{ opacity: !playerName ? 0.5 : 1 }}
              onPress={() => {
                setImage(null);
                handleAddPlayer();
              }}
            >
              Add Player
            </ThemedButton>
            <ThemedButton
              type="danger"
              onPress={() => {
                setImage(null);
                handleClose();
              }}
            >
              Cancel
            </ThemedButton>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
