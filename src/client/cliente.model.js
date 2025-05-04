import { Schema, model } from 'mongoose'

const clienteSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    contact: {
      type: String,
      required: [true, 'Contact is required']
    },
    company: {
      type: String,
      required: [true, 'Company is required']
    },
    status: {
      type: Boolean,
      default: true
    }
  }
)

export default model('Cliente', clienteSchema)