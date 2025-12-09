import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface AdvancedARViewProps {
  mode: "archaeological" | "speculative";
  onBack: () => void;
}

const isfahanImage = require("../assets/siosepol.jpg");
const londonImage = require("../assets/london_tower.jpg");

export function AdvancedARView({ mode, onBack }: AdvancedARViewProps) {
  const [selectedCity, setSelectedCity] = useState<"Isfahan" | "London">("Isfahan");
  const [currentYear, setCurrentYear] = useState(mode === "archaeological" ? 1858 : 2050);
  const [activeMode, setActiveMode] = useState<"archaeological" | "speculative">(mode);
  const [hideUI, setHideUI] = useState(false);
  const sliderRef = useRef<View>(null);
  const sliderWidth = useRef(width - 40);
  const lastUpdateTime = useRef(0);

  const minYear = activeMode === "archaeological" ? 1600 : 2026;
  const maxYear = activeMode === "archaeological" ? 2025 : 2100;

  const calculateYear = useCallback((locationX: number) => {
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth.current));
    return Math.round(minYear + percentage * (maxYear - minYear));
  }, [minYear, maxYear]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const year = calculateYear(e.nativeEvent.locationX);
        setCurrentYear(year);
      },
      onPanResponderMove: (e) => {
        const now = Date.now();
        // Throttle updates to every 16ms (60fps)
        if (now - lastUpdateTime.current > 16) {
          const year = calculateYear(e.nativeEvent.locationX);
          setCurrentYear(year);
          lastUpdateTime.current = now;
        }
      },
      onPanResponderRelease: (e) => {
        const year = calculateYear(e.nativeEvent.locationX);
        setCurrentYear(year);
      },
    })
  ).current;

  const handleModeChange = (newMode: "archaeological" | "speculative") => {
    setActiveMode(newMode);
    if (newMode === "archaeological") {
      setCurrentYear(1858);
    } else {
      setCurrentYear(2050);
    }
  };

  const getBackgroundImage = () => {
    return selectedCity === "Isfahan" ? isfahanImage : londonImage;
  };

  const getLocationText = () => {
    return selectedCity === "Isfahan" 
      ? "Isfahan, Naqsh-e Jahan Square" 
      : "London, Tower Bridge";
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {
        if (hideUI) {
          setHideUI(false);
        }
      }}
    >
      <ImageBackground
        source={getBackgroundImage()}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Dark overlay for better readability */}
        {!hideUI && <View style={styles.darkOverlay} />}

        <SafeAreaView style={styles.safeArea}>
          {/* Top Location Bar */}
          {!hideUI && (
          <View style={styles.topBar}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{getLocationText()}</Text>
            </View>
            <TouchableOpacity style={styles.infoButton} onPress={onBack}>
              <Text style={styles.infoIcon}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          )}

        {/* Lens and City Selection */}
        {!hideUI && (
        <View style={styles.lensRow}>
          <View style={styles.lensLabel}>
            <Text style={styles.lensText}>LENS: {activeMode === "archaeological" ? "PAST" : "FUTURE"}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.cityButton,
              selectedCity === "Isfahan" && styles.cityButtonActive,
            ]}
            onPress={() => setSelectedCity("Isfahan")}
          >
            <Text
              style={[
                styles.cityText,
                selectedCity === "Isfahan" && styles.cityTextActive,
              ]}
            >
              Isfahan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cityButton,
              selectedCity === "London" && styles.cityButtonActive,
            ]}
            onPress={() => setSelectedCity("London")}
          >
            <Text
              style={[
                styles.cityText,
                selectedCity === "London" && styles.cityTextActive,
              ]}
            >
              London
            </Text>
          </TouchableOpacity>
        </View>
        )}

        {/* Left Side Tools */}
        {!hideUI && (
        <View style={styles.leftTools}>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>🕐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolButton} onPress={() => setHideUI(true)}>
            <Text style={styles.toolIcon}>👁️</Text>
          </TouchableOpacity>
        </View>
        )}

        {/* Center Detection Markers */}
        {!hideUI && (
        <View style={styles.detectionArea}>
          <View style={styles.detectionFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.marker1} />
          <View style={styles.marker2} />
        </View>
        )}

        {/* Temporal Position Display */}
        {!hideUI && (
        <View style={styles.temporalDisplay}>
          <BlurView intensity={40} tint="dark" style={styles.temporalBlur}>
            <View style={styles.temporalDot} />
            <Text style={styles.temporalLabel}>TEMPORAL POSITION</Text>
            <Text style={styles.temporalYear}>{currentYear}</Text>
          </BlurView>
        </View>
        )}

        {/* Bottom Section */}
        {!hideUI && (
        <View style={styles.bottomSection}>
          {/* Timeline Slider */}
          <View style={styles.timelineContainer}>
            <View
              ref={sliderRef}
              style={styles.timelineTrack}
              {...panResponder.panHandlers}
            >
              {/* Track background */}
              <View style={styles.trackBackground} />
              {/* Filled portion */}
              <LinearGradient
                colors={["#D4A853", "#B8860B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.timelineFill,
                  { width: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%` },
                ]}
              />
              {/* Slider thumb */}
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%` },
                ]}
              />
            </View>

            {/* Year labels - only start and end years */}
            <View style={styles.yearLabels}>
              <Text style={[styles.yearLabel, styles.yearLabelActive]}>
                {minYear}
              </Text>
              <Text style={styles.yearLabel}>
                {maxYear}
              </Text>
            </View>
          </View>

          {/* Mode Toggle Buttons */}
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                activeMode === "archaeological" && styles.modeButtonActive,
              ]}
              onPress={() => handleModeChange("archaeological")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  activeMode === "archaeological" && styles.modeButtonTextActive,
                ]}
              >
                ARCHAEOLOGICAL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                activeMode === "speculative" && styles.modeButtonActive,
              ]}
              onPress={() => handleModeChange("speculative")}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  activeMode === "speculative" && styles.modeButtonTextActive,
                ]}
              >
                SPECULATIVE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
      </SafeAreaView>
    </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D4A853",
    justifyContent: "center",
    alignItems: "center",
  },
  infoIcon: {
    color: "#D4A853",
    fontSize: 20,
  },
  lensRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  lensLabel: {
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  lensText: {
    color: "#D4A853",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 6,
    backgroundColor: "rgba(60, 60, 60, 0.7)",
  },
  cityButtonActive: {
    backgroundColor: "#D4A853",
  },
  cityText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  cityTextActive: {
    color: "#000",
  },
  leftTools: {
    position: "absolute",
    left: 16,
    top: "35%",
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderRadius: 30,
    padding: 8,
  },
  toolButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  toolIcon: {
    fontSize: 22,
  },
  detectionArea: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: "50%",
    height: "35%",
  },
  detectionFrame: {
    flex: 1,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#D4A853",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  marker1: {
    position: "absolute",
    top: "20%",
    left: "30%",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D4A853",
  },
  marker2: {
    position: "absolute",
    bottom: "30%",
    right: "10%",
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#D4A853",
  },
  temporalDisplay: {
    position: "absolute",
    bottom: "28%",
    alignSelf: "center",
  },
  temporalBlur: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    overflow: "hidden",
  },
  temporalDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D4A853",
    marginBottom: 8,
  },
  temporalLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    marginBottom: 4,
  },
  temporalYear: {
    color: "#D4A853",
    fontSize: 36,
    fontWeight: "300",
    letterSpacing: 4,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
  },
  timelineContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timelineTrack: {
    height: 30,
    backgroundColor: "transparent",
    justifyContent: "center",
    position: "relative",
  },
  trackBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 13,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  timelineFill: {
    position: "absolute",
    left: 0,
    top: 13,
    height: 4,
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#D4A853",
    marginLeft: -10,
    borderWidth: 3,
    borderColor: "#fff",
  },
  yearLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 0,
  },
  yearLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    fontWeight: "500",
  },
  yearLabelActive: {
    color: "#D4A853",
  },
  modeToggle: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(40, 40, 40, 0.9)",
    marginHorizontal: 60,
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#D4A853",
  },
  modeButtonText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  modeButtonTextActive: {
    color: "#000",
  },
});
