import React from 'react';
import { Link } from 'react-router-dom';
// In src/index.tsx or src/App.tsx
import './component.css';

const Navbar: React.FC = () => {
  return (
    <nav style={{ marginBottom: '1rem' }}>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem' }}>
        <li><Link to="/createEmployee">Create Employee</Link></li>
        <li><Link to="/viewAllEmployee">View All Employees</Link></li>
        <li><Link to="/updateEmployee">Update Employee</Link></li>
        <li><Link to="/deleteEmployee">Delete Employee</Link></li>
        <li><Link to="/viewEmployeeById">View Employee By ID</Link></li>
        <li><Link to="/viewEmployeeByFirstName">View Employee By First Name</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
