import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ThemedButton } from "../ThemedButton";

import { useDispatch, useSelector } from "react-redux";
import {
  updateOptions,
  incrementOption,
} from "../../features/slices/optionsSlice";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useState } from "react";
import ThemedModal from "../ThemedModal";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  onChange,
  value,
  minValue,
  maxValue,
  style,
  increment = 1,
  placeholder = "none",
  ...rest
}) => {
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
        onPress={() => onChange(value - increment)}
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
        onPress={() => onChange(value + increment)}
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

const OptionLabel = ({ url, children, ...rest }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return (
    <TouchableOpacity {...rest} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
};

export default ({ route, style, ...rest }) => {
  const options = useSelector((state) => state.options);

  const dispatch = useDispatch();

  const { inGame = false } = route.params;

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

  const safeArea = useSafeAreaInsets();

  return (
    <ThemedView style={[{ flex: 1 }, style]}>
      <ScrollView
        stickyHeaderIndices={[0, 2]}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ThemedView>
          <ThemedText style={styles.sectionTitle} type="subtitle">
            Betting
          </ThemedText>
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
        </ThemedView>
        <View>
          {/* Limit */}
          {!inGame && (
            <View style={styles.optionRow}>
              <OptionLabel
                url="https://en.wikipedia.org/wiki/Betting_in_poker#Limits"
                style={styles.optionLabel}
              >
                <ThemedText>Limit</ThemedText>
                <FontAwesome
                  name="question-circle"
                  size={20}
                  style={{
                    color: useThemeColor({}, "buttonBackground"),
                  }}
                />
              </OptionLabel>

              <ThemedButton
                icon={
                  <FontAwesome6
                    size={18}
                    name="bars"
                    style={{
                      color: switchActiveThumbColor,
                      justifySelf: "start",
                      flex: 0,
                    }}
                  />
                }
                style={{
                  flex: 0,
                  width: 200,
                  fontSize: 18,
                  justifyContent: "stretch",
                  height: 50,
                }}
                onPress={() => setLimitModalVisibility(true)}
                type="small"
              >
                <Text style={{ textAlign: "center", flex: 1 }}>
                  {selectedLimit.label}
                </Text>
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
          )}
          <View style={[styles.horizontalRule, { backgroundColor: rules }]} />
          {/* Ante */}
          <View style={styles.optionRow}>
            <OptionLabel
              url="https://en.wikipedia.org/wiki/Betting_in_poker#Ante"
              style={styles.optionLabel}
            >
              <ThemedText>Ante</ThemedText>
              <FontAwesome
                name="question-circle"
                size={20}
                style={{
                  color: useThemeColor({}, "buttonBackground"),
                }}
              />
            </OptionLabel>
            <IncrementControls
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
            <OptionLabel
              url="https://en.wikipedia.org/wiki/Betting_in_poker#Blinds"
              style={styles.optionLabel}
            >
              <ThemedText>Small Blind</ThemedText>
              <FontAwesome
                name="question-circle"
                size={20}
                style={{
                  color: useThemeColor({}, "buttonBackground"),
                }}
              />
            </OptionLabel>
            <IncrementControls
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
            <OptionLabel
              url="https://en.wikipedia.org/wiki/Betting_in_poker#Blinds"
              style={styles.optionLabel}
            >
              <ThemedText>Big Blind</ThemedText>
              <FontAwesome
                name="question-circle"
                size={20}
                style={{
                  color: useThemeColor({}, "buttonBackground"),
                }}
              />
            </OptionLabel>
            <IncrementControls
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
          {!inGame && (
            <View style={styles.optionRow}>
              <ThemedText style={styles.optionLabel}>
                Starting Balance
              </ThemedText>
              <IncrementControls
                onChange={(value) => {
                  dispatch(updateOptions({ startingBalance: value }));
                }}
                value={options.startingBalance}
                minValue={0}
                maxValue={1000}
              />
            </View>
          )}
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
        {/* <View style={{height: safeArea.bottom}} /> */}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    justifyContent: "space-between",
    height: 80,
    paddingHorizontal: 20,
  },
  horizontalRule: {
    height: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  sectionTitle: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});
