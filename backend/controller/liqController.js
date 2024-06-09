import liquidation from "../models/liquidation.js";
import employee from "../models/employee.js"
import admin from "../models/admin.js";
import liq_items from "../models/liq_items.js";




export const addLiq = async (req, res, next) => {
  try {
    const { description, name, initial_amount } = req.body;

    if (!description || !name || !initial_amount) {
      return res.status(400).json({ message: 'Description and name and Amount are required' });
    }
    const created_by = req.user.userId;
    const created_by_model = req.user.userType === 'admin' ? 'Admin' : 'Employee';

    const newLiquidation = new liquidation({
      description,
      name,
      initial_amount,
      created_by,
      created_by_model
    })

    await newLiquidation.save()

    if (created_by_model === 'Employee') {
      await employee.findByIdAndUpdate(created_by, {
        $push: { liquidations: newLiquidation._id }
      });
    } else if (created_by_model === 'Admin') {
      await admin.findByIdAndUpdate(created_by, {
        $push: { liquidations: newLiquidation._id }
      });
    }


    res.status(201).json({
      success: true,
      message: 'Reimbursement created successfully',
      liquidation: newLiquidation
    });


  } catch (error) {
    next(error)
  }
}

export const updateLiq = async (req, res, next) => {
  try {
    const { id } = req.params
    const { description, name, initial_amount } = req.body

    if (!description || !name || !initial_amount) {
      return res.status(400).json({ message: 'Description and name and Amount are required' });
    }

    const liq = await liquidation.findById(id);

    if (!liq) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    if (name) {
      liq.name = name;
    }
    if (description) {
      liq.description = description;
    }
    if (initial_amount) {
      liq.initial_amount = initial_amount;
    }

    await liq.save();

    res.status(200).json({
      success: true,
      message: 'Liquidation Updated',
      liquidation: liq
    })


  } catch (error) {
    next(error)
  }
}

export const getLiqbyID = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the reimbursement by ID
    const liq = await liquidation.findById(id);

    // Check if the reimbursement exists
    if (!liq) {
      return res.status(404).json({ message: 'Reimbursement not found' });
    }

    // Return the reimbursement
    res.status(200).json({
      success: true,
      liq
    });
  } catch (error) {
    next(error);
  }
};


export const deleteLiq = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the reimbursement by ID and delete it
    const deletedLiq = await liquidation.findByIdAndDelete(id);

    // Check if the reimbursement was found and deleted
    if (!deletedLiq) {
      return res.status(404).json({ message: 'Liquidation not found' });
    }

    // Remove the reimbursement ID from the user's reimbursements array
    const userId = req.user.userId;
    const userType = req.user.userType === 'admin' ? 'Admin' : 'Employee';

    let updateOperations = {
      $pull: { liquidations: id }
    };

    if (userType === 'Admin') {
      const adminUser = await admin.findById(userId);

      // Check and remove the liquidation ID from the admin's specific arrays
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

      arraysToCheck.forEach(arrayName => {
        if (adminUser[arrayName].includes(id)) {
          updateOperations.$pull[arrayName] = id;
        }
      });

      await admin.findByIdAndUpdate(userId, updateOperations);
    } else if (userType === 'Employee') {
      await employee.findByIdAndUpdate(userId, {
        $pull: { liquidations: id }
      });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Return a success message
    res.status(200).json({
      success: true,
      message: 'Liquidation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}




export const createLiqItem = async (req, res, next) => {
  try {
    const { liquidation_id, item, quantity, price } = req.body;

    if (!liquidation_id || !item || !quantity || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const liq = await liquidation.findById(liquidation_id);

    if (!liq) {
      return res.status(404).json({ message: 'Liquidation not found' });
    }

    const newLiqItem = new liq_items({
      liquidation_id,
      item,
      quantity,
      price
    });

    await newLiqItem.save()

    liq.liq_items.push(newLiqItem._id)

    await liq.calculateTotalPrice()

    await liq.save()
    res.status(201).json({
      success: true,
      message: 'Liquidation Item created successfully',
      Item: newLiqItem
    });

  } catch (error) {
    next(error)
  }
}


export const updateLiqItem = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { item, quantity, price } = req.body;


    if (!item || !quantity || !price) {
      return res.status(400).json({ message: 'Credentials Missing' });
    }

    const liq_item = await liq_items.findById(id)

    if (!liq_item) {
      return res.status(404).json({ message: 'Item Not Found' })
    }

    if (item) {
      liq_item.item = item
    }
    if (quantity) {
      liq_item.quantity = quantity
    }
    if (price) {
      liq_item.price = price
    }

    await liq_item.save()

    const liq = await liquidation.findById(liq_item.liquidation_id)
    await liq.calculateTotalPrice();
    await liq.save();
    res.status(200).json({
      success: true,
      message: "Item Updated",
      item: liq_item
    })

  } catch (error) {
    next(error)
  }
}

export const getLiqItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const liq_item = await liq_items.findById(id)

    if (!liq_item) {
      return res.status(404).json({ message: 'Item Not Found' })
    }

    res.status(200).json({
      success: true,
      liq_item
    })

  } catch (error) {
    next(error)
  }
}

export const delLiqItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the reimbursement item by its ID
    const deleteLiqItem = await liq_items.findByIdAndDelete(id);

    if (!deleteLiqItem) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    // Remove the reimbursement item ID from the corresponding reimbursement's array
    const liq_id = deleteLiqItem.liquidation_id;
    const liq = await liquidation.findByIdAndUpdate(liq_id, {
      $pull: { liq_items: id }
    });

    if (!liq) {
      return res.status(404).json({ message: "Reimbursement Not Found" });
    }

    // Recalculate the total price of the reimbursement
    await liq.calculateTotalPrice();
    await liq.save();

    res.status(200).json({
      success: true,
      message: "Liquidation item deleted and total price recalculated successfully"
    });
  } catch (error) {
    next(error);
  }
};


export const getAllLiqItems = async (req, res, next) => {
  try {
    const { liquidationId } = req.params
    if (!liquidationId) {
      return res.status(400).json({ message: 'Liquidation ID is required' });
    }

    const liq = await liquidation.findById(liquidationId)

    if (!liq) {
      return res.status(404).json({ message: 'Liquidation not found' });
    }

    const items = await liq_items.find({ liquidation_id: liquidationId })

    res.status(200).json({
      success: true,
      items,
    });


  } catch (error) {
    next(error)
  }
}

export const getAllLiq = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Retrieve all reimbursements from the database
    const allLiquidations = await liquidation.find();

    // Filter out reimbursements where created_by matches the userId
    const filteredLiq = allLiquidations.filter(
      liq => liq.created_by.toString() !== userId
    );

    res.status(200).json({
      success: true,
      liquidations: filteredLiq,
    });
  } catch (error) {
    next(error)
  }
}


export const getCreatedLiq = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Retrieve reimbursements created by the user from the database
    const createdLiq = await liquidation.find({ created_by: userId });

    res.status(200).json({
      success: true,
      liquidations: createdLiq,
    });
  } catch (error) {
    next(error);
  }
};

export const getFilteredLiq = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { userId } = req.user;

    // Define valid status and paystatus values
    const validStatus = ['pending', 'accepted', 'rejected'];
    const validPayStatus = ['unreturned', 'returned'];

    // Validate the status parameter
    if (!status || (!validStatus.includes(status) && !validPayStatus.includes(status))) {
      return res.status(400).json({ message: 'Invalid or missing status parameter' });
    }

    let filterCriteria = { created_by: userId };

    // Add the appropriate filter based on the provided status
    if (validStatus.includes(status)) {
      filterCriteria.status = status;
    } else if (validPayStatus.includes(status)) {
      filterCriteria.paystatus = status;
    }

    // Retrieve liquidations based on the filter criteria
    const liq = await liquidation.find(filterCriteria);

    res.status(200).json({
      success: true,
      liq,
    });
  } catch (error) {
    next(error);
  }
};



export const getFilteredLiq2 = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { userId } = req.user;

    // Define valid status and paystatus values
    const validStatus = ['pending', 'approved', 'rejected'];
    const validPayStatus = ['unreturned', 'returned'];

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
    const liq = await liquidation.find(filterCriteria);

    res.status(200).json({
      success: true,
      liq,
    });
  } catch (error) {
    next(error);
  }
};
