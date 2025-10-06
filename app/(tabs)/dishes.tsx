import Button from "@/components/Button/Button";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dishes = () => {
  const { user } = useAuthStore();

  return (
    <SafeAreaView>
      <Image
        className="w-full h-40 bg-cover"
        source={{ uri: user?.profileImage }}
      />
      <Button text="Novo prato" onPress={() => {}} />
    </SafeAreaView>
  );
};

export default dishes;
