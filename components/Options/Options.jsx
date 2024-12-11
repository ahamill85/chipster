import { ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";

import { useDispatch, useSelector } from "react-redux";
import {
  updateOptions,
  incrementOption,
} from "../../features/slices/optionsSlice";
import { FontAwesome6 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import ThemedModal from "../ThemedModal";
import { TouchableOpacity } from "react-native";

const presets = [
  { label: "Custom", id: 0, value: {} },
  { label: "No Limit Texas Hold'em", id: 1, value: {} },
  { label: "Texas Hold'em", id: 1, value: {} },
  { label: "Pot Limit Omaha", id: 2, value: {} },
  { label: "5 Card Draw", id: 3, value: {} },
];

const limits = [
  { label: "No Limit", id: 0, value: "none" },
  { label: "Fixed", id: 1, value: "fixed" },
  { label: "Pot", id: 2, value: "pot" },
];

const IncrementControls = ({
  onIncrement,
  onDecrement,
  onChange,
  value,
  minValue,
  maxValue,
  style,
  placeholder = "none",
  ...rest
}) => {
  const dispatch = useDispatch();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          width: 200,
        },
        style,
      ]}
      {...rest}
    >
      <ThemedButton
        type="circle"
        onPress={onDecrement}
        style={{ opacity: value === minValue ? 0.5 : 1 }}
        disabled={value === minValue}
      >
        <FontAwesome6
          name="minus"
          color={useThemeColor({}, "buttonText")}
          size={20}
        />
      </ThemedButton>

      <TextInput
        style={{
          flexGrow: 1,
          color: useThemeColor({}, "text"),
          fontSize: 30,
          textAlign: "center",
          minWidth: 0,
        }}
        keyboardType="numeric"
        value={`${value}`}
        textAlign="center"
        onChangeText={(text) => {
          let newText = parseInt(text.replace(/[^0-9]/, ""));

          if (!text) newText = minValue;
          if (newText > maxValue) newText = maxValue;

          onChange(parseInt(newText));
        }}
        textContentType="none"
        maxLength={3}
        inputMode="numeric"
      />
      <ThemedButton
        type="circle"
        onPress={onIncrement}
        style={{ opacity: value >= maxValue ? 0.5 : 1 }}
        disabled={value >= maxValue}
      >
        <FontAwesome6
          name="plus"
          color={useThemeColor({}, "buttonText")}
          size={20}
        />
      </ThemedButton>
    </View>
  );
};

export default ({ style, ...rest }) => {
  const options = useSelector((state) => state.options);

  const dispatch = useDispatch();

  const [selectedPresetId, setSelectedPresetId] = useState(`${presets[0].id}`);
  const [presetModalVisibility, setPresetModalVisibility] = useState(false);

  const [limitModalVisibility, setLimitModalVisibility] = useState(false);

  const text = useThemeColor({}, "text");
  const switchActiveTrackColor = useThemeColor({}, "buttonBackground");
  const switchActiveThumbColor = useThemeColor({}, "buttonText");
  const switchInactiveThumbColor = useThemeColor({}, "tint2");
  const switchInactiveTrackColor = useThemeColor({}, "tint1");

  const selectedPreset = presets.find(({ id }) => `${id}` === selectedPresetId);
  const selectedLimit = limits.find(({ value }) => value === options.limitType);

  const rules = useThemeColor({}, "rules");
  const tint1 = useThemeColor({}, "tint1");

  return (
    <ThemedView style={[{ flex: 1 }, style]}>
      <ScrollView stickyHeaderIndices={[0, 2]} style={{ flex: 1 }}>
        <ThemedView>
          <ThemedText style={styles.sectionTitle} type="subtitle">
            Betting
          </ThemedText>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
        </ThemedView>
        <View>
          {/* Presets */}
          {/* <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Game Presets</ThemedText>
            <ThemedButton
              icon={
                <FontAwesome6
                  size={18}
                  name="bars"
                  style={{ color: switchActiveThumbColor }}
                />
              }
              style={{ flex: 1, fontSize: 18, textAlign: "left" }}
              onPress={() => setPresetModalVisibility(true)}
            >
              {selectedPreset.label}
            </ThemedButton>
            <ThemedModal
              visible={presetModalVisibility}
              backdropDismiss={() => setPresetModalVisibility(false)}
            >
              <Picker
                itemStyle={{ color: text }}
                selectedValue={selectedPresetId}
                onValueChange={(id) => {
                  setSelectedPresetId(id);
                }}
              >
                {presets.map((preset, index) => {
                  return (
                    <Picker.Item
                      key={preset.id}
                      label={preset.label}
                      value={preset.id}
                    />
                  );
                })}
              </Picker>
            </ThemedModal>
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} /> */}
          {/* Limit */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Limit</ThemedText>
            <ThemedButton
              icon={
                <FontAwesome6
                  size={18}
                  name="bars"
                  style={{ color: switchActiveThumbColor }}
                />
              }
              style={{ flex: 1, fontSize: 18, textAlign: "left" }}
              onPress={() => setLimitModalVisibility(true)}
            >
              {selectedLimit.label}
            </ThemedButton>
            <ThemedModal
              visible={limitModalVisibility}
              backdropDismiss={() => setLimitModalVisibility(false)}
            >
              <Picker
                itemStyle={{ color: text }}
                selectedValue={options.limitType}
                onValueChange={(value) => {
                  dispatch(updateOptions({ limitType: value }));
                }}
              >
                {limits.map((limit) => {
                  return (
                    <Picker.Item
                      key={limit.id}
                      label={limit.label}
                      value={limit.value}
                    />
                  );
                })}
              </Picker>
            </ThemedModal>
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Betting Increments*/}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>
              Betting Increments
            </ThemedText>
            <IncrementControls
              onIncrement={() => {
                dispatch(incrementOption({ key: "increment", value: 1 }));

                const newIncrement = options.increment + 1;
                const smallBlind =
                  Math.ceil(options.smallBlind / newIncrement) * newIncrement;

                dispatch(
                  updateOptions({
                    ante: Math.ceil(options.ante / newIncrement) * newIncrement,
                    smallBlind,
                    bigBlind: smallBlind * 2,
                  })
                );
              }}
              onDecrement={() => {
                dispatch(incrementOption({ key: "increment", value: -1 }));

                const newIncrement = options.increment - 1;
                const smallBlind =
                  Math.floor(options.smallBlind / newIncrement) * newIncrement;

                dispatch(
                  updateOptions({
                    ante:
                      Math.floor(options.ante / newIncrement) * newIncrement,
                    smallBlind,
                    bigBlind: smallBlind * 2,
                  })
                );
              }}
              onChange={(value) => {
                dispatch(updateOptions({ increment: value }));
              }}
              value={options.increment}
              minValue={1}
              maxValue={20}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Ante */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Ante</ThemedText>
            <IncrementControls
              onIncrement={() =>
                dispatch(
                  incrementOption({ key: "ante", value: options.increment })
                )
              }
              onDecrement={() =>
                dispatch(
                  incrementOption({ key: "ante", value: -options.increment })
                )
              }
              onChange={(value) => {
                dispatch(updateOptions({ ante: value }));
              }}
              value={options.ante}
              minValue={0}
              maxValue={20}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Small Blind */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Small Blind</ThemedText>
            <IncrementControls
              onIncrement={() =>
                dispatch(
                  incrementOption({
                    key: "smallBlind",
                    value: options.increment,
                  })
                )
              }
              onDecrement={() =>
                dispatch(
                  incrementOption({
                    key: "smallBlind",
                    value: -options.increment,
                  })
                )
              }
              onChange={(value) => {
                dispatch(updateOptions({ smallBlind: value }));
              }}
              value={options.smallBlind}
              minValue={0}
              maxValue={20}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Big Blind */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Big Blind</ThemedText>
            <IncrementControls
              onIncrement={() =>
                dispatch(
                  incrementOption({ key: "bigBlind", value: options.increment })
                )
              }
              onDecrement={() =>
                dispatch(
                  incrementOption({
                    key: "bigBlind",
                    value: -options.increment,
                  })
                )
              }
              onChange={(value) => {
                dispatch(updateOptions({ bigBlind: value }));
              }}
              value={options.bigBlind}
              minValue={0}
              maxValue={20}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Starting Balance */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Starting Balance</ThemedText>
            <IncrementControls
              onIncrement={() =>
                dispatch(
                  incrementOption({
                    key: "startingBalance",
                    value: options.increment,
                  })
                )
              }
              onDecrement={() =>
                dispatch(
                  incrementOption({
                    key: "startingBalance",
                    value: -options.increment,
                  })
                )
              }
              onChange={(value) => {
                dispatch(updateOptions({ startingBalance: value }));
              }}
              value={options.startingBalance}
              minValue={0}
              maxValue={1000}
            />
          </View>
        </View>
        <ThemedView>
          <ThemedText style={styles.sectionTitle} type="subtitle">
            Game
          </ThemedText>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
        </ThemedView>
        <View>
          {/* Player Dealer */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Player Dealer</ThemedText>
            <Switch
              trackColor={{
                false: switchInactiveTrackColor,
                true: switchActiveTrackColor,
              }}
              thumbColor={
                options.playerDealer
                  ? switchActiveThumbColor
                  : switchInactiveThumbColor
              }
              ios_backgroundColor={switchInactiveTrackColor}
              onValueChange={(value) =>
                dispatch(
                  updateOptions({
                    playerDealer: value,
                    rotatingDealer: !value ? false : options.rotatingDealer,
                  })
                )
              }
              value={options.playerDealer}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Rotating Dealer */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Rotating Dealer</ThemedText>
            <Switch
              trackColor={{
                false: switchInactiveTrackColor,
                true: switchActiveTrackColor,
              }}
              thumbColor={
                options.rotatingDealer
                  ? switchActiveThumbColor
                  : switchInactiveThumbColor
              }
              ios_backgroundColor={switchInactiveTrackColor}
              onValueChange={(value) =>
                dispatch(
                  updateOptions({
                    rotatingDealer: value,
                    playerDealer: value || options.playerDealer,
                  })
                )
              }
              value={options.rotatingDealer}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Reraise */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Maximum Reraises</ThemedText>
            <IncrementControls
              onIncrement={() =>
                dispatch(incrementOption({ key: "maxReraise", value: 1 }))
              }
              onDecrement={() =>
                dispatch(incrementOption({ key: "maxReraise", value: -1 }))
              }
              onChange={(value) => {
                dispatch(updateOptions({ maxReraise: value }));
              }}
              value={options.maxReraise}
              minValue={1}
              maxValue={5}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Max Rounds */}
          <View style={styles.optionRow}>
            <ThemedText style={styles.optionLabel}>Maximum Rounds</ThemedText>
            <IncrementControls
              onIncrement={() =>
                dispatch(incrementOption({ key: "maxRounds", value: 1 }))
              }
              onDecrement={() =>
                dispatch(incrementOption({ key: "maxRounds", value: -1 }))
              }
              onChange={(value) => {
                dispatch(updateOptions({ maxRounds: value }));
              }}
              value={options.maxRounds}
              minValue={0}
              maxValue={5}
            />
          </View>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 20,
  },
  horizontalRule: {
    height: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    flex: 1,
  },
  sectionTitle: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});
