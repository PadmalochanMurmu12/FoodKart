import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  
  const cartItems = useSelector((state: RootState) => state.cart.carts);
  
  // FIX: Count unique item types, not the total quantity of items
  const uniqueItemCount = cartItems.length;

  const handleCartPress = () => {
    if (pathname !== "/cart") {
      router.push("/cart");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/")} style={styles.homeIconContainer}>
         <Feather name="home" size={24} color="#64748b" />
      </Pressable>

      <View style={styles.brandContainer}>
        <Text style={styles.brandText}>FoodKart</Text>
        <MaterialCommunityIcons name="noodles" size={24} color="#10b981" style={styles.brandIcon} />
      </View>

      <Pressable onPress={handleCartPress} style={styles.cartContainer}>
        <Feather name="shopping-cart" size={24} color="#64748b" />
        {uniqueItemCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{uniqueItemCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    zIndex: 50,
  },
  homeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  brandIcon: {
    marginLeft: 4,
  },
  cartContainer: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#10b981",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});