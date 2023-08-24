import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shop_location: {
    coordinates: {
      type: [Number],
      required: true,
    },
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
  fav_prov: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const Shop = mongoose.model("Shop", shopSchema);

export { Shop, shopSchema };
