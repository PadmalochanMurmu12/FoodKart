import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Pressable, View } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type: "add" | "remove" | "warning";
}

export default function Toast({ message, isVisible, onClose, type }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 50, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  if (!isVisible) return null;

  const isLight = type === "remove";

  return (
    <Animated.View style={[styles.container, isLight ? styles.bgLight : styles.bgDark, { transform: [{ translateY }], opacity }]}>
      <View style={styles.content}>
        {type === "warning" ? (
          <Feather name="alert-circle" size={18} color="#f59e0b" style={styles.icon} />
        ) : (
          <MaterialIcons name="check-circle" size={20} color="#10b981" style={styles.icon} />
        )}
        <Text style={[styles.message, isLight ? styles.textDark : styles.textLight]}>{message}</Text>
      </View>
      <Pressable onPress={handleClose} hitSlop={10}>
        <Feather name="x" size={18} color={isLight ? "#64748b" : "#94a3b8"} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", left: 20, right: 20, zIndex: 9999, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8, borderWidth: 1 },
  bgDark: { backgroundColor: "#1e293b", borderColor: "#334155" },
  bgLight: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
  content: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 },
  icon: { marginRight: 10 },
  message: { fontSize: 14, fontWeight: "600", flexShrink: 1 },
  textLight: { color: "#ffffff" },
  textDark: { color: "#334155" },
});