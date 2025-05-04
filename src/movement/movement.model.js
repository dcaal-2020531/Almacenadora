import mongoose, { Schema, model } from 'mongoose';

const movementSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['entry', 'exit'], required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  reason: { type: String },
  destination: { type: String }, 
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }
});

export default model("Movement", movementSchema);