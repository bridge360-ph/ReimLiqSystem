import React, { useState, useEffect } from 'react';
import axios from 'axios'
import AddLiq from '../components/shared/AddLiq';
import UpdateLiq from '../components/shared/UpdateLiq';

const Liquidations = () => {
    const [AddModal, setAddModal] = useState(false);
    const [liquidations, setLiquidations] = useState([]);
    const [error, setError] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedLiq, setSelectedLiq] = useState(null);


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

            <div>
                {
                    liquidations.map(liquidation => (
                        <li key={liquidation._id}>
                            {liquidation.name}
                            {liquidation.description}
                            {liquidation.initial_amount}
                            <button onClick={() => openUpdateModal(liquidation)} > Update </button>
                        </li>
                    ))
                }
            </div>
        </>
    )
}

export default Liquidations