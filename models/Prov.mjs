import mongoose from "mongoose";

//proGeoSchema
const provGeoSchema = new mongoose.Schema({
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

const provSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  geometry: provGeoSchema,
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
  score: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  price_score: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  testimonials: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  tags: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tag",
  },
  categories: {
    // check whether we want plurial or singular
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Category",
  },
});

const Prov = mongoose.model("Prov", provSchema);

export { Prov, provSchema };
