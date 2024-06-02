
import './App.css';
import LoginPage from './pages/LoginPage';
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register';
import EmpDashboard from './pages/EmpDashboard.js';
import AdminDash from './pages/AdminDash.js';
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import PrivateRoutes from './components/routes/PrivateRoutes.js';
import PublicRoute from './components/routes/PublicRoute.js'

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>

        <Route path='/' element={<PublicRoute><LoginPage /></PublicRoute>}></Route>
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>}></Route>
        <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>}></Route>


        <Route path='/empdash' element={<PrivateRoutes><EmpDashboard />
        </PrivateRoutes>}></Route>
        <Route path='/admdash' element={<PrivateRoutes><AdminDash /></PrivateRoutes>}></Route>
      </Routes>

    </>
  );
}

export default App;
