import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/shared/Spinner.js';

const ManageLiq = () => {
    const [pendingLiquidations, setPendingLiquidations] = useState([])
    const [acceptedLiquidations, setacceptedLiquidations] = useState([])
    const [rejectedLiquidations, setrejectedLiquidations] = useState([])
    const [unreturnedLiquidations, setunreturnedLiquidations] = useState([])
    const [returnedLiquidations, setreturnedLiquidations] = useState([])
    const [error, setError] = useState(null);
    const [selectedLiquidationId, setselectedLiquidationId] = useState(null);
    const [liquidationItems, setliquidationItems] = useState([]);
    const [fullname, setFullname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchUserDetails();
    }, [])

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

    useEffect(() => {
        if (fullname) {
            fetchLiquidations();
        }
    }, [fullname]);

    const fetchLiquidations = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/api/v1/liq/get-all-liq', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setIsLoading(true)

            if (response.data.success) {
                const pending = response.data.liquidations.filter(liq => liq.status === 'pending');
                const approved = response.data.liquidations.filter(liq => liq.status === 'accepted' && liq.comments === fullname);
                const rejected = response.data.liquidations.filter(liq => liq.status === 'rejected' && liq.comments === fullname);
                const unpaid = approved.filter(liq => liq.paystatus === 'unreturned' && liq.status === 'accepted');
                const paid = approved.filter(liq => liq.paystatus === 'returned');
                setPendingLiquidations(pending);
                setacceptedLiquidations(approved);
                setrejectedLiquidations(rejected);
                setunreturnedLiquidations(unpaid);
                setreturnedLiquidations(paid);
                setIsLoading(false)
            } else {
                console.error('Failed to fetch liquidations');
                setError('Failed to fetch liquidations');
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error fetching liquidations:', error);
            setError('Error fetching liquidations');
        }
    };

    const fetchItemsforLiq = (liquidationId) => {
        if (selectedLiquidationId === liquidationId) {
            setselectedLiquidationId(null);
            setliquidationItems([]);
        } else {
            setselectedLiquidationId(liquidationId);
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
                console.error(`Failed to fetch items for liquidations ${liquidationId}`);
                setError(`Failed to fetch items for liquidations ${liquidationId}`);
            }
        } catch (error) {
            console.error(`Error fetching items for liquidations ${liquidationId}:`, error);
            setError(`Error fetching items for liquidations ${liquidationId}: ${error.message}`);
        }
    };

    const acceptLiq = async (liquidationId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8080/api/v1/process/accept-liq',
                { liquidation_id: liquidationId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                console.log(`Successfully accepted liquidation ${liquidationId}`);
                fetchLiquidations();  // Refetch reimbursements
            } else {
                console.error(`Failed to accept liquidation ${liquidationId}`);
                setError(`Failed to accept liquidation ${liquidationId}`);
            }
        } catch (error) {
            console.error(`Error accepting liquidation ${liquidationId}:`, error);
            setError(`Error accepting liquidation ${liquidationId}: ${error.message}`);
        }
    };

    const rejectLiq = async (liquidationId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:8080/api/v1/process/reject-liq',
                { liquidation_id: liquidationId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                console.log(`Successfully rejected liquidation ${liquidationId}`);
                fetchLiquidations();  // Refetch reimbursements
            } else {
                console.error(`Failed to reject liquidation ${liquidationId}`);
                setError(`Failed to reject liquidation ${liquidationId}`);
            }
        } catch (error) {
            console.error(`Error rejecting liquidation ${liquidationId}:`, error);
            setError(`Error rejecting liquidation ${liquidationId}: ${error.message}`);
        }
    };

    const returnLiq = async (liquidationId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('/api/v1/process/return-liq',
                { liquidation_id: liquidationId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                console.log(`Successfully paid liquidation ${liquidationId}`);
                fetchLiquidations();  // Refetch reimbursements
            } else {
                console.error(`Failed to pay liquidation ${liquidationId}`);
                setError(`Failed to pay liquidation ${liquidationId}`);
            }
        } catch (error) {
            console.error(`Error paying liquidation ${liquidationId}:`, error);
            setError(`Error paying liquidation ${liquidationId}: ${error.message}`);
        }
    };



    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className='reimpage'>
                    <h1 className='settings-header'>Manage Liquidations</h1>
                    <div className='reimpagecont'>
                        <div className='flexy'>
                            <h2>Pending Liquidations</h2>
                        </div>
                        <div className='reim-card'>
                            {pendingLiquidations.map(liquidation => (
                                <div key={liquidation._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{liquidation.name}</h3>
                                            <p>{liquidation.description} </p>
                                            <p>Total Price: Php {liquidation.total_price}</p>
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsforLiq(liquidation._id)}>Show Items</button>
                                            <button onClick={() => acceptLiq(liquidation._id)}>Accept Liquidation</button>
                                            <button onClick={() => rejectLiq(liquidation._id)}>Reject Liquidation</button>
                                        </div>
                                    </div>
                                    {selectedLiquidationId === liquidation._id && (
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
                                                {liquidationItems.map(item => (
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
                        {error}
                        <div className='flexy'>
                            <h2>Approved Liquidations</h2>
                        </div>
                        <div className='reim-card'>
                            {acceptedLiquidations.map(liquidation => (
                                <div key={liquidation._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{liquidation.name}</h3>
                                            <p>{liquidation.description} </p>
                                            <p>Total Price: Php {liquidation.total_price}</p>
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsforLiq(liquidation._id)}>Show Items</button>
                                            <button onClick={() => returnLiq(liquidation._id)}>Return Liquidation</button>
                                        </div>
                                    </div>
                                    {selectedLiquidationId === liquidation._id && (
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
                                                {liquidationItems.map(item => (
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
                            <h2>Rejected Liquidations</h2>
                        </div>
                        <div className='reim-card'>
                            {rejectedLiquidations.map(liquidation => (
                                <div key={liquidation._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{liquidation.name}</h3>
                                            <p>{liquidation.description} </p>
                                            <p>Total Price: Php {liquidation.total_price}</p>
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsforLiq(liquidation._id)}>Show Items</button>
                                            <button onClick={() => acceptLiq(liquidation._id)}>Change to Accept</button>
                                        </div>
                                    </div>
                                    {selectedLiquidationId === liquidation._id && (
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
                                                {liquidationItems.map(item => (
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
                            <h2>Unreturned Liquidations</h2>
                        </div>
                        <div className='reim-card'>
                            {unreturnedLiquidations.map(liquidation => (
                                <div key={liquidation._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{liquidation.name}</h3>
                                            <p>{liquidation.description} </p>
                                            <p>Total Price: Php {liquidation.total_price}</p>
                                        </div>
                                        <div className='reim-butts'>
                                            <button onClick={() => fetchItemsforLiq(liquidation._id)}>Show Items</button>
                                            <button onClick={() => returnLiq(liquidation._id)}>Return Liquidation</button>
                                        </div>
                                    </div>
                                    {selectedLiquidationId === liquidation._id && (
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
                                                {liquidationItems.map(item => (
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
                            <h2>Returned Liquidations</h2>
                        </div>
                        <div className='reim-card'>
                            {returnedLiquidations.map(liquidation => (
                                <div key={liquidation._id} className='reimindiv'>
                                    <div className='flexy'>
                                        <div className='reim-info'>
                                            <h3>{liquidation.name}</h3>
                                            <p>{liquidation.description} </p>
                                            <p>Total Price: Php {liquidation.total_price}</p>
                                        </div>
                                    </div>
                                    {selectedLiquidationId === liquidation._id && (
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
                                                {liquidationItems.map(item => (
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
                    </div>
                </div>
            )}
        </>
    );

}

export default ManageLiq