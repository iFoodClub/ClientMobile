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
      console.log(JSON.stringify(response.data, null, 2));
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    employees,
    loading,
    fetchEmployees,
  };
};
