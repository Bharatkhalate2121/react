import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateEmployee from './components/CreateEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import EmployeeList from './components/EmployeeList';
import EmployeeDetails from './components/EmployeeDetails';
import EmployeeByFirstName from './components/EmployeeByFirstName';
import DeleteEmployee from './components/DeleteEmployee';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<EmployeeList />} />
        <Route path="/createEmployee" element={<CreateEmployee />} />
        <Route path="/updateEmployee" element={<UpdateEmployee />} />
        <Route path="/viewAllEmployee" element={<EmployeeList />} />
        <Route path="/viewEmployeeById" element={<EmployeeDetails />} />
        <Route path="/viewEmployeeByFirstName" element={<EmployeeByFirstName />} />
        <Route path="/deleteEmployee" element={<DeleteEmployee />} />
      </Routes>
    </Router>
  );
};

export default App;
