import { COLORS } from "@/src/constants/colors";
import { useAuthStore } from "@/src/store/authStore";
import { Octicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
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
      icon: ({ focused, color, size }: TabBarIconProps & { size: number }) => (
        <Feather
          name="home"
          size={size}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
    {
      name: "dishes",
      title: "Pratos",
      href: isRestaurant ? "/dishes" : null,
      icon: ({ focused, color, size }: TabBarIconProps & { size: number }) => (
        <Ionicons
          name="fast-food-outline"
          size={size}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
    {
      name: "orders",
      title: "Pedidos",
      icon: ({ focused, color, size }: TabBarIconProps & { size: number }) => (
        <Ionicons
          name="receipt-outline"
          size={size}
          color={focused ? COLORS.primary : color}
        />
      ),
    },

    {
      name: "employees",
      title: "Funcionários",
      href: isCompany ? "/employees" : null,
      icon: ({ focused, color, size }: TabBarIconProps & { size: number }) => (
        <SimpleLineIcons
          name="people"
          size={size}
          color={focused ? COLORS.primary : color}
        />
      ),
    },
    {
      name: "settings",
      title: "Perfil",
      icon: ({ focused, color, size }: TabBarIconProps & { size: number }) => (
        <Octicons
          name="person"
          size={size}
          color={focused ? COLORS.primary : color}
        />
      ),
      options: {
        tabBarLabelStyle: { fontSize: 12 },
      },
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 85, // Aumentado para dar espaço à barra do sistema
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingBottom: 25, // Empurra o conteúdo para cima da barra preta
          paddingTop: 12,
          backgroundColor: "#FFFFFF",
          elevation: 0, // Remove sombra estranha no Android
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      {tabsConfig.map(({ name, title, icon, href, options }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            sceneStyle: { backgroundColor: "#fff" },
            title,
            href,
            tabBarIcon: ({ focused, color }) => icon({ focused, color, size: 22 }),
            ...options,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;
