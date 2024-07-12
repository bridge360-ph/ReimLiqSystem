import employee from '../models/employee.js';
import bcrypt from 'bcryptjs'
import Employee from '../models/employee.js';
import Admin from '../models/admin.js';

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

    // Update password if provided
    if (password) {
      emp.password = password; // Directly assign the password
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

export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userType = req.user.userType === 'admin' ? 'Admin' : 'Employee'; // Get usertype from req.user

    let user;

    if (userType === 'Admin') {
      user = await admin.findById(id);
    } else if (userType === 'Employee') {
      user = await employee.findById(id);
    } else {
      return res.status(400).json({ message: 'Invalid usertype provided' });
    }

    if (!user) {
      return res.status(404).json({ message: `${userType.charAt(0).toUpperCase() + userType.slice(1)} not found` });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};


export const postUserController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType === 'admin' ? 'Admin' : 'Employee';
    console.log(userType)
    let user;

    if (userType === 'Admin') {
      user = await admin.findById(userId);
    } else if (userType === 'Employee') {
      user = await employee.findById(userId);
    } else {
      return res.status(400).send({
        message: "Invalid usertype",
        success: false,
      });
    }

    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    user.password = undefined; // Remove password for security

    res.status(200).send({
      success: true,
      data: user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Auth Error",
      success: false,
      error: error.message,
    });
  }
};


import multer from 'multer';
import upload from '../middlewares/multerMiddleware.js'; // Assuming multer configuration is in multer.j// Import your Admin model

export const addImage = async (req, res) => {
  const userType = req.user.userType === 'admin' ? 'Admin' : 'Employee';
  try {
    // Handle file upload using multer middleware
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer error: ' + err.message });
      } else if (err) {
        return res.status(500).json({ message: 'Error uploading file: ' + err.message });
      }

      // Check if file is present
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Construct the filename (assuming it's already set by multer storage configuration)
      const userId = req.user.userId; // Assuming userId is available in req.user
      const fileName = userId + req.file.originalname;

      // Determine user type (employee or admin)
      if (userType === 'Employee') {
        // Update the employee model with the image filename
        const employee = await Employee.findById(userId);
        if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
        }
        employee.image = fileName; // Set the image attribute to the filename
        await employee.save();

        // Respond with success message
        return res.status(200).json({ message: 'Image added successfully for employee', fileName });
      } else if (userType === 'Admin') {
        // Update the admin model with the image filename
        const admin = await Admin.findById(userId);
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found' });
        }
        admin.image = fileName; // Set the image attribute to the filename
        await admin.save();

        // Respond with success message
        return res.status(200).json({ message: 'Image added successfully for admin', fileName });
      } else {
        return res.status(400).json({ message: 'Invalid user type' });
      }
    });
  } catch (error) {
    console.error('Error adding image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


