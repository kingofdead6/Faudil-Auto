import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  colors: [{ type: String, required: true }],
  images: [{ type: String, required: true }],
}, { timestamps: true });

export default mongoose.model('Car', carSchema);