import React, { useState } from 'react';
import employeeService, { Employee } from '../api/employeeService';
// In src/index.tsx or src/App.tsx
import './component.css';

const EmployeeDetails: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getEmployeeById(id);
      setEmployee(data);
      setMessage('');
    } catch (error: any) {
      setEmployee(null);
      setMessage("Error fetching employee by ID: " + error.message);
    }
  };

  return (
    <div>
      <h2>View Employee By ID</h2>
      <div>
        <input 
          type="text" 
          value={id} 
          onChange={handleIdChange} 
          placeholder="Enter Employee ID" 
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

export default EmployeeDetails;
