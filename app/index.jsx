import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet, Button, Pressable } from "react-native";
import SetPlayers from "@/components/Players/Players";
import SetChips from "@/components/SetChips";
import Game from "@/components/Game/Game";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useSelector } from "react-redux";

// Screens
const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: useThemeColor({}, "background"),
      }}
    >
      <View style={{ paddingHorizontal: 20, rowGap: 20 }}>
        <ThemedText
          type="title"
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontSize: 50,
            lineHeight: 50,
          }}
        >
          CHIPSTER
        </ThemedText>
        <View>
          <ThemedButton onPress={() => navigation.navigate("Set Players")}>
            New Game
          </ThemedButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  const screenStyles = {
    headerStyle: {
      backgroundColor: useThemeColor({}, "background"),
      borderWidth: 0,
      shadowRadius: 0,
      shadowOffset: {
        height: 0,
      },
    },
    headerTintColor: useThemeColor({}, "text"),
    headerTitleStyle: {
      fontWeight: "bold",
    },
    borderWidth: 0,
  };

  const players = useSelector((state) => state.players);

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      //screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Set Players"
        component={SetPlayers}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <ThemedButton
              disabled={players.length < 2}
              style={{
                color: useThemeColor({}, "text"),
                opacity: players.length < 2 ? 0.5 : 1,
              }}
              type="headerNav"
              onPress={() => navigation.navigate("Game")}
            >
              Start Game
            </ThemedButton>
          ),
          title: "Set Players",
          ...screenStyles,
        })}
      />
      <Stack.Screen
        name="Set Chips"
        component={SetChips}
        options={{
          title: "Set Chips",
          ...screenStyles,
        }}
      />
      <Stack.Screen
        name="Game"
        component={Game}
        options={{
          headerShown: false,
          title: "Game",
          ...screenStyles,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 48,
    backgroundColor: "#fff",
    rowGap: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listContainer: {
    flexDirection: "row",
    flexGrow: 1,
    flexWrap: "wrap",
  },
  playerItem: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 4,
    height: 120,
    width: 120,
    borderRadius: 10,
    backgroundColor: "lightgreen",
    rowGap: 5,
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
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 8,
    flex: 1,
    width: "100%",
  },
  button: {
    backgroundColor: "blue",
    height: 60,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

export default App;
