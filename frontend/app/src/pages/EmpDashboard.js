import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/empdash.css'
const EmpDashboard = () => {
    const usertype = localStorage.getItem('usertype');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the usertype is not employee, navigate to login
        if (usertype !== 'employee') {
            navigate('/admdash');
        }
    }, [usertype, navigate]);

    const [userData, setUserData] = useState({ fullname: '', email: '' });
    const [reimbursements, setReimbursements] = useState([]);
    const [paidReimbursements, setPaidReimbursements] = useState([]);
    const [liquidations, setLiquidations] = useState([]);
    const [returnedLiquidations, setReturnedLiquidations] = useState([]);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (usertype && userId) {
            const fetchUserData = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`/api/v1/user/get-user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data.success) {
                        setUserData(response.data.user);
                    } else {
                        toast.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    toast.error('Error fetching user data');
                }
            };

            const fetchReimbursements = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('/api/v1/reim/get-created-reim', {
                        params: { limit: 3 },
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data.success) {
                        const createdReims = response.data.reimbursements.filter(reim => reim.status !== 'paid');
                        const paidReims = response.data.reimbursements.filter(reim => reim.status === 'paid');
                        setReimbursements(createdReims);
                        setPaidReimbursements(paidReims);
                    } else {
                        toast.error('Failed to fetch reimbursements');
                    }
                } catch (error) {
                    console.error('Error fetching reimbursements:', error);
                    toast.error('Error fetching reimbursements');
                }
            };

            const fetchLiquidations = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get('/api/v1/liq/get-created-liq', {
                        params: { limit: 3 },
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.data.success) {
                        const createdLiqs = response.data.liquidations.filter(liq => liq.status !== 'returned');
                        const returnedLiqs = response.data.liquidations.filter(liq => liq.status === 'returned');
                        setLiquidations(createdLiqs);
                        setReturnedLiquidations(returnedLiqs);
                    } else {
                        toast.error('Failed to fetch liquidations');
                    }
                } catch (error) {
                    console.error('Error fetching liquidations:', error);
                    toast.error('Error fetching liquidations');
                }
            };

            fetchUserData();
            fetchReimbursements();
            fetchLiquidations();
        }
    }, [usertype, userId]);

    return (
        <>
            {usertype === 'employee' && (<>
                <h1 className='settings-header'>Welcome {userData.fullname} !</h1>
                <div className='dash-container'>
                    <div className='flex-cont'>
                        <div className='dash-reims dashconts'>
                            <div className='dash-header'>
                                <h2>Your Reimbursements</h2>
                                <Link to={'/reimbursements'}>See More</Link>
                            </div>

                            {reimbursements.length > 0 ? (
                                reimbursements.map(reim => (
                                    <div key={reim._id} className='reim-item'>
                                        <h3>{reim.name}</h3>
                                        <p>{reim.description}</p>
                                        <p>Total Amount: {reim.total_price}</p>
                                        <p>Status: {reim.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No created reimbursements yet</p>
                            )}
                        </div>

                        <div className='dash-paid-reims dashconts'>
                            <div className='dash-header'>
                                <h2>Paid Reimbursements</h2>
                                <Link to={'/reimbursements'}>See More</Link>
                            </div>
                            {paidReimbursements.length > 0 ? (
                                paidReimbursements.map(reim => (
                                    <div key={reim._id} className='reim-item'>
                                        <h3>{reim.name}</h3>
                                        <p>{reim.description}</p>
                                        <p>Total Amount: {reim.total_amount}</p>
                                        <p>Status: {reim.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reimbursements paid yet</p>
                            )}
                        </div>
                    </div>

                    <div className='flex-cont'>
                        <div className='dash-liqs dashconts'>
                            <div className='dash-header'>
                                <h2>Your Liquidations</h2>
                                <Link to={'/liquidations'}>See More</Link>
                            </div>
                            {liquidations.length > 0 ? (
                                liquidations.map(liq => (
                                    <div key={liq._id} className='liq-item'>
                                        <h3>{liq.name}</h3>
                                        <p>{liq.description}</p>
                                        <p>Initial Amount: {liq.initial_amount}</p>
                                        <p>Remaining Amount: {liq.remaining_amount}</p>
                                        <p>Status: {liq.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No created liquidations yet</p>
                            )}
                        </div>

                        <div className='dash-returned-liqs dashconts'>
                            <div className='dash-header'>
                                <h2>Returned Liquidations</h2>
                                <Link to={'/reimbursements'}>See More</Link>
                            </div>
                            {returnedLiquidations.length > 0 ? (
                                returnedLiquidations.map(liq => (
                                    <div key={liq._id} className='liq-item'>
                                        <h3>{liq.name}</h3>
                                        <p>{liq.description}</p>
                                        <p>Total Amount: {liq.total_amount}</p>
                                        <p>Status: {liq.status}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No liquidations returned yet</p>
                            )}
                        </div>
                    </div>

                </div>
            </>)}
        </>
    );
};

export default EmpDashboard;
