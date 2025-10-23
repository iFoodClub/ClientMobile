import PageHeader from "@/components/PageHeader/PageHeader";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const orders = () => {
  return (
    <SafeAreaView>
      <PageHeader title="Pedidos" subtitle="Gerencie os pedidos recebidos " />
    </SafeAreaView>
  );
};

export default orders;
