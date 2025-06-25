import React, { useState } from 'react';
import employeeService, { Employee } from '../api/employeeService';
// In src/index.tsx or src/App.tsx
import './component.css';

const EmployeeByFirstName: React.FC = () => {
  const [first_name, setFirstName] = useState<string>('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeByFirstName(first_name);
      setEmployee(data);
      setMessage('');
    } catch (error: any) {
      setEmployee(null);
      setMessage("Error fetching employee by first name: " + error.message);
    }
  };

  return (
    <div>
      <h2>View Employee By First Name</h2>
      <div>
        <input 
          type="text" 
          value={first_name} 
          onChange={handleChange} 
          placeholder="Enter First Name" 
        />
        <button onClick={fetchEmployee}>Search</button>
      </div>
      {message && <p>{message}</p>}
      {employee && (
        <div>
          <p>ID: {employee.id}</p>
          <p>First Name: {employee.first_name}</p>
          <p>Last Name: {employee.last_name}</p>
          <p>Address: {employee.address}</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeByFirstName;
