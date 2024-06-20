import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddReim from '../components/shared/AddReim.js';
import UpdateReim from '../components/shared/UpdateReim.js';
import AddReimItem from '../components/shared/AddReimItem.js';
import UpdateReimItem from '../components/shared/UpdateReimItem.js';
import '../styles/reim.css';
import Spinner from '../components/shared/Spinner.js';

const Reimbursements = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [selectedReimbursement, setSelectedReimbursement] = useState(null);
    const [reimbursements, setReimbursements] = useState([]);
    const [paidReimbursements, setPaidReimbursements] = useState([]);
    const [unpaidReimbursements, setUnpaidReimbursements] = useState([]);
    const [error, setError] = useState(null);
    const [selectedReimbursementId, setSelectedReimbursementId] = useState(null);
    const [reimbursementItems, setReimbursementItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [status, setStatus] = useState('pending');
    const [filteredReimbursements, setFilteredReimbursements] = useState([]);
    const [showItemsReimbursementId, setShowItemsReimbursementId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReimbursements();
    }, []);

    useEffect(() => {
        filterReimbursements();
    }, [reimbursements, status]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleStatusChange = (e) => setStatus(e.target.value);

    const openUpdateModal = (reimbursement) => {
        setSelectedReimbursement(reimbursement);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    const openAddItemModal = (reimbursementId, e) => {
        e.stopPropagation();
        setSelectedReimbursementId(reimbursementId);
        setIsAddItemModalOpen(true);
    };

    const openUpdateItemModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsUpdateItemModalOpen(true);
    };

    const closeUpdateItemModal = () => setIsUpdateItemModalOpen(false);

    const closeAddItemModal = () => setIsAddItemModalOpen(false);

    const fetchReimbursements = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/v1/reim/get-created-reim', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setIsLoading(true);
            if (response.data.success) {
                const paid = response.data.reimbursements.filter(reim => reim.paystatus === 'paid');
                const unpaid = response.data.reimbursements.filter(reim => reim.paystatus !== 'paid' && reim.status === 'accepted');
                setReimbursements(response.data.reimbursements);
                setPaidReimbursements(paid);
                setUnpaidReimbursements(unpaid);
                filterReimbursements();
                setIsLoading(false)
            } else {
                console.error('Failed to fetch reimbursements');
                setError('Failed to fetch reimbursements');
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error fetching reimbursements:', error);
            setError('Error fetching reimbursements');
        }
    };

    const filterReimbursements = () => {
        if (status === 'pending') {
            setFilteredReimbursements(reimbursements.filter(reim => reim.status === 'pending'));
        } else if (status === 'accepted') {
            setFilteredReimbursements(reimbursements.filter(reim => reim.status === 'accepted'));
        } else if (status === 'rejected') {
            setFilteredReimbursements(reimbursements.filter(reim => reim.status === 'rejected'));
        }
    };

    const fetchItemsForReimbursement = (reimbursementId, e) => {
        e.stopPropagation();
        if (showItemsReimbursementId === reimbursementId) {
            setShowItemsReimbursementId(null);
            setReimbursementItems([]);
        } else {
            setShowItemsReimbursementId(reimbursementId);
            fetchReimbursementItems(reimbursementId);
        }
    };

    const fetchReimbursementItems = async (reimbursementId) => {
        const token = localStorage.getItem('token');
        try {
            setIsLoading(true)
            const response = await axios.get(`/api/v1/reim/get-reim-items/${reimbursementId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setReimbursementItems(response.data.items);
                setIsLoading(false)
            } else {
                console.error(`Failed to fetch items for reimbursement ${reimbursementId}`);
                setError(`Failed to fetch items for reimbursement ${reimbursementId}`);
                setIsLoading(false)
            }
        } catch (error) {
            console.error(`Error fetching items for reimbursement ${reimbursementId}:`, error);
            setError(`Error fetching items for reimbursement ${reimbursementId}: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/api/v1/reim/del-reim/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setReimbursements(reimbursements.filter(reimbursement => reimbursement._id !== id));
                setPaidReimbursements(paidReimbursements.filter(reimbursement => reimbursement._id !== id));
                setUnpaidReimbursements(unpaidReimbursements.filter(reimbursement => reimbursement._id !== id));
            } else {
                console.error('Failed to delete reimbursement');
                setError('Failed to delete reimbursement');
            }
        } catch (error) {
            console.error('Error deleting reimbursement:', error);
            setError('Error deleting reimbursement');
        }
    };

    const handleDeleteItem = async (itemId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`/api/v1/reim/del-reim-item/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setReimbursementItems(reimbursementItems.filter(item => item._id !== itemId));
            } else {
                console.error('Failed to delete item');
                setError('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Error deleting item');
        }
    };

    const handleUpdateItem = (itemId) => {
        setSelectedItemId(itemId);
        setIsUpdateItemModalOpen(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    return (<>
        {isLoading ? <Spinner /> : (
            <div className='reimpage'>
                <h1 className='settings-header'>Reimbursements</h1>
                <AddReim isOpen={isModalOpen} onClose={closeModal} />
                <UpdateReim
                    isOpen={isUpdateModalOpen}
                    onClose={closeUpdateModal}
                    selectedReimbursement={selectedReimbursement}
                />
                {isAddItemModalOpen && (
                    <AddReimItem
                        reimbursementId={selectedReimbursementId}
                        onClose={closeAddItemModal}
                    />
                )}
                <UpdateReimItem
                    isOpen={isUpdateItemModalOpen}
                    onClose={closeUpdateItemModal}
                    selectedItem={reimbursementItems.find(item => item._id === selectedItemId)}
                />
                <div className='reimpagecont'>
                    <button onClick={openModal} className='add-reim'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                        Add Reimbursement
                    </button>
                    <div className='flexy'>
                        <h2>Your Reimbursements</h2>
                        <div className='filt'>
                            <label htmlFor="status">Filter by Status: </label>
                            <select id="status" value={status} onChange={handleStatusChange}>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className='reim-card'>
                        {filteredReimbursements.length > 0 ? (
                            filteredReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            <p>Date Submitted: {formatDate(reimbursement.submission_date)}</p>
                                            {reimbursement.status === 'accepted' && (
                                                <p>Approval Date: {formatDate(reimbursement.approval_date)}</p>
                                            )}

                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                                            <button onClick={() => openUpdateModal(reimbursement)}>Update</button>
                                            <button onClick={(e) => openAddItemModal(reimbursement._id, e)}>Add Item</button>
                                            <button onClick={(e) => fetchItemsForReimbursement(reimbursement._id, e)}>Show Items</button>
                                        </div>
                                    </div>
                                    {showItemsReimbursementId === reimbursement._id && (
                                        isLoading ? (
                                            <Spinner /> // Show spinner while loading
                                        ) : (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Item</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Total Price</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reimbursementItems.map(item => (
                                                        <tr key={item._id}>
                                                            <td className="item-column">{item.item}</td>
                                                            <td>{item.price}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.total_price}</td>
                                                            <td>
                                                                <div className='reim-butts card-butts'>
                                                                    <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                                                                    <button onClick={() => handleUpdateItem(item._id)}>Update</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No reimbursements found.</p>
                        )}
                    </div>

                    <div className='flexy'>
                        <h2>Paid Reimbursements</h2>
                    </div>
                    {error}
                    <div className='reim-card'>

                        {paidReimbursements.length > 0 ? (
                            paidReimbursements.map(reimbursement => (
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
                                        <div className='reim-butts'>
                                            <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                                            <button onClick={(e) => fetchItemsForReimbursement(reimbursement._id, e)}>Show Items</button>
                                        </div>
                                    </div>
                                    {showItemsReimbursementId === reimbursement._id && (
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
                            ))
                        ) : (
                            <p>No paid reimbursements yet</p>
                        )}
                    </div>
                    <div className='flexy'>
                        <h2>Unpaid Reimbursements</h2>
                    </div>

                    <div className='reim-card'>
                        {unpaidReimbursements.filter(reimbursement => reimbursement.status === 'accepted').length > 0 ? (
                            unpaidReimbursements.map(reimbursement => (
                                <div key={reimbursement._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{reimbursement.name}</h3>
                                            <p>{reimbursement.description} </p>
                                            <p>Total Price: Php {reimbursement.total_price}</p>
                                            {reimbursement.status === 'accepted' && (<>
                                                <p>Approval Date: {formatDate(reimbursement.approval_date)}</p>
                                                <p>Approved by: {reimbursement.comments}</p></>
                                            )}


                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                                            <button onClick={(e) => fetchItemsForReimbursement(reimbursement._id, e)}>Show Items</button>
                                        </div>
                                    </div>
                                    {showItemsReimbursementId === reimbursement._id && (
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
                            ))
                        ) : (
                            <p>No unpaid reimbursements yet or Reimbursements are not accepted Yet</p>
                        )}
                    </div>

                </div>
            </div>)}
    </>);
};

export default Reimbursements;
