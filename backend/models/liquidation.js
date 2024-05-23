import mongoose from "mongoose";

// Liquidation Schema
const liquidationSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
    unique: true
  },
  liq_items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiqItem'
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
  },
  initial_amount: {
    type: Number,
    required: true
  },
  remaining_amount: {
    type: Number,
    required: true,
    default: function() {
      return this.initial_amount - this.total_price;
    }
  }
});

// Pre-save hook to calculate remaining amount
liquidationSchema.pre('save', function(next) {
  this.remaining_amount = this.initial_amount - this.total_price;
  next();
});

export default mongoose.model('Liquidation', liquidationSchema);
