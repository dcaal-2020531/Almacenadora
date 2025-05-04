import mongoose, { Schema, model } from 'mongoose';

const productSchema = new Schema({
  name: { 
    type: String, 
    required: true 
},
  description: { 
    type: String, 
    required: true 
},
  price: { 
    type: Number, 
    required: true 
},
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
},
  stock: { 
    type: Number, 
    required: true 
},
  salesCount: { 
    type: Number, 
    default: 0 
},
  entryDate: { 
    type: Date, 
    required: true 
},             
  expirationDate: { 
    type: Date, 
    required: false 
}
});

export default model("Product", productSchema);
