import { useAuthStore } from "@/src/store/authStore";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  const { user, isRestaurant, isCompany, isEmployee } = useAuthStore();

  console.log("isrestaurant", isRestaurant);
  console.log("iscompany", isCompany);
  console.log("isemployee", isEmployee);
  console.log("user", user?.userType);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />

      <Tabs.Screen
        name="dishes"
        options={{
          title: "Dishes",
          href: isRestaurant ? "/dishes" : null,
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
        }}
      />

      <Tabs.Screen name="settings" options={{ title: "Settings" }} />

      <Tabs.Screen
        name="employees"
        options={{
          title: "Employees",
          href: isCompany ? "/employees" : null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
