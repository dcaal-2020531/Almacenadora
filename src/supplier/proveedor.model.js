import { Schema, model } from 'mongoose'

const proveedorSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    contact: {
      type: String,
      required: [true, 'Contact is required']
    },
    products:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required']
    },
    status: {
      type: Boolean,
      default: true
    }
  }
)

export default model('Proveedor', proveedorSchema)