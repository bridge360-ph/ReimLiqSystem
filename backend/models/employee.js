import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

// Employee Schema
const employeeSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // Ensure password is not selected by default
  },
  reimbursements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement'
    }
  ],
  liquidations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Liquidation'
    }
  ],
  image: {
    type: String,
    default: "none"
  },
  position: {
    type: String
  },
  usertype: {
    type: String,
    enum: ['employee', 'admin'],
    required: true,
    default: 'employee'
  }
});

// Hash password before saving


employeeSchema.methods.createJWT = function () {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
  }
  return JWT.sign({ userId: this._id, userType: 'employee' }, process.env.JWT_SECRET, { expiresIn: '1d' });
};


// Password compare method
employeeSchema.methods.comparePassword = async function (candidatePassword) {
  return this.password === candidatePassword;
}

export default mongoose.model('Employee', employeeSchema);
