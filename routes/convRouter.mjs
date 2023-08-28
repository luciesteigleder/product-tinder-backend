import express from "express";
import { Conversation, conversationSchema } from "../models/Conversation.mjs";

const router = express.Router();
router.use(express.json());

//CONVERSATIONS
// View conversation
router.get("/", async (req, res) => {
  const conversation_id = req.query.conversation_id;
  try {
    const getConversation = await Conversation.findById(conversation_id);
    res.json(getConversation);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//Creates a new conversation
router.post("/new", async (req, res) => {
  console.log(req.body);
  console.log(req.body.messages);
  try {
    const newConversation = await Conversation.create({
      shop_id: req.body.shop_id,
      prov_id: req.body.prov_id,
      messages: [
        {
          message_author: req.body.messages[0].message_author,
          message_text: req.body.messages[0].message_text,
        },
      ],
    });
    res.status(201).json(newConversation);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//Delete conversation
router.delete("/", async (req, res) => {
  try {
    const conversation_id = req.query.conversation_id;
    const deletedConversation = await Conversation.deleteOne({
      _id: conversation_id,
    });
    res.json(deletedConversation);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//MESSAGES
//Creates new message
router.post("/mess/new/", async (req, res) => {
  //the id here is the conversation ID
  try {
    const conversation_id = req.query.conversation_id;
    console.log(conversation_id);

    const currentConv = await Conversation.findByIdAndUpdate(
      conversation_id,
      {
        $push: {
          messages: {
            message_author: req.body.message_author,
            message_text: req.body.message_text,
          },
        },
      },
      { new: true }
    );
    res.json(currentConv);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

//Update message
router.put("/mess", async (req, res) => {
  try {
    const { conversation_id, message_id } = req.query;

    const updatedMessage = await Conversation.findOneAndUpdate(
      {
        _id: conversation_id,
        "messages._id": message_id,
      },
      {
        $set: {
          "messages.$.message_text": req.body.message_text, // Update the message_text field as needed
        },
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//get message
router.get("/mess", async (req, res) => {
  try {
    const { conversation_id, message_id } = req.query;

    const conversation = await Conversation.findOne({
      _id: conversation_id,
      "messages._id": message_id,
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const message = conversation.messages.find(
      (msg) => msg._id.toString() === message_id
    );
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    console.log(message);
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//Delete message
router.delete("/mess", async (req, res) => {
  try {
    const { conversation_id, message_id } = req.query;

    const updatedConversation = await Conversation.updateOne(
      {
        _id: conversation_id,
      },
      {
        $pull: {
          messages: {
            _id: message_id,
          },
        },
      }
    );

    if (updatedConversation.nModified === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
