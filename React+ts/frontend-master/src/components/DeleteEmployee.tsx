import React, { useState } from 'react';
import employeeService from '../api/employeeService';
// In src/index.tsx or src/App.tsx
import './component.css';

const DeleteEmployee: React.FC = () => {
  const [id, setId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const result = await employeeService.deleteEmployeeById(id);
      setMessage("Employee deleted successfully! Response: " + result);
      setId('');
    } catch (error: any) {
      setMessage("Error deleting employee: " + error.message);
    }
  };

  return (
    <div>
      <h2>Delete Employee</h2>
      <input 
        type="text" 
        value={id} 
        onChange={handleChange} 
        placeholder="Enter Employee ID" 
      />
      <button onClick={handleDelete}>Delete</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteEmployee;
