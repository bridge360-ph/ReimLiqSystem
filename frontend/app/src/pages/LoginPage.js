import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputForm from '../components/shared/InputForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/login.css';
import Spinner from '../components/shared/Spinner';
import '../styles/responsive.css'

const LoginPage = ({ setUsertype }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUserType] = useState("employee");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleLogin = async () => {
        try {
            setLoading(true); // Show spinner
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
                toast.error('Login failed. Please check your credentials and try again.');
                console.log(error)
            }
        } catch (error) {
            setError(error)
            console.log("Login error:", error);
            toast.error(error);
        } finally {
            setLoading(false); // Hide spinner
        }
    };

    return (
        <>
            <div className='main-cont'>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className='form-container login-cont'>
                        <img src='/assets/company.png' alt='Company Logo' />
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
                        <div className='form-input'>
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
                        </div>

                        <button onClick={handleLogin}>
                            {usertype === "employee" ? "SIGN IN" : "SIGN IN"}
                        </button>
                        <p>Don't have an Account yet? <Link to={'/register'}>Register Here!</Link></p>
                    </div>
                )}
            </div>
        </>
    );
};

export default LoginPage;
