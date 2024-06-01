import logo from './logo.svg';
import './App.css';
import LoginPage from './pages/LoginPage';
import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register';

function App() {
  return (
    <>

      <Routes>
        <Route path='/' element={<LoginPage />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
      </Routes>

    </>
  );
}

export default App;
