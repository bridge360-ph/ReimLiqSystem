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
    required: true
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
    type: String
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

employeeSchema.pre("save", async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.createJWT = function() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
  }
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export default mongoose.model('Employee', employeeSchema);
