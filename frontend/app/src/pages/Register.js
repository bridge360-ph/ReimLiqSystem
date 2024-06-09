import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputForm from '../components/shared/InputForm';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../components/shared/Spinner';

const Register = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUserType] = useState('employee'); // Default to 'employee'
    const [passkey, setPasskey] = useState('');
    const [position, setPosition] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEmpSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!fullname || !email || !password || !position || !usertype) {
                return alert('Please Provide all Fields');
            }
            dispatch(showLoading());
            setLoading(true); // Show spinner

            const { data } = await axios.post('/api/v1/auth/empregister', {
                fullname,
                email,
                password,
                position,
                usertype,
            });

            dispatch(hideLoading());
            setLoading(false); // Hide spinner
            if (data.success) {
                toast.success('Registered Successfully')
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading());
            setLoading(false); // Hide spinner
            toast.error('Email Registered Already')
        }
    };

    const handleAdmSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!fullname || !email || !password || !position || !usertype || !passkey) {
                return toast.error('Please Provide all Fields');
            }
            dispatch(showLoading());
            setLoading(true); // Show spinner

            const { data } = await axios.post('/api/v1/auth/adminregister', {
                fullname,
                email,
                password,
                position,
                usertype,
                passkey,
            });

            dispatch(hideLoading());
            setLoading(false); // Hide spinner
            if (data.success) {
                toast.success('Registered Successfully')
                navigate('/login');
            }
        } catch (error) {
            dispatch(hideLoading());
            setLoading(false); // Hide spinner
            toast.error('Email Registered Already')
        }
    };

    return (
        <>
            <div className='main-cont'>
                {loading ? ( // Conditionally render the spinner
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
                        <div className='form-input'>
                            <InputForm
                                htmlFor="Fullname"
                                labelText={'Fullname'}
                                type={'text'}
                                value={fullname}
                                placeholder={'Juan Dela Cruz'}
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
                        </div>
                        <button onClick={usertype === 'employee' ? handleEmpSubmit : handleAdmSubmit}>
                            Register
                        </button>
                        <p>Already have an Account? <Link to={'/login'}>Login Here!</Link></p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Register;
