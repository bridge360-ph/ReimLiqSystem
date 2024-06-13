import React, { useState, useEffect } from 'react';
import axios from 'axios'
import AddLiq from '../components/shared/AddLiq';
import UpdateLiq from '../components/shared/UpdateLiq';
import AddLiqItem from '../components/shared/AddLiqItem';
import UpdateLiqItem from '../components/shared/UpdateLiqItem';
import Spinner from '../components/shared/Spinner.js';

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
    const [isLoading, setIsLoading] = useState(true);
    const [showItemsLiqId, setshowItemsLiqId] = useState(null);
    const [isFiltering, setIsFiltering] = useState(false); // New state for filtering


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
            setIsLoading(true);
            if (response.data.success) {
                setLiquidations(response.data.liquidations);
                const returned = response.data.liquidations.filter(liq => liq.paystatus === 'returned')
                const unreturned = response.data.liquidations.filter(liq => liq.paystatus === 'unreturned')
                setReturnedLiq(returned)
                setunreturnedLiq(unreturned)
                filterLiquidations();
                setIsLoading(false);
            } else {
                console.error('Failed to fetch liquidations');
                setError('Failed to fetch liquidations');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching liquidations:', error);
            setError('Error fetching liquidations');
        }
    }

    const filterLiquidations = () => {
        setIsFiltering(true);
        if (status === 'pending') {
            setFilteredLiq(liquidations.filter(liq => liq.status === 'pending'));
        } else if (status === 'accepted') {
            setFilteredLiq(liquidations.filter(liq => liq.status === 'accepted'));
        } else if (status === 'rejected') {
            setFilteredLiq(liquidations.filter(liq => liq.status === 'rejected'));
        }
        setIsFiltering(false);
    };


    const fetchItemsForLiquidation = (liquidationId, e) => {
        if (showItemsLiqId === liquidationId) {
            // If the clicked reimbursement is already selected, hide the items
            setshowItemsLiqId(null);
            // Reset the reimbursementItems state to an empty array
            setliquidationItems([]);
        } else {
            // Otherwise, fetch the items for the reimbursement
            setshowItemsLiqId(liquidationId);
            console.log(liquidationId)
            fetchLiquidationItems(liquidationId);
        }
    };

    const fetchLiquidationItems = async (liquidationId) => {
        const token = localStorage.getItem('token');
        try {
            setIsLoading(true);
            const response = await axios.get(`/api/v1/liq/get-all-items/${liquidationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setliquidationItems(response.data.items);
                setIsLoading(false);
            } else {
                console.error(`Failed to fetch items for liquidation ${liquidationId}`);
                setError(`Failed to fetch items for liquidation ${liquidationId}`);
                setIsLoading(false);
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
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            {isLoading ? <Spinner /> : (
                <div className='reimpage'>
                    <h1 className='settings-header'>Liquidations</h1>
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
                    <div className='reimpagecont'>
                        <button className='add-reim' onClick={openAddLiqModal}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>Add Liquidation</button>

                        <div className='flexy'>
                            <h2>Your Liquidations</h2>
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
                            {isFiltering ? (
                                <Spinner /> // Show spinner while filtering
                            ) : (
                                filteredLiq.length > 0 ? (
                                    filteredLiq.map(liquidation => (
                                        <div key={liquidation._id} className='reimindiv'>
                                            <div className='flexy'>
                                                <div className='reim-info'>
                                                    <h3>{liquidation.name}</h3>
                                                    <p>{liquidation.description} </p>
                                                    <p>Total Amount: Php {liquidation.total_price}</p>
                                                    <p>Remaining Amount: {liquidation.remaining_amount}</p>
                                                    <p>Date Submitted: {formatDate(liquidation.submission_date)}</p>

                                                    {liquidation.status === 'accepted' && (
                                                        <p>Approval Date: {formatDate(liquidation.approval_date)}</p>
                                                    )}
                                                </div>

                                                <div className='reim-butts'>
                                                    <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                                                    <button onClick={() => openUpdateModal(liquidation)}>Update</button>
                                                    <button onClick={() => openAddItemModal(liquidation._id)}>Add Item</button>
                                                    <button onClick={() => fetchItemsForLiquidation(liquidation._id)}>Show Items</button>
                                                </div>
                                            </div>

                                            {showItemsLiqId === liquidation._id && (
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
                                                            {liquidationItems.map(item => (
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
                                    <p>No liquidations found.</p>
                                )
                            )}
                        </div>


                        <div className='flexy'>
                            <h2>Returned Liquidations</h2>
                        </div>

                        <div className='reim-card'>

                            {returnedLiq.length > 0 ? (
                                returnedLiq.map(liquidation => (
                                    <div key={liquidation._id} className='reimindiv'>
                                        <div className='flexy'>
                                            <div className='reim-info'>
                                                <h3>{liquidation.name}</h3>
                                                <p>{liquidation.description} </p>
                                                <p>Total Price: Php {liquidation.total_price}</p>
                                                <p>Approved by: {liquidation.comments}</p>
                                                <p>Approval Date: {formatDate(liquidation.approval_date)}</p>
                                                <p>Payment Date : {formatDate(liquidation.payment_date)}</p>

                                            </div>
                                            <div className='reim-butts'>
                                                <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                                                <button onClick={() => fetchItemsForLiquidation(liquidation._id)}>Show Items</button>
                                            </div>
                                        </div>


                                        {showItemsLiqId === liquidation._id && (
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
                                                        {liquidationItems.map(item => (
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
                                <p>No Returned reimbursements yet</p>
                            )}
                        </div>
                        <div className='flexy'>
                            <h2>Unreturned Liquidations</h2>
                        </div>
                        <div className='reim-card'>
                            {unreturnedLiq.filter(liquidation => liquidation.status === 'accepted').length > 0 ? (
                                unreturnedLiq.filter(liquidation => liquidation.status === 'accepted').map(liquidation => (
                                    <div key={liquidation._id} className='reimindiv'>
                                        <div className='flexy'>
                                            <div className='reim-info'>
                                                <h3>{liquidation.name}</h3>
                                                <p>{liquidation.description} </p>
                                                <p>Initial Amount: Php {liquidation.initial_amount}</p>
                                                <p>Remaining Amount: {liquidation.remaining_amount}</p>
                                                <p>Approval Date: {formatDate(liquidation.approval_date)}</p>
                                            </div>
                                            <div className='reim-butts'>
                                                <button onClick={() => handleDelete(liquidation._id)}>Delete</button>
                                                <button onClick={() => fetchItemsForLiquidation(liquidation._id)}>Show Items</button>
                                            </div>
                                        </div>
                                        {showItemsLiqId === liquidation._id && (
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
                                                        {liquidationItems.map(item => (
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
                                <p>The reimbursement must be accepted first</p>
                            )}
                        </div>




                    </div>

                </div>)}

        </>
    )
}

export default Liquidations