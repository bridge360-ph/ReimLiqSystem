import employee from "../models/employee.js"
import admin from '../models/admin.js'
import bcrypt from 'bcryptjs'

export const empregisterController = async (req, res, next) => {
  const { fullname, email, password, usertype, position } = req.body;

  if (!fullname || !email || !password || !position || !usertype) {
    return res.status(400).send({ success: false, message: 'Please provide all required fields' });
  }

  try {
    // Check if an employee with the same email already exists
    const existingEmp = await employee.findOne({ email });
    if (existingEmp) {
      return res.status(400).send({ success: false, message: 'Email is already registered' });
    }

    // Create the new employee
    const emp = await employee.create({ fullname, email, password, usertype, position });
    const token = emp.createJWT();
    if (!token) {
      console.error("Token generation failed");
      return res.status(500).send({ success: false, message: 'Token generation failed' });
    }

    res.status(201).send({
      success: true,
      message: 'Employee created',
      emp,
      token
    });
  } catch (error) {
    // Check if the error is a duplicate key error (E11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).send({ success: false, message: 'Email is already registered' });
    }

    // If it's not a duplicate key error, forward the error to the error middleware
    next(error);
  }
};


export const adminregisterController = async (req, res, next) => {

  const { fullname, email, password, usertype, passkey, position } = req.body

  if (!fullname) {
    return next('Provide Fullname')
  }
  if (!email) {
    return next('Provide Email')
  }
  if (!password) {
    return next('Provide Password')
  }
  if (!usertype) {
    return next('Provide UserType')
  }
  if (!position) {
    return next('Provide Position')
  }
  if (!passkey || passkey !== 'adminkey') {
    return next('Ivalid Passkey')
  }


  const existingadmin = await admin.findOne({ email })
  if (existingadmin) {
    return next('Email is Already Registered')
  }

  const adm = await admin.create({ fullname, email, password, usertype, passkey, position })
  const token = adm.createJWT();
  if (!token) {
    console.error("Token generation failed");
    return res.status(500).send({ success: false, message: 'Token generation failed' });
  }
  res.status(201).send({
    success: true,
    message: 'Admin Created',
    adm,
    token
  })
}

export const emploginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Provide All Fields' });
    }

    const emp = await employee.findOne({ email }).select("+password");
    if (!emp) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isMatch = await emp.comparePassword(password); // Ensure password is a string
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    emp.password = undefined;

    const token = emp.createJWT();
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: emp, // Fix the response to return the user
      token
    });
  } catch (error) {
    next(error);
  }
};

export const admloginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Provide All Fields' });
    }

    const adm = await admin.findOne({ email }).select("+password");
    if (!adm) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Compare the plain text password with the stored password
    const isMatch = await adm.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = adm.createJWT();
    res.status(200).json({
      success: true,
      message: "Login as Admin Successfully",
      user: adm, // Fix the response to return the user
      token
    });
  } catch (error) {
    next(error);
  }
};