import React, { useState, useEffect } from 'react';
import axios from 'axios'
import AddLiq from '../components/shared/AddLiq';
import UpdateLiq from '../components/shared/UpdateLiq';
import AddLiqItem from '../components/shared/AddLiqItem';
import UpdateLiqItem from '../components/shared/UpdateLiqItem';

const Liquidations = () => {
    const [AddModal, setAddModal] = useState(false);
    const [liquidations, setLiquidations] = useState([]);
    const [error, setError] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedLiq, setSelectedLiq] = useState(null);

    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const openAddItemModal = (reimbursementId) => {
        setSelectedLiq(reimbursementId);
        setIsAddItemModalOpen(true); // Open the modal when the button is clicked
    };
    const closeAddItemModal = () => {
        setIsAddItemModalOpen(false);
    };

    const [liquidationItems, setliquidationItems] = useState([]);
    const fetchItemsForLiquidation = (liquidationId) => {
        if (selectedLiq === liquidationId) {
            // If the clicked reimbursement is already selected, hide the items
            setSelectedLiq(null);
            // Reset the reimbursementItems state to an empty array
            setliquidationItems([]);
        } else {
            // Otherwise, fetch the items for the reimbursement
            setSelectedLiq(liquidationId);
            console.log(liquidationId)
            fetchLiquidationItems(liquidationId);
        }
    };

    const fetchLiquidationItems = async (liquidationId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/api/v1/liq/get-all-items/${liquidationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setliquidationItems(response.data.items);
            } else {
                console.error(`Failed to fetch items for liquidation ${liquidationId}`);
                setError(`Failed to fetch items for liquidation ${liquidationId}`);
            }
        } catch (error) {
            console.error(`Error fetching items for liquidation ${liquidationId}:`, error);
            setError(`Error fetching items for liquidation ${liquidationId}: ${error.message}`);
        }
    };



    const openAddLiqModal = () => {
        setAddModal(true);
    };

    const closeAddLiqModal = () => {
        setAddModal(false);
    };

    useEffect(() => {
        fetchLiquidations();
    }, []);


    const openUpdateModal = (liquidations) => {
        setSelectedLiq(liquidations);
        setIsUpdateModalOpen(true);
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };



    const fetchLiquidations = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get('/api/v1/liq/get-created-liq', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setLiquidations(response.data.Liq);
            } else {
                console.error('Failed to fetch liquidations');
                setError('Failed to fetch liquidations');
            }
        } catch (error) {
            console.error('Error fetching liquidations:', error);
            setError('Error fetching liquidations');
        }
    }

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`/api/v1/liq/del-liq/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                window.location.reload()
            } else {
                console.error('Failed to delete liquidation');
                setError('Failed to delete liquidation');
            }
        } catch (error) {
            console.error('Error deleting liquidation:', error);
            setError('Error deleting liquidation');
        }
    };


    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const handleUpdateItem = (itemId) => {
        setSelectedItemId(itemId);
        setIsUpdateItemModalOpen(true); // Open the UpdateReimItem modal
    };

    const closeUpdateItemModal = () => {
        setIsUpdateItemModalOpen(false); // Close the UpdateReimItem modal
    };


    const handleDeleteItem = async (itemId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`/api/v1/liq/del-liq-item/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                // Remove the deleted item from the list
                setliquidationItems(liquidationItems.filter(item => item._id !== itemId));
            } else {
                console.error('Failed to delete item');
                setError('Failed to delete item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            setError('Error deleting item');
        }
    };


    return (
        <>
            <h1>Liquidations</h1>
            <button onClick={openAddLiqModal}>Add Liquidation</button>
            <AddLiq isOpen={AddModal} onClose={closeAddLiqModal} />
            <UpdateLiq
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                selectedLiquidation={selectedLiq}
            />

            {isAddItemModalOpen && (
                <AddLiqItem
                    liquidationId={selectedLiq}
                    onClose={closeAddItemModal}
                />
            )}

            <UpdateLiqItem
                isOpen={isUpdateItemModalOpen}
                onClose={closeUpdateItemModal}
                selectedItem={liquidationItems.find(item => item._id === selectedItemId)}
            />


            <div>
                {
                    liquidations.map(liquidation => (
                        <li key={liquidation._id}>
                            {liquidation.name}
                            {liquidation.description}
                            {liquidation.initial_amount}
                            <button onClick={() => openUpdateModal(liquidation)} > Update </button>
                            <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                            <button onClick={() => openAddItemModal(liquidation._id)}>Add Item</button>
                            <button onClick={() => fetchItemsForLiquidation(liquidation._id)}>Show Items</button>


                            {selectedLiq === liquidation._id && (
                                <ul>
                                    {liquidationItems.map(item => (
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
                    ))
                }
            </div>
        </>
    )
}

export default Liquidations