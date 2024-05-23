import mongoose from "mongoose";

// Admin Schema
const adminSchema = new mongoose.Schema({
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
  position: {
    type: String,
    required: true
  },
  approved_reim: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement'
    }
  ],
  rejected_reim: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement'
    }
  ],
  approved_liq: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Liquidation'
    }
  ],
  rejected_liq: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Liquidation'
    }
  ],
  paid_reim: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement'
    }
  ],
  unpaid_reim: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement'
    }
  ],
  usertype: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
});

export default mongoose.model('Admin', adminSchema);
