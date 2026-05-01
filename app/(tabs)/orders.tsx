import EmployeeOrders from "@/components/Employees/EmployeeOrders/EmployeeOrders";
import { CompanyOrder } from "@/components/Orders/CompanyOrder/CompanyOrder";
import PageHeader from "@/components/PageHeader/PageHeader";
import RestaurantOrders from "@/components/Restaurant/Components/Orders/RestaurantOrders";
import { useAuthStore } from "@/src/store/authStore";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {
  const { isEmployee, isCompany, isRestaurant } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PageHeader title="Pedidos" subtitle="Gerencie os seus pedidos" />

      {/* <PressableButton
        className="absolute bottom-4 right-4"
        onPress={() => {}}
        icon={<AntDesign name="plus" size={16} color="white" />}
      /> */}
      {isCompany && <CompanyOrder />}
      {isEmployee && <EmployeeOrders />}
      {isRestaurant && <RestaurantOrders />}
    </SafeAreaView>
  );
};

export default Orders;
