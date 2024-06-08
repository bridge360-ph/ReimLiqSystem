import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageReim = () => {
    const [pendingReimbursements, setPendingReimbursements] = useState([]);
    const [approvedReimbursements, setApprovedReimbursements] = useState([]);
    const [rejectedReimbursements, setRejectedReimbursements] = useState([]);
    const [unpaidReimbursements, setUnpaidReimbursements] = useState([]);
    const [paidReimbursements, setPaidReimbursements] = useState([]);
    const [error, setError] = useState(null);
    const [selectedReimbursementId, setSelectedReimbursementId] = useState(null);
    const [reimbursementItems, setReimbursementItems] = useState([]);
    const [fullname, setFullname] = useState('');

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (fullname) {
            fetchReimbursements();
        }
    }, [fullname]);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/user/get-user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setFullname(response.data.user.fullname);
            } else {
                console.error('Failed to fetch user details');
                setError('Failed to fetch user details');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError('Error fetching user details');
        }
    };

    const fetchReimbursements = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/v1/reim/get-all-reim', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const pending = response.data.reimbursements.filter(reim => reim.status === 'pending');
                const approved = response.data.reimbursements.filter(reim => reim.status === 'accepted' && reim.comments === fullname);
                const rejected = response.data.reimbursements.filter(reim => reim.status === 'rejected' && reim.comments === fullname);
                const unpaid = approved.filter(reim => reim.paystatus === 'unpaid');
                const paid = approved.filter(reim => reim.paystatus === 'paid');
                
                setPendingReimbursements(pending);
                setApprovedReimbursements(approved);
                setRejectedReimbursements(rejected);
                setUnpaidReimbursements(unpaid);
                setPaidReimbursements(paid);
            } else {
                console.error('Failed to fetch reimbursements');
                setError('Failed to fetch reimbursements');
            }
        } catch (error) {
            console.error('Error fetching reimbursements:', error);
            setError('Error fetching reimbursements');
        }
    };

    const fetchItemsForReimbursement = (reimbursementId) => {
        if (selectedReimbursementId === reimbursementId) {
            setSelectedReimbursementId(null);
            setReimbursementItems([]);
        } else {
            setSelectedReimbursementId(reimbursementId);
            fetchReimbursementItems(reimbursementId);
        }
    };

    const fetchReimbursementItems = async (reimbursementId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/api/v1/reim/get-reim-items/${reimbursementId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setReimbursementItems(response.data.items);
            } else {
                console.error(`Failed to fetch items for reimbursement ${reimbursementId}`);
                setError(`Failed to fetch items for reimbursement ${reimbursementId}`);
            }
        } catch (error) {
            console.error(`Error fetching items for reimbursement ${reimbursementId}:`, error);
            setError(`Error fetching items for reimbursement ${reimbursementId}: ${error.message}`);
        }
    };

    const acceptReimbursement = async (reimbursementId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8080/api/v1/process/accept-reim', 
                { reimbursement_id: reimbursementId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                console.log(`Successfully accepted reimbursement ${reimbursementId}`);
                fetchReimbursements();  // Refetch reimbursements
            } else {
                console.error(`Failed to accept reimbursement ${reimbursementId}`);
                setError(`Failed to accept reimbursement ${reimbursementId}`);
            }
        } catch (error) {
            console.error(`Error accepting reimbursement ${reimbursementId}:`, error);
            setError(`Error accepting reimbursement ${reimbursementId}: ${error.message}`);
        }
    };

    const rejectReimbursement = async (reimbursementId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8080/api/v1/process/reject-reim', 
                { reimbursement_id: reimbursementId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                console.log(`Successfully rejected reimbursement ${reimbursementId}`);
                fetchReimbursements();  // Refetch reimbursements
            } else {
                console.error(`Failed to reject reimbursement ${reimbursementId}`);
                setError(`Failed to reject reimbursement ${reimbursementId}`);
            }
        } catch (error) {
            console.error(`Error rejecting reimbursement ${reimbursementId}:`, error);
            setError(`Error rejecting reimbursement ${reimbursementId}: ${error.message}`);
        }
    };

    const payReimbursement = async (reimbursementId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/api/v1/process/pay-reim', 
                { reimbursement_id: reimbursementId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                console.log(`Successfully paid reimbursement ${reimbursementId}`);
                fetchReimbursements();  // Refetch reimbursements
            } else {
                console.error(`Failed to pay reimbursement ${reimbursementId}`);
                setError(`Failed to pay reimbursement ${reimbursementId}`);
            }
        } catch (error) {
            console.error(`Error paying reimbursement ${reimbursementId}:`, error);
            setError(`Error paying reimbursement ${reimbursementId}: ${error.message}`);
        }
    };

    return (
        <div className='reim-container'>
            <div>Manage Reimbursements</div>
            {error && <div className="error">{error}</div>}
            
            <h2>Pending Reimbursements</h2>
            {pendingReimbursements.map(reimbursement => (
                <div key={reimbursement._id} className='reims'>
                    {reimbursement.name} {reimbursement.description} {reimbursement.total_price}
                    <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                    <button onClick={() => acceptReimbursement(reimbursement._id)}>Accept Reimbursement</button>
                    <button onClick={() => rejectReimbursement(reimbursement._id)}>Reject Reimbursement</button>
                    {selectedReimbursementId === reimbursement._id && (
                        <div>
                            {reimbursementItems.map(item => (
                                <li key={item._id}>
                                    Item: {item.item}<br />
                                    Price: {item.price}<br />
                                    Quantity: {item.quantity}<br />
                                    Total Price: {item.total_price}
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            ))}
    
            <h2>Approved Reimbursements</h2>
            {approvedReimbursements.map(reimbursement => (
                <div key={reimbursement._id} className='reims'>
                    {reimbursement.name} {reimbursement.description} {reimbursement.total_price}
                    <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                    <button onClick={() => rejectReimbursement(reimbursement._id)}>Reject Reimbursement</button>
                    {selectedReimbursementId === reimbursement._id && (
                        <div>
                            {reimbursementItems.map(item => (
                                <li key={item._id}>
                                    Item: {item.item}<br />
                                    Price: {item.price}<br />
                                    Quantity: {item.quantity}<br />
                                    Total Price: {item.total_price}
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            ))}
    
            <h2>Rejected Reimbursements</h2>
            {rejectedReimbursements.map(reimbursement => (
                <div key={reimbursement._id} className='reims'>
                    {reimbursement.name} {reimbursement.description} {reimbursement.total_price}
                    <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                    <button onClick={() => acceptReimbursement(reimbursement._id)}>Accept Reimbursement</button>
                    {selectedReimbursementId === reimbursement._id && (
                        <div>
                            {reimbursementItems.map(item => (
                                <li key={item._id}>
                                    Item: {item.item}<br />
                                    Price: {item.price}<br />
                                    Quantity: {item.quantity}<br />
                                    Total Price: {item.total_price}
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            ))}
    
            <h2>Unpaid Reimbursements (Approved Only)</h2>
            {unpaidReimbursements.map(reimbursement => (
                <div key={reimbursement._id} className='reims'>
                    {reimbursement.name} {reimbursement.description} {reimbursement.total_price}
                    <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                    <button onClick={() => payReimbursement(reimbursement._id)}>Pay Reimbursement</button>
                    {selectedReimbursementId === reimbursement._id && (
                        <div>
                            {reimbursementItems.map(item => (
                                <li key={item._id}>
                                    Item: {item.item}<br />
                                    Price: {item.price}<br />
                                    Quantity: {item.quantity}<br />
                                    Total Price: {item.total_price}
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            ))}
    
            <h2>Paid Reimbursements (Approved Only)</h2>
            {paidReimbursements.map(reimbursement => (
                <div key={reimbursement._id} className='reims'>
                    {reimbursement.name} {reimbursement.description} {reimbursement.total_price}
                    <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                    {selectedReimbursementId === reimbursement._id && (
                        <div>
                            {reimbursementItems.map(item => (
                                <li key={item._id}>
                                    Item: {item.item}<br />
                                    Price: {item.price}<br />
                                    Quantity: {item.quantity}<br />
                                    Total Price: {item.total_price}
                                </li>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
        </div>
    );
};

export default ManageReim;

