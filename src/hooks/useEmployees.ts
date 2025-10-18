import { useState } from "react";
import { IEmployeeResponse } from "../interfaces/apiResponses";
import EmployeeRepository from "../repository/employeeRepository";

export const useEmployees = (companyId: number | undefined) => {
  const [employees, setEmployees] = useState<IEmployeeResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchEmployees() {
    try {
      setLoading(true);
      if (!companyId) return;
      const response = await EmployeeRepository.getEmployees(companyId);
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteEmployee(employeeId: number) {
    try {
      setLoading(true);
      await EmployeeRepository.deleteEmployee(employeeId);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    employees,
    deleteEmployee,
    loading,
    fetchEmployees,
  };
};
