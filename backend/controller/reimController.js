import Reimbursement from '../models/reimbursement.js'; // Ensure correct import
import reim_items from '../models/reim_items.js';
import employee from '../models/employee.js';
import admin from '../models/admin.js';
import reimbursement from '../models/reimbursement.js';


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

    if (userType === 'Admin') {
      const adminUser = await admin.findById(userId);

      if (!adminUser) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      // Check and remove the reimbursement ID from the admin's specific arrays
      const arraysToCheck = [
        'approved_reim',
        'rejected_reim',
        'paid_reim',
        'unpaid_reim',
        'approved_liq',
        'rejected_liq',
        'unreturned_liq',
        'returned_liq'
      ];

      let updateOperations = { $pull: { reimbursements: id } };

      arraysToCheck.forEach(arrayName => {
        if (adminUser[arrayName].includes(id)) {
          updateOperations.$pull[arrayName] = id;
        }
      });

      await admin.findByIdAndUpdate(userId, updateOperations);
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





//CREATE ITEM

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


export const getReimItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reim_item = await reim_items.findById(id)

    if (!reim_item) {
      return res.status(404).json({ message: 'Item Not Found' })
    }

    res.status(200).json({
      success: true,
      reim_item
    })

  } catch (error) {
    next(error)
  }
}

export const updateReimItem = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { item, quantity, price } = req.body;


    if (!item || !quantity || !price) {
      return res.status(400).json({ message: 'Credentials Missing' });
    }

    const reim_item = await reim_items.findById(id)

    if (!reim_item) {
      return res.status(404).json({ message: 'Item Not Found' })
    }

    if (item) {
      reim_item.item = item
    }
    if (quantity) {
      reim_item.quantity = quantity
    }
    if (price) {
      reim_item.price = price
    }

    await reim_item.save()

    const reimbursement = await Reimbursement.findById(reim_item.reimbursement_id)
    await reimbursement.calculateTotalPrice();
    await reimbursement.save();
    res.status(200).json({
      success: true,
      message: "Item Updated",
      item: reim_item
    })

  } catch (error) {
    next(error)
  }
}

export const delReimItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the reimbursement item by its ID
    const deleteReimItem = await reim_items.findByIdAndDelete(id);

    if (!deleteReimItem) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    // Remove the reimbursement item ID from the corresponding reimbursement's array
    const reimbursementId = deleteReimItem.reimbursement_id;
    const reimbursement = await Reimbursement.findByIdAndUpdate(reimbursementId, {
      $pull: { reim_items: id }
    });

    if (!reimbursement) {
      return res.status(404).json({ message: "Reimbursement Not Found" });
    }

    // Recalculate the total price of the reimbursement
    await reimbursement.calculateTotalPrice();
    await reimbursement.save();

    res.status(200).json({
      success: true,
      message: "Reimbursement item deleted and total price recalculated successfully"
    });
  } catch (error) {
    next(error);
  }
};



//GETTING ALL ITEMS OF REIMBURSEMENT
export const getAllItems = async (req, res, next) => {
  try {
    const { reimbursementId } = req.params;

    // Validate the reimbursementId
    if (!reimbursementId) {
      return res.status(400).json({ message: 'Reimbursement ID is required' });
    }

    // Check if the reimbursement exists
    const reimbursement = await Reimbursement.findById(reimbursementId);
    if (!reimbursement) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    // Find all items related to the reimbursementId
    const items = await reim_items.find({ reimbursement_id: reimbursementId });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    next(error);
  }
};



//GET ALL REIMBURSEMENT
export const getAllReim = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Retrieve all reimbursements from the database
    const allReimbursements = await Reimbursement.find();

    // Filter out reimbursements where created_by matches the userId
    const filteredReimbursements = allReimbursements.filter(
      reimbursement => reimbursement.created_by.toString() !== userId
    );

    res.status(200).json({
      success: true,
      reimbursements: filteredReimbursements,
    });
  } catch (error) {
    next(error);
  }
};


export const getCreatedReim = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Retrieve reimbursements created by the user from the database
    const createdReimbursements = await Reimbursement.find({ created_by: userId });

    res.status(200).json({
      success: true,
      reimbursements: createdReimbursements,
    });
  } catch (error) {
    next(error);
  }
};

export const getFilteredReim = async (req, res, next) => {
  try {
    const { status } = req.query; // Extract status from query parameters
    const { userId } = req.user;

    // Define valid status and paystatus values
    const validStatus = ['pending', 'accepted', 'rejected'];
    const validPayStatus = ['unpaid', 'paid'];

    // Validate the status parameter
    if (!validStatus.includes(status) && !validPayStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    let filterCriteria = { created_by: userId };

    // Add the appropriate filter based on the provided status
    if (validStatus.includes(status)) {
      filterCriteria.status = status;
    } else if (validPayStatus.includes(status)) {
      filterCriteria.paystatus = status;
    }

    // Retrieve reimbursements based on the filter criteria
    const reimbursements = await Reimbursement.find(filterCriteria);

    res.status(200).json({
      success: true,
      reimbursements,
    });
  } catch (error) {
    next(error);
  }
};


export const getFilteredReim2 = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { userId } = req.user;

    // Define valid status and paystatus values
    const validStatus = ['pending', 'approved', 'rejected'];
    const validPayStatus = ['unpaid', 'paid'];

    // Validate the status parameter
    if (!validStatus.includes(status) && !validPayStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    let filterCriteria = { created_by: { $ne: userId } };

    // Add the appropriate filter based on the provided status
    if (validStatus.includes(status)) {
      filterCriteria.status = status;
    } else if (validPayStatus.includes(status)) {
      filterCriteria.paystatus = status;
    }

    // Retrieve reimbursements based on the filter criteria
    const reimbursements = await Reimbursement.find(filterCriteria);

    res.status(200).json({
      success: true,
      reimbursements,
    });
  } catch (error) {
    next(error);
  }
};
