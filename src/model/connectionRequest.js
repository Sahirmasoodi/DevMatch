const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"user"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"user"
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VAlUE} is not valid request`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre('save',function (){
  const connectionRequest = this
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Bad request.");
    
  }
} )

const ConnectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;

