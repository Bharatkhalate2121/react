// Define interfaces for Employee and NewEmployee
export interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
  }
  
  export type NewEmployee = Omit<Employee, 'id'>;
  
  // Helper function to handle response based on content type
  async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    } else {
      // For non-JSON responses (assumed text)
      return response.text() as unknown as T;
    }
  }
  
  const BASE_URL = 'http://localhost:8080';
  
  const employeeService = {
    createEmployee: async (employee: NewEmployee): Promise<Employee | string> => {
      const response = await fetch(`${BASE_URL}/createEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });
      if (!response.ok) {
        throw new Error('Error creating employee');
      }
      return handleResponse<Employee | string>(response);
    },
  
    updateEmployee: async (id: number | string, employee: NewEmployee): Promise<Employee | string> => {
      const response = await fetch(`${BASE_URL}/updateEmployee/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)        
      });
      console.log(employee);
      if (!response.ok) {
        throw new Error('Error updating employee');
      }
      return handleResponse<Employee | string>(response);
    },
  
    getEmployeeById: async (id: number | string): Promise<Employee> => {
      const response = await fetch(`${BASE_URL}/viewEmployeeById/${id}`);
      if (!response.ok) {
        throw new Error('Error fetching employee by ID');
      }
      return handleResponse<Employee>(response);
    },
  
    getAllEmployees: async (): Promise<Employee[]> => {
      const response = await fetch(`${BASE_URL}/viewAllEmployee`);
      if (!response.ok) {
        throw new Error('Error fetching all employees');
      }
      return handleResponse<Employee[]>(response);
    },
  
    deleteEmployeeById: async (id: number | string): Promise<string> => {
      const response = await fetch(`${BASE_URL}/deleteEmployeeById/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error deleting employee');
      }
      return handleResponse<string>(response);
    },
  
    getEmployeeByFirstName: async (first_name: string): Promise<Employee> => {
      const response = await fetch(`${BASE_URL}/viewEmployeeByFirstName/${first_name}`);
      if (!response.ok) {
        throw new Error('Error fetching employee by first name');
      }
      return handleResponse<Employee>(response);
    }
  };
  
  export default employeeService;
  