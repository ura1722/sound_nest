import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    messageContent: {
        type: String,
        required: true
    },
    
},{timestamps: true})

export const Message = mongoose.model("Message", messageSchema)
