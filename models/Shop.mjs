import mongoose from "mongoose";

//shopGeoSchema
const shopGeoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
    required: true,
  },
});

//shopResultsSchema
const shopResultsSchema = new mongoose.Schema({
  prov_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prov",
    required: true,
  },
  distance: {
    type: Number,
  },
});

//shopSearchSchema
const shopSearchSchema = new mongoose.Schema({
  criteria: {
    type: Object,
  },
  results: shopResultsSchema,
});

const shopSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  geometry: shopGeoSchema,
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
