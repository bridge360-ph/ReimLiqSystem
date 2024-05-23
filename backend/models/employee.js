import mongoose from "mongoose";

// Employee Schema
const employeeSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
    unique: true
  },
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
    default:'employee'
  }
});

export default mongoose.model('Employee', employeeSchema);
