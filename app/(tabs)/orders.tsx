import PressableButton from "@/components/Button/PressableButton";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useAuthStore } from "@/src/store/authStore";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const orders = () => {
  const { isEmployee, isCompany, isRestaurant } = useAuthStore();
  const { user } = useAuthStore();
  const { employees, fetchEmployees } = useEmployees(user?.company?.id);

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PageHeader title="Pedidos" subtitle="Gerencie os pedidos recebidos " />

      <PressableButton
        className="absolute bottom-4 right-4"
        onPress={() => {}}
        icon={<AntDesign name="plus" size={16} color="white" />}
      />
      {}
    </SafeAreaView>
  );
};

export default orders;
