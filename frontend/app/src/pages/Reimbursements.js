import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddReim from '../components/shared/AddReim.js';
import UpdateReim from '../components/shared/UpdateReim.js';
import AddReimItem from '../components/shared/AddReimItem.js';
import UpdateReimItem from '../components/shared/UpdateReimItem.js';
import '../styles/reim.css'

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

    useEffect(() => {
        fetchReimbursements();
    }, []);

    useEffect(() => {
        filterReimbursements();
    }, [reimbursements, status]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const openUpdateModal = (reimbursement) => {
        setSelectedReimbursement(reimbursement);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const openAddItemModal = (reimbursementId) => {
        setSelectedReimbursementId(reimbursementId);
        setIsAddItemModalOpen(true);
    };

    const openUpdateItemModal = (itemId) => {
        setSelectedItemId(itemId);
        setIsUpdateItemModalOpen(true);
    };

    const closeUpdateItemModal = () => {
        setIsUpdateItemModalOpen(false);
    };

    const closeAddItemModal = () => {
        setIsAddItemModalOpen(false);
    };

    const fetchReimbursements = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get('/api/v1/reim/get-created-reim', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const paid = response.data.reimbursements.filter(reim => reim.status === 'paid');
                const unpaid = response.data.reimbursements.filter(reim => reim.status !== 'paid');
                setReimbursements(response.data.reimbursements);
                setPaidReimbursements(paid);
                setUnpaidReimbursements(unpaid);
                filterReimbursements(); // Call filter function initially
            } else {
                console.error('Failed to fetch reimbursements');
                setError('Failed to fetch reimbursements');
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

    return (
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

                <button onClick={openModal} className='add-reim'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>Add Reimbursement</button>

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
                                    <div>
                                        <p>Name: {reimbursement.name}</p>
                                        <p>Description: {reimbursement.description} </p>
                                        <p>Total Price: Php {reimbursement.total_price}</p>
                                    </div>
                                    <div className='reim-butts'>
                                        <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                                        <button onClick={() => openUpdateModal(reimbursement)}>Update</button>
                                        <button onClick={() => openAddItemModal(reimbursement._id)}>Add Item</button>
                                        <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>
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
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reimbursementItems.map(item => (
                                                <tr key={item._id}>
                                                    <td>{item.item}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.total_price}</td>
                                                    <td>
                                                        <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
                                                        <button onClick={() => handleUpdateItem(item._id)}>Update</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No reimbursements found.</p>
                    )}
                </div>
                <ul>
                    <h3>Paid Reimbursements</h3>
                    {paidReimbursements.length > 0 ? (
                        paidReimbursements.map(reimbursement => (
                            <li key={reimbursement._id}>
                                {reimbursement.name} - {reimbursement.description}
                                {reimbursement.total_price}
                                <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                                <button onClick={() => openUpdateModal(reimbursement)}>Update</button>

                            </li>
                        ))
                    ) : (
                        <p>No paid reimbursements yet</p>
                    )}
                </ul>
                <ul>
                    <h3>Unpaid Reimbursements</h3>
                    {unpaidReimbursements.length > 0 ? (
                        unpaidReimbursements.map(reimbursement => (
                            <li key={reimbursement._id}>
                                {reimbursement.name} - {reimbursement.description}
                                {reimbursement.total_price}
                                <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                                <button onClick={() => openUpdateModal(reimbursement)}>Update</button>

                            </li>
                        ))
                    ) : (
                        <p>The reimbursement must be accepted first</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Reimbursements;
