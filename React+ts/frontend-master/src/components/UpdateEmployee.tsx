import React, { useState } from 'react';
import employeeService, { NewEmployee, Employee } from '../api/employeeService';
// In src/index.tsx or src/App.tsx
import './component.css';

const UpdateEmployee: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [employee, setEmployee] = useState<NewEmployee>({ first_name: '', last_name: '', address: '' });
  const [message, setMessage] = useState<string>('');
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await employeeService.updateEmployee(id, employee);
      setMessage("Employee updated successfully!");
      // Fetch updated employee data
      const updatedData = await employeeService.getEmployeeById(id);
      setUpdatedEmployee(updatedData);
    } catch (error: any) {
      setMessage("Error updating employee: " + error.message);
    }
  };

  return (
    <div>
      <h2>Update Employee</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input type="text" value={id} onChange={handleIdChange} />
        </div>
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
        <button type="submit">Update</button>
      </form>
      {updatedEmployee && (
        <div>
          <h3>Updated Employee Data:</h3>
          <p>ID: {updatedEmployee.id}</p>
          <p>First Name: {updatedEmployee.first_name}</p>
          <p>Last Name: {updatedEmployee.last_name}</p>
          <p>Address: {updatedEmployee.address}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateEmployee;
