import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface AnimatedSplashProps {
  onFinish: () => void;
}

export default function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => onFinish());
      }, 1200);
    });
  }, []);

  return (
    <Animated.View 
      style={[styles.container, { opacity: containerOpacity }]}
      pointerEvents="none" // Prevents it from blocking touches while fading
    >
      <Animated.View style={[styles.logoWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.brandText}>FoodKart</Text>
        <MaterialCommunityIcons name="noodles" size={56} color="#10b981" style={styles.brandIcon} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    elevation: 99999, // FIX: Forces Android to place this on top of the Stack
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontSize: 48,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1.5,
  },
  brandIcon: {
    marginLeft: 8,
    marginTop: -4,
  },
});