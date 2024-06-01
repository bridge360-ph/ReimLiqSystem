import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputForm from '../components/shared/InputForm';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUserType] = useState("employee"); // Default to 'employee'

    const handleLogin = () => {
        const loginData = {
            email,
            password,
            usertype
        };
        // Add your login logic here, for example, making an API call
        console.log("Logging in as:", loginData);
    };

    return (
        <>
            <div>LoginPage</div>
            <div>
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
        </>
    );
};

export default LoginPage;
