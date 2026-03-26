import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Image } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedButton } from "../ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDispatch } from "react-redux";
import { FontAwesome6 } from "@expo/vector-icons";

import { updatePlayer } from "@/features/slices/playersSlice";

import * as ImagePicker from "expo-image-picker";
import ThemedTextInput from "../ThemedTextInput";
import ThemedModal from "../ThemedModal";

export default EditPlayerFormModal = ({ handleClose, player, ...rest }) => {

  const {name = "", avatar = null} = player;

  const [playerName, setPlayerName] = useState(name);
  const [playerImage, setPlayerImage] = useState(avatar);

  const dispatch = useDispatch();

  const inputField = useRef(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0,
    });

    if (!result.canceled) {
      setPlayerImage(result.assets[0].uri);
    }
  };

  const handleEditPlayer = () => {
    if (playerName) {
      dispatch(
        updatePlayer({
          ...player,
          avatar: playerImage,
          name: playerName,
        })
      );
    }

    resetForm();
  };

  const resetForm = () => {
    setPlayerName("");
    setPlayerImage(null);
    handleClose();
  };

  useEffect(() => {
    inputField.current?.focus();
    setPlayerName(name);
    setPlayerImage(avatar);
  }, [inputField.current, name, avatar]);

  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonText = useThemeColor({}, "buttonText");

  return (
    <ThemedModal {...rest}>
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
            {playerImage ? (
              <Image
                style={{
                  width: 130,
                  height: 130,
                  borderRadius: 130,
                }}
                source={{ uri: playerImage }}
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
      </View>
      <ThemedView style={{ gap: 10 }}>
        <ThemedTextInput
          style={{
            ...styles.input,
            backgroundColor: useThemeColor({}, "buttonBackground"),
            color: useThemeColor({}, "buttonText"),
          }}
          placeholder="Player Name"
          placeholderTextColor={"#dbdbdb"}
          value={playerName}
          onChangeText={setPlayerName}
          ref={inputField}
        />
        <ThemedButton
          disabled={!playerName}
          style={{ opacity: !playerName ? 0.5 : 1 }}
          onPress={handleEditPlayer}
        >
          Save
        </ThemedButton>
        <ThemedButton type="danger" onPress={resetForm}>
          Cancel
        </ThemedButton>
      </ThemedView>
    </ThemedModal>
  );
};

const styles = StyleSheet.create({
  inputRow: {},
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
