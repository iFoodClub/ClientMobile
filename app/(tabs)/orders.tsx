import PageHeader from "@/components/PageHeader/PageHeader";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const orders = () => {
  const { isEmployee, isCompany, isRestaurant } = useAuthStore();

  return (
    <SafeAreaView>
      <PageHeader title="Pedidos" subtitle="Gerencie os pedidos recebidos " />

      {}
    </SafeAreaView>
  );
};

export default orders;
