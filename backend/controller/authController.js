import employee from "../models/employee.js"
import admin from '../models/admin.js'


export const empregisterController = async (req, res, next) => {
    const { fullname, email, password, usertype } = req.body;
  
    if (!fullname) {
      return res.status(400).send({ success: false, message: 'Please provide fullname' });
    }
    if (!email) {
      return res.status(400).send({ success: false, message: 'Please provide email' });
    }
    if (!password) {
      return res.status(400).send({ success: false, message: 'Please provide password' });
    }
    if (!usertype) {
      return res.status(400).send({ success: false, message: 'Please provide usertype' });
    }
  
    try {
      const existingEmp = await employee.findOne({ email });
      if (existingEmp) {
        return res.status(400).send({ success: false, message: 'Email is already registered' });
      }
  
      const emp = await employee.create({ fullname, email, password, usertype });
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

        const {fullname,email,password,usertype,passkey} = req.body

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
        if (!passkey || passkey !== 'adminkey') {
            next('Ivalid Passkey')
        }
      
        
        const existingadmin = await admin.findOne({email})
        if(existingadmin){
            next('Email is Already Registered')
        }

        const adm = await admin.create({fullname,email,password,usertype,passkey})
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