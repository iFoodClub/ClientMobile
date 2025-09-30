import { useAuthStore } from "@/src/store/authStore";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  const { user, isRestaurant, isCompany, isEmployee } = useAuthStore();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="dishes" options={{ title: "Dishes" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
};

export default TabsLayout;
