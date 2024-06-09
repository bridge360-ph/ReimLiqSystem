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
import NotFound from './pages/NotFound.js';

function App() {
  const [usertype, setUsertype] = useState(localStorage.getItem('usertype'));
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth > 1040); // Initially true if screen width is greater than 1040px

  useEffect(() => {
    const handleResize = () => {
      setIsNavVisible(window.innerWidth > 1040); // Update visibility based on screen width
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <div className='app-container'>
      <div>
        {usertype && (
          <div className={`hamburger ${!isNavVisible ? 'active' : ''}`} onClick={toggleNav}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill=" #0072ce" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.5 3a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5z" />
            </svg>
          </div>
        )}
        {usertype && isNavVisible && <Navigation toggleNav={toggleNav} />}
      </div>

      <ToastContainer />
      <div className='content-cont'>
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
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
