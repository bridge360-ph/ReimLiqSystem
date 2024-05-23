import mongoose from "mongoose";

// Reimbursement Schema
const reimbursementSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
    unique: true
  },
  reim_items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReimItem'
    }
  ],
  receipt: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending'],
    default: 'pending'
  },
  paystatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  submission_date: {
    type: Date,
    default: Date.now
  },
  approval_date: {
    type: Date
  },
  comments: {
    type: String
  },
  total_price: {
    type: Number,
    required: true
  }
});

export default mongoose.model('Reimbursement', reimbursementSchema);
