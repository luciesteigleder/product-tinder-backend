import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  prov_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prov",
    required: true,
  },
  conversation_creation: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      message_author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message_text: {
        type: String,
        required: true,
      },
      message_date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export { Conversation, conversationSchema };
