import React, { useState, useEffect } from 'react';
import axios from 'axios'
import AddLiq from '../components/shared/AddLiq';
import UpdateLiq from '../components/shared/UpdateLiq';
import AddLiqItem from '../components/shared/AddLiqItem';
import UpdateLiqItem from '../components/shared/UpdateLiqItem';

const Liquidations = () => {
    const [AddModal, setAddModal] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [liquidations, setLiquidations] = useState([]);
    const [selectedLiq, setSelectedLiq] = useState(null);
    const [error, setError] = useState(null);
    const [liquidationItems, setliquidationItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [returnedLiq, setReturnedLiq] = useState([]);
    const [unreturnedLiq, setunreturnedLiq] = useState([]);
    const [status, setStatus] = useState('pending');
    const [filteredLiq, setFilteredLiq] = useState([]);

    const openAddItemModal = (reimbursementId) => {
        setSelectedLiq(reimbursementId);
        setIsAddItemModalOpen(true); // Open the modal when the button is clicked
    };
    const closeAddItemModal = () => {
        setIsAddItemModalOpen(false);
    };

    useEffect(() => {
        fetchLiquidations();
    }, []);

    useEffect(() => {
        fetchLiquidations();
    }, [liquidations, status]);

    const fetchLiquidations = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get('/api/v1/liq/get-created-liq', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setLiquidations(response.data.liquidations);
                const returned = response.data.liquidations.filter(liq => liq.paystatus === 'returned')
                const unreturned = response.data.liquidations.filter(liq => liq.paystatus === 'unreturned')
                setReturnedLiq(returned)
                setunreturnedLiq(unreturned)
                filterLiquidations();
            } else {
                console.error('Failed to fetch liquidations');
                setError('Failed to fetch liquidations');
            }
        } catch (error) {
            console.error('Error fetching liquidations:', error);
            setError('Error fetching liquidations');
        }
    }

    const filterLiquidations = () => {
        if (status === 'pending') {
            setFilteredLiq(liquidations.filter(liq => liq.status === 'pending'));
        } else if (status === 'accepted') {
            setFilteredLiq(liquidations.filter(liq => liq.status === 'accepted'));
        } else if (status === 'rejected') {
            setFilteredLiq(liquidations.filter(liq => liq.status === 'rejected'));
        }
    };

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
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };


    return (
        <>
            <h1>Liquidations</h1>
            <label htmlFor="status">Filter by Status: </label>
            <select id="status" value={status} onChange={handleStatusChange}>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
            </select>
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
                <ul>
                    <h3>Filtered Reimbursements</h3>
                    {filteredLiq.length > 0 ? (
                        filteredLiq.map(liquidation => (
                            <li key={liquidation._id}>
                                {liquidation.name} - {liquidation.description}
                                {liquidation.initial_amount}
                                <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                                <button onClick={() => openUpdateModal(liquidation)}>Update</button>
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
                    ) : (
                        <p>No reimbursements found.</p>
                    )}
                </ul>
                <ul>
                    <h3>Returned Liquidations</h3>
                    {returnedLiq.length > 0 ? (
                        returnedLiq.map(liquidation => (
                            <li key={liquidation._id}>
                                {liquidation.name} - {liquidation.description}
                                {liquidation.initial_amount}
                                <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                                <button onClick={() => openUpdateModal(liquidation)}>Update</button>

                            </li>
                        ))
                    ) : (
                        <p>No Returned reimbursements yet</p>
                    )}
                </ul>

                <ul>
                    <h3>Unreturned Liquidations</h3>
                    {unreturnedLiq.length > 0 ? (
                        unreturnedLiq.map(liquidation => (
                            <li key={liquidation._id}>
                                {liquidation.name} - {liquidation.description}
                                {liquidation.initial_amount}
                                <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                                <button onClick={() => openUpdateModal(liquidation)}>Update</button>

                            </li>
                        ))
                    ) : (
                        <p>The reimbursement must be accepted first</p>
                    )}
                </ul>
            </div>
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