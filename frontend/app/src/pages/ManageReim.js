import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/shared/Spinner';

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
    const [isLoading, setIsLoading] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

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
            setIsLoading(true)

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
                setIsLoading(false)
            } else {
                console.error('Failed to fetch reimbursements');
                setError('Failed to fetch reimbursements');
            }
        } catch (error) {
            console.error('Error fetching reimbursements:', error);
            setError('Error fetching reimbursements');
            setIsLoading(true)
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className='reimpage'>
                    {error}
                    <h1 className='settings-header'>Manage Reimbursements</h1>
                    <div className='reimpagecont'>
                        <div className='flexy'>
                            <h2>Pending Reimbursements</h2>
                        </div>
                        <div className='reim-card'>
                            {pendingReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            <p>Date Submitted: {formatDate(reimbursement.submission_date)}</p>
                                            {showReceipt && reimbursement.receipt !== 'none' && (
                                                <div className='modal-overlay receipt'>
                                                    <div className='modal-content'>
                                                        <button className='modal-close' onClick={() => setShowReceipt(!showReceipt)}>
                                                            {showReceipt ? 'x' : 'Show Receipt'}
                                                        </button>
                                                        <img className='imgrec' src={`/assets/images/uploads/${reimbursement.receipt}`} alt='Receipt' />
                                                    </div>

                                                </div>

                                            )}
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                                            <button onClick={() => acceptReimbursement(reimbursement._id)}>Accept Reimbursement</button>
                                            <button onClick={() => rejectReimbursement(reimbursement._id)}>Reject Reimbursement</button>
                                            {
                                                reimbursement.receipt !== 'none' && (
                                                    <button onClick={() => setShowReceipt(!showReceipt)}>
                                                        {showReceipt ? 'Hide Receipt' : 'Show Receipt'}
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {selectedReimbursementId === reimbursement._id && (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reimbursementItems.map(item => (
                                                    <tr key={item._id}>
                                                        <td className="item-column">{item.item}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.total_price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='flexy'>
                            <h2>Approved Reimbursements</h2>
                        </div>
                        <div className='reim-card'>
                            {approvedReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            <p>Approval Date: {formatDate(reimbursement.approval_date)}</p>
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                                            <button onClick={() => rejectReimbursement(reimbursement._id)}>Change to Reject</button>
                                        </div>
                                    </div>
                                    {selectedReimbursementId === reimbursement._id && (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reimbursementItems.map(item => (
                                                    <tr key={item._id}>
                                                        <td className="item-column">{item.item}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.total_price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='flexy'>
                            <h2>Rejected Reimbursements</h2>
                        </div>
                        <div className='reim-card'>
                            {rejectedReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            <p>Approval Date: {formatDate(reimbursement.approval_date)}</p>
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
                                            <button onClick={() => acceptReimbursement(reimbursement._id)}>Change to Approve</button>
                                        </div>
                                    </div>
                                    {selectedReimbursementId === reimbursement._id && (
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reimbursementItems.map(item => (
                                                    <tr key={item._id}>
                                                        <td className="item-column">{item.item}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.total_price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='flexy'>
                            <h2>Unpaid Reimbursements</h2>
                        </div>
                        <div className='reim-card'>
                            {unpaidReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            <p>Approval Date: {formatDate(reimbursement.approval_date)}</p>
                                            <p>Approved by: {reimbursement.comments}</p>
                                        </div>
                                        <div className='reim-butts'>

                                            <button onClick={() => payReimbursement(reimbursement._id)}>Pay Reimbursement</button>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className='flexy'>
                            <h2>Paid Reimbursements</h2>
                        </div>
                        <div className='reim-card'>
                            {paidReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            <p>Approved by: {reimbursement.comments}</p>
                                            <p>Approval Date: {formatDate(reimbursement.approval_date)}</p>
                                            <p>Payment Date : {formatDate(reimbursement.payment_date)}</p>
                                        </div>

                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageReim;

