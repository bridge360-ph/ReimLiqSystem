import mongoose from "mongoose";
import liq_items from "./liq_items.js"

// Liquidation Schema
const liquidationSchema = new mongoose.Schema({

  liq_items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiqItem'
    }
  ],
  receipt: {
    type: String,
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
    enum: ['returned', 'unreturned'],
    default: 'unreturned'
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
  },
  initial_amount: {
    type: Number,
    required: true
  },
  remaining_amount: {
    type: Number,
    default: function () {
      return this.initial_amount - this.total_price;
    }
  }
});

liquidationSchema.methods.calculateTotalPrice = async function () {
  const liqItems = await liq_items.find({ liquidation_id: this._id })
  this.total_price = liqItems.reduce((sum, item) => sum + item.total_price, 0)
  return this.total_price
}

// Pre-save hook to calculate remaining amount
liquidationSchema.pre('save', async function (next) {
  await this.calculateTotalPrice()
  this.remaining_amount = this.initial_amount - this.total_price;

  next();
});


export default mongoose.model('Liquidation', liquidationSchema);
