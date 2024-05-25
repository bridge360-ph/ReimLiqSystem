import employee from '../models/employee.js'; // Ensure correct import

export const updateEmpController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, position } = req.body;

    // Find the employee by ID
    const emp = await employee.findById(id);

    if (!emp) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update fields
    if (fullname) emp.fullname = fullname;
    if (email) emp.email = email;
    if (position) emp.position = position;

    // Hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      emp.password = await bcrypt.hash(password, salt);
    }

    // Save the updated employee
    await emp.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      emp
    });
  } catch (error) {
    next(error);
  }
};

import admin from '../models/admin.js'; // Ensure correct import

export const updateAdminController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullname, email, password, position } = req.body;

    // Find the admin by ID
    const adm = await admin.findById(id);

    if (!adm) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields
    if (fullname) adm.fullname = fullname;
    if (email) adm.email = email;
    if (position) adm.position = position;

    // Hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      adm.password = await bcrypt.hash(password, salt);
    }

    // Save the updated admin
    await adm.save();

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      adm
    });
  } catch (error) {
    next(error);
  }
};