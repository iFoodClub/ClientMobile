import { useCallback, useState } from "react";
import { IEmployeeSimple } from "../interfaces/apiResponses";
import { IEmployeeDTO } from "../interfaces/dtos";
import EmployeeRepository from "../repository/employeeRepository";

export const useEmployees = (companyId: number | undefined) => {
  const [employees, setEmployees] = useState<IEmployeeSimple[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEmployees = useCallback(async () => {
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
  }, [companyId]);

  const deleteEmployee = useCallback(async (employeeId: number) => {
    try {
      setLoading(true);
      await EmployeeRepository.deleteEmployee(employeeId);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (data: IEmployeeDTO) => {
    try {
      setLoading(true);
      await EmployeeRepository.createEmployee(data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmployee = useCallback(async (
    employeeId: number,
    data: Partial<IEmployeeSimple>
  ) => {
    try {
      setLoading(true);
      await EmployeeRepository.updateEmployee(employeeId, data);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    employees,
    updateEmployee,
    deleteEmployee,
    loading,
    fetchEmployees,
    createEmployee,
  };
};
