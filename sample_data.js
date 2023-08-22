import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profile_type: {
    type: Boolean, //do we really ant boolean ? Yes-no
    required: true,
  },
});

const shopSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop_location: {
    type: String,
    required: true,
  },
  shop_name: {
    type: String,
    required: true,
  },
  shop_contact: { address: String, phone: Number },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String, // to be confirmed, either saved on the server or on mongodb
  },
  language: {
    type: String,
    required: true,
  },
  //fav_prov will be added afterwards
});

const provSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prov_location: {
    type: String,
    required: true,
  },
  prov_name: {
    type: String,
    required: true,
  },
  prov_contact: { address: String, phone: Number },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String, // to be confirmed, either saved on the server or on mongodb
  },
  language: {
    type: String,
    required: true,
  },
  //score, pricescore and testimonies will be added afterwards
});

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
  },
  category_description: {
    type: String,
  },
  category_logo: {
    type: String, // to be confirmed, either saved on the server or on mongodb
  },
});

const tagSchema = new mongoose.Schema({
  tag_name: {
    type: String,
    required: true,
  },
});

const resultSchema = new mongoose.Schema({
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
});

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
