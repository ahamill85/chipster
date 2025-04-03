import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet, Text } from "react-native";
import SetPlayers from "@/components/Players/Players";
import Game from "@/components/Game/Game";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useSelector } from "react-redux";
import Options from "../components/Options/Options";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

// Screens
const WelcomeScreen = ({ navigation }) => {
  const players = useSelector((state) => state.players);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: useThemeColor({}, "background"),
      }}
    >
      <View
        style={{
          padding: 20,
          rowGap: 20,
          flex: 1,
          justifyContent: "space-evenly",
        }}
      >
        <View style={{marginTop: "auto"}}>
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
          <View style={{ gap: 20, flexDirection: "row" }}>
            <ThemedButton
              onPress={() => navigation.navigate("players")}
              style={styles.boxButton}
              icon={
                <FontAwesome
                  name="user-plus"
                  size={50}
                  color={useThemeColor({}, "buttonText")}
                  style={{ height: 60 }}
                />
              }
            >
              <Text style={{ fontSize: "20" }}>
                {players.length
                  ? `Edit Players (${players.length})`
                  : "Add Players"}
              </Text>
            </ThemedButton>
            <ThemedButton
              onPress={() => navigation.navigate("game")}
              disabled={!players.length}
              style={{
                ...styles.boxButton,
                opacity: !players.length ? 0.5 : 1,
              }}
              icon={
                <MaterialCommunityIcons
                  name="cards"
                  size={55}
                  color={useThemeColor({}, "buttonText")}
                  style={{ height: 60 }}
                />
              }
            >
              <Text style={{ fontSize: "20" }}>Start Game</Text>
            </ThemedButton>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", marginTop: "auto" }}>
          <ThemedButton
            onPress={() => navigation.navigate("options", {})}
            type="circle"
          >
            <FontAwesome name="gear" size={30} />
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
    <Stack.Navigator initialRouteName="welcome">
      <Stack.Screen
        name="welcome"
        component={WelcomeScreen}
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="players"
        component={SetPlayers}
        options={({ navigation, route }) => ({
          title: "Player List",
          presentation: "modal",
          ...screenStyles,
          headerBackTitle: "Done",
        })}
      />
      <Stack.Screen
        name="options"
        component={Options}
        options={{
          title: "Options",
          presentation: "modal",
          ...screenStyles,
        }}
      />
      <Stack.Screen
        name="game"
        component={Game}
        options={{
          headerShown: false,
          title: "Game",
          gestureEnabled: false,
          ...screenStyles,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  boxButton: {
    flex: 1,
    height: "auto",
    paddingVertical: 15,
    flexDirection: "column",
    aspectRatio: 1,
  },
});

export default App;
