import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import EmpDashboard from './pages/EmpDashboard.js';
import AdminDash from './pages/AdminDash.js';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/empdash' element={<EmpDashboard />}></Route>
        <Route path='/admdash' element={<AdminDash />}></Route>
      </Routes>

    </>
  );
}

export default App;
