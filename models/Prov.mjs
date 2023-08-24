import mongoose from "mongoose";

const provSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  prov_location: {
    coordinates: {
      type: [Number],
      required: true,
    },
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
  score: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  price_score: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  testimonials: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

  const Prov = mongoose.model("Prov", provSchema);

  export {Prov, provSchema}