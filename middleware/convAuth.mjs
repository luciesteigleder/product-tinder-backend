import { Conversation, conversationSchema } from "../models/Conversation.mjs";

const convAuth = async (req, res, next) => {
    const provOrShopId = res.locals.payload.prov_id || res.locals.payload.shop_id;
    try {
      const conversation_id = req.query.conversation_id;
      //Verify the logged-in user profile (shop or provider) is assigned to the conversation ID
      const userCheck = await Conversation.findById(conversation_id);
      if (
        userCheck.prov_id == provOrShopId ||
        userCheck.shop_id == provOrShopId
      ) next();
      else {
        console.log("not a user of this conversation");
        res.send("not a user of this conversation");
      }
    } catch (err) {
      console.error(err.message);
      res.status(400).json({ message: err.message });
    }
  }
;
export default convAuth;