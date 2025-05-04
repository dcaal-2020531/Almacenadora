import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: { 
    type: String, 
    required: true 
},
  description: { 
    type: String, 
    required: true 
},
  defaultCat: { 
    type: Boolean, 
    default: false 
}
}, {
  timestamps: true
});

export default model('Category', categorySchema);
