import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Image } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedButton } from "../ThemedButton";
import { TextInput } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDispatch } from "react-redux";
import { addPlayers } from "@/features/slices/playersSlice";
import { nanoid } from "@reduxjs/toolkit";
import { FontAwesome6 } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import ThemedModal from "../ThemedModal";
import ThemedTextInput from "../ThemedTextInput";

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
      //base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const inputField = useRef(null);

  const dispatch = useDispatch();

  const handleAddPlayer = () => {
    if (playerName) {
      dispatch(
        addPlayers([{
          name: playerName,
          id: nanoid(),
          avatar: image,
        }])
      );
      setPlayerName("");
      inputField.current.clear();
      handleClose();
    }
  };

  const buttonBackground = useThemeColor({}, "buttonBackground");
  const buttonText = useThemeColor({}, "buttonText");

  return (
    <ThemedModal {...rest}>
      <View style={{gap: 20}}>
        <View style={{marginTop: 90, gap: 10}}>
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
                  size={50}
                  style={{ color: buttonText }}
                />
              )}
            </TouchableOpacity>
          </ThemedView>
          <ThemedTextInput
            placeholder="Player Name"
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
      </View>
    </ThemedModal>
  );
};

