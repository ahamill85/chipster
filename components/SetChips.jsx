import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "./ThemedButton";
import { useHeaderHeight } from "@react-navigation/elements";
import { useThemeColor } from "@/hooks/useThemeColor";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import PokerChip from "@/components/PokerChip";
import { FontAwesome6 } from "@expo/vector-icons";

const extractItemKey = (item) => {
  return item.id.toString();
};

export default SetChips = () => {
  const [chips, setChips] = useState({
    white: {
      maxCount: 100,
      hex: "#c9c9c9",
      value: 1,
      defaultCount: 20,
    },
    green: {
      maxCount: 50,
      hex: "#0E854D",
      value: 5,
      defaultCount: 6,
    },
    red: {
      maxCount: 20,
      hex: "#E01E43",
      value: 10,
      defaultCount: 4,
    },
    blue: {
      maxCount: 10,
      hex: "#1E4E97",
      value: 20,
      defaultCount: 3,
    },
    black: {
      maxCount: 5,
      hex: "#36363A",
      value: 50,
      defaultCount: 1,
    },
  });

  const headerHeight = useHeaderHeight();

  const addChip = () => {
    const denomination = parseFloat(newChipDenomination);
    if (!isNaN(denomination)) {
      const newChip = { id: Date.now().toString(), denomination };
      setChips([...chips, newChip]);
      setNewChipDenomination("");
    }
  };

  const PokerChipRow = ({ chip }) => {
    const { defaultCount, hex, maxCount, value } = chip;
    const [chipCount, setChipCount] = useState(defaultCount);

    console.log(chip);

    return (
      <Pressable
      // onLongPress={drag}
      // disabled={isActive}
      >
        <ThemedView style={styles.item}>
          <View style={styles.chip}>
            <PokerChip fillColor={hex} value={value} size={80} />
          </View>
          <TouchableOpacity onPress={() => setChipCount((count) => count - 1)}>
            <FontAwesome6
              name="circle-minus"
              color={useThemeColor({}, "buttonBackground")}
              size={40}
            />
          </TouchableOpacity>
          <TextInput
            style={{
              width: 50,
              color: useThemeColor({}, "text"),
              fontSize: 30,
            }}
            keyboardType="numeric"
            value={`${chipCount}`}
            textAlign="center"
            onChangeText={(text) => console.log(text)}
            textContentType="none"
            maxLength={2}
          />
          <TouchableOpacity
            onPress={(event) =>
              setChipCount((count) => {
                //console.log(count++)
                return count + 1;
              })
            }
          >
            <FontAwesome6
              name="circle-plus"
              color={useThemeColor({}, "buttonBackground")}
              size={40}
            />
          </TouchableOpacity>
          <ThemedText type="subtitle">{chipCount * value}</ThemedText>
        </ThemedView>
      </Pressable>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }}>
        {Object.entries(chips).map(([key, value], index) => {
          console.log(key, value)
          return (
          <View key={index}>
            <PokerChipRow chip={value} />
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            />
          </View>
        )})}
        {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={headerHeight + 20}>
          <View style={{ flex: 0, rowGap: 16, paddingTop: 20, paddingHorizontal: 20 }}>
            <View style={styles.inputRow}>
              <TextInput
                style={{...styles.input, backgroundColor: useThemeColor({}, 'buttonBackground'), color: useThemeColor({}, 'buttonText')}}
                placeholder="Chip Denomination"
                placeholderTextColor={useThemeColor({}, "buttonText")}
                value={newChipDenomination}
                onChangeText={setNewChipDenomination}
                keyboardType="numeric"
              />
            </View>
            <ThemedButton onPress={addChip}>
              Add Chip
            </ThemedButton>
          </View>
        </KeyboardAvoidingView> */}
      </SafeAreaView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  item: {
    height: 120,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    columnGap: 20,
  },
  section: {
    flex: 1,
  },

  chipItem: {
    flex: 0,
    width: 80,
    aspectRatio: 1,
    backgroundColor: "black",
  },
  chipText: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
  },
  playerName: {
    fontSize: 16,
    textAlign: "center",
  },
  playerBalance: {
    marginTop: "auto",
    backgroundColor: "white",
    width: "100%",
    textAlign: "center",
    padding: 4,
    borderRadius: 10,
  },
  inputRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 16,
    height: 60,
  },
  input: {
    height: "100%",
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    flex: 1,
    width: "100%",
    fontSize: 20,
  },
});
