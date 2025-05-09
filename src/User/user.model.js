import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, `Can't exceed 25 characters`],
    },
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        maxLength: [25, `Can't exceed 25 characters`],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        maxLength: [15, `Can't exceed 15 characters`],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters'],
        maxLength: [100, `Can't exceed 100 characters`],
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        maxLength: [13, `Can't exceed 13 characters`],
        minLength: [8, 'Phone must be at least 8 characters']
    },
    role: {
        type: String,
        uppercase: true,
        enum: ['ADMIN', 'EMPLOYEE'],
        required: [true, 'role is required'],

    }
}
)

userSchema.methods.toJSON = function(){
    const { __v, password, ...user} = this.toObject() 
    return user
}

export default model('User', userSchema)