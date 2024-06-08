import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputForm from '../components/shared/InputForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/login.css'

const LoginPage = ({ setUsertype }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUserType] = useState("employee");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const loginData = { email, password };
            const url = usertype === "employee" ? "/api/v1/auth/emplogin" : "/api/v1/auth/admlogin";
            const { data } = await axios.post(url, loginData);

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('usertype', usertype);
                localStorage.setItem('userId', data.user._id);
                setUsertype(usertype); // Update the usertype in App component

                const redirectPath = usertype === "employee" ? "/empdash" : "/admdash";
                navigate(redirectPath);
                toast.success("Login successful");
            } else {
                alert('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error("Login error:", error);
            alert('An error occurred during login. Please try again.');
        }
    };

    return (
        <>
        <div className='main-cont'>
        
        <div className='form-container login-cont'>
            <img src='/assets/company.png'></img>
            <div className='radio-container'>
                <label>
                    <input
                        type="radio"
                        name="usertype"
                        value="employee"
                        checked={usertype === "employee"}
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    Login as Employee
                </label>
                <label>
                    <input
                        type="radio"
                        name="usertype"
                        value="admin"
                        checked={usertype === "admin"}
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    Login as Admin
                </label>
            </div>
            <InputForm
                htmlFor="Email"
                labelText={'Email'}
                type={'email'}
                value={email}
                placeholder={'example@gmail.com'}
                name={"email"}
                handleChange={(e) => setEmail(e.target.value)}
            />
            <InputForm
                htmlFor="Password"
                labelText={'Password'}
                type={'password'}
                value={password}
                placeholder={''}
                name={"password"}
                handleChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>
                {usertype === "employee" ? "Login as Employee" : "Login as Admin"}
            </button>
            <Link to={'/register'}> Register</Link>
        </div>
        </div>
        
            
            
        </>
    );
};

export default LoginPage;
