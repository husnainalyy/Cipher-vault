import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
    _id: string;
    content: string,
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: [true, "the Message is required"]
    },
    createdAt : {
        type: Date,
        required: [true, "the created date is required"],
        default: Date.now()
    }
})


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage: boolean,
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,"please enter valid email"]
    },
    password: {
        type: String,
        required: false,
    },
    verifyCode: {
        type: String,
        required: false,
    },
    verifyCodeExpiry: {
        type: Date,
        required: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default:true
    },
    messages: [MessageSchema],
    isVerified: {
        type: Boolean,
        default:false
    }
})


export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

