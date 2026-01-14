import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  PanResponder,
  Animated,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface AdvancedARViewProps {
  mode: "archaeological" | "speculative";
  onBack: () => void;
}

const isfahanImage = require("../assets/siosepol.jpg");
// Historic Isfahan photos for different eras
const isfahanPastImage1603 = require("../assets/Safavid Era past 1603.png");
const isfahanPastImage1950 = require("../assets/Pahlavi Era past Year 1950.png");
const isfahanPresentImage2025 = require("../assets/Present era 2025.jpg");
const isfahanFutureImage2100 = require("../assets/Future Era 2100 .png");
const isfahanFutureImage2200 = require("../assets/ Future era 2200.png");
// London photos for different eras
const londonImage = require("../assets/london_tower.jpg");
const londonPastImage1858 = require("../assets/london-1858.png");
const londonPastImage1950 = require("../assets/london-1950.png");
const londonPresentImage2025 = require("../assets/london-present.jpg");
const londonFutureImage2150 = require("../assets/london-2150.png");

export function AdvancedARView({ mode, onBack }: AdvancedARViewProps) {
  const [selectedCity, setSelectedCity] = useState<"Isfahan" | "London">("Isfahan");
  const [activeMode, setActiveMode] = useState<"archaeological" | "speculative">(mode);
  const [hideUI, setHideUI] = useState(false);
  const sliderRef = useRef<View>(null);
  const sliderWidth = useRef(width - 40);


  // Pan state for historic image exploration (no zoom, just pan)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const lastPan = useRef({ x: 0, y: 0 });

  // Image dimensions (landscape image: width = height * 1.5)
  const imageWidth = height * 1.5;

  // Calculate max pan (only horizontal since image fits vertically)
  const maxPanX = Math.max(0, (imageWidth - width) / 2);

  // PanResponder for historic image panning (horizontal only)
  const imagePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastPan.current = { ...panOffset };
      },
      onPanResponderMove: (_, gestureState) => {
        // Horizontal pan only, clamped to prevent black borders
        let newX = lastPan.current.x + gestureState.dx;
        newX = Math.max(-maxPanX, Math.min(maxPanX, newX));
        setPanOffset({ x: newX, y: 0 });
      },
      onPanResponderRelease: () => {
        lastPan.current = { ...panOffset };
      },
    })
  ).current;

  // Reset pan when year changes
  const resetImageTransform = () => {
    setPanOffset({ x: 0, y: 0 });
    lastPan.current = { x: 0, y: 0 };
  };

  // Define fixed year stops for each mode and city
  const getYearStops = () => {
    if (activeMode === "archaeological") {
      return selectedCity === "Isfahan" ? [1603, 1950, 2025] : [1858, 1950, 2025];
    } else {
      // Speculative mode - different for each city
      return selectedCity === "Isfahan" ? [2025, 2100, 2200] : [2025, 2150];
    }
  };
  const yearStops = getYearStops();
  const [currentYearIndex, setCurrentYearIndex] = useState(
    mode === "archaeological" ? 1 : 1 // Start at middle option
  );
  const currentYear = yearStops[currentYearIndex];

  const minYear = yearStops[0];
  const maxYear = yearStops[yearStops.length - 1];

  // Find closest year stop based on touch position
  const findClosestYearIndex = useCallback((locationX: number) => {
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth.current));
    const exactYear = minYear + percentage * (maxYear - minYear);
    
    // Find the closest year stop
    let closestIndex = 0;
    let minDiff = Math.abs(yearStops[0] - exactYear);
    
    for (let i = 1; i < yearStops.length; i++) {
      const diff = Math.abs(yearStops[i] - exactYear);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }
    
    return closestIndex;
  }, [yearStops, minYear, maxYear]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const index = findClosestYearIndex(e.nativeEvent.locationX);
        setCurrentYearIndex(index);
      },
      onPanResponderMove: (e) => {
        const index = findClosestYearIndex(e.nativeEvent.locationX);
        setCurrentYearIndex(index);
      },
      onPanResponderRelease: (e) => {
        const index = findClosestYearIndex(e.nativeEvent.locationX);
        setCurrentYearIndex(index);
      },
    })
  ).current;

  const handleModeChange = (newMode: "archaeological" | "speculative") => {
    setActiveMode(newMode);
    setCurrentYearIndex(1); // Reset to middle option
    // Reset pan and zoom position when changing mode
    resetImageTransform();
  };

  const getBackgroundImage = () => {
    return selectedCity === "Isfahan" ? isfahanImage : londonImage;
  };

  // Choose which photo to show based on mode and year
  const isIsfahanMode = selectedCity === "Isfahan";

  // Select image based on year index
  const getOverlayImage = () => {
    if (selectedCity === "Isfahan") {
      if (activeMode === "archaeological") {
        // Archaeological: 0=1603, 1=1950, 2=2025
        if (currentYearIndex === 0) return isfahanPastImage1603;
        if (currentYearIndex === 1) return isfahanPastImage1950;
        if (currentYearIndex === 2) return isfahanPresentImage2025;
      } else {
        // Speculative: 0=2025, 1=2100, 2=2200
        if (currentYearIndex === 0) return isfahanPresentImage2025;
        if (currentYearIndex === 1) return isfahanFutureImage2100;
        if (currentYearIndex === 2) return isfahanFutureImage2200;
      }
    } else {
      // London
      if (activeMode === "archaeological") {
        // Archaeological: 0=1858, 1=1950, 2=2025
        if (currentYearIndex === 0) return londonPastImage1858;
        if (currentYearIndex === 1) return londonPastImage1950;
        if (currentYearIndex === 2) return londonPresentImage2025;
      } else {
        // Speculative: 0=2025, 1=2150
        if (currentYearIndex === 0) return londonPresentImage2025;
        if (currentYearIndex === 1) return londonFutureImage2150;
      }
    }
    return null;
  };
  
  const overlayImage = getOverlayImage();

  // Show full opacity when any era image is selected
  const overlayOpacity = overlayImage ? 1 : 0;

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
      {/* Show background image only when not viewing era photo */}
      {!(overlayOpacity > 0 && overlayImage) ? (
        <ImageBackground
          source={getBackgroundImage()}
          style={styles.container}
          resizeMode="cover"
        >
          {/* Dark overlay for better readability */}
          {!hideUI && <View style={styles.darkOverlay} />}
        </ImageBackground>
      ) : (
        <View style={[styles.container, { backgroundColor: '#000' }]} />
      )}
      
      {/* Era overlay showing historic/future Isfahan photos */}
      {overlayOpacity > 0 && overlayImage && (
        <View 
          style={[styles.pastOverlay, { opacity: 1, overflow: 'hidden', backgroundColor: '#000' }]}
          {...imagePanResponder.panHandlers}
        >
          <View
            style={{
              width: imageWidth,
              height: height,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [
                { translateX: panOffset.x },
              ],
            }}
          >
            <Image
              source={overlayImage}
              style={{
                height: height,
                width: imageWidth,
              }}
              resizeMode="cover"
            />
          </View>
          {/* Pan hint indicator */}
          {hideUI === false && (
            <View style={styles.panHintContainer}>
              <Text style={styles.panHintText}>← Sola/Sağa Kaydır →</Text>
            </View>
          )}
        </View>
      )}

        <View style={[styles.safeArea, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
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
              {/* Year stop markers */}
              {yearStops.map((year, index) => (
                <View
                  key={year}
                  style={[
                    styles.yearStopMarker,
                    { left: `${((year - minYear) / (maxYear - minYear)) * 100}%` },
                    currentYearIndex === index && styles.yearStopMarkerActive,
                  ]}
                />
              ))}
              {/* Slider thumb */}
              <View
                style={[
                  styles.sliderThumb,
                  { left: `${((currentYear - minYear) / (maxYear - minYear)) * 100}%` },
                ]}
              />
            </View>

            {/* Year labels - show all stops */}
            <View style={styles.yearLabels}>
              {yearStops.map((year, index) => (
                <Text 
                  key={year}
                  style={[
                    styles.yearLabel, 
                    currentYearIndex === index && styles.yearLabelActive,
                    index === 0 && { textAlign: 'left' },
                    index === yearStops.length - 1 && { textAlign: 'right' },
                  ]}
                >
                  {year}
                </Text>
              ))}
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
      </View>
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
  pastOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pastColorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(90, 70, 40, 0.75)",
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
  yearStopMarker: {
    position: "absolute",
    top: 9,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginLeft: -6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  yearStopMarkerActive: {
    backgroundColor: "#D4A853",
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
    flex: 1,
    textAlign: "center",
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
  panHintContainer: {
    position: "absolute",
    bottom: "32%",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  panHintText: {
    color: "#D4A853",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
