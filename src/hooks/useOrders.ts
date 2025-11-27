import { useState } from "react";
import { useToastAll } from "../components/Toast";
import {
  IEmployeeChoicesResponse,
  IEmployeeWeeklyOrdersResponse,
  IRestaurantOrdersResponse,
} from "../interfaces/apiResponses";
import companyRepository from "../repository/companyRepository";
import orderRepository from "../repository/orderRepository";
import restaurantRepository from "../repository/restaurantRepository";

export const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToastAll();

  const [restaurantOrders, setRestaurantOrders] = useState<
    IRestaurantOrdersResponse[]
  >([]);
  const [employeesWeeklyOrders, setEmployeesWeeklyOrders] =
    useState<IEmployeeWeeklyOrdersResponse | null>(null);

  const [employeeChoices, setEmployeeChoices] = useState<
    IEmployeeChoicesResponse[]
  >([]);

  async function getRestaurantOrders(restaurantId: number) {
    try {
      setIsLoading(true);
      const response = await restaurantRepository.getRestaurantOrders(
        restaurantId
      );

      const validOrders =
        response.data.filter((order) => order.employeeOrders.length > 0) || [];

      setRestaurantOrders(validOrders);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function getEmployeesWeeklyOrdersCurrentDay(companyId: number) {
    try {
      setIsLoading(true);
      const response =
        await companyRepository.getEmployeesWeeklyOrdersCurrentDay(companyId);

      setEmployeesWeeklyOrders(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function createCompanyOrder(companyId: number) {
    try {
      setIsLoading(true);
      const response = await orderRepository.createCompanyWeeklyOrder(
        companyId
      );
      if (response) {
        showSuccess("Pedidos criados com sucesso!");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCompanyOrder(
    restaurantId: number,
    orderId: number,
    status: string
  ) {
    try {
      setIsLoading(true);
      const response = await orderRepository.updateCompanyOrder(
        restaurantId,
        orderId,
        status
      );
      await getRestaurantOrders(restaurantId);
      if (response) {
        showSuccess("Pedido atualizado com sucesso!");
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function getEmployeeWeeklyOrders(employeeId: number) {
    try {
      setIsLoading(true);
      const response = await orderRepository.getEmployeeWeeklyChosenOrders(
        employeeId
      );
      setEmployeeChoices(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function removeEmployeeChoice(choiceId: number, employeeId: number) {
    try {
      setIsLoading(true);
      await orderRepository.removeEmployeeCoice(choiceId);
      await getEmployeeWeeklyOrders(employeeId);
      showSuccess("Pedido removido com sucesso!");
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    employeeChoices,
    isLoading,
    restaurantOrders,
    employeesWeeklyOrders,
    removeEmployeeChoice,
    getEmployeeWeeklyOrders,
    getRestaurantOrders,
    getEmployeesWeeklyOrdersCurrentDay,
    createCompanyOrder,
    updateCompanyOrder,
  };
};
