import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

interface MainARViewProps {
  cameraBackground: string;
  historicalImage: string;
  futureImage: string;
}

type TimeMode = "past" | "present" | "future";

export function MainARView({
  cameraBackground,
  historicalImage,
  futureImage,
}: MainARViewProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [timeMode, setTimeMode] = useState<TimeMode>("present");
  const [cameraReady, setCameraReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (timeMode === "past" || timeMode === "future") {
      Animated.timing(overlayOpacity, {
        toValue: 0.7,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [timeMode]);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Loading camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera access required</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Kamera Görünümü */}
      <CameraView
        style={styles.camera}
        facing="back"
        onCameraReady={() => setCameraReady(true)}
      />

      {/* Zaman Overlay */}
      {timeMode !== "present" && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Image
            source={{
              uri: timeMode === "past" ? historicalImage : futureImage,
            }}
            style={styles.overlayImage}
            resizeMode="cover"
            onLoad={() => {
              setImageLoaded(true);
              console.log("Image loaded:", timeMode);
            }}
            onError={(error) => {
              console.log("Image load error:", error.nativeEvent.error);
              Alert.alert("Image Error", "Failed to load time overlay image");
            }}
          />
          {/* Colored tint for better visibility */}
          <View
            style={[
              styles.colorTint,
              {
                backgroundColor:
                  timeMode === "past"
                    ? "rgba(139, 100, 50, 0.3)"
                    : "rgba(100, 150, 255, 0.3)",
              },
            ]}
          />
          {!imageLoaded && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>
                Loading {timeMode === "past" ? "past" : "future"} view...
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* UI Overlay */}
      <View style={styles.uiContainer}>
          {/* Üst Bar */}
          <BlurView intensity={40} style={styles.topBar}>
            <Text style={styles.topBarText}>
              {timeMode === "past"
                ? "📜 Past"
                : timeMode === "present"
                ? "📍 Present"
                : "🚀 Future"}
            </Text>
          </BlurView>

          {/* Alt Kontroller */}
          <View style={styles.bottomControls}>
            <BlurView intensity={40} style={styles.controlsContainer}>
              <View style={styles.timeButtons}>
                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeMode === "past" && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeMode("past")}
                >
                  <Text style={styles.timeButtonText}>📜</Text>
                  <Text style={styles.timeButtonLabel}>Past</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeMode === "present" && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeMode("present")}
                >
                  <Text style={styles.timeButtonText}>📍</Text>
                  <Text style={styles.timeButtonLabel}>Present</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.timeButton,
                    timeMode === "future" && styles.timeButtonActive,
                  ]}
                  onPress={() => setTimeMode("future")}
                >
                  <Text style={styles.timeButtonText}>🚀</Text>
                  <Text style={styles.timeButtonLabel}>Future</Text>
                </TouchableOpacity>
              </View>
            </BlurView>

            {/* Info Button */}
            <TouchableOpacity
              style={styles.infoButton}
              onPress={() =>
                Alert.alert(
                  "Chronoscape",
                  "Navigate between past, present and future. Tap the buttons to see different time periods."
                )
              }
            >
              <BlurView intensity={40} style={styles.infoButtonBlur}>
                <Text style={styles.infoButtonText}>ℹ️</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayImage: {
    width: "100%",
    height: "100%",
  },
  uiContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    marginTop: 60,
    marginHorizontal: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
  topBarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  bottomControls: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlsContainer: {
    borderRadius: 30,
    overflow: "hidden",
    padding: 20,
  },
  timeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  timeButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    minWidth: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  timeButtonActive: {
    backgroundColor: "rgba(74, 144, 226, 0.4)",
    borderWidth: 2,
    borderColor: "#4a90e2",
  },
  timeButtonText: {
    fontSize: 28,
    marginBottom: 5,
  },
  timeButtonLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
  },
  infoButton: {
    position: "absolute",
    top: -70,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  infoButtonBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoButtonText: {
    fontSize: 24,
  },
  permissionText: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  colorTint: {
    ...StyleSheet.absoluteFillObject,
  },
});

