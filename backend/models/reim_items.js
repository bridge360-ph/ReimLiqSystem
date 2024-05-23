import mongoose from "mongoose";

// ReimItem Schema
const reimItemSchema = new mongoose.Schema({
  reimbursement_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reimbursement',
    required: true
  },
  item: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  total_price: {
    type: Number,
    required: true,
    default: function() {
      return this.price * this.quantity;
    }
  }
});

// Pre-save hook to calculate total_price
reimItemSchema.pre('save', function(next) {
  this.total_price = this.price * this.quantity;
  next();
});

export default mongoose.model('ReimItem', reimItemSchema);
