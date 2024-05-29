import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken';
// Admin Schema
const adminSchema = new mongoose.Schema({
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
    type: String
  },
  approved_reim: [
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
  paid_reim: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reimbursement'
    }
  ],
  image: {
    type: String,
    default:"none"
  },
  usertype: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  },
  passkey: {
    type: String,
    required: true
  }
});

adminSchema.pre("save", async function(){
  const salt = await bcrypt.genSalt(10);
  this.password= await bcrypt.hash(this.password, salt)
})

// In your Admin model
adminSchema.methods.createJWT = function() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
  }
  return JWT.sign({ userId: this._id, usertype: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

adminSchema.methods.comparePassword = async function (admPassword){
  const isMatch = await bcrypt.compare(admPassword, this.password)
  return isMatch;
}


export default mongoose.model('Admin', adminSchema);
