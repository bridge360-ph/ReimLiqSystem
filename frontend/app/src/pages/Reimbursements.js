import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddReim from '../components/shared/AddReim.js';
import UpdateReim from '../components/shared/UpdateReim.js';
import AddReimItem from '../components/shared/AddReimItem.js';
import UpdateReimItem from '../components/shared/UpdateReimItem.js';


const Reimbursements = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [selectedReimbursement, setSelectedReimbursement] = useState(null);
    const [reimbursements, setReimbursements] = useState([]);
    const [error, setError] = useState(null);
    const [selectedReimbursementId, setSelectedReimbursementId] = useState(null);
    const [reimbursementItems, setReimbursementItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        fetchReimbursements();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
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
        setIsAddItemModalOpen(true); // Open the modal when the button is clicked
    };

    const openUpdateItemModal = (itemId) => {
        setSelectedItemId(itemId); // Set the selected item ID
        setIsUpdateItemModalOpen(true); // Open the UpdateReimItem modal
    };

    const closeUpdateItemModal = () => {
        setIsUpdateItemModalOpen(false); // Close the UpdateReimItem modal
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
                setReimbursements(response.data.reimbursements);
            } else {
                console.error('Failed to fetch reimbursements');
                setError('Failed to fetch reimbursements');
            }
        } catch (error) {
            console.error('Error fetching reimbursements:', error);
            setError('Error fetching reimbursements');
        }
    };

    // Function to fetch reimbursement items when "Show Items" button is clicked
    const fetchItemsForReimbursement = (reimbursementId) => {
        if (selectedReimbursementId === reimbursementId) {
            // If the clicked reimbursement is already selected, hide the items
            setSelectedReimbursementId(null);
            // Reset the reimbursementItems state to an empty array
            setReimbursementItems([]);
        } else {
            // Otherwise, fetch the items for the reimbursement
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
                // Remove the deleted reimbursement from the list
                setReimbursements(reimbursements.filter(reimbursement => reimbursement._id !== id));
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
                // Remove the deleted item from the list
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
        setIsUpdateItemModalOpen(true); // Open the UpdateReimItem modal
    };



    return (
        <div>
            <h1>Reimbursements</h1>
            <button onClick={openModal}>Add Reimbursement</button>
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

            <div>
                <h2>Reimbursement List</h2>
                <ul>
                    {reimbursements.map(reimbursement => (
                        <li key={reimbursement._id}>
                            {reimbursement.name} - {reimbursement.description}
                            {reimbursement.total_price}
                            <button onClick={() => handleDelete(reimbursement._id)}>Delete</button>
                            <button onClick={() => openUpdateModal(reimbursement)}>Update</button>
                            <button onClick={() => openAddItemModal(reimbursement._id)}>Add Item</button>
                            <button onClick={() => fetchItemsForReimbursement(reimbursement._id)}>Show Items</button>



                            {selectedReimbursementId === reimbursement._id && (
                                <ul>
                                    {reimbursementItems.map(item => (
                                        <li key={item._id}>
                                            Item: {item.item}<br />
                                            Price: {item.price}<br />
                                            Quantity: {item.quantity}<br />
                                            Total Price: {item.total_price}
                                            <button onClick={() => handleDeleteItem(item._id)}>Delete Item</button>
                                            <button onClick={() => handleUpdateItem(item._id)}>Update</button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
};

export default Reimbursements;