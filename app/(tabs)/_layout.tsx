import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/store/authStore";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React from "react";

type TabBarIconProps = Parameters<
  NonNullable<BottomTabNavigationOptions["tabBarIcon"]>
>[0];

const TabsLayout = () => {
  const { isRestaurant, isCompany } = useAuthStore();

  const tabsConfig = [
    {
      name: "index",
      title: "Início",
      icon: ({ focused, color }: TabBarIconProps) => (
        <Feather
          name="home"
          size={24}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
    {
      name: "dishes",
      title: "Pratos",
      href: isRestaurant ? "/dishes" : null,
      icon: ({ focused, color }: TabBarIconProps) => (
        <Ionicons
          name="fast-food-outline"
          size={24}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
    {
      name: "orders",
      title: "Pedidos",
      icon: ({ focused, color }: TabBarIconProps) => (
        <Ionicons
          name="receipt-outline"
          size={24}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
    {
      name: "settings",
      title: "Perfil",
      icon: ({ focused, color }: TabBarIconProps) => (
        <Octicons
          name="person"
          size={24}
          color={focused ? COLORS.primary : color}
        />
      ),
      options: {
        tabBarLabelStyle: { fontSize: 12 },
      },
    },
    {
      name: "employees",
      title: "Funcionários",
      href: isCompany ? "/employees" : null,
      icon: ({ focused, color }: TabBarIconProps) => (
        <SimpleLineIcons
          name="people"
          size={24}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
  ];

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {tabsConfig.map(({ name, title, icon, href, options }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            sceneStyle: { padding: 12 },
            title,
            href,
            tabBarLabelStyle: { fontSize: 12 },
            tabBarIcon: icon,
            tabBarActiveTintColor: COLORS.primary,
            ...options,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
