import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { View } from "react-native";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { user, isLoading } = useUser();
  const segments = useSegments();
  const router = useRouter();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (isLoading || hasNavigated) return;

    const firstSegment = segments[0] as string;
    const inOnboarding = firstSegment === 'onboarding' || firstSegment === 'onboarding-professional' || firstSegment === 'role-selection';

    if (!user.hasCompletedOnboarding && !inOnboarding) {
      setHasNavigated(true);
      router.replace('/role-selection' as any);
    } else if (user.hasCompletedOnboarding && inOnboarding) {
      setHasNavigated(true);
      router.replace('/(tabs)');
    } else {
      setHasNavigated(true);
    }
  }, [user.hasCompletedOnboarding, isLoading, segments, hasNavigated, router]);

  if (isLoading || !hasNavigated) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="onboarding-professional" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="role-selection" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="peptide/[id]" options={{ title: "Peptide Details" }} />
      <Stack.Screen name="camera" options={{ headerShown: false, presentation: "fullScreenModal" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </UserProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
