import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    emoji: "📸",
    title: "Open Your Camera",
    description: "Scan your surroundings to see the past and future",
  },
  {
    emoji: "🕰️",
    title: "Travel Through Time",
    description: "Swipe between past and future",
  },
  {
    emoji: "🔐",
    title: "Grant Permissions",
    description: "We'll need access to your camera, photos, and location to create your time-travel experience",
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }
  };

  const handleSkip = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onComplete();
    });
  };

  const step = onboardingSteps[currentStep];

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.emoji}>{step.emoji}</Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentStep && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <LinearGradient
              colors={["#4a90e2", "#357abd"]}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {currentStep === onboardingSteps.length - 1
                  ? "Get Started"
                  : "Continue"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  skipText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#b0b0b0",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#4a90e2",
    width: 24,
  },
  button: {
    borderRadius: 25,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
