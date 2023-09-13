import express from "express";
import { Conversation, conversationSchema } from "../models/Conversation.mjs";
import authChecker from "../middleware/authChecker.mjs";
import convAuth from "../middleware/convAuth.mjs";

const router = express.Router();
router.use(express.json());

//CONVERSATIONS
// View conversation
router.get("/", authChecker, async (req, res) => {
  const authId = res.locals.payload.prov_id || res.locals.payload.shop_id;
  const conversation_id = req.query.conversation_id;

  try {
    const getConversation = await Conversation.findById(conversation_id);

    if (
      authId == getConversation.shop_id ||
      authId == getConversation.prov_id
    ) {
      res.json(getConversation);
    } else {
      res.send("You don't have access to this conversation");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//Creates a new conversation
router.post("/new", authChecker, async (req, res) => {
  const authId = res.locals.payload.shop_id;
  const messAuthor = res.locals.payload.user_id;
  try {
    const newConversation = await Conversation.create({
      shop_id: authId,
      prov_id: req.body.prov_id,
      messages: [
        {
          message_author: messAuthor,
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
router.delete("/", authChecker, async (req, res) => {
  const { prov_id: authProvId, shop_id: authShopId } = res.locals.payload;
  try {
    const conversation_id = req.query.conversation_id;
    const { prov_id: convProvId, shop_id: convShopId } =
      await Conversation.findById(conversation_id);
    console.log("convProvId: " + String(convProvId));
    console.log("convShopId: " + String(convShopId));
    if (convProvId == authProvId || convShopId == authShopId) {
      const deletedConversation = await Conversation.deleteOne({
        _id: conversation_id,
      });
      res.status(204).json(deletedConversation);
    } else {
      res
        .status(400)
        .send("You don't have the rights to delete this conversation");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//MESSAGES
//Creates new message
router.post("/mess/new/", authChecker, convAuth, async (req, res) => {
  //Select the user ID and shop/provider ID from the jwt payload
  const provOrShopId = res.locals.payload.prov_id || res.locals.payload.shop_id;
  const userId = res.locals.payload.user_id;
  try {
    const conversation_id = req.query.conversation_id;
      const currentConv = await Conversation.findByIdAndUpdate(
        conversation_id,
        {
          $push: {
            messages: {
              message_author: userId,
              message_text: req.body.message_text,
            },
          },
        },
        { new: true }
      );
      res.json(currentConv);
    // } else {
    //   console.log("not a user of this conversation");
    //   res.send("not a user of this conversation");
    // }
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

//Update message
router.put("/mess", authChecker, convAuth, async (req, res) => {
  // const provOrShopId = res.locals.payload.prov_id || res.locals.payload.shop_id;
  // const userId = res.locals.payload.user_id;
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
router.get("/mess", authChecker ,convAuth, async (req, res) => {
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
router.delete("/mess", authChecker, convAuth, async (req, res) => {
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
