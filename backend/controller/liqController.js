import liquidation from "../models/liquidation.js";
import employee from "../models/employee.js"
import admin from "../models/admin.js";
export const addLiq = async(req,res,next)=>{
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