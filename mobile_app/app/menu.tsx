import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart } from "../src/store/cartSlice";
import Header from "../src/components/Header";
import FoodCard from "../src/components/FoodCard";
import Cardsdata, { Product } from "../src/data/CardData";
import Toast from "../src/components/Toast"; 

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dispatch = useDispatch();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      // Do not trim here, we need to know if they typed spaces to show the empty state
      setDebouncedQuery(searchQuery);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // FIX: Strict Search filtering
  let filteredData = Cardsdata;
  
  if (debouncedQuery.length > 0) {
    const trimmedQuery = debouncedQuery.trim();
    if (trimmedQuery === "") {
      // User typed ONLY spaces -> show no results
      filteredData = [];
    } else {
      // Filter cleanly ignoring leading/trailing spaces on valid keywords
      filteredData = Cardsdata.filter((item) =>
        item.dish.toLowerCase().includes(trimmedQuery.toLowerCase())
      );
    }
  }

  const handleAddToCart = (item: Product) => {
    dispatch(addToCart(item));
    setToastMessage(`${item.dish} added to cart!`);
    setToastVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />
      <Toast 
        isVisible={toastVisible} 
        message={toastMessage} 
        onClose={() => setToastVisible(false)} 
        type="add" 
      />
      
      {/* ... KEEP YOUR EXISTING FlatList CODE HERE ... */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FoodCard item={item} onAddToCart={handleAddToCart} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerSection}>
             {/* ... existing header content ... */}
             <Text style={styles.heroTitle}>
              What's on your <Text style={styles.emeraldText}>mind?</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Discover the best meals from top-rated local kitchens, delivered fresh to your doorstep.
            </Text>
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for dishes, cuisines..."
                placeholderTextColor="#94a3b8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={44} color="#94a3b8" />
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptySubtitle}>No results matching "{debouncedQuery}"</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 12,
  },
  emeraldText: {
    color: "#10b981",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    width: "100%",
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    height: "100%",
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#334155",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
});