import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/features/alertSlice.js';
import axios from 'axios';
import { setUser } from '../../redux/features/authSlice/authSlice.js';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const getUser = async () => {
        try {
            dispatch(showLoading());
            const { data } = await axios.post(
                '/api/v1/user/post-user',
                { token: localStorage.getItem('token') },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            dispatch(hideLoading());
            if (data.success) {
                dispatch(setUser(data.data));
            } else {
                localStorage.clear();
            }
        } catch (error) {
            localStorage.clear();
            dispatch(hideLoading());
            console.log(error);
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user, getUser]);


    if (localStorage.getItem('token')) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoutes;