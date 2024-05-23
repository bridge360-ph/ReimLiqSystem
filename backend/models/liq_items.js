import mongoose from "mongoose";

// LiqItem Schema
const liqItemSchema = new mongoose.Schema({
  liquidation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Liquidation',
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
liqItemSchema.pre('save', function(next) {
  this.total_price = this.price * this.quantity;
  next();
});

export default mongoose.model('LiqItem', liqItemSchema);
