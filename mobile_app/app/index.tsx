import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const HERO_IMAGE_URI =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80";

export default function LandingPage() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -6, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.65, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    bounceLoop.start();
    pulseLoop.start();
    return () => { bounceLoop.stop(); pulseLoop.stop(); };
  }, [bounceAnim, pulseAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={styles.headerText} accessibilityRole="header">
              FoodKart
            </Text>
            <MaterialCommunityIcons 
              name="noodles" 
              size={28} 
              color="#10b981" 
              style={styles.brandIcon} 
            />
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Typography & CTA */}
          <View style={styles.leftSection}>
            <Animated.View style={[styles.badge, { transform: [{ translateY: bounceAnim }] }]}>
              <Feather name="zap" size={13} color="#065f46" style={styles.badgeIcon} />
              <Text style={styles.badgeText}>Lightning Fast Delivery</Text>
            </Animated.View>

            <Text style={styles.title}>Feeling{"\n"}<Text style={styles.emeraldText}>Hungry!!</Text></Text>
            
            <Text style={styles.subtitle}>
              Get your favourite foods delivered hot and fresh with just a few clicks.
            </Text>

            <Pressable
              onPress={() => router.push("/menu")}
              testID="landing-cta-button"
              accessibilityRole="button"
              style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            >
              <Text style={styles.ctaText}>Order Now</Text>
              <Feather name="arrow-right" size={20} color="#ffffff" />
            </Pressable>
          </View>

          {/* Hero Image */}
          <View style={styles.heroSection}>
            <Animated.View
              style={[
                styles.glowBlob,
                {
                  opacity: pulseAnim,
                  transform: [{ scale: pulseAnim.interpolate({ inputRange: [0.3, 0.65], outputRange: [0.95, 1.08] }) }],
                },
              ]}
            />
            <View style={styles.imageContainer}>
              <Image source={{ uri: HERO_IMAGE_URI }} style={styles.image} resizeMode="cover" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { flexGrow: 1 },
  header: { width: "100%", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, zIndex: 20 },
  brandContainer: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 24, fontWeight: "900", color: "#0f172a", letterSpacing: -1 },
  brandIcon: { marginLeft: 6, marginTop: -2 },
  emeraldText: { color: "#10b981" },
  mainContent: { flex: 1, justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 24 },
  leftSection: { alignItems: "flex-start", marginTop: 16, zIndex: 10 },
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 9999, backgroundColor: "#d1fae5", borderColor: "#a7f3d0", borderWidth: 1, marginBottom: 20 },
  badgeIcon: { marginRight: 6 },
  badgeText: { color: "#065f46", fontWeight: "bold", fontSize: 12, letterSpacing: 0.5 },
  title: { fontSize: 48, fontWeight: "900", color: "#0f172a", lineHeight: 54, letterSpacing: -1 },
  subtitle: { fontSize: 16, color: "#64748b", fontWeight: "500", marginTop: 16, maxWidth: 320, lineHeight: 24 },
  ctaButton: { marginTop: 28, paddingHorizontal: 32, paddingVertical: 16, backgroundColor: "#0f172a", borderRadius: 9999, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
  ctaButtonPressed: { transform: [{ scale: 0.97 }] },
  ctaText: { color: "#ffffff", fontWeight: "bold", fontSize: 18, marginRight: 8 },
  heroSection: { marginVertical: 40, alignItems: "center", justifyContent: "center", position: "relative" },
  glowBlob: { position: "absolute", width: 288, height: 288, borderRadius: 144, backgroundColor: "#6ee7b7" },
  imageContainer: { width: "100%", maxWidth: 350, aspectRatio: 1, borderRadius: 24, overflow: "hidden", backgroundColor: "#0f172a", borderColor: "rgba(226,232,240,0.5)", borderWidth: 1, zIndex: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10 },
  image: { width: "100%", height: "100%" },
});