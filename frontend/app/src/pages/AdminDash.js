import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDash = () => {
    const [pendingReimbursements, setPendingReimbursements] = useState([]);
    const [pendingLiquidations, setPendingLiquidations] = useState([]);
    const [yourReimbursements, setYourReimbursements] = useState([]);
    const [yourLiquidations, setYourLiquidations] = useState([]);
    const [error, setError] = useState(null);

    const usertype = localStorage.getItem('usertype');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the usertype is not admin, navigate to empdash
        if (usertype !== 'admin') {
            navigate('/empdash');
        } else {
            fetchPendingReimbursements();
            fetchPendingLiquidations();
            fetchYourReimbursements();
            fetchYourLiquidations();
        }
    }, [usertype, navigate]);

    const fetchPendingReimbursements = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://reimapi.onrender.com/api/v1/reim/get-all-reim', {
                params: { limit: 5 }, // Limiting to 5 items per page
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const pending = response.data.reimbursements.filter(reim => reim.status === 'pending');
                setPendingReimbursements(pending);
            } else {
                console.error('Failed to fetch reimbursements');
                setError('Failed to fetch reimbursements');
            }
        } catch (error) {
            console.error('Error fetching reimbursements:', error);
            setError('Error fetching reimbursements');
        }
    };

    const fetchPendingLiquidations = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://reimapi.onrender.com/api/v1/liq/get-all-liq', {
                params: { limit: 5 }, // Limiting to 5 items per page
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const pending = response.data.liquidations.filter(liq => liq.status === 'pending');
                setPendingLiquidations(pending);
            } else {
                console.error('Failed to fetch liquidations');
                setError('Failed to fetch liquidations');
            }
        } catch (error) {
            console.error('Error fetching liquidations:', error);
            setError('Error fetching liquidations');
        }
    };

    const fetchYourReimbursements = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://reimapi.onrender.com/api/v1/reim/get-created-reim', {
                params: { limit: 3, userId }, // Fetch reimbursements created by the logged-in admin
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setYourReimbursements(response.data.reimbursements);
            } else {
                console.error('Failed to fetch your reimbursements');
                setError('Failed to fetch your reimbursements');
            }
        } catch (error) {
            console.error('Error fetching your reimbursements:', error);
            setError('Error fetching your reimbursements');
        }
    };

    const fetchYourLiquidations = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://reimapi.onrender.com/api/v1/liq/get-created-liq', {
                params: { limit: 3, userId }, // Fetch liquidations created by the logged-in admin
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setYourLiquidations(response.data.liquidations);
            } else {
                console.error('Failed to fetch your liquidations');
                setError('Failed to fetch your liquidations');
            }
        } catch (error) {
            console.error('Error fetching your liquidations:', error);
            setError('Error fetching your liquidations');
        }
    };

    return (
        <>
            {usertype === 'admin' && (
                <>
                    {error}
                    <h1 className='settings-header'>Welcome Admin!</h1>
                    <div className='dash-container'>
                        <div className='flex-cont'>
                            <div className='dash-reims dashconts'>
                                <div className='dash-header'>
                                    <h2>Reimbursement Requests</h2>
                                    <Link to={'/managereim'}>See More</Link>
                                </div>
                                {pendingReimbursements.length > 0 ? (
                                    pendingReimbursements.map(reimbursement => (
                                        <div key={reimbursement._id} className='reim-item flexy'>
                                            <div>
                                                <h3>{reimbursement.name}</h3>
                                                <p>{reimbursement.description}</p>
                                                <p>Total Price: {reimbursement.total_price}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No pending reimbursements</p>
                                )}
                            </div>

                            <div className='dash-reims dashconts'>
                                <div className='dash-header'>
                                    <h2>Your Reimbursements</h2>
                                    <Link to={'/yourreimbursements'}>See More</Link>
                                </div>
                                {yourReimbursements.length > 0 ? (
                                    yourReimbursements.map(reim => (
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

                            <div className='dash-liquidations dashconts'>
                                <div className='dash-header'>
                                    <h2>Liquidation Requests</h2>
                                    <Link to={'/manageliq'}>See More</Link>
                                </div>
                                {pendingLiquidations.length > 0 ? (
                                    pendingLiquidations.map(liquidation => (
                                        <div key={liquidation._id} className='liq-item flexy'>
                                            <div>
                                                <h3>{liquidation.name}</h3>
                                                <p>{liquidation.description}</p>
                                                <p>Total Amount: {liquidation.total_price}</p>
                                                <p>Status: {liquidation.status}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No pending liquidations</p>
                                )}
                            </div>

                            <div className='dash-liquidations dashconts'>
                                <div className='dash-header'>
                                    <h2>Your Liquidations</h2>
                                    <Link to={'/yourliquidations'}>See More</Link>
                                </div>
                                {yourLiquidations.length > 0 ? (
                                    yourLiquidations.map(liq => (
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
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default AdminDash;
