import Reimbursement from '../models/reimbursement.js';
import Admin from '../models/admin.js';
import Liquidation from '../models/liquidation.js'

export const acceptReimbursementController = async (req, res, next) => {
    try {
        const { reimbursement_id } = req.body;
        const { userId, userType } = req.user;

        // Check if the user is an admin
        if (userType !== 'admin') {
            return res.status(403).json({ message: 'Only admins can accept or reject reimbursements' });
        }

        // Find the admin's fullname
        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Find the reimbursement
        const reimbursement = await Reimbursement.findById(reimbursement_id);
        if (!reimbursement) {
            return res.status(404).json({ message: 'Reimbursement not found' });
        }

        // Update the reimbursement status to "approved"
        reimbursement.status = 'accepted';
        reimbursement.approval_date = new Date();
        reimbursement.comments = admin.fullname;

        // Save the updated reimbursement
        await reimbursement.save();

        // Update the admin's approved_reim array
        admin.approved_reim.push(reimbursement_id);
        admin.unpaid_reim.push(reimbursement_id);
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Reimbursement accepted successfully',
            reimbursement,
        });
    } catch (error) {
        next(error);
    }
};



export const rejectReimbursementController = async (req, res, next) => {
    try {
        const { reimbursement_id } = req.body;
        const { userId, userType } = req.user;

        // Check if the user is an admin
        if (userType !== 'admin') {
            return res.status(403).json({ message: 'Only admins can accept or reject reimbursements' });
        }

        // Find the admin's fullname
        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Find the reimbursement
        const reimbursement = await Reimbursement.findById(reimbursement_id);
        if (!reimbursement) {
            return res.status(404).json({ message: 'Reimbursement not found' });
        }

        // Update the reimbursement status to "approved"
        reimbursement.status = 'rejected';
        reimbursement.approval_date = new Date();
        reimbursement.comments = admin.fullname;

        admin.rejected_reim.push(reimbursement_id);
        await admin.save();

        // Save the updated reimbursement
        await reimbursement.save();

        res.status(200).json({
            success: true,
            message: 'Reimbursement rejected successfully',
            reimbursement,
        });
    } catch (error) {
        next(error);
    }
};

export const payReim = async (req, res, next) => {
    try {
        const { reimbursement_id } = req.body;
        const { userId, userType } = req.user;

        if (userType !== 'admin') {
            return res.status(403).json({ message: 'Only admins can accept or reject reimbursements' });
        }

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const reimbursement = await Reimbursement.findById(reimbursement_id);
        if (!reimbursement) {
            return res.status(404).json({ message: 'Reimbursement not found' });
        }

        reimbursement.paystatus = 'paid';
        reimbursement.payment_date = new Date();
        await reimbursement.save();

        admin.paid_reim.push(reimbursement_id);
        admin.unpaid_reim.pull(reimbursement_id);
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Reimbursement paid successfully',
            reimbursement,
        });
    } catch (error) {

    }
}


export const acceptLiq = async (req, res, next) => {
    try {
        const { liquidation_id } = req.body;
        const { userId, userType } = req.user;

        if (userType !== 'admin') {
            return res.status(403).json({ message: 'Only admins can accept or reject liquidation' });
        }

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const liquidation = await Liquidation.findById(liquidation_id);
        if (!liquidation) {
            return res.status(404).json({ message: 'Reimbursement not found' });
        }

        liquidation.status = 'accepted'
        liquidation.approval_date = new Date()
        liquidation.comments = admin.fullname;

        await liquidation.save()

        admin.approved_liq.push(liquidation_id);
        admin.unreturned_liq.push(liquidation_id)
        await admin.save()

        res.status(200).json({
            success: true,
            message: 'Liquidation accepted successfully',
            liquidation,
        });



    } catch (error) {
        next(error)
    }
}


export const rejectLiq = async (req, res, next) => {
    try {
        const { liquidation_id } = req.body;
        const { userId, userType } = req.user;

        if (userType !== 'admin') {
            return res.status(403).json({ message: 'Only admins can accept or reject liquidations' });
        }

        // Find the admin's fullname
        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const liquidation = await Liquidation.findById(liquidation_id);
        if (!liquidation) {
            return res.status(404).json({ message: 'Reimbursement not found' });
        }

        liquidation.status = 'rejected';
        liquidation.approval_date = new Date();
        liquidation.comments = admin.fullname;

        admin.rejected_liq.push(liquidation_id);
        await admin.save();
        await liquidation.save();
        res.status(200).json({
            success: true,
            message: 'Reimbursement rejected successfully',
            liquidation,
        });

    } catch (error) {
        next(error)
    }
}

export const returnLiq = async (req, res, next) => {
    try {
        const { liquidation_id } = req.body;
        const { userId, userType } = req.user;

        console.log('Request received for returning liquidation:', liquidation_id);

        if (userType !== 'admin') {
            return res.status(403).json({ message: 'Only admins can accept or reject liquidation' });
        }

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const liquidation = await Liquidation.findById(liquidation_id);
        if (!liquidation) {
            return res.status(404).json({ message: 'Liquidation not found' });
        }

        liquidation.paystatus = 'returned';
        liquidation.payment_date = new Date();
        await liquidation.save();

        admin.returned_liq.push(liquidation_id);
        admin.unreturned_liq.pull(liquidation_id);
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Liquidation returned successfully',
            liquidation,
        });
    } catch (error) {
        console.error('Error returning liquidation:', error);
        next(error);
    }
};






