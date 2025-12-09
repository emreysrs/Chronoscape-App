import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface ModeSelectionScreenProps {
  onSelectMode: (mode: "archaeological" | "speculative") => void;
}

export function ModeSelectionScreen({ onSelectMode }: ModeSelectionScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.gradient}
      >
        <Text style={styles.title}>Select a mode to begin</Text>
        <Text style={styles.subtitle}>Choose how you want to explore time</Text>

        <View style={styles.modesContainer}>
          {/* Archaeological Lens */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => onSelectMode("archaeological")}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} style={styles.modeBlur}>
              <LinearGradient
                colors={["rgba(139, 69, 19, 0.8)", "rgba(101, 67, 33, 0.8)"]}
                style={styles.modeGradient}
              >
                <Text style={styles.modeIcon}>🏛️</Text>
                <Text style={styles.modeTitle}>Archaeological Lens</Text>
                <Text style={styles.modeDescription}>
                  Generate historical reconstructions{"\n"}
                  Travel back in time (1800-2024)
                </Text>
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>📜 Historical Records</Text>
                  <Text style={styles.featureItem}>🗺️ Detailed Maps</Text>
                  <Text style={styles.featureItem}>📷 Photo Archives</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          {/* Speculative Lens */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => onSelectMode("speculative")}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} style={styles.modeBlur}>
              <LinearGradient
                colors={["rgba(100, 150, 255, 0.8)", "rgba(70, 100, 200, 0.8)"]}
                style={styles.modeGradient}
              >
                <Text style={styles.modeIcon}>🚀</Text>
                <Text style={styles.modeTitle}>Speculative Lens</Text>
                <Text style={styles.modeDescription}>
                  Imagine future scenarios{"\n"}
                  Project forward in time (2024-2100)
                </Text>
                <View style={styles.featureList}>
                  <Text style={styles.featureItem}>🌆 Future Cities</Text>
                  <Text style={styles.featureItem}>🔮 AI Predictions</Text>
                  <Text style={styles.featureItem}>🌍 Climate Impact</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 40,
  },
  modesContainer: {
    gap: 20,
  },
  modeCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modeBlur: {
    overflow: "hidden",
  },
  modeGradient: {
    padding: 30,
    alignItems: "center",
  },
  modeIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  modeDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  featureList: {
    alignItems: "flex-start",
    width: "100%",
  },
  featureItem: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 8,
  },
});
