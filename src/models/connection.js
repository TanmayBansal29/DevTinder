const mongoose = require("mongoose")

const connectionSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{value} is not supported`
        }
    }
}, {timestamps: true})

connectionSchema.index({ fromUserId: 1, toUserId: 1 })

connectionSchema.pre("save", function (next) {
    const connectionRequest = this;
    // Check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!")
    }
    next()
})

const ConnectionRequest = mongoose.model("Connection", connectionSchema)
module.exports = ConnectionRequest