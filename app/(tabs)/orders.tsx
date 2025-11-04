import PageHeader from "@/components/PageHeader/PageHeader";
import { useEmployees } from "@/src/hooks/useEmployees";
import { useAuthStore } from "@/src/store/authStore";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const orders = () => {
  const { isEmployee, isCompany, isRestaurant } = useAuthStore();
  const { user } = useAuthStore();
  const { employees, fetchEmployees } = useEmployees(user?.company?.id);

  useEffect(() => {
    fetchEmployees();
  }, []);

  console.log(JSON.stringify(user, null, 2));
  console.log(JSON.stringify(employees, null, 2));

  return (
    <SafeAreaView>
      <PageHeader title="Pedidos" subtitle="Gerencie os pedidos recebidos " />

      {}
    </SafeAreaView>
  );
};

export default orders;
