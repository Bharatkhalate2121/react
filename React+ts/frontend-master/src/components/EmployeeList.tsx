import React, { useEffect, useState } from 'react';
import employeeService, { Employee } from '../api/employeeService';
// In src/index.tsx or src/App.tsx
import './component.css';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    employeeService.getAllEmployees()
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
          console.warn('Expected an array but received:', data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees", error);
      });
  }, []);

  return (
    <div>
      <h2>Employee List</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.first_name}</td>
              <td>{emp.last_name}</td>
              <td>{emp.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
