import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Users",
  },
  messageType: {
    type: String,
    required: true,
    enum: ["text", "file"],
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text" || this.messageType === "";
    },
  },
  // content: {
  //   type: String,
  //   validate: {
  //     validator: function (value) {
  //       // Allow empty content only if it's a 'file' message or handle specific logic
  //       if (this.messageType === "text" && value === "") {
  //         return true;  
  //       }
  //       return true;  
  //     message: 'Content is required for text messages',
  //   },
  // },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
