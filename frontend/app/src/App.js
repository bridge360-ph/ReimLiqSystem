import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import EmpDashboard from './pages/EmpDashboard.js';
import AdminDash from './pages/AdminDash.js';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import PrivateRoutes from './components/routes/PrivateRoutes.js';
import PublicRoute from './components/routes/PublicRoute.js';
import Navigation from './components/shared/Navigation.js';
import Reimbursements from './pages/Reimbursements.js';
import Liquidations from './pages/Liquidations.js';
import ManageReim from './pages/ManageReim.js';
import ManageLiq from './pages/ManageLiq.js';
import Settings from './pages/Settings.js'

function App() {
  const [usertype, setUsertype] = useState(localStorage.getItem('usertype'));

  useEffect(() => {
    const storedUsertype = localStorage.getItem('usertype');
    if (storedUsertype !== usertype) {
      setUsertype(storedUsertype);
    }
  }, []);

  return (
    <div className='app-container'>
      {usertype && <Navigation />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<PublicRoute><LoginPage setUsertype={setUsertype} /></PublicRoute>}></Route>
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>}></Route>
        <Route path='/login' element={<PublicRoute><LoginPage setUsertype={setUsertype} /></PublicRoute>}></Route>
        <Route path='/empdash' element={<PrivateRoutes><EmpDashboard /></PrivateRoutes>}></Route>
        <Route path='/admdash' element={<PrivateRoutes><AdminDash /></PrivateRoutes>}></Route>
        <Route path='/reimbursements' element={<PrivateRoutes><Reimbursements /></PrivateRoutes>}></Route>
        <Route path='/liquidations' element={<PrivateRoutes><Liquidations /></PrivateRoutes>}></Route>
        <Route path='/managereim' element={<PrivateRoutes><ManageReim /></PrivateRoutes>}></Route>
        <Route path='/manageliq' element={<PrivateRoutes><ManageLiq /></PrivateRoutes>}></Route>
        <Route path='/settings' element={<PrivateRoutes><Settings /></PrivateRoutes>}></Route>
      </Routes>
    </div>
  );
}

export default App;
