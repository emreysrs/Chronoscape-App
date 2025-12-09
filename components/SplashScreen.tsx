import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Dimensions, Animated, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, G, Ellipse, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onComplete: () => void;
}

// Custom Hourglass Logo Component
const HourglassLogo = ({ size = 120 }: { size?: number }) => {
  const AnimatedG = Animated.createAnimatedComponent(G);
  const sandAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(sandAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 100 130">
      <Defs>
        {/* Golden gradient for frame */}
        <SvgLinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFD700" />
          <Stop offset="50%" stopColor="#FFA500" />
          <Stop offset="100%" stopColor="#DAA520" />
        </SvgLinearGradient>
        
        {/* Sand gradient */}
        <SvgLinearGradient id="sandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#F4E4BA" />
          <Stop offset="100%" stopColor="#D4A574" />
        </SvgLinearGradient>
        
        {/* Glass gradient */}
        <SvgLinearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <Stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
          <Stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </SvgLinearGradient>
      </Defs>

      {/* Top frame bar */}
      <Rect x="15" y="5" width="70" height="8" rx="2" fill="url(#goldGradient)" />
      <Rect x="18" y="7" width="64" height="2" fill="#FFF8DC" opacity="0.5" />
      
      {/* Bottom frame bar */}
      <Rect x="15" y="117" width="70" height="8" rx="2" fill="url(#goldGradient)" />
      <Rect x="18" y="119" width="64" height="2" fill="#FFF8DC" opacity="0.5" />
      
      {/* Left frame connectors */}
      <Rect x="18" y="13" width="6" height="10" fill="url(#goldGradient)" />
      <Rect x="18" y="107" width="6" height="10" fill="url(#goldGradient)" />
      
      {/* Right frame connectors */}
      <Rect x="76" y="13" width="6" height="10" fill="url(#goldGradient)" />
      <Rect x="76" y="107" width="6" height="10" fill="url(#goldGradient)" />
      
      {/* Glass body - top bulb */}
      <Path
        d="M24 23 Q24 55, 50 65 Q76 55, 76 23 L76 20 Q76 18, 74 18 L26 18 Q24 18, 24 20 Z"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      
      {/* Glass body - bottom bulb */}
      <Path
        d="M24 107 Q24 75, 50 65 Q76 75, 76 107 L76 110 Q76 112, 74 112 L26 112 Q24 112, 24 110 Z"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
      
      {/* Sand in top (decreasing) */}
      <Path
        d="M28 28 Q28 48, 50 58 Q50 58, 50 58 Q72 48, 72 28 L72 25 L28 25 Z"
        fill="url(#sandGradient)"
        opacity="0.6"
      />
      
      {/* Sand stream in middle */}
      <Rect x="48" y="58" width="4" height="14" fill="#D4A574" opacity="0.8" />
      
      {/* Sand in bottom (increasing) */}
      <Path
        d="M30 105 Q30 90, 50 80 Q70 90, 70 105 L70 108 L30 108 Z"
        fill="url(#sandGradient)"
        opacity="0.9"
      />
      
      {/* Decorative gems on frame */}
      <Circle cx="50" cy="9" r="3" fill="#E74C3C" />
      <Circle cx="35" cy="9" r="2" fill="#3498DB" />
      <Circle cx="65" cy="9" r="2" fill="#3498DB" />
      
      <Circle cx="50" cy="121" r="3" fill="#E74C3C" />
      <Circle cx="35" cy="121" r="2" fill="#3498DB" />
      <Circle cx="65" cy="121" r="2" fill="#3498DB" />
      
      {/* Shine effect on glass */}
      <Path
        d="M30 30 Q32 45, 40 50"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      <Path
        d="M30 100 Q32 90, 38 85"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    console.log("SplashScreen mounted");
    
    // Animasyon başlat
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1500), // Daha uzun göster
      Animated.timing(scale, {
        toValue: 1.05,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log("SplashScreen completed");
      onComplete();
    });
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/siosepol.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(10, 10, 25, 0.85)", "rgba(15, 25, 45, 0.75)", "rgba(10, 10, 25, 0.85)"]}
          style={styles.gradient}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity,
                transform: [{ scale }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <HourglassLogo size={100} />
            </View>
            <Text style={styles.title}>CHRONOSCAPE</Text>
            <View style={styles.taglineContainer}>
              <View style={styles.taglineLine} />
              <Text style={styles.subtitle}>EXPLORE TIME</Text>
              <View style={styles.taglineLine} />
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 30,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 15,
    letterSpacing: 8,
    textShadowColor: "rgba(255, 215, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  taglineLine: {
    width: 30,
    height: 1,
    backgroundColor: "rgba(255, 215, 0, 0.6)",
    marginHorizontal: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#DAA520",
    letterSpacing: 4,
    fontWeight: "500",
  },
});
