import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { RootState } from "../src/store/store";
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from "../src/store/cartSlice";
import Header from "../src/components/Header";
import Toast from "../src/components/Toast";


const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL

export default function CartScreen() {
  const cartItems = useSelector((state: RootState) => state.cart.carts);
  const dispatch = useDispatch();
  const router = useRouter();

  // Toast States
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"add" | "remove" | "warning">("remove");

  // Stripe & Modal States
  const [isConnecting, setIsConnecting] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.qnty, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qnty, 0);

  const showToast = (message: string, type: "add" | "remove" | "warning") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
    showToast("Item removed from your cart", "remove");
  };

  const handleProceedToCheckout = async () => {
    try {
      setIsConnecting(true);

      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: cartItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate Stripe session");
      }

      if (data.url) {
        setCheckoutUrl(data.url);
        setModalVisible(true);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to connect to Stripe", "warning");
    } finally {
      setIsConnecting(false);
    }
  };

  // Intercepts in-app redirects from Stripe
  const handleNavigationStateChange = (navState: { url: string }) => {
    const { url } = navState;

    if (url.includes("/success")) {
      setModalVisible(false);
      setCheckoutUrl(null);
      dispatch(clearCart());
      router.replace("/success");
    } else if (url.includes("canceled=true")) {
      setModalVisible(false);
      setCheckoutUrl(null);
      showToast("Payment was interrupted. Your items are still here!", "warning");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCheckoutUrl(null);
    showToast("Payment was interrupted. Your items are still here!", "warning");
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Feather name="shopping-cart" size={48} color="#94a3b8" />
      </View>
      <Text style={styles.emptyTitle}>Your cart is feeling light!</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet. Let's get some delicious food in here.
      </Text>
      <Pressable style={styles.exploreButton} onPress={() => router.push("/menu")}>
        <Text style={styles.exploreButtonText}>Explore Menu</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header />

      <Toast
        isVisible={toastVisible}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
        type={toastType}
      />

      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>
                Your Cart <Text style={styles.cartCount}>({totalQuantity})</Text>
              </Text>
              <Pressable onPress={() => dispatch(clearCart())}>
                <Text style={styles.clearAllText}>
                  <Feather name="trash-2" size={14} /> Clear All
                </Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cartCard}>
              <View style={styles.cardTopRow}>
                <Image source={{ uri: item.imgdata }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.dish}</Text>
                  <Text style={styles.itemPricePer}>₹{item.price} / item</Text>
                </View>
                <Pressable style={styles.deleteButton} onPress={() => handleRemove(item.id)}>
                  <Feather name="trash-2" size={18} color="#ef4444" />
                </Pressable>
              </View>

              <View style={styles.cardBottomRow}>
                <View style={styles.quantityControl}>
                  <Pressable
                    style={styles.qntyButton}
                    onPress={() => item.qnty > 1 && dispatch(decrementQuantity(item.id))}
                  >
                    <Feather name="minus" size={16} color={item.qnty <= 1 ? "#cbd5e1" : "#334155"} />
                  </Pressable>
                  <Text style={styles.qntyText}>{item.qnty}</Text>
                  <Pressable
                    style={styles.qntyButton}
                    onPress={() => item.qnty < 10 && dispatch(incrementQuantity(item.id))}
                  >
                    <Feather name="plus" size={16} color={item.qnty >= 10 ? "#cbd5e1" : "#334155"} />
                  </Pressable>
                </View>
                <Text style={styles.itemTotalPrice}>₹{item.price * item.qnty}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Items</Text>
                <Text style={styles.summaryValue}>{totalQuantity}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValueFree}>Free</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelTotal}>Total Amount</Text>
                <Text style={styles.summaryValueTotal}>₹{totalAmount}</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.checkoutButton,
                  isConnecting && styles.checkoutButtonDisabled,
                  pressed && !isConnecting && { opacity: 0.9 },
                ]}
                onPress={handleProceedToCheckout}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <ActivityIndicator size="small" color="#ffffff" style={styles.loaderIcon} />
                    <Text style={styles.checkoutButtonText}>Connecting to Stripe...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    <Feather name="arrow-right" size={20} color="#ffffff" />
                  </>
                )}
              </Pressable>
            </View>
          }
        />
      )}

      {/* In-App Stripe Checkout Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <SafeAreaView style={styles.modalContainer} edges={["top"]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Stripe Checkout</Text>
            <Pressable onPress={handleModalClose} style={styles.modalCloseButton} hitSlop={10}>
              <Feather name="x" size={22} color="#0f172a" />
            </Pressable>
          </View>
          {checkoutUrl && (
            <WebView
              source={{ uri: checkoutUrl }}
              onShouldStartLoadWithRequest={(request) => {
                const { url } = request;
               
                if (url.includes("/success")) {
                  setModalVisible(false);
                  setCheckoutUrl(null);
                  dispatch(clearCart());
                  router.replace("/success");
                  return false;
                }
                
                if (url.includes("canceled=true")) {
                  setModalVisible(false);
                  setCheckoutUrl(null);
                  showToast("Payment was interrupted. Your items are still here!", "warning");
                  return false; 
                }
                
                return true;
              }}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.webviewLoader}>
                  <ActivityIndicator size="large" color="#10b981" />
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, marginTop: 60 },
  emptyIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  emptyTitle: { fontSize: 24, fontWeight: "900", color: "#0f172a", marginBottom: 12 },
  emptySubtitle: { fontSize: 15, color: "#64748b", textAlign: "center", lineHeight: 22, paddingHorizontal: 10, marginBottom: 32 },
  exploreButton: { backgroundColor: "#10b981", paddingHorizontal: 32, paddingVertical: 14, borderRadius: 9999 },
  exploreButtonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  cartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 24 },
  cartTitle: { fontSize: 24, fontWeight: "900", color: "#0f172a" },
  cartCount: { color: "#10b981" },
  clearAllText: { color: "#ef4444", fontWeight: "bold", fontSize: 14 },
  cartCard: { backgroundColor: "#ffffff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#e2e8f0" },
  cardTopRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  itemImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: "#f1f5f9" },
  itemDetails: { flex: 1, marginLeft: 12, marginRight: 8 },
  itemName: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginBottom: 4 },
  itemPricePer: { fontSize: 13, color: "#64748b", fontWeight: "500" },
  deleteButton: { padding: 8, backgroundColor: "#fef2f2", borderRadius: 8, borderWidth: 1, borderColor: "#fee2e2" },
  cardBottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 16 },
  quantityControl: { flexDirection: "row", alignItems: "center", backgroundColor: "#f8fafc", borderRadius: 8, borderWidth: 1, borderColor: "#e2e8f0" },
  qntyButton: { paddingHorizontal: 12, paddingVertical: 8 },
  qntyText: { fontSize: 16, fontWeight: "bold", color: "#0f172a", width: 24, textAlign: "center" },
  itemTotalPrice: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  summaryCard: { backgroundColor: "#0f172a", borderRadius: 20, padding: 24, marginTop: 8 },
  summaryTitle: { fontSize: 20, fontWeight: "bold", color: "#ffffff", marginBottom: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  summaryLabel: { color: "#94a3b8", fontSize: 15 },
  summaryValue: { color: "#ffffff", fontSize: 15, fontWeight: "600" },
  summaryValueFree: { color: "#10b981", fontSize: 15, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#1e293b", marginVertical: 16 },
  summaryLabelTotal: { color: "#94a3b8", fontSize: 14 },
  summaryValueTotal: { color: "#ffffff", fontSize: 28, fontWeight: "900" },
  checkoutButton: { backgroundColor: "#10b981", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, marginTop: 24 },
  checkoutButtonDisabled: { opacity: 0.7 },
  checkoutButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginRight: 8 },
  loaderIcon: { marginRight: 8 },
  modalContainer: { flex: 1, backgroundColor: "#ffffff" },
  modalHeader: { height: 54, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  modalCloseButton: { padding: 4 },
  webviewLoader: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
});