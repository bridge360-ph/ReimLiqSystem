import mongoose from "mongoose";
import reim_items from "./reim_items.js";

// Reimbursement Schema
const reimbursementSchema = new mongoose.Schema({
  reim_items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReimItem'
    }
  ],
  receipt: {
    type: String,
    default: "none"
  },
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'created_by_model',
    required: true
  },
  created_by_model: {
    type: String,
    required: true,
    enum: ['Employee', 'Admin']
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
  payment_date: {
    type: Date
  },
  comments: {
    type: String
  },
  total_price: {
    type: Number,
    default: 0
  }
});

reimbursementSchema.methods.calculateTotalPrice = async function () {
  const reimItems = await reim_items.find({ reimbursement_id: this._id });
  this.total_price = reimItems.reduce((sum, item) => sum + item.total_price, 0);
  return this.total_price;
};

// Pre-save hook to calculate total_price
reimbursementSchema.pre('save', async function (next) {
  await this.calculateTotalPrice();
  next();
});

export default mongoose.model('Reimbursement', reimbursementSchema);
