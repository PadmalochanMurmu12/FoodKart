import "../global.css";
import { useState, useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { store } from "../src/store/store";
import AnimatedSplash from "../src/components/AnimatedSplash";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {
    });
  }, []);

  return (
    <Provider store={store}>
      <View style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#f8fafc" },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="menu" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="success" />
          </Stack>
        </SafeAreaProvider>

        {!isSplashAnimationComplete && (
          <AnimatedSplash onFinish={() => setAnimationComplete(true)} />
        )}
      </View>
    </Provider>
  );
}