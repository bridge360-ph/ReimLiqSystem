import Reimbursement from '../models/reimbursement.js'; // Ensure correct import
import reim_items  from '../models/reim_items.js';
import employee from '../models/employee.js';
import admin from '../models/admin.js';


export const createReimbursementController = async (req, res, next) => {
  try {
    const { description, name } = req.body;

    // Validate required fields
    if (!description || !name) {
      return res.status(400).json({ message: 'Description and name are required' });
    }

    // Log to debug

    const created_by = req.user.userId;
    const created_by_model = req.user.userType === 'admin' ? 'Admin' : 'Employee'; // Use 'userType'

    // Create the new reimbursement
    const newReimbursement = new Reimbursement({
      description,
      name,
      created_by,
      created_by_model
    });

    // Save the reimbursement to the database
    await newReimbursement.save();

    // Log the new reimbursement for debugging
    console.log('New Reimbursement:', newReimbursement);

    // Add the reimbursement ID to the reimbursements array of the creator
    if (created_by_model === 'Employee') {
      await employee.findByIdAndUpdate(created_by, {
        $push: { reimbursements: newReimbursement._id }
      });
    } else if (created_by_model === 'Admin') {
      await admin.findByIdAndUpdate(created_by, {
        $push: { reimbursements: newReimbursement._id }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Reimbursement created successfully',
      reimbursement: newReimbursement
    });
  } catch (error) {
    next(error);
  }
};

//UPDATE REIM

export const updateReimController = async (req, res, next) => {
  try {
  

    const { id } = req.params;
    const { name, description } = req.body;

    if (!description || !name) {
      return res.status(400).json({ message: 'Description is required' });
    }

    // Check if the reimbursement exists
    const reimbursement = await Reimbursement.findById(id);
    if (!reimbursement) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    // Update the fields
    if (name) {
      reimbursement.name = name;
    }
    if (description) {
      reimbursement.description = description;
    }

    // Save the updated reimbursement
    await reimbursement.save();

    res.status(200).json({
      success: true,
      message: 'Reimbursement updated successfully',
      reimbursement: reimbursement
    });
  } catch (error) {
    next(error);
  }
};


//GET BY ID 
export const getReimbursementByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the reimbursement by ID
    const reimbursement = await Reimbursement.findById(id);

    // Check if the reimbursement exists
    if (!reimbursement) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    // Return the reimbursement
    res.status(200).json({
      success: true,
      reimbursement
    });
  } catch (error) {
    next(error);
  }
};



//DELETE BY ID 

export const deleteReimbursementController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the reimbursement by ID and delete it
    const deletedReimbursement = await Reimbursement.findByIdAndDelete(id);

    // Check if the reimbursement was found and deleted
    if (!deletedReimbursement) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    // Remove the reimbursement ID from the user's reimbursements array
    const userId = req.user.userId;
    const userType = req.user.userType === 'admin' ? 'Admin' : 'Employee';
    console.log(userType)

    if (userType === 'Admin') {
      await admin.findByIdAndUpdate(userId, {
        $pull: { reimbursements: id }
      });
    } else if (userType === 'Employee') {
      await employee.findByIdAndUpdate(userId, {
        $pull: { reimbursements: id }
      });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Return a success message
    res.status(200).json({
      success: true,
      message: 'Reimbursement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};







export const createReimItemController = async (req, res, next) => {
    try {
      const { reimbursement_id, item, quantity, price } = req.body;
  
      // Validate required fields
      if (!reimbursement_id || !item || !quantity || !price) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Check if the reimbursement exists
      const reimbursement = await Reimbursement.findById(reimbursement_id);
      if (!reimbursement) {
        return res.status(404).json({ message: 'Reimbursement not found' });
      }
  
      // Create the new reimItem
      const newReimItem = new reim_items({
        reimbursement_id,
        item,
        quantity,
        price
      });
  
      // Save the reimItem to the database
      await newReimItem.save();
  
      // Add the reimItem ID to the reim_items array of the corresponding reimbursement
      reimbursement.reim_items.push(newReimItem._id);
  
      // Recalculate the total price for the reimbursement
      await reimbursement.calculateTotalPrice();
      
      // Save the updated reimbursement
      await reimbursement.save();
  
      res.status(201).json({
        success: true,
        message: 'Reimbursement Item created successfully',
        reimItem: newReimItem
      });
    } catch (error) {
      next(error);
    }
  };