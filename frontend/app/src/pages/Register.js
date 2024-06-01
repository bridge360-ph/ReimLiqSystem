import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputForm from '../components/shared/InputForm';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';

const Register = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUserType] = useState('employee'); // Default to 'employee'
    const [passkey, setPasskey] = useState('');
    const [position, setPosition] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEmpSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!fullname || !email || !password || !position || !usertype) {
                return alert('Please Provide all Fields');
            }
            dispatch(showLoading());

            const { data } = await axios.post('/api/v1/auth/empregister', {
                fullname,
                email,
                password,
                position,
                usertype,
            });

            dispatch(hideLoading());
            if (data.success) {
                alert('Successful');
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading());
            alert('Invalid ');
            console.log(error);
        }
    };

    const handleAdmSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!fullname || !email || !password || !position || !usertype || !passkey) {
                return alert('Please Provide all Fields');
            }
            dispatch(showLoading());

            const { data } = await axios.post('/api/v1/auth/adminregister', {
                fullname,
                email,
                password,
                position,
                usertype,
                passkey,
            });

            dispatch(hideLoading());
            if (data.success) {
                alert('Successful');
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading());
            alert('Invalid ');
            console.log(error);
        }
    };

    return (
        <>
            <Link to={'/login'}>Login</Link>
            <div>
                <label>
                    <input
                        type="radio"
                        name="usertype"
                        value="employee"
                        checked={usertype === 'employee'}
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    Register as Employee
                </label>
                <label>
                    <input
                        type="radio"
                        name="usertype"
                        value="admin"
                        checked={usertype === 'admin'}
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    Register as Admin
                </label>
            </div>

            <InputForm
                htmlFor="Fullname"
                labelText={'Fullname'}
                type={'text'}
                value={fullname}
                placeholder={'Fullname'}
                name={'Fullname'}
                handleChange={(e) => setFullName(e.target.value)}
            />
            <InputForm
                htmlFor="Email"
                labelText={'Email'}
                type={'email'}
                value={email}
                placeholder={'example@gmail.com'}
                name={'email'}
                handleChange={(e) => setEmail(e.target.value)}
            />
            <InputForm
                htmlFor="Password"
                labelText={'Password'}
                type={'password'}
                value={password}
                placeholder={''}
                name={'password'}
                handleChange={(e) => setPassword(e.target.value)}
            />
            {usertype === 'admin' && (
                <InputForm
                    htmlFor="passkey"
                    labelText={'Admin Key'}
                    type={'text'}
                    value={passkey}
                    placeholder={''}
                    name={'passkey'}
                    handleChange={(e) => setPasskey(e.target.value)}
                />
            )}
            <InputForm
                htmlFor="position"
                labelText={'Position'}
                type={'text'}
                value={position}
                placeholder={'Department Head etc...'}
                name={'position'}
                handleChange={(e) => setPosition(e.target.value)}
            />
            <button onClick={usertype === 'employee' ? handleEmpSubmit : handleAdmSubmit}>
                Register as {usertype === 'employee' ? 'Employee' : 'Admin'}
            </button>
        </>
    );
};

export default Register;
