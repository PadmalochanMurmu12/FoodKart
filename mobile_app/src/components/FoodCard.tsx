import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Product } from "../data/CardData";
import { Feather } from "@expo/vector-icons";

interface FoodCardProps {
  item: Product;
  onAddToCart: (item: Product) => void;
}

export default function FoodCard({ item, onAddToCart }: FoodCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imgdata }} style={styles.image} resizeMode="cover" />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Feather name="star" size={10} color="#eab308" />
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.dish}</Text>
          <Text style={styles.price}>₹{item.price}</Text>
        </View>

        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>

        <View style={styles.footerRow}>
           {/* Web design includes an arrow icon and a delivery badge here */}
          <View style={styles.iconRow}>
            <View style={styles.circleIcon}>
                <Feather name="trending-up" size={14} color="#6366f1" />
            </View>
             <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryText}>FREE DELIVERY</Text>
             </View>
          </View>

          <Pressable 
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            onPress={() => onAddToCart(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  imageContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginRight: 4,
  },
  detailsContainer: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    flex: 1,
    paddingRight: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  address: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 16,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  circleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  deliveryBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  deliveryText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#059669",
  },
  addButton: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  }
});