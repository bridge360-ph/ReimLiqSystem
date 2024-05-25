import employee from "../models/employee.js"
import admin from '../models/admin.js'


export const empregisterController = async (req, res, next) => {
    const { fullname, email, password, usertype,position } = req.body;
  
    if (!fullname) {
      return res.status(400).send({ success: false, message: 'Please provide fullname' });
    }
    if (!email) {
      return res.status(400).send({ success: false, message: 'Please provide email' });
    }
    if (!password) {
      return res.status(400).send({ success: false, message: 'Please provide password' });
    }
    if (!position) {
      return res.status(400).send({ success: false, message: 'Please provide position' });
    }
    if (!usertype) {
      return res.status(400).send({ success: false, message: 'Please provide usertype' });
    }
  
    try {
      const existingEmp = await employee.findOne({ email });
      if (existingEmp) {
        return res.status(400).send({ success: false, message: 'Email is already registered' });
      }
  
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
      next(error);
    }
  };

export const adminregisterController = async (req,res,next) =>{

        const {fullname,email,password,usertype,passkey, position} = req.body

        if(!fullname){
            next('Provide Fullname')
        }
        if(!email){
            next('Provide Email')
        }
        if(!password){
            next('Provide Password')
        }
        if(!usertype){
            next('Provide UserType')
        }
        if(!position){
          next('Provide Position')
      }
        if (!passkey || passkey !== 'adminkey') {
            next('Ivalid Passkey')
        }
      
        
        const existingadmin = await admin.findOne({email})
        if(existingadmin){
            next('Email is Already Registered')
        }

        const adm = await admin.create({fullname,email,password,usertype,passkey,position})
        const token = adm.createJWT();
        if (!token) {
          console.error("Token generation failed");
          return res.status(500).send({ success: false, message: 'Token generation failed' });
        }
        res.status(201).send({
            success:true,
            message:'Admin Created',
            adm,
            token
        })
} 

export const emploginController = async(req, res, next) => {
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

export const admloginController = async(req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Provide All Fields' });
    }

    const adm = await admin.findOne({ email }).select("+password");
    if (!adm) {
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isMatch = await adm.comparePassword(password); // Ensure password is a string
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }
    adm.password = undefined;

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