import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Index" options={{ title: "Home" }} />
      <Tabs.Screen name="Cart" options={{ title: "Carrinho" }} />
      <Tabs.Screen name="Profile" options={{ title: "Perfil" }} />
      <Tabs.Screen name="Search" options={{ title: "Buscar" }} />
    </Tabs>
  );
}
