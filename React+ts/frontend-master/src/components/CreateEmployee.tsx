import React, { useState } from 'react';
import employeeService, { NewEmployee } from '../api/employeeService';
// In src/index.tsx or src/App.tsx
import './component.css';

const CreateEmployee: React.FC = () => {
  const [employee, setEmployee] = useState<NewEmployee>({ first_name: '', last_name: '', address: '' });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeService.createEmployee(employee);
      setMessage("Employee created successfully!");
      setEmployee({ first_name: '', last_name: '', address: '' });
    } catch (error: any) {
      setMessage("Error creating employee: " + error.message);
    }
  };

  return (
    <div>
      <h2>Create Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input 
            type="text" 
            name="first_name" 
            value={employee.first_name} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input 
            type="text" 
            name="last_name" 
            value={employee.last_name} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <label>Address:</label>
          <input 
            type="text" 
            name="address" 
            value={employee.address} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateEmployee;
