import { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { ModeSelectionScreen } from "./components/ModeSelectionScreen";
import { AdvancedARView } from "./components/AdvancedARView";

type Screen = "splash" | "onboarding" | "modeSelection" | "ar";
type Mode = "archaeological" | "speculative" | null;

const { width, height } = Dimensions.get("window");

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedMode, setSelectedMode] = useState<Mode>(null);

  console.log("App rendered, currentScreen:", currentScreen);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {currentScreen === "splash" && (
        <SplashScreen
          onComplete={() => {
            console.log("Splash completed, moving to onboarding");
            setCurrentScreen("onboarding");
          }}
        />
      )}

      {currentScreen === "onboarding" && (
        <OnboardingScreen
          onComplete={() => {
            console.log("Onboarding completed, moving to mode selection");
            setCurrentScreen("modeSelection");
          }}
        />
      )}

      {currentScreen === "modeSelection" && (
        <ModeSelectionScreen
          onSelectMode={(mode) => {
            console.log("Mode selected:", mode);
            setSelectedMode(mode);
            setCurrentScreen("ar");
          }}
        />
      )}

      {currentScreen === "ar" && selectedMode && (
        <AdvancedARView
          mode={selectedMode}
          onBack={() => {
            setCurrentScreen("modeSelection");
            setSelectedMode(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
