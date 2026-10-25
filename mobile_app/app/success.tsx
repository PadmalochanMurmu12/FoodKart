import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Header from "../src/components/Header";

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Feather name="check" size={54} color="#10b981" />
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your kitchen-to-door journey has begun. We'll notify you when it's out for delivery.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.homeButton, pressed && styles.homeButtonPressed]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.homeButtonText}>Return to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ecfdf5",
    borderWidth: 2,
    borderColor: "#a7f3d0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: { fontSize: 28, fontWeight: "900", color: "#0f172a", marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: "#64748b", textAlign: "center", lineHeight: 22, marginBottom: 36, maxWidth: 320 },
  homeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  homeButtonPressed: { transform: [{ scale: 0.97 }] },
  homeButtonText: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
});